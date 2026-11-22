import { InvitationIntro, InvitationScreen } from './components/invitation-screen';
import { demoInvitation, demoSlug } from '@/lib/invitation';

export default function HomePage() {
  return (
    <InvitationScreen invitation={demoInvitation} demo>
      <InvitationIntro demo confirmHref={`/convite/${demoSlug}/confirmar`} />
    </InvitationScreen>
  );
}
