begin;

create table public.events (
  slug text primary key default gen_random_uuid()::text,
  owner_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 100),
  event_date date,
  event_time time,
  location text check (char_length(location) <= 160),
  created_at timestamptz not null default now()
);

create index events_owner_created_idx on public.events (owner_id, created_at desc);

create table public.rsvps (
  event_slug text not null references public.events (slug) on delete cascade,
  request_id uuid not null,
  guest_name text not null check (char_length(guest_name) between 1 and 100),
  companions text[] not null default '{}' check (cardinality(companions) <= 10),
  created_at timestamptz not null default now(),
  primary key (event_slug, request_id)
);

create index rsvps_event_created_idx on public.rsvps (event_slug, created_at desc, request_id desc);

alter table public.events enable row level security;
alter table public.rsvps enable row level security;

revoke all on public.events, public.rsvps from public, anon, authenticated;
grant select on public.events to authenticated;
grant insert (title, event_date, event_time, location) on public.events to authenticated;
grant select on public.rsvps to authenticated;

create policy "Organizers read their own events" on public.events
  for select to authenticated using (owner_id = (select auth.uid()));

create policy "Organizers create their own events" on public.events
  for insert to authenticated with check (owner_id = (select auth.uid()));

create policy "Organizers read responses to their own events" on public.rsvps
  for select to authenticated using (
    exists (select 1 from public.events where slug = event_slug and owner_id = (select auth.uid()))
  );

create function public.get_invitation(target_slug text)
returns table (title text, event_date date, event_time time, location text)
language sql stable security definer set search_path = ''
as $$
  select e.title, e.event_date, e.event_time, e.location
  from public.events e where e.slug = target_slug;
$$;

create function public.confirm_attendance(
  target_slug text, submission_id uuid, submitted_name text, submitted_companions text[]
)
returns void
language plpgsql security definer set search_path = ''
as $$
declare
  clean_name text := regexp_replace(submitted_name, '^[[:space:]]+|[[:space:]]+$', '', 'g');
  clean_companions text[];
begin
  if submission_id is null or clean_name is null or char_length(clean_name) not between 1 and 100
    or submitted_companions is null or cardinality(submitted_companions) > 10 then
    raise exception 'Invalid RSVP details' using errcode = '23514';
  end if;

  clean_companions := array(
    select regexp_replace(name, '^[[:space:]]+|[[:space:]]+$', '', 'g')
    from unnest(submitted_companions) with ordinality as guest(name, position)
    order by guest.position
  );

  if exists (select 1 from unnest(clean_companions) as guest(name)
    where name is null or char_length(name) not between 1 and 100) then
    raise exception 'Invalid companion name' using errcode = '23514';
  end if;

  insert into public.rsvps (event_slug, request_id, guest_name, companions)
    values (target_slug, submission_id, clean_name, clean_companions)
    on conflict (event_slug, request_id) do nothing;
exception when foreign_key_violation then
  raise exception 'Invitation not found' using errcode = 'P0002';
end;
$$;

revoke all on function public.get_invitation(text) from public, anon, authenticated;
revoke all on function public.confirm_attendance(text, uuid, text, text[]) from public, anon, authenticated;
grant execute on function public.get_invitation(text) to anon;
grant execute on function public.confirm_attendance(text, uuid, text, text[]) to anon;

commit;
