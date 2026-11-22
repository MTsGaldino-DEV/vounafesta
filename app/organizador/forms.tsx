'use client';

import { ArrowRight, KeyRound, LogOut, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { defaultAccent } from '@/lib/invitation';
import { requestPasswordReset, signIn, signOut, updatePassword } from './actions';

const maxCoverBytes = 900_000; // keep in sync with lib/organizer.ts

type FormState = { error?: string; success?: boolean };
type EventValues = { title: string; event_date: string | null; event_time: string | null; location: string | null; accent_color: string | null };

// Shrinks the chosen photo in the browser (max 1920 px, WebP under maxCoverBytes) before it is sent.
async function prepareCover(file: File) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  for (const quality of [0.85, 0.7, 0.55, 0.4]) {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (blob && blob.size <= maxCoverBytes) return new File([blob], 'capa.webp', { type: 'image/webp' });
  }
  throw new Error('too large');
}

export function LoginForm({ configured }: { configured: boolean }) {
  const [state, submit, pending] = useActionState(signIn, {});
  const [email, setEmail] = useState('');
  return (
    <form action={submit} className="form-stack">
      <label className="field">E-mail
        <input name="email" type="email" autoComplete="username" placeholder="voce@exemplo.com" required value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="field">Senha
        <input name="password" type="password" autoComplete="current-password" placeholder="Sua senha" required />
      </label>
      {!configured && <p className="form-error">O login estará disponível após configurar o Supabase deste projeto.</p>}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button button-primary" disabled={pending || !configured}>{pending ? 'Entrando…' : 'Entrar'} <ArrowRight size={18} aria-hidden="true" /></button>
      <Link className="back-link" href="/organizador/recuperar">Esqueci minha senha</Link>
    </form>
  );
}

export function LogoutForm() {
  const [state, submit, pending] = useActionState(signOut, {});
  return (
    <form action={submit} className="logout-form">
      <button className="header-link" disabled={pending}><LogOut size={16} aria-hidden="true" /> {pending ? 'Saindo…' : 'Sair'}</button>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
    </form>
  );
}

export function EventForm({ action, initial, coverSrc, label, pendingLabel, icon }: {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  initial?: EventValues; coverSrc?: string | null; label: string; pendingLabel: string; icon: React.ReactNode;
}) {
  const [state, submit, pending] = useActionState(action, {});
  const [cover, setCover] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [coverError, setCoverError] = useState('');
  const [color, setColor] = useState(initial?.accent_color ?? defaultAccent);

  async function chooseCover(file: File | undefined) {
    setCoverError('');
    if (!file) return;
    try {
      const prepared = await prepareCover(file);
      setCover(prepared);
      setPreview(URL.createObjectURL(prepared));
    } catch {
      setCover(null);
      setPreview(null);
      setCoverError('Não foi possível usar essa foto. Tente outra em JPG, PNG ou WebP.');
    }
  }
  const [title, setTitle] = useState(initial?.title ?? '');
  const [date, setDate] = useState(initial?.event_date ?? '');
  const [time, setTime] = useState(initial?.event_time?.slice(0, 5) ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  return (
    <form action={(data) => { if (cover) data.set('cover', cover); submit(data); }} className="form-stack">
      <label className="field">Nome do evento
        <input name="title" placeholder="Ex. Aniversário da Marina" maxLength={100} required value={title} onChange={(event) => setTitle(event.target.value)} />
      </label>
      <div className="form-columns">
        <label className="field"><span>Data <span className="optional">(opcional)</span></span>
          <input name="event_date" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </label>
        <label className="field"><span>Horário <span className="optional">(opcional)</span></span>
          <input name="event_time" type="time" value={time} onChange={(event) => setTime(event.target.value)} />
        </label>
      </div>
      <label className="field"><span>Local <span className="optional">(opcional)</span></span>
        <input name="location" placeholder="Nome do local ou endereço" maxLength={160} value={location} onChange={(event) => setLocation(event.target.value)} />
      </label>
      <div className="field">
        <label htmlFor="cover-input">Foto do convite <span className="optional">(opcional)</span></label>
        <input id="cover-input" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => chooseCover(event.target.files?.[0])} />
        <small className="field-hint">Tamanho ideal: 1080 × 1350 px (proporção 4:5), em JPG, PNG ou WebP. O topo e a base podem ser cortados em algumas telas, então deixe o título e os detalhes longe das bordas. A foto é reduzida automaticamente antes do envio.</small>
        {coverError && <p className="form-error" role="alert">{coverError}</p>}
        {(preview || coverSrc) && <img className="cover-preview" src={preview ?? coverSrc ?? ''} alt="Prévia da foto do convite" />}
        {coverSrc && !cover && <label className="check"><input type="checkbox" name="remove_cover" value="1" /> Remover a foto atual (volta para a arte padrão)</label>}
      </div>
      <label className="field">Cor dos destaques
        <input name="accent_color" type="color" value={color} onChange={(event) => setColor(event.target.value)} />
        <small className="field-hint">Cor dos botões e dos detalhes do convite. O texto dos botões é branco, prefira uma cor escura ou média.</small>
      </label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button button-primary" disabled={pending}>{icon} {pending ? pendingLabel : label}</button>
    </form>
  );
}

