'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { defaultAccent } from '@/lib/invitation';
import { removeCover, requireOrganizer, uploadCover } from '@/lib/organizer';
import { uuidPattern } from '@/lib/public-invitation';
import { organizerClient } from '@/lib/supabase';

type FormState = { error?: string; success?: boolean };

function textValue(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === 'string' ? value.trim() : '';
}

export async function signIn(_state: FormState, data: FormData): Promise<FormState> {
  const email = textValue(data, 'email');
  const password = data.get('password');
  if (!email || typeof password !== 'string' || !password) return { error: 'Preencha seu e-mail e senha.' };

  const supabase = await organizerClient();
  if (!supabase) return { error: 'Conecte o Supabase para habilitar o login.' };
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error?.status === 429) return { error: 'Muitas tentativas. Aguarde um pouco e tente novamente.' };
  if (error?.code === 'invalid_credentials') return { error: 'E-mail ou senha incorretos.' };
  if (error) return { error: 'Não foi possível entrar. Confira os dados e tente novamente.' };
  redirect('/organizador');
}

export async function signOut(_state: FormState): Promise<FormState> {
  const supabase = await requireOrganizer();
  const { error } = await supabase.auth.signOut({ scope: 'local' });
  if (error) return { error: 'Não foi possível sair. Tente novamente.' };
  redirect('/organizador/login');
}

function parseEvent(data: FormData) {
  const title = textValue(data, 'title');
  const eventDate = textValue(data, 'event_date');
  const eventTime = textValue(data, 'event_time');
  const location = textValue(data, 'location');
  if (!title || title.length > 100) return { error: 'Digite um nome de evento de até 100 caracteres.' };
  if (location.length > 160) return { error: 'O local deve ter até 160 caracteres.' };
  const color = textValue(data, 'accent_color').toLowerCase() || defaultAccent;
  if (!/^#[0-9a-f]{6}$/.test(color)) return { error: 'Escolha uma cor válida.' };
  if ((eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) || (eventTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(eventTime))) {
    return { error: 'Confira a data e o horário do evento.' };
  }
  return {
    values: {
      title, event_date: eventDate || null, event_time: eventTime || null, location: location || null,
      accent_color: color === defaultAccent ? null : color,
    },
  };
}

function coverFile(data: FormData) {
  const file = data.get('cover');
  return file instanceof File && file.size > 0 ? file : null;
}

export async function createEvent(_state: FormState, data: FormData): Promise<FormState> {
  const supabase = await requireOrganizer();
  const parsed = parseEvent(data);
  if (!parsed.values) return parsed;

  let coverPath: string | null = null;
  const file = coverFile(data);
  if (file) {
    const upload = await uploadCover(supabase, file);
    if ('error' in upload) return upload;
    coverPath = upload.path;
  }

  const { data: event, error } = await supabase.from('events').insert({ ...parsed.values, cover_path: coverPath }).select('slug').single();
  if (error) await removeCover(supabase, coverPath);
  if (error?.code === '22008') return { error: 'Confira a data e o horário do evento.' };
  if (error) return { error: 'Não foi possível criar o evento. Tente novamente.' };
  revalidatePath('/organizador');
  redirect(`/organizador/${event.slug}`);
}

export async function updateEvent(slug: string, _state: FormState, data: FormData): Promise<FormState> {
  const supabase = await requireOrganizer();
  if (!uuidPattern.test(slug)) return { error: 'Evento não encontrado.' };
  const parsed = parseEvent(data);
  if (!parsed.values) return parsed;

  const { data: current } = await supabase.from('events').select('cover_path').eq('slug', slug).maybeSingle();
  if (!current) return { error: 'Evento não encontrado.' };

  let coverPath: string | null = current.cover_path;
  const file = coverFile(data);
  if (file) {
    const upload = await uploadCover(supabase, file);
    if ('error' in upload) return upload;
    coverPath = upload.path;
  } else if (data.get('remove_cover')) {
    coverPath = null;
  }

  const { data: updated, error } = await supabase.from('events').update({ ...parsed.values, cover_path: coverPath }).eq('slug', slug).select('slug');
  if (error || !updated?.length) {
    if (coverPath !== current.cover_path) await removeCover(supabase, coverPath);
    if (error?.code === '22008') return { error: 'Confira a data e o horário do evento.' };
    return { error: error ? 'Não foi possível salvar o evento. Tente novamente.' : 'Evento não encontrado.' };
  }
  if (coverPath !== current.cover_path) await removeCover(supabase, current.cover_path);
  revalidatePath('/organizador');
  revalidatePath(`/organizador/${slug}`);
  revalidatePath(`/convite/${slug}`);
  redirect(`/organizador/${slug}`);
}

export async function deleteEvent(slug: string, _state: FormState): Promise<FormState> {
  const supabase = await requireOrganizer();
  if (!uuidPattern.test(slug)) return { error: 'Evento não encontrado.' };
  const { data: deleted, error } = await supabase.from('events').delete().eq('slug', slug).select('cover_path');
  if (error) return { error: 'Não foi possível excluir o evento. Tente novamente.' };
  if (!deleted?.length) return { error: 'Evento não encontrado.' };
  await removeCover(supabase, deleted[0].cover_path);
  revalidatePath('/organizador');
  redirect('/organizador');
}

export async function deleteRsvp(slug: string, requestId: string, _state: FormState): Promise<FormState> {
  const supabase = await requireOrganizer();
  if (!uuidPattern.test(slug) || !uuidPattern.test(requestId)) return { error: 'Confirmação não encontrada.' };
  const { error } = await supabase.from('rsvps').delete().eq('event_slug', slug).eq('request_id', requestId);
  if (error) return { error: 'Não foi possível excluir. Tente novamente.' };
  revalidatePath(`/organizador/${slug}`);
  return { success: true };
}

export async function requestPasswordReset(_state: FormState, data: FormData): Promise<FormState> {
  const email = textValue(data, 'email');
  if (!email) return { error: 'Informe seu e-mail.' };
  const supabase = await organizerClient();
  const origin = (await headers()).get('origin');
  if (!supabase || !origin) return { error: 'Não foi possível enviar o e-mail agora. Tente novamente.' };

  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${origin}/organizador/auth/confirmar` });
  if (error?.status === 429) return { error: 'Muitas tentativas. Aguarde um pouco e tente novamente.' };
  if (error) return { error: 'Não foi possível enviar o e-mail agora. Tente novamente.' };
  return { success: true };
}

export async function updatePassword(_state: FormState, data: FormData): Promise<FormState> {
  const supabase = await requireOrganizer();
  const password = data.get('password');
  if (typeof password !== 'string' || password.length < 8 || password.length > 72) return { error: 'A senha deve ter de 8 a 72 caracteres.' };
  if (password !== data.get('confirm')) return { error: 'As senhas não são iguais.' };

  const { error } = await supabase.auth.updateUser({ password });
  if (error?.code === 'same_password') return { error: 'Escolha uma senha diferente da atual.' };
  if (error?.code === 'weak_password') return { error: 'Senha muito fraca. Use letras, números e mais caracteres.' };
  if (error) return { error: 'Não foi possível salvar a nova senha. Tente novamente.' };
  redirect('/organizador');
}
