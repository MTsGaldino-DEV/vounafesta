export type Invitation = {
  title: string;
  event_date: string | null;
  event_time: string | null;
  location: string | null;
};

export const demoInvitation: Invitation = {
  title: 'Maressa',
  event_date: '2026-12-20',
  event_time: '12:30',
  location: 'Rua das Ondas, 100 · Bairro Maré',
};

export const demoSlug = 'exemplo';
export const maxCompanions = 10;
export const maxNameLength = 100;

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC',
});

const partFormatters = {
  day: new Intl.DateTimeFormat('pt-BR', { day: 'numeric', timeZone: 'UTC' }),
  month: new Intl.DateTimeFormat('pt-BR', { month: 'long', timeZone: 'UTC' }),
  weekday: new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'UTC' }),
};

// Pieces of the schedule for the themed invitation: "20", "dezembro", "Domingo", "12:30h".
export function invitationParts({ event_date, event_time }: Invitation) {
  const date = event_date ? new Date(`${event_date}T00:00:00Z`) : null;
  const weekday = date && partFormatters.weekday.format(date);
  return {
    day: date && partFormatters.day.format(date),
    month: date && partFormatters.month.format(date),
    weekday: weekday && weekday[0].toUpperCase() + weekday.slice(1),
    time: event_time && `${event_time.slice(0, 5)}h`,
  };
}

export function invitationSchedule({ event_date, event_time }: Invitation) {
  const date = event_date && dateFormatter.format(new Date(`${event_date}T00:00:00Z`));
  const time = event_time && `${event_time.slice(0, 2)}h${event_time.slice(3, 5) === '00' ? '' : event_time.slice(3, 5)}`;
  return [date, time].filter(Boolean).join(' · ');
}
