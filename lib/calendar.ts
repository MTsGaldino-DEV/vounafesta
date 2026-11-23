import type { Invitation } from './invitation';

type CalendarInvitation = Pick<Invitation, 'title' | 'event_date' | 'event_time' | 'location'>;

// The organizer only enters a start time, so the calendar entry lasts this long.
const durationHours = 3;
const compact = (iso: string) => iso.replaceAll('-', '').replaceAll(':', '');

// Dates come as YYYY-MM-DD and times as HH:MM[:SS]. Without a time the entry is an all-day event.
// Times are "floating" (no time zone), so they show at the same clock time in the guest's calendar.
export function calendarTimes({ event_date, event_time }: Pick<Invitation, 'event_date' | 'event_time'>) {
  if (!event_date) return null;
  if (!event_time) {
    const next = new Date(`${event_date}T00:00:00Z`);
    next.setUTCDate(next.getUTCDate() + 1);
    return { allDay: true, start: compact(event_date), end: compact(next.toISOString().slice(0, 10)) };
  }
  const start = new Date(`${event_date}T${event_time.slice(0, 5)}:00Z`);
  const end = new Date(start.getTime() + durationHours * 3_600_000);
  const floating = (date: Date) => compact(date.toISOString().slice(0, 19));
  return { allDay: false, start: floating(start), end: floating(end) };
}

export function calendarLinks(invitation: CalendarInvitation, slug: string) {
  const times = calendarTimes(invitation);
  if (!times) return null;
  const google = new URL('https://calendar.google.com/calendar/render');
  google.searchParams.set('action', 'TEMPLATE');
  google.searchParams.set('text', invitation.title);
  google.searchParams.set('dates', `${times.start}/${times.end}`);
  if (invitation.location) google.searchParams.set('location', invitation.location);
  return { google: google.toString(), ics: `/convite/${slug}/agenda` };
}

const escapeText = (value: string) => value.replace(/[\\;,]/g, '\\$&').replace(/\r?\n/g, '\\n');

// RFC 5545 asks for lines of at most 75 octets: fold at 50 characters, which stays under that even with accents.
function fold(line: string) {
  const chars = Array.from(line);
  const parts: string[] = [];
  for (let at = 0; at < chars.length; at += 50) parts.push(chars.slice(at, at + 50).join(''));
  return parts.join('\r\n ');
}

export function icsFile(invitation: CalendarInvitation, slug: string, inviteUrl: string, now = new Date()) {
  const times = calendarTimes(invitation);
  if (!times) return null;
  const when = times.allDay
    ? [`DTSTART;VALUE=DATE:${times.start}`, `DTEND;VALUE=DATE:${times.end}`]
    : [`DTSTART:${times.start}`, `DTEND:${times.end}`];
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Vou na Festa//PT-BR', 'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${slug}@vounafesta`,
    `DTSTAMP:${compact(now.toISOString().slice(0, 19))}Z`,
    ...when,
    `SUMMARY:${escapeText(invitation.title)}`,
    ...(invitation.location ? [`LOCATION:${escapeText(invitation.location)}`] : []),
    `DESCRIPTION:${escapeText(`Convite: ${inviteUrl}`)}`,
    `URL:${inviteUrl}`,
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}
