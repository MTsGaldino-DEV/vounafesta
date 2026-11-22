import { redirect } from 'next/navigation';
import { coverBucket, organizerClient } from './supabase';

export async function requireOrganizer() {
  const supabase = await organizerClient();
  if (!supabase) redirect('/organizador/login');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/organizador/login');
  return supabase;
}

type OrganizerClient = Awaited<ReturnType<typeof requireOrganizer>>;
const coverExtensions: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };
// The browser shrinks photos below this before sending (server actions accept ~1 MB bodies).
export const maxCoverBytes = 900_000;

export async function uploadCover(supabase: OrganizerClient, file: File): Promise<{ path: string } | { error: string }> {
  const extension = coverExtensions[file.type];
  if (!extension) return { error: 'Use uma foto JPG, PNG ou WebP.' };
  if (file.size > maxCoverBytes) return { error: 'A foto é grande demais. Use uma imagem de até 900 KB.' };
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Sua sessão expirou. Entre novamente.' };
  const path = `${user.id}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(coverBucket).upload(path, file, { contentType: file.type });
  return error ? { error: 'Não foi possível enviar a foto. Tente novamente.' } : { path };
}

// Best effort: an orphaned file is harmless, so failures are ignored.
export async function removeCover(supabase: OrganizerClient, path: string | null | undefined) {
  if (path) await supabase.storage.from(coverBucket).remove([path]);
}

// ponytail: reads every RSVP's companions in pages of 1000; fine for party sizes, move to a SQL aggregate if events reach tens of thousands.
export async function rsvpTotals(supabase: Awaited<ReturnType<typeof requireOrganizer>>, slug: string) {
  let guests = 0;
  let companions = 0;
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase.from('rsvps').select('companions').eq('event_slug', slug)
      .order('created_at').order('request_id').range(from, from + 999);
    if (error) return null;
    guests += data.length;
    for (const row of data) companions += row.companions.length;
    if (data.length < 1000) return { guests, companions };
  }
}
