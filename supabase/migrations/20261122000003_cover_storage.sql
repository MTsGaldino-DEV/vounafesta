begin;

-- Bucket publico (o convite e aberto a qualquer convidado) com limite de 1 MB por foto.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('event-covers', 'event-covers', true, 1048576, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set public = true,
  file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Cada organizador mexe apenas na propria pasta (<id do usuario>/arquivo).
create policy "Organizers manage their own cover files" on storage.objects
  for all to authenticated
  using (bucket_id = 'event-covers' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'event-covers' and (storage.foldername(name))[1] = (select auth.uid())::text);

commit;
