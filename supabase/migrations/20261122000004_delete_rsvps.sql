begin;

grant delete on public.rsvps to authenticated;

create policy "Organizers delete responses to their own events" on public.rsvps
  for delete to authenticated using (
    exists (select 1 from public.events where slug = event_slug and owner_id = (select auth.uid()))
  );

commit;
