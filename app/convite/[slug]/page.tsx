import { InvitationIntro, InvitationScreen } from '@/app/components/invitation-screen';
import { calendarLinks } from '@/lib/calendar';
import { demoSlug } from '@/lib/invitation';
import { getInvitation } from '@/lib/public-invitation';

export const metadata = { title: 'Convite', robots: { index: false, follow: false } };

export default async function InvitationPage({ params }: PageProps<'/convite/[slug]'>) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);
  return (
    <InvitationScreen invitation={invitation} slug={slug} demo={slug === demoSlug}>
      <InvitationIntro demo={slug === demoSlug} confirmHref={`/convite/${slug}/confirmar`} calendar={calendarLinks(invitation, slug)} />
    </InvitationScreen>
  );
}
