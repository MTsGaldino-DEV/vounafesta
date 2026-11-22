import { ArrowLeft, ChevronLeft, ChevronRight, Download, Pencil, UserCheck, UserPlus, Users } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteHeader } from '@/app/components/site-header';
import { invitationSchedule } from '@/lib/invitation';
import { requireOrganizer, rsvpTotals } from '@/lib/organizer';
import { uuidPattern } from '@/lib/public-invitation';
import { deleteEvent, deleteRsvp } from '../actions';
import { DeleteEventForm, DeleteRsvpForm, LogoutForm } from '../forms';
import { ShareInvitation } from './share-invitation';

export const metadata = { title: 'Lista de presenças', robots: { index: false, follow: false } };
const pageSize = 50;

export default async function EventPage({ params, searchParams }: PageProps<'/organizador/[slug]'>) {
  const supabase = await requireOrganizer();
  const { slug } = await params;
  const rawPage = (await searchParams).pagina;
  const requestedPage = typeof rawPage === 'string' && /^[1-9]\d{0,6}$/.test(rawPage) ? Number(rawPage) : 1;
  if (!uuidPattern.test(slug)) notFound();

  const { data: event, error: eventError } = await supabase.from('events').select('title, event_date, event_time, location').eq('slug', slug).maybeSingle();
  if (eventError) throw new Error('Falha ao carregar o evento.', { cause: eventError });
  if (!event) notFound();

  const start = (requestedPage - 1) * pageSize;
  const { data: replies, count, error } = await supabase.from('rsvps')
    .select('request_id, guest_name, companions', { count: 'exact' }).eq('event_slug', slug)
    .order('created_at', { ascending: false }).order('request_id', { ascending: false })
    .range(start, start + pageSize - 1);
  const totals = await rsvpTotals(supabase, slug);
  const stats = totals && [
    { label: 'Presenças confirmadas', hint: 'convidados + acompanhantes', value: totals.guests + totals.companions, Icon: UserCheck },
    { label: 'Convidados', hint: 'quem respondeu o convite', value: totals.guests, Icon: Users },
    { label: 'Acompanhantes', hint: 'trazidos pelos convidados', value: totals.companions, Icon: UserPlus },
  ];
  const pageCount =Math.ceil((count ?? 0) / pageSize);
  const pageHref = (page: number) => `/organizador/${slug}${page > 1 ? `?pagina=${page}` : ''}`;
  const details = [invitationSchedule(event), event.location].filter(Boolean).join(' · ');

  return (
    <>
      <SiteHeader><LogoutForm /></SiteHeader>
      <main className="dashboard event-dashboard">
        <Link className="back-link" href="/organizador"><ArrowLeft size={16} aria-hidden="true" /> Seus eventos</Link>
        <h1>{event.title}</h1>
        {details && <p className="event-details">{details}</p>}
        {stats && <section className="stats-grid" aria-label="Resumo das presenças">
          {stats.map(({ label, hint, value, Icon }) => <div className="surface stat-card" key={label}>
            <span className="event-icon"><Icon size={21} aria-hidden="true" /></span>
            <div><strong>{value}</strong><span>{label}</span><small>{hint}</small></div>
          </div>)}
        </section>}
        <ShareInvitation href={`/convite/${slug}`} />
        <section className="event-actions" aria-label="Gerenciar evento">
          <Link className="button button-secondary" href={`/organizador/${slug}/editar`}><Pencil size={16} aria-hidden="true" /> Editar evento</Link>
          {count !== null && count > 0 && <a className="button button-secondary" href={`/organizador/${slug}/exportar`} download><Download size={16} aria-hidden="true" /> Exportar CSV</a>}
          <DeleteEventForm action={deleteEvent.bind(null, slug)} />
        </section>
        <section className="surface guest-card">
          <div className="guest-heading"><h2>Presenças confirmadas</h2>{count !== null && <span className="count-tag">{count} {count === 1 ? 'confirmação' : 'confirmações'}</span>}</div>
          {error && <div className="guest-empty"><p className="form-error" role="alert">Não foi possível carregar as confirmações desta página.</p><Link className="back-link" href={pageHref(1)}>Voltar à primeira página</Link></div>}
          {!error && count === 0 && <div className="guest-empty"><Users size={24} aria-hidden="true" /><p>As confirmações vão aparecer aqui assim que os convidados responderem.</p></div>}
          {replies && replies.length > 0 && (
            <ul className="guest-list">
              {replies.map((reply) => <li key={reply.request_id}>
                <span className="event-icon"><Users size={17} aria-hidden="true" /></span>
                <div><strong>{reply.guest_name}</strong>{reply.companions.length > 0 && <p>Com {reply.companions.join(', ')}</p>}</div>
                <DeleteRsvpForm action={deleteRsvp.bind(null, slug, reply.request_id)} name={reply.guest_name} />
              </li>)}
            </ul>
          )}
          {!error && pageCount > 1 && (
            <nav className="pagination" aria-label="Páginas de confirmações">
              {requestedPage > 1 && <Link className="button button-secondary" href={pageHref(requestedPage - 1)}><ChevronLeft size={16} aria-hidden="true" /> Anterior</Link>}
              <span>Página {requestedPage} de {pageCount}</span>
              {requestedPage < pageCount && <Link className="button button-secondary" href={pageHref(requestedPage + 1)}>Próxima <ChevronRight size={16} aria-hidden="true" /></Link>}
            </nav>
          )}
        </section>
      </main>
    </>
  );
}
