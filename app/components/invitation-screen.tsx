import { MapPin, UserRound } from 'lucide-react';
import Link from 'next/link';
import { invitationParts, type Invitation } from '@/lib/invitation';

// The art lives in public/tema/moana.webp (1080x1920). Everything below is positioned
// as a percentage of that image, so the text always lands inside the white oval.
export function InvitationStage({ invitation, confirmHref, demo = false }: {
  invitation: Invitation;
  confirmHref: string;
  demo?: boolean;
}) {
  const { day, month, weekday, time } = invitationParts(invitation);
  const mapsHref = invitation.location && `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.location)}`;
  const length = invitation.title.length;
  const titleSize = length <= 10 ? 15 : length <= 18 ? 11 : length <= 30 ? 8.5 : 6.5;

  return (
    <main className="theme-page">
      <section className="stage" aria-label="Convite">
        {demo && <p className="stage-demo">Convite de exemplo</p>}
        <div className="stage-title"><h1 style={{ fontSize: `${titleSize}cqw` }}>{invitation.title}</h1></div>
        <p className="stage-tagline">Você está convidado para uma festa inesquecível.</p>
        {(day || time) && (
          <div className="stage-when">
            {day && <p className="stage-date"><strong>{day}</strong><em>{month}</em></p>}
            {day && time && <span className="stage-divider" aria-hidden="true" />}
            <p className="stage-time">{weekday}{time && <>{weekday && ' às'}<br />{time}</>}</p>
          </div>
        )}
        <nav className="stage-actions" aria-label="Ações do convite">
          {mapsHref && <a className="stage-action" href={mapsHref} target="_blank" rel="noreferrer"><span><MapPin aria-hidden="true" /></span>Local</a>}
          <Link className="stage-action" href={confirmHref}><span><UserRound aria-hidden="true" /></span>Confirmar presença</Link>
        </nav>
        {invitation.location && <p className="stage-address">{invitation.location}</p>}
      </section>
    </main>
  );
}

// Same art behind a white card with the oval's dashed ring, for pages with a form.
export function ThemedCard({ children }: { children: React.ReactNode }) {
  return (
    <main className="theme-page theme-form-page">
      <div className="stage stage-backdrop" aria-hidden="true" />
      <div className="theme-card">{children}</div>
    </main>
  );
}
