import type { APIRoute } from 'astro';
import { getEvents, type EventItem } from '../../lib/content';

export async function getStaticPaths() {
  return (await getEvents()).map((event) => ({ params: { slug: event.slug }, props: { event } }));
}

const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const esc = (t: string) => t.replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

// Calendar file for one event. No end time is stored, so events last 2 hours.
export const GET: APIRoute = ({ props }) => {
  const { event } = props as { event: EventItem };
  const start = new Date(event.date);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//SEWA USA//FR',
    'BEGIN:VEVENT',
    `UID:${event.slug}@sewa-usa`,
    `DTSTAMP:${stamp(new Date())}`,
    `DTSTART:${stamp(start)}`,
    `DTEND:${stamp(end)}`,
    `SUMMARY:${esc(event.title)}`,
    `LOCATION:${esc(event.location)}`,
    `DESCRIPTION:${esc(event.summary)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];
  return new Response(lines.join('\r\n'), {
    headers: { 'Content-Type': 'text/calendar; charset=utf-8' },
  });
};
