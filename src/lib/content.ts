// Single place the site reads content from. Today: JSON files in src/data.
// When the editor login (Sanity) is connected, only this file changes;
// pages and components keep using the same functions and types.
import site from '../data/site.json';
import eventsData from '../data/events.json';
import postsData from '../data/posts.json';
import teamData from '../data/team.json';
import resourcesData from '../data/resources.json';

export type EventItem = (typeof eventsData)[number];
export type PostItem = (typeof postsData)[number];
export type TeamMember = (typeof teamData)[number];
export type Resource = (typeof resourcesData)[number];

export const getSite = () => site;

const byDateAsc = (a: { date: string }, b: { date: string }) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();

export const getEvents = (): EventItem[] => [...eventsData].sort(byDateAsc);
export const getUpcomingEvents = (now = new Date()): EventItem[] =>
  getEvents().filter((e) => new Date(e.date) >= now);
export const getPastEvents = (now = new Date()): EventItem[] =>
  getEvents()
    .filter((e) => new Date(e.date) < now)
    .reverse();

export const getPosts = (): PostItem[] => [...postsData].sort(byDateAsc).reverse();
export const getTeam = (): TeamMember[] => teamData;

export const getResourcesByCategory = (): Record<string, Resource[]> => {
  const groups: Record<string, Resource[]> = {};
  for (const r of resourcesData) (groups[r.category] ??= []).push(r);
  return groups;
};

const TZ = 'America/New_York';

export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: TZ }).format(new Date(iso));

export const formatDateTime = (iso: string): string =>
  new Intl.DateTimeFormat('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: TZ,
  }).format(new Date(iso));

export const dateParts = (iso: string) => {
  const d = new Date(iso);
  return {
    day: new Intl.DateTimeFormat('fr-FR', { day: 'numeric', timeZone: TZ }).format(d),
    month: new Intl.DateTimeFormat('fr-FR', { month: 'short', timeZone: TZ })
      .format(d)
      .replace('.', ''),
    year: new Intl.DateTimeFormat('fr-FR', { year: 'numeric', timeZone: TZ }).format(d),
  };
};
