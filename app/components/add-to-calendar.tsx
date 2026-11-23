import { CalendarPlus } from 'lucide-react';

export type CalendarLinks = { google: string; ics: string } | null;

export function AddToCalendar({ links }: { links: CalendarLinks }) {
  if (!links) return null;
  return (
    <div className="add-to-calendar">
      <p><CalendarPlus size={16} aria-hidden="true" /> Salvar na agenda</p>
      <div className="share-actions">
        <a className="button button-secondary" href={links.google} target="_blank" rel="noopener noreferrer">Google Agenda</a>
        {/* .ics opens in Apple Calendar, Outlook and most other calendar apps. */}
        <a className="button button-secondary" href={links.ics}>Apple e Outlook</a>
      </div>
    </div>
  );
}
