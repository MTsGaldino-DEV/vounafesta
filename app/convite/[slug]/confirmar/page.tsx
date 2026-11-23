import { randomUUID } from 'node:crypto';
import { InvitationScreen } from '@/app/components/invitation-screen';
import { calendarLinks } from '@/lib/calendar';
import { demoSlug } from '@/lib/invitation';
import { getInvitation } from '@/lib/public-invitation';
import { RsvpForm } from './rsvp-form';

export const metadata = { title: 'Confirmar presença', robots: { index: false, follow: false } };

export default async function ConfirmPage({ params }: PageProps<'/convite/[slug]/confirmar'>) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);
  const demo = slug === demoSlug;
  return (
    <InvitationScreen invitation={invitation} slug={slug} demo={demo}>
      <RsvpForm slug={slug} requestId={randomUUID()} demo={demo} calendar={calendarLinks(invitation, slug)} />
    </InvitationScreen>
  );
}
