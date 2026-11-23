import { ArrowRight, CalendarDays, LockKeyhole, MapPin, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { invitationSchedule, type Invitation } from '@/lib/invitation';
import { coverUrl } from '@/lib/supabase';
import defaultCover from '@/public/tema/moana.webp';
import { AddToCalendar, type CalendarLinks } from './add-to-calendar';
import { SiteHeader } from './site-header';

export function InvitationScreen({ invitation, slug, demo = false, children }: {
  invitation: Invitation;
  slug: string;
  demo?: boolean;
  children: React.ReactNode;
}) {
  const schedule = invitationSchedule(invitation);
  const accent = invitation.accent_color;
  // accent_color is validated as #rrggbb by the database; the other shades derive from it.
  const theme = accent ? {
    '--accent': accent,
    '--accent-dark': `color-mix(in srgb, ${accent} 75%, black)`,
    '--accent-soft': `color-mix(in srgb, ${accent} 12%, white)`,
  } as React.CSSProperties : undefined;
  return (
    <div className="invite-page" style={theme}>
      {/* The logo stays inside the invitation so guests never land on the marketing page. */}
      <SiteHeader homeHref={`/convite/${slug}`} />
      <main className="invite-layout">
        <section className="invite-cover" aria-label="Sobre o evento">
          {invitation.cover_path
            ? <img className="cover-custom" src={coverUrl(invitation.cover_path)} alt="" />
            : <Image src={defaultCover} alt="" fill preload sizes="(max-width: 760px) 100vw, 50vw" />}
          <div className="cover-content">
            <div className="cover-title">
              <p className="eyebrow"><span className="eyebrow-line" /> Você está convidado</p>
              <p className="cover-heading">
                {demo ? <>Uma noite<br /><em>para celebrar.</em></> : invitation.title}
              </p>
            </div>
            {(schedule || invitation.location) && (
              <div className="cover-details">
                {schedule && <p><CalendarDays size={17} aria-hidden="true" /> {schedule}</p>}
                {invitation.location && <p><MapPin size={17} aria-hidden="true" /> {invitation.location}</p>}
              </div>
            )}
          </div>
        </section>
        <section className="invite-panel">{children}</section>
      </main>
    </div>
  );
}

export function InvitationIntro({ demo = false, confirmHref, calendar = null }: { demo?: boolean; confirmHref: string; calendar?: CalendarLinks }) {
  return (
    <div className="invite-intro">
      <div className="invite-tag"><Sparkles size={15} aria-hidden="true" /> {demo ? 'Convite de exemplo' : 'Confirmação de presença'}</div>
      <h1>Você vem<br /><em>na festa?</em></h1>
      <p className="invite-description">Confirme sua presença e informe quem vai com você. É rapidinho!</p>
      <Link className="button button-primary invite-cta" href={confirmHref}>
        Confirmar presença <ArrowRight size={19} aria-hidden="true" />
      </Link>
      <AddToCalendar links={calendar} />
      <p className="invite-note"><LockKeyhole size={15} aria-hidden="true" /> {demo ? 'Respostas de exemplo não são salvas.' : 'Só quem organiza vê os nomes enviados.'}</p>
    </div>
  );
}
