'use server';

import { demoSlug, maxCompanions, maxNameLength } from '@/lib/invitation';
import { uuidPattern } from '@/lib/public-invitation';
import { guestClient } from '@/lib/supabase';

export type RsvpState = { error?: string; success?: boolean };

export async function confirmAttendance(slug: string, requestId: string, _state: RsvpState, data: FormData): Promise<RsvpState> {
  const rawName = data.get('guestName');
  const name = typeof rawName === 'string' ? rawName.trim() : '';
  const companions = data.getAll('companion').map((value) => typeof value === 'string' ? value.trim() : '');
  if (!name || name.length > maxNameLength) return { error: 'Informe seu nome completo.' };
  if (companions.length > maxCompanions || companions.some((value) => !value || value.length > maxNameLength)) {
    return { error: 'Preencha o nome de cada acompanhante ou remova os campos vazios.' };
  }
  if (slug === demoSlug) return { success: true };

  const supabase = guestClient();
  if (!supabase || !uuidPattern.test(slug) || !uuidPattern.test(requestId)) {
    return { error: 'Esse convite está indisponível.' };
  }
  const { error } = await supabase.rpc('confirm_attendance', {
    target_slug: slug,
    submission_id: requestId,
    submitted_name: name,
    submitted_companions: companions,
  });
  if (error?.code === 'P0002') return { error: 'Esse convite está indisponível.' };
  if (error) return { error: 'Não foi possível confirmar sua presença. Tente novamente em instantes.' };
  return { success: true };
}
