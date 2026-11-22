export type Invitation = {
  title: string;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
  cover_path: string | null;
  accent_color: string | null;
};

export const demoInvitation: Invitation = {
  title: 'Uma noite para celebrar',
  event_date: '2026-12-12',
  event_time: '19:30',
  location: 'Terraço Aurora · São Paulo, SP',
  cover_path: null,
  accent_color: null,
};

export const defaultAccent = '#c2417f';

export const demoSlug = 'exemplo';
export const maxCompanions = 10;
export const maxNameLength = 100;

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});

export function invitationSchedule({ event_date, event_time }: Pick<Invitation, 'event_date' | 'event_time'>) {
  const date = event_date && dateFormatter.format(new Date(`${event_date}T00:00:00Z`));
  const time = event_time && `${event_time.slice(0, 2)}h${event_time.slice(3, 5) === '00' ? '' : event_time.slice(3, 5)}`;
  return [date, time].filter(Boolean).join(' · ');
}
