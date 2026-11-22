import { redirect } from 'next/navigation';
import { organizerClient } from './supabase';

export async function requireOrganizer() {
  const supabase = await organizerClient();
  if (!supabase) redirect('/organizador/login');
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/organizador/login');
  return supabase;
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
