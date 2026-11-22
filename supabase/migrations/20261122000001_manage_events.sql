begin;

grant update (title, event_date, event_time, location) on public.events to authenticated;
grant delete on public.events to authenticated;

create policy "Organizers update their own events" on public.events
  for update to authenticated
  using (owner_id = (select auth.uid()))
  with check (owner_id = (select auth.uid()));

create policy "Organizers delete their own events" on public.events
  for delete to authenticated using (owner_id = (select auth.uid()));

commit;
