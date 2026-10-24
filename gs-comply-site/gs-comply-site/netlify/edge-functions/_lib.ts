// Shared helpers for the Netlify Edge Functions (Deno runtime).
// These fetch LIVE posts from Supabase on every request (with a short CDN cache),
// so publishing a post never needs a redeploy.
import sanitizeHtml from 'npm:sanitize-html@2.13.0';

export const SITE_URL = (Deno.env.get('SITE_URL') || 'https://gscomply.com').replace(/\/+$/, '');
export const SITE_NAME = 'GS Comply Solutions';
export const PER_PAGE = 9;
export const CATEGORIES = [
  'REACH', 'RoHS', 'IMDS', 'PFAS', 'SCIP', 'CBAM', 'PPWR', 'Battery Regulation',
  'Supplier Compliance', 'Material Declaration', 'Sustainability', 'General',
];
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export interface PostRow {
  title: string;
  slug: string;
  excerpt: string | null;
  content?: string | null;
  cover_image_url: string | null;
  category: string | null;
  published_at: string;
  updated_at: string;
  seo_title?: string | null;
  seo_description?: string | null;
  author_name: string | null;
  read_time_minutes: number | null;
}

const env = (a: string, b: string) => Deno.env.get(a) || Deno.env.get(b) || '';

async function rest(query: string, withCount = false): Promise<{ rows: any[]; total: number }> {
  const base = env('SUPABASE_URL', 'VITE_SUPABASE_URL');
  const key = env('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');
  if (!base || !key) throw new Error('SUPABASE_URL / SUPABASE_ANON_KEY are not set for edge functions');
  const res = await fetch(`${base}/rest/v1/posts?${query}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      ...(withCount ? { Prefer: 'count=exact' } : {}),
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  const rows = await res.json();
  const range = res.headers.get('content-range') || '';
  const total = withCount ? Number(range.split('/')[1]) || rows.length : rows.length;
  return { rows, total };
}

const LIST_COLS =
  'title,slug,excerpt,cover_image_url,category,published_at,updated_at,author_name,read_time_minutes';
const live = () =>
  `status=in.(published,scheduled)&published_at=lte.${encodeURIComponent(new Date().toISOString())}`;

export async function listPosts(page: number, category?: string) {
  const from = (page - 1) * PER_PAGE;
  let q = `select=${LIST_COLS}&${live()}&order=published_at.desc&limit=${PER_PAGE}&offset=${from}`;
  if (category) q += `&category=eq.${encodeURIComponent(category)}`;
  const { rows, total } = await rest(q, true);
  return { posts: rows as PostRow[], total };
}

export async function getPost(slug: string): Promise<PostRow | null> {
  if (!SLUG_RE.test(slug)) return null;
  const { rows } = await rest(`select=*&${live()}&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return (rows[0] as PostRow) ?? null;
}

export async function allLivePosts(limit = 1000, withContent = false) {
  const cols = withContent ? `${LIST_COLS},content,seo_description` : LIST_COLS;
  const { rows } = await rest(`select=${cols}&${live()}&order=published_at.desc&limit=${limit}`);
  return rows as PostRow[];
}

/* ------------------------------ HTML helpers ------------------------------ */

export const esc = (s: unknown) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const jsonLd = (obj: unknown) => JSON.stringify(obj).replace(/</g, '\\u003c');

export const absolute = (u: string) => (/^https?:\/\//i.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);

export const plain = (html: string) =>
  html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

export const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/** Same allow-list as the browser (DOMPurify) sanitiser. */
export function cleanHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      'h2', 'h3', 'h4', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote', 'strong', 'b', 'em', 'i', 'u', 's',
      'code', 'pre', 'span', 'a', 'img', 'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col', 'caption',
    ],
    allowedAttributes: {
      a: ['href', 'target', 'rel', 'title'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      '*': ['id', 'class'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    transformTags: {
      a: (tag: string, attribs: Record<string, string>) => {
        const out = { ...attribs };
        if (/^https?:\/\//i.test(out.href || '')) {
          out.target = '_blank';
          out.rel = 'noopener noreferrer';
        }
        return { tagName: tag, attribs: out };
      },
    },
  });
}

/** Give h2/h3 ids so in-page links work in the pre-rendered copy too. */
export function addHeadingIds(html: string): string {
  const used = new Set<string>();
  return html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (m, tag, attrs, inner) => {
    if (/\sid=/.test(attrs)) return m;
    const base = plain(inner).toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 60) || 'section';
    let id = base, n = 2;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });
}

