'use client';

import { ArrowRight, KeyRound, LogOut, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useState } from 'react';
import { requestPasswordReset, signIn, signOut, updatePassword } from './actions';

type FormState = { error?: string; success?: boolean };
type EventValues = { title: string; event_date: string | null; event_time: string | null; location: string | null };

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

export function EventForm({ action, initial, label, pendingLabel, icon }: {
  action: (state: FormState, data: FormData) => Promise<FormState>;
  initial?: EventValues; label: string; pendingLabel: string; icon: React.ReactNode;
}) {
  const [state, submit, pending] = useActionState(action, {});
  const [title, setTitle] = useState(initial?.title ?? '');
  const [date, setDate] = useState(initial?.event_date ?? '');
  const [time, setTime] = useState(initial?.event_time?.slice(0, 5) ?? '');
  const [location, setLocation] = useState(initial?.location ?? '');
  return (
    <form action={submit} className="form-stack">
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
