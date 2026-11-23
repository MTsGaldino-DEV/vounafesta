'use client';

import { ArrowLeft, ArrowRight, CircleCheck, LockKeyhole, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useRef, useState } from 'react';
import { AddToCalendar, type CalendarLinks } from '@/app/components/add-to-calendar';
import { maxCompanions, maxNameLength } from '@/lib/invitation';
import { confirmAttendance } from './actions';

export function RsvpForm({ slug, requestId, demo, calendar }: { slug: string; requestId: string; demo: boolean; calendar: CalendarLinks }) {
  const [state, submit, pending] = useActionState(confirmAttendance.bind(null, slug, requestId), {});
  const [name, setName] = useState('');
  const [companions, setCompanions] = useState<{ id: number; name: string }[]>([]);
  const nextId = useRef(0);
  const focusedId = useRef<number | null>(null);
  const backHref = `/convite/${slug}`;

  function addCompanion() {
    const id = nextId.current++;
    focusedId.current = id;
    setCompanions((current) => [...current, { id, name: '' }]);
  }

  if (state.success) {
    return (
      <div className="invite-form-wrap success-panel" role="status">
        <span className="success-icon"><CircleCheck size={32} aria-hidden="true" /></span>
        <h1>Presença confirmada!</h1>
        <p>{demo ? 'Você concluiu o convite de exemplo. A resposta não foi salva.' : 'Tudo certo. A organização já recebeu a sua confirmação.'}</p>
        <Link className="button button-secondary" href={backHref}>Voltar ao convite</Link>
        <AddToCalendar links={calendar} />
      </div>
    );
  }

  return (
    <div className="invite-form-wrap">
      <Link className="back-link" href={backHref}><ArrowLeft size={16} aria-hidden="true" /> Voltar ao convite</Link>
      <h1>Confirme sua<br /><em>presença.</em></h1>
      <form action={submit} className="form-stack">
        <label className="field">Seu nome
          <input name="guestName" autoComplete="name" placeholder="Seu nome completo" maxLength={maxNameLength} required value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <fieldset className="companions">
          <legend>Acompanhantes <span className="optional">(opcional)</span></legend>
          {companions.map((companion, index) => (
            <div className="companion-row" key={companion.id}>
              <input name="companion" aria-label={`Nome do acompanhante ${index + 1}`} placeholder={`Nome do acompanhante ${index + 1}`} maxLength={maxNameLength} required value={companion.name} ref={(input) => {
                if (input && focusedId.current === companion.id) {
                  input.focus();
                  focusedId.current = null;
                }
              }} onChange={(event) => {
                const value = event.target.value;
                setCompanions((current) => current.map((item) => item.id === companion.id ? { ...item, name: value } : item));
              }} />
              <button className="button button-icon" type="button" aria-label={`Remover acompanhante ${index + 1}`} onClick={() => setCompanions((current) => current.filter((item) => item.id !== companion.id))}><X size={18} aria-hidden="true" /></button>
            </div>
          ))}
          {companions.length < maxCompanions && (
            <button className="button button-secondary add-companion" type="button" onClick={addCompanion}><Plus size={17} aria-hidden="true" /> Adicionar acompanhante</button>
          )}
        </fieldset>
        {state.error && <p className="form-error" role="alert">{state.error}</p>}
        <button className="button button-primary" disabled={pending}>{pending ? 'Confirmando…' : 'Vou na Festa'} <ArrowRight size={19} aria-hidden="true" /></button>
      </form>
      <p className="invite-note"><LockKeyhole size={15} aria-hidden="true" /> {demo ? 'Respostas de exemplo não são salvas.' : 'Só quem organiza vê os nomes enviados.'}</p>
    </div>
  );
}