export interface PageMeta {
  title: string;        // full <title>
  description: string;
  path: string;         // e.g. /insights/foo
  type?: 'website' | 'article';
  image?: string | null;
  noindex?: boolean;
  published?: string | null;
  modified?: string | null;
  section?: string | null;
  jsonLd?: unknown[];
  extraHead?: string;
}

export function headTags(m: PageMeta): string {
  const url = `${SITE_URL}${m.path}`;
  const img = absolute(m.image || '/og-image.svg');
  const t = (s: string) => `${s} data-rh="true" />`;
  const lines = [
    `<title data-rh="true">${esc(m.title)}</title>`,
    t(`<meta name="description" content="${esc(m.description)}"`),
    t(`<meta name="robots" content="${m.noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'}"`),
    t(`<link rel="canonical" href="${esc(url)}"`),
    t(`<meta property="og:site_name" content="${SITE_NAME}"`),
    t(`<meta property="og:type" content="${m.type || 'website'}"`),
    t(`<meta property="og:url" content="${esc(url)}"`),
    t(`<meta property="og:title" content="${esc(m.title)}"`),
    t(`<meta property="og:description" content="${esc(m.description)}"`),
    t(`<meta property="og:image" content="${esc(img)}"`),
    m.published ? t(`<meta property="article:published_time" content="${esc(m.published)}"`) : '',
    m.modified ? t(`<meta property="article:modified_time" content="${esc(m.modified)}"`) : '',
    m.section ? t(`<meta property="article:section" content="${esc(m.section)}"`) : '',
    t(`<meta name="twitter:card" content="summary_large_image"`),
    t(`<meta name="twitter:url" content="${esc(url)}"`),
    t(`<meta name="twitter:title" content="${esc(m.title)}"`),
    t(`<meta name="twitter:description" content="${esc(m.description)}"`),
    t(`<meta name="twitter:image" content="${esc(img)}"`),
    t(`<link rel="alternate" type="application/rss+xml" title="${SITE_NAME} Insights" href="${SITE_URL}/rss.xml"`),
    ...(m.jsonLd || []).map((o) => `<script type="application/ld+json" data-rh="true">${jsonLd(o)}</script>`),
    m.extraHead || '',
  ];
  return lines.filter(Boolean).join('\n    ');
}

/** Swap the head tags and the empty #root of the built SPA shell for pre-rendered ones. */
export function injectIntoShell(shell: string, meta: PageMeta, bodyHtml: string): string {
  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="(description|robots)"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+(property="og:[^"]*"|name="twitter:[^"]*")[^>]*>/gi, '');
  html = html.replace('</head>', `    ${headTags(meta)}\n  </head>`);
  return html.replace(/<div id="root">\s*<\/div>/, `<div id="root">${bodyHtml}</div>`);
}

const wrapStyle =
  'max-width:760px;margin:0 auto;padding:6rem 1.25rem 3rem;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#374151;line-height:1.75';

export function chrome(inner: string): string {
  return `<div id="prerender" style="${wrapStyle}">
<nav aria-label="Main" style="margin-bottom:2rem;font-size:14px"><a href="/" style="color:#1A6B3C">Home</a> · <a href="/services" style="color:#1A6B3C">Services</a> · <a href="/industries" style="color:#1A6B3C">Industries</a> · <a href="/regulations" style="color:#1A6B3C">Regulations</a> · <a href="/insights" style="color:#1A6B3C">Insights</a> · <a href="/contact" style="color:#1A6B3C">Contact</a></nav>
${inner}
</div>`;
}

export const articleJsonLd = (p: PostRow, description: string) => [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/insights/${p.slug}` },
    headline: p.title.slice(0, 110),
    description,
    image: p.cover_image_url ? [absolute(p.cover_image_url)] : undefined,
    datePublished: p.published_at,
    dateModified: p.updated_at,
    articleSection: p.category || undefined,
    author:
      !p.author_name || p.author_name === SITE_NAME
        ? { '@type': 'Organization', name: SITE_NAME, url: SITE_URL }
        : { '@type': 'Person', name: p.author_name },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/GS_comply__Logo.jpg` },
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Insights', item: `${SITE_URL}/insights` },
      { '@type': 'ListItem', position: 3, name: p.title, item: `${SITE_URL}/insights/${p.slug}` },
    ],
  },
];
