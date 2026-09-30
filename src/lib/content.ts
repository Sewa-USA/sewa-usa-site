// Single place the site reads content from: Sanity (project oy6psniq) at build time.
// Static info (name, phone, email, WhatsApp) stays in src/data/site.json.
// Pages and components only use the functions and types exported here.
import { createClient } from '@sanity/client';
import site from '../data/site.json';

const client = createClient({
  projectId: import.meta.env.SANITY_PROJECT_ID ?? 'oy6psniq',
  dataset: import.meta.env.SANITY_DATASET ?? 'production',
  apiVersion: '2025-01-01',
  useCdn: false, // build-time reads must see the latest published content
  perspective: 'published', // never show drafts
});

export type EventItem = {
  slug: string;
  title: string;
  date: string;
  location: string;
  summary: string;
  body: string[];
  imageUrl?: string;
  sample?: boolean;
};
export type PostItem = {
  slug: string;
  title: string;
  date: string;
  category: string;
  summary: string;
  body: string[];
  imageUrl?: string;
  sample?: boolean;
};
export type TeamMember = { name: string; role: string; bio?: string; imageUrl?: string; sample?: boolean };
export type Resource = { category: string; title: string; description: string; url: string };

type Raw<T> = Omit<T, 'body'> & { body?: string | null };

// Editors write plain text; a blank line separates paragraphs.
const paragraphs = (text?: string | null): string[] =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

// One fetch per build for each list, shared by every page.
const memo = new Map<string, Promise<unknown>>();
const cached = <T>(key: string, load: () => Promise<T>): Promise<T> => {
  if (!memo.has(key)) memo.set(key, load());
  return memo.get(key) as Promise<T>;
};

const EVENT_FIELDS = `"slug": slug.current, title, date, location, summary, body, "imageUrl": image.asset->url, sample`;
const POST_FIELDS = `"slug": slug.current, title, date, category, summary, body, "imageUrl": image.asset->url, sample`;

export const getSite = () => site;

export const getEvents = (): Promise<EventItem[]> =>
  cached('events', async () => {
    const rows = await client.fetch<Raw<EventItem>[]>(
      `*[_type == "event" && defined(slug.current)] | order(date asc) {${EVENT_FIELDS}}`,
    );
    return rows.map((r) => ({ ...r, body: paragraphs(r.body) }));
  });

export const getUpcomingEvents = async (now = new Date()): Promise<EventItem[]> =>
  (await getEvents()).filter((e) => new Date(e.date) >= now);

export const getPastEvents = async (now = new Date()): Promise<EventItem[]> =>
  (await getEvents()).filter((e) => new Date(e.date) < now).reverse();

export const getPosts = (): Promise<PostItem[]> =>
  cached('posts', async () => {
    const rows = await client.fetch<Raw<PostItem>[]>(
      `*[_type == "post" && defined(slug.current)] | order(date desc) {${POST_FIELDS}}`,
    );
    return rows.map((r) => ({ ...r, body: paragraphs(r.body) }));
  });

export const getTeam = (): Promise<TeamMember[]> =>
  cached('team', () =>
    client.fetch<TeamMember[]>(
      `*[_type == "teamMember"] | order(order asc) {name, role, bio, "imageUrl": photo.asset->url, sample}`,
    ),
  );

export const getResourcesByCategory = async (): Promise<Record<string, Resource[]>> => {
  const rows = await cached('resources', () =>
    client.fetch<Resource[]>(`*[_type == "resource"] | order(category asc, title asc) {category, title, description, url}`),
  );
  const groups: Record<string, Resource[]> = {};
  for (const r of rows) (groups[r.category] ??= []).push(r);
  return groups;
};

// Sanity serves resized, optimized images; ask for the size we display.
export const img = (url: string, w: number, h?: number): string =>
  `${url}?w=${w}${h ? `&h=${h}&fit=crop` : ''}&auto=format`;

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
