import { ArrowRight, CalendarDays, Plus, Ticket } from 'lucide-react';
import Link from 'next/link';
import { SiteHeader } from '@/app/components/site-header';
import { invitationSchedule } from '@/lib/invitation';
import { requireOrganizer } from '@/lib/organizer';
import { createEvent } from './actions';
import { EventForm, LogoutForm } from './forms';

export const metadata = { title: 'Seus eventos', robots: { index: false, follow: false } };

export default async function OrganizerPage() {
  const supabase = await requireOrganizer();
  const { data: events, error } = await supabase.from('events').select('slug, title, event_date, event_time, location').order('created_at', { ascending: false });
  return (
    <>
      <SiteHeader><LogoutForm /></SiteHeader>
      <main className="dashboard">
        <h1>Seus <em>eventos.</em></h1>
        <div className="dashboard-grid">
          <section aria-label="Lista de eventos">
            {error && <p className="form-error" role="alert">Não foi possível carregar os eventos. Atualize a página para tentar novamente.</p>}
            {events?.length === 0 && <div className="surface empty-state"><Ticket size={25} aria-hidden="true" /><h2>Nenhum evento criado</h2><p>Crie seu primeiro evento para gerar um link de convite.</p></div>}
            {events && events.length > 0 && (
              <ul className="event-list">
                {events.map((event) => {
                  const schedule = invitationSchedule(event);
                  return <li key={event.slug}><Link className="surface event-card" href={`/organizador/${event.slug}`}>
                    <span className="event-icon"><CalendarDays size={21} aria-hidden="true" /></span>
                    <span><strong>{event.title}</strong>{schedule && <small>{schedule}</small>}</span>
                    <ArrowRight size={19} aria-hidden="true" />
                  </Link></li>;
                })}
              </ul>
            )}
          </section>
          <section className="surface new-event"><h2>Novo evento</h2><EventForm action={createEvent} label="Criar evento" pendingLabel="Criando…" icon={<Plus size={18} aria-hidden="true" />} /></section>
        </div>
      </main>
    </>
  );
}
