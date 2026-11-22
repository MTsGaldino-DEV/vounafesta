import { redirect } from 'next/navigation';
import { organizerClient } from './supabase';

export async function requireOrganizer() {
  const supabase = await organizerClient();
  if (!supabase) redirect('/organizador/login');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/organizador/login');
  return supabase;
}
