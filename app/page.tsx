import { InvitationStage } from './components/invitation-screen';
import { demoInvitation, demoSlug } from '@/lib/invitation';

export default function HomePage() {
  return <InvitationStage invitation={demoInvitation} demo confirmHref={`/convite/${demoSlug}/confirmar`} />;
}
