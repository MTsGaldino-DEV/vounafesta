import { randomUUID } from 'node:crypto';
import { ThemedCard } from '@/app/components/invitation-screen';
import { demoSlug } from '@/lib/invitation';
import { getInvitation } from '@/lib/public-invitation';
import { RsvpForm } from './rsvp-form';

export const metadata = { title: 'Confirmar presença', robots: { index: false, follow: false } };

export default async function ConfirmPage({ params }: PageProps<'/convite/[slug]/confirmar'>) {
  const { slug } = await params;
  await getInvitation(slug);
  return (
    <ThemedCard>
      <RsvpForm slug={slug} requestId={randomUUID()} demo={slug === demoSlug} />
    </ThemedCard>
  );
}
