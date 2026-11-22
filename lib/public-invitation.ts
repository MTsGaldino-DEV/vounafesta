import { notFound } from 'next/navigation';
import { demoInvitation, demoSlug, type Invitation } from './invitation';
import { guestClient } from './supabase';

export const uuidPattern = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

export async function getInvitation(slug: string) {
  if (slug === demoSlug) return demoInvitation;
  if (!uuidPattern.test(slug)) notFound();

  const supabase = guestClient();
  if (!supabase) notFound();
  const { data, error } = await supabase.rpc('get_invitation', { target_slug: slug }).maybeSingle<Invitation>();
  if (error) throw new Error('Falha ao carregar o convite.', { cause: error });
  if (!data) notFound();
  return data;
}
