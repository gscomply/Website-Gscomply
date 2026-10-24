export type PostStatus = 'draft' | 'scheduled' | 'published';

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  cover_image_url: string | null;
  category: string | null;
  status: PostStatus;
  published_at: string | null;
  seo_title: string | null;
  seo_description: string | null;
  author_name: string | null;
  read_time_minutes: number | null;
  created_at: string;
  updated_at: string;
}

/** Everything except the (large) content column. Used for lists and cards. */
export type PostListItem = Omit<Post, 'content' | 'seo_title' | 'seo_description'>;

export const POST_LIST_COLUMNS =
  'id, title, slug, excerpt, cover_image_url, category, status, published_at, author_name, read_time_minutes, created_at, updated_at';

export const BLOG_CATEGORIES = [
  'REACH',
  'RoHS',
  'IMDS',
  'PFAS',
  'SCIP',
  'CBAM',
  'PPWR',
  'Battery Regulation',
  'Supplier Compliance',
  'Material Declaration',
  'Sustainability',
  'General',
] as const;

export const SEO_TITLE_MAX = 60;
export const SEO_DESCRIPTION_MAX = 160;

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100)
    .replace(/-+$/g, '');
}

export function plainText(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
}

export function calculateReadTime(html: string | null | undefined): number {
  if (!html) return 1;
  const text = plainText(html);
  const words = text ? text.split(' ').length : 0;
  return Math.max(1, Math.ceil(words / 200));
}

export function readTimeOf(post: { read_time_minutes?: number | null; content?: string | null }): number {
  return post.read_time_minutes ?? calculateReadTime(post.content);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/** A scheduled post whose time has passed is live, so show it as published. */
export function effectiveStatus(post: { status: PostStatus; published_at: string | null }): PostStatus {
  if (post.status === 'scheduled' && post.published_at && new Date(post.published_at) <= new Date()) {
    return 'published';
  }
  return post.status;
}

/* ---- <input type="datetime-local"> helpers (value is LOCAL time, no zone) ---- */
const pad = (n: number) => String(n).padStart(2, '0');

export function toLocalInput(iso: string | null | undefined): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function fromLocalInput(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
