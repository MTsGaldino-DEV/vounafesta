import assert from 'node:assert/strict';
import test from 'node:test';
import { calendarLinks, calendarTimes, icsFile } from '../lib/calendar.ts';

const event = { title: 'Festa, da Ana; 30 anos', event_date: '2026-12-31', event_time: '22:30:00', location: 'Rua A, 10' };

test('timed events last three hours and may cross midnight', () => {
  assert.deepEqual(calendarTimes(event), { allDay: false, start: '20261231T223000', end: '20270101T013000' });
});

test('events without a time are all-day and without a date have no calendar entry', () => {
  assert.deepEqual(calendarTimes({ ...event, event_time: null }), { allDay: true, start: '20261231', end: '20270101' });
  assert.equal(calendarTimes({ ...event, event_date: null }), null);
  assert.equal(calendarLinks({ ...event, event_date: null }, 'x'), null);
});

test('ics escapes text, folds long lines and uses CRLF', () => {
  const ics = icsFile({ ...event, title: `${event.title} ${'x'.repeat(120)}` }, 'abc', 'https://site/convite/abc', new Date('2026-01-01T00:00:00Z'));
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /DTSTART:20261231T223000\r\n/);
  assert.match(ics, /BEGIN:VALARM\r\nACTION:DISPLAY\r\n/);
  assert.match(ics, /TRIGGER:-P1D\r\nEND:VALARM\r\n/);
  assert.match(ics, /LOCATION:Rua A\\, 10\r\n/);
  assert.ok(ics.includes('SUMMARY:Festa\\, da Ana\\; 30 anos'));
  assert.ok(ics.split('\r\n').every((line) => line.length <= 51));
});

test('google link carries title, dates and place', () => {
  const { google, ics } = calendarLinks(event, 'abc');
  const url = new URL(google);
  assert.equal(url.searchParams.get('dates'), '20261231T223000/20270101T013000');
  assert.equal(url.searchParams.get('text'), event.title);
  assert.equal(ics, '/convite/abc/agenda');
});
