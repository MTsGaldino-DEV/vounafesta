import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/site-header';
import { requireOrganizer } from '@/lib/organizer';
import { uuidPattern } from '@/lib/public-invitation';
import { updateEvent } from '../../actions';
import { EventForm, LogoutForm } from '../../forms';

export const metadata = { title: 'Editar evento', robots: { index: false, follow: false } };

export default async function EditEventPage({ params }: PageProps<'/organizador/[slug]/editar'>) {
  const supabase = await requireOrganizer();
  const { slug } = await params;
  if (!uuidPattern.test(slug)) notFound();

  const { data: event, error } = await supabase.from('events').select('title, event_date, event_time, location').eq('slug', slug).maybeSingle();
  if (error) throw new Error('Falha ao carregar o evento.', { cause: error });
  if (!event) notFound();

  return (
    <>
      <SiteHeader><LogoutForm /></SiteHeader>
      <main className="dashboard event-dashboard">
        <Link className="back-link" href={`/organizador/${slug}`}><ArrowLeft size={16} aria-hidden="true" /> Voltar ao evento</Link>
        <h1>Editar <em>evento.</em></h1>
        <section className="surface new-event">
          <EventForm action={updateEvent.bind(null, slug)} initial={event} label="Salvar alterações" pendingLabel="Salvando…" icon={<Save size={18} aria-hidden="true" />} />
        </section>
      </main>
    </>
  );
}