export function DeleteEventForm({ action }: { action: (state: FormState) => Promise<FormState> }) {
  const [state, submit, pending] = useActionState(action, {});
  const [confirming, setConfirming] = useState(false);
  return (
    <form action={submit} className="delete-form">
      {!confirming
        ? <button className="button button-secondary" type="button" onClick={() => setConfirming(true)}><Trash2 size={17} aria-hidden="true" /> Excluir evento</button>
        : <>
            <p>Isso apaga o evento e todas as confirmações. Não dá para desfazer.</p>
            <div className="share-actions">
              <button className="button button-secondary" type="button" onClick={() => setConfirming(false)} disabled={pending}>Cancelar</button>
              <button className="button button-danger" disabled={pending}><Trash2 size={17} aria-hidden="true" /> {pending ? 'Excluindo…' : 'Excluir de vez'}</button>
            </div>
          </>}
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
    </form>
  );
}

export function DeleteRsvpForm({ action, name }: { action: (state: FormState) => Promise<FormState>; name: string }) {
  const [state, submit, pending] = useActionState(action, {});
  const [confirming, setConfirming] = useState(false);
  if (!confirming) {
    return <button className="button button-icon rsvp-delete" type="button" aria-label={`Excluir a confirmação de ${name}`} onClick={() => setConfirming(true)}><Trash2 size={16} aria-hidden="true" /></button>;
  }
  return (
    <form action={submit} className="rsvp-delete">
      <span>Excluir?</span>
      <button className="button button-danger" disabled={pending}>{pending ? 'Excluindo…' : 'Sim'}</button>
      <button className="button button-secondary" type="button" onClick={() => setConfirming(false)} disabled={pending}>Não</button>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
    </form>
  );
}

export function RecoverForm() {
  const [state, submit, pending] = useActionState(requestPasswordReset, {});
  if (state.success) return <p className="form-success" role="status">Se esse e-mail tiver conta, você vai receber um link para criar uma nova senha. Confira também o spam.</p>;
  return (
    <form action={submit} className="form-stack">
      <label className="field">E-mail
        <input name="email" type="email" autoComplete="username" placeholder="voce@exemplo.com" required />
      </label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button button-primary" disabled={pending}>{pending ? 'Enviando…' : 'Enviar link'} <ArrowRight size={18} aria-hidden="true" /></button>
    </form>
  );
}

export function ResetPasswordForm() {
  const [state, submit, pending] = useActionState(updatePassword, {});
  return (
    <form action={submit} className="form-stack">
      <label className="field">Nova senha
        <input name="password" type="password" autoComplete="new-password" minLength={8} maxLength={72} required />
      </label>
      <label className="field">Repita a nova senha
        <input name="confirm" type="password" autoComplete="new-password" minLength={8} maxLength={72} required />
      </label>
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="button button-primary" disabled={pending}>{pending ? 'Salvando…' : 'Salvar senha'} <KeyRound size={18} aria-hidden="true" /></button>
    </form>
  );
}
