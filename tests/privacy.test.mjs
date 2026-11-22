import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { PGlite } from '@electric-sql/pglite';

test('guests can RSVP once per submission and only the event owner can read the names', async () => {
  const db = new PGlite();
  try {
    await db.exec(`
      create role anon;
      create role authenticated;
      create schema auth;
      create table auth.users (id uuid primary key);
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('test.user_id', true), '')::uuid $$;
      grant usage on schema auth to authenticated;
      insert into auth.users values ('00000000-0000-0000-0000-000000000001'),
                                    ('00000000-0000-0000-0000-000000000002');
    `);
    const migration = new URL('../supabase/migrations/20261122000000_initial.sql', import.meta.url);
    await db.exec(await readFile(migration, 'utf8'));
    await db.exec(await readFile(new URL('../supabase/migrations/20261122000001_manage_events.sql', import.meta.url), 'utf8'));

    await db.exec(`set role authenticated; set test.user_id = '00000000-0000-0000-0000-000000000001';`);
    const { rows: [event] } = await db.query("insert into public.events (title) values ('Minha festa') returning slug");

    await db.exec('set role anon');
    await assert.rejects(db.query('select * from public.events'), { code: '42501' });
    await assert.rejects(db.query('select * from public.rsvps'), { code: '42501' });
    const invitation = await db.query('select * from public.get_invitation($1)', [event.slug]);
    assert.deepEqual(invitation.rows, [{ title: 'Minha festa', event_date: null, event_time: null, location: null }]);

    const submit = 'select public.confirm_attendance($1, $2, $3, $4)';
    const request = '00000000-0000-0000-0000-000000000003';
    await assert.rejects(db.query(submit, [event.slug, request, '  ', ['João']]), { code: '23514' });
    await assert.rejects(db.query(submit, [event.slug, request, 'Ana', ['  ']]), { code: '23514' });
    await assert.rejects(db.query(submit, ['missing-event', request, 'Ana', []]), { code: 'P0002' });
    await db.query(submit, [event.slug, request, ' Ana ', [' João ', 'Maria']]);
    await db.query(submit, [event.slug, request, 'Ana', ['João', 'Maria']]);

    await db.exec(`set role authenticated; set test.user_id = '00000000-0000-0000-0000-000000000002';`);
    assert.deepEqual((await db.query('select * from public.rsvps')).rows, []);
    assert.deepEqual((await db.query('select * from public.events')).rows, []);
    await assert.rejects(db.query("insert into public.events (owner_id, title) values ('00000000-0000-0000-0000-000000000001', 'Festa alheia')"), { code: '42501' });

    await db.exec(`set test.user_id = '00000000-0000-0000-0000-000000000001';`);
    assert.deepEqual((await db.query('select guest_name, companions from public.rsvps')).rows,
      [{ guest_name: 'Ana', companions: ['João', 'Maria'] }]);

    // edit and delete: only the owner
    await db.exec(`set test.user_id = '00000000-0000-0000-0000-000000000002';`);
    assert.equal((await db.query("update public.events set title = 'Invadida' where slug = $1", [event.slug])).affectedRows, 0);
    assert.equal((await db.query('delete from public.events where slug = $1', [event.slug])).affectedRows, 0);

    await db.exec(`set test.user_id = '00000000-0000-0000-0000-000000000001';`);
    await assert.rejects(db.query("update public.events set owner_id = '00000000-0000-0000-0000-000000000002' where slug = $1", [event.slug]), { code: '42501' });
    assert.equal((await db.query("update public.events set title = 'Nova festa', location = 'Casa' where slug = $1", [event.slug])).affectedRows, 1);
    assert.equal((await db.query('select title from public.events')).rows[0].title, 'Nova festa');
    assert.equal((await db.query('delete from public.events where slug = $1', [event.slug])).affectedRows, 1);
    assert.deepEqual((await db.query('select * from public.rsvps')).rows, []);
  } finally {
    await db.close();
  }
});
