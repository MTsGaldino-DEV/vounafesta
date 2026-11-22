import { ArrowRight, CalendarDays, LockKeyhole, MapPin, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { invitationSchedule, type Invitation } from '@/lib/invitation';
import cover from '@/public/celebracao.webp';
import { SiteHeader } from './site-header';

export function InvitationScreen({ invitation, demo = false, children }: {
  invitation: Invitation;
  demo?: boolean;
  children: React.ReactNode;
}) {
  const schedule = invitationSchedule(invitation);
  return (
    <>
      <SiteHeader />
      <main className="invite-layout">
        <section className="invite-cover" aria-label="Sobre o evento">
          <Image src={cover} alt="" fill preload sizes="(max-width: 760px) 100vw, 50vw" />
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
    </>
  );
}

export function InvitationIntro({ demo = false, confirmHref }: { demo?: boolean; confirmHref: string }) {
  return (
    <div className="invite-intro">
      <div className="invite-tag"><Sparkles size={15} aria-hidden="true" /> {demo ? 'Convite de exemplo' : 'Confirmação de presença'}</div>
      <h1>Você vem<br /><em>na festa?</em></h1>
      <p className="invite-description">Confirme sua presença e informe quem vai com você. É rapidinho!</p>
      <Link className="button button-primary invite-cta" href={confirmHref}>
        Confirmar presença <ArrowRight size={19} aria-hidden="true" />
      </Link>
      <p className="invite-note"><LockKeyhole size={15} aria-hidden="true" /> {demo ? 'Respostas de exemplo não são salvas.' : 'Só quem organiza vê os nomes enviados.'}</p>
    </div>
  );
}
