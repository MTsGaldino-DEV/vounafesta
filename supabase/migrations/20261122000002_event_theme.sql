begin;

-- Foto do convite (arquivo no bucket event-covers) e cor dos destaques, por evento.
alter table public.events
  add column cover_path text check (cover_path ~ '^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\.(webp|jpg|png)$'),
  add column accent_color text check (accent_color ~ '^#[0-9a-fA-F]{6}$');

grant insert (cover_path, accent_color) on public.events to authenticated;
grant update (cover_path, accent_color) on public.events to authenticated;

drop function public.get_invitation(text);

create function public.get_invitation(target_slug text)
returns table (title text, event_date date, event_time time, location text, cover_path text, accent_color text)
language sql stable security definer set search_path = ''
as $$
  select e.title, e.event_date, e.event_time, e.location, e.cover_path, e.accent_color
  from public.events e where e.slug = target_slug;
$$;

revoke all on function public.get_invitation(text) from public, anon, authenticated;
grant execute on function public.get_invitation(text) to anon;

commit;
