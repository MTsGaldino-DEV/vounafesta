import { icsFile } from '@/lib/calendar';
import { getInvitation } from '@/lib/public-invitation';

export async function GET(request: Request, { params }: RouteContext<'/convite/[slug]/agenda'>) {
  const { slug } = await params;
  const invitation = await getInvitation(slug);
  const ics = icsFile(invitation, slug, new URL(`/convite/${slug}`, request.url).toString());
  if (!ics) return new Response('Este evento ainda não tem data.', { status: 404 });
  return new Response(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="convite.ics"',
      'Cache-Control': 'no-store',
    },
  });
}
