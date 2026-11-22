import { requireOrganizer } from '@/lib/organizer';
import { uuidPattern } from '@/lib/public-invitation';

const batchSize = 1000;
const dateTime = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short', timeZone: 'America/Sao_Paulo' });

// Quotes every cell and neutralizes spreadsheet formulas (=, +, -, @).
const cell = (value: string) => `"${(/^[=+\-@\t\r]/.test(value) ? `'${value}` : value).replaceAll('"', '""')}"`;

export async function GET(_request: Request, { params }: RouteContext<'/organizador/[slug]/exportar'>) {
  const supabase = await requireOrganizer();
  const { slug } = await params;
  if (!uuidPattern.test(slug)) return new Response('Evento não encontrado.', { status: 404 });

  const { data: event } = await supabase.from('events').select('title').eq('slug', slug).maybeSingle();
  if (!event) return new Response('Evento não encontrado.', { status: 404 });

  const lines = [['Nome', 'Acompanhantes', 'Total de pessoas', 'Confirmado em'].map(cell).join(';')];
  for (let from = 0; ; from += batchSize) {
    const { data, error } = await supabase.from('rsvps').select('guest_name, companions, created_at')
      .eq('event_slug', slug).order('created_at').order('request_id').range(from, from + batchSize - 1);
    if (error) return new Response('Não foi possível exportar as confirmações.', { status: 500 });
    for (const row of data) {
      lines.push([
        row.guest_name, row.companions.join(', '), String(1 + row.companions.length), dateTime.format(new Date(row.created_at)),
      ].map(cell).join(';'));
    }
    if (data.length < batchSize) break;
  }

  const name = event.title.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'evento';
  // ponytail: ";" separator + BOM so Excel pt-BR opens it correctly; switch to "," if you need Google Sheets defaults.
  return new Response(`﻿${lines.join('\r\n')}\r\n`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="confirmacoes-${name}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}
