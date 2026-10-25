/**
 * Vercel Function: live blog pages for search engines (only used when VITE_BLOG_ENABLED=true).
 *
 * vercel.json rewrites these public URLs to this one function:
 *   /insights          -> /api/blog?kind=list
 *   /insights/:slug    -> /api/blog?kind=post&slug=:slug
 *   /rss.xml           -> /api/blog?kind=rss
 *   /sitemap.xml       -> /api/blog?kind=sitemap
 *
 * It reads LIVE posts from Supabase on every (CDN-cached) request, so publishing a post needs no redeploy.
 * It takes the built app shell (/200.html) and fills in the title, meta tags, canonical URL, Open Graph tags,
 * JSON-LD and the article text, then the React app loads on top exactly as normal.
 *
 * Environment variables (Vercel > Project > Settings > Environment Variables):
 *   VITE_BLOG_ENABLED, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SITE_URL
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import sanitizeHtml from 'sanitize-html';

/* ------------------------------ config ------------------------------ */
const env = (...names: string[]) => names.map((n) => process.env[n]).find(Boolean) || '';
const siteUrl = () => (env('SITE_URL') || 'https://gscomply.com').replace(/\/+$/, '');
const blogEnabled = () => env('VITE_BLOG_ENABLED', 'BLOG_ENABLED') === 'true';
const SITE_NAME = 'GS Comply Solutions';
const PER_PAGE = 9;
const CATEGORIES = [
  'REACH', 'RoHS', 'IMDS', 'PFAS', 'SCIP', 'CBAM', 'PPWR', 'Battery Regulation',
  'Supplier Compliance', 'Material Declaration', 'Sustainability', 'General',
];
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
// Keep in sync with PAGES in src/entry-server.tsx
const STATIC_PAGES = [
  '/', '/about', '/services', '/industries', '/regulations', '/imds-cdx',
  '/sustainability', '/scip-notification-services', '/contact', '/privacy-policy', '/terms',
];
const CDN_CACHE = 'public, max-age=0, s-maxage=120, stale-while-revalidate=300';

interface PostRow {
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

/* ------------------------------ Supabase ------------------------------ */
async function rest(query: string, withCount = false): Promise<{ rows: any[]; total: number }> {
  const base = env('SUPABASE_URL', 'VITE_SUPABASE_URL');
  const key = env('SUPABASE_ANON_KEY', 'VITE_SUPABASE_ANON_KEY');
  if (!base || !key) throw new Error('Supabase URL / anon key are not set for the function');
  const res = await fetch(`${base}/rest/v1/posts?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...(withCount ? { Prefer: 'count=exact' } : {}) },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}`);
  const rows = await res.json();
  const total = withCount ? Number((res.headers.get('content-range') || '').split('/')[1]) || rows.length : rows.length;
  return { rows, total };
}

const LIST_COLS = 'title,slug,excerpt,cover_image_url,category,published_at,updated_at,author_name,read_time_minutes';
const live = () => `status=in.(published,scheduled)&published_at=lte.${encodeURIComponent(new Date().toISOString())}`;

async function listPosts(page: number, category?: string) {
  let q = `select=${LIST_COLS}&${live()}&order=published_at.desc&limit=${PER_PAGE}&offset=${(page - 1) * PER_PAGE}`;
  if (category) q += `&category=eq.${encodeURIComponent(category)}`;
  const { rows, total } = await rest(q, true);
  return { posts: rows as PostRow[], total };
}

async function getPost(slug: string): Promise<PostRow | null> {
  if (!SLUG_RE.test(slug)) return null;
  const { rows } = await rest(`select=*&${live()}&slug=eq.${encodeURIComponent(slug)}&limit=1`);
  return (rows[0] as PostRow) ?? null;
}

async function allLivePosts(limit: number, withContent = false) {
  const cols = withContent ? `${LIST_COLS},content,seo_description` : LIST_COLS;
  const { rows } = await rest(`select=${cols}&${live()}&order=published_at.desc&limit=${limit}`);
  return rows as PostRow[];
}

/* ------------------------------ HTML helpers ------------------------------ */
const esc = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const jsonLd = (o: unknown) => JSON.stringify(o).replace(/</g, '\\u003c');
const absolute = (u: string) => (/^https?:\/\//i.test(u) ? u : `${siteUrl()}${u.startsWith('/') ? '' : '/'}${u}`);
const plain = (html: string) => html.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const cdata = (s: string) => `<![CDATA[${s.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;

/** Same allow-list as the browser sanitiser (DOMPurify): scripts, iframes, event handlers and javascript: links are removed. */
function cleanHtml(html: string): string {
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

function addHeadingIds(html: string): string {
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

interface PageMeta {
  title: string;
  description: string;
  path: string;
  type?: 'website' | 'article';
  image?: string | null;
  noindex?: boolean;
  published?: string | null;
  modified?: string | null;
  section?: string | null;
  jsonLd?: unknown[];
}

function headTags(m: PageMeta): string {
  const site = siteUrl();
  const url = `${site}${m.path}`;
  const img = absolute(m.image || '/og-image.png');
  const t = (s: string) => `${s} data-rh="true" />`;
  return [
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
    t(`<link rel="alternate" type="application/rss+xml" title="${SITE_NAME} Insights" href="${site}/rss.xml"`),
    ...(m.jsonLd || []).map((o) => `<script type="application/ld+json" data-rh="true">${jsonLd(o)}</script>`),
  ].filter(Boolean).join('\n    ');
}

function injectIntoShell(shell: string, meta: PageMeta, bodyHtml: string): string {
  let html = shell
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="(description|robots)"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+(property="og:[^"]*"|name="twitter:[^"]*")[^>]*>/gi, '');
  html = html.replace('</head>', `    ${headTags(meta)}\n  </head>`);
  return html.replace(/<div id="root">\s*<\/div>/, () => `<div id="root">${bodyHtml}</div>`);
}

const chrome = (inner: string) => `<div id="prerender" style="max-width:760px;margin:0 auto;padding:6rem 1.25rem 3rem;font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#374151;line-height:1.75">
<nav aria-label="Main" style="margin-bottom:2rem;font-size:14px"><a href="/" style="color:#1A6B3C">Home</a> · <a href="/services" style="color:#1A6B3C">Services</a> · <a href="/industries" style="color:#1A6B3C">Industries</a> · <a href="/insights" style="color:#1A6B3C">Insights</a> · <a href="/contact" style="color:#1A6B3C">Contact</a></nav>
${inner}
</div>`;

const href = (category: string | null, page: number) => {
  const p = new URLSearchParams();
  if (category) p.set('category', category);
  if (page > 1) p.set('page', String(page));
  const qs = p.toString();
  return qs ? `/insights?${qs}` : '/insights';
};

function listBody(posts: PostRow[], total: number, page: number, category: string | null) {
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const cats = ['All', ...CATEGORIES]
    .map((c) => `<a href="${esc(href(c === 'All' ? null : c, 1))}" style="margin-right:10px;color:#1A6B3C">${esc(c)}</a>`)
    .join('');
  const items = posts.map((p) => `<article style="margin:0 0 2rem">
<h2 style="margin:0 0 .25rem;font-size:20px"><a href="/insights/${esc(p.slug)}" style="color:#111827;text-decoration:none">${esc(p.title)}</a></h2>
<p style="margin:0 0 .5rem;font-size:13px;color:#6b7280">${p.category ? esc(p.category) + ' · ' : ''}<time datetime="${esc(p.published_at)}">${fmtDate(p.published_at)}</time> · ${p.read_time_minutes || 1} min read</p>
${p.excerpt ? `<p style="margin:0">${esc(p.excerpt)}</p>` : ''}
</article>`).join('\n');
  const pager = pages > 1
    ? `<nav aria-label="Pagination" style="margin-top:2rem">${page > 1 ? `<a rel="prev" href="${esc(href(category, page - 1))}">Previous</a> · ` : ''}Page ${page} of ${pages}${page < pages ? ` · <a rel="next" href="${esc(href(category, page + 1))}">Next</a>` : ''}</nav>`
    : '';
  return chrome(`<h1 style="font-size:32px;color:#111827">Insights &amp; Resources</h1>
<p>Practical guidance and updates on regulatory compliance, material declarations, sustainability and supply chain requirements for manufacturers.</p>
<p style="font-size:14px">${cats}</p>
${items || '<p>No articles published yet.</p>'}
${pager}`);
}

function postBody(p: PostRow) {
  const content = addHeadingIds(cleanHtml(p.content || ''));
  return chrome(`<article>
<p style="font-size:13px;margin:0 0 .5rem"><a href="/insights" style="color:#1A6B3C">&larr; All articles</a></p>
${p.category ? `<p style="margin:0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#1A6B3C">${esc(p.category)}</p>` : ''}
<h1 style="font-size:34px;line-height:1.2;color:#111827;margin:.25rem 0 .5rem">${esc(p.title)}</h1>
<p style="font-size:14px;color:#6b7280">By ${esc(p.author_name || SITE_NAME)} · <time datetime="${esc(p.published_at)}">${fmtDate(p.published_at)}</time> · ${p.read_time_minutes || 1} min read</p>
${p.cover_image_url ? `<img src="${esc(p.cover_image_url)}" alt="${esc(p.title)}" width="1200" height="600" style="max-width:100%;height:auto;border-radius:12px" />` : ''}
${p.excerpt ? `<p style="font-size:18px;font-weight:500">${esc(p.excerpt)}</p>` : ''}
<div>${content}</div>
<aside style="margin-top:2.5rem;padding:1.5rem;border-radius:12px;background:#f0f7f3"><strong>Need help with ${esc(p.category && p.category !== 'General' ? p.category : 'compliance')} for your products?</strong><br/><a href="/contact" style="color:#1A6B3C">Discuss your requirement</a></aside>
</article>`);
}

const articleJsonLd = (p: PostRow, description: string) => {
  const site = siteUrl();
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: { '@type': 'WebPage', '@id': `${site}/insights/${p.slug}` },
      headline: p.title.slice(0, 110),
      description,
      image: p.cover_image_url ? [absolute(p.cover_image_url)] : undefined,
      datePublished: p.published_at,
      dateModified: p.updated_at,
      articleSection: p.category || undefined,
      author: !p.author_name || p.author_name === SITE_NAME
        ? { '@type': 'Organization', name: SITE_NAME, url: site }
        : { '@type': 'Person', name: p.author_name },
      publisher: { '@type': 'Organization', name: SITE_NAME, url: site, logo: { '@type': 'ImageObject', url: `${site}/logo.png` } },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site },
        { '@type': 'ListItem', position: 2, name: 'Insights', item: `${site}/insights` },
        { '@type': 'ListItem', position: 3, name: p.title, item: `${site}/insights/${p.slug}` },
      ],
    },
  ];
};

/* ------------------------------ app shell ------------------------------ */
let shellCache: { html: string; at: number } | null = null;

async function fetchStatic(req: IncomingMessage, path: string): Promise<string> {
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || '';
  const proto = (req.headers['x-forwarded-proto'] as string) || 'https';
  const r = await fetch(`${proto}://${host}${path}`);
  if (!r.ok && r.status !== 404) throw new Error(`Could not load ${path}: ${r.status}`);
  return r.text();
}

async function getShell(req: IncomingMessage): Promise<string> {
  if (shellCache && Date.now() - shellCache.at < 5 * 60_000) return shellCache.html;
  const html = await fetchStatic(req, '/200.html');
  shellCache = { html, at: Date.now() };
  return html;
}

function send(res: ServerResponse, status: number, type: string, body: string, cache = CDN_CACHE) {
  res.statusCode = status;
  res.setHeader('Content-Type', type);
  res.setHeader('Cache-Control', cache);
  res.end(body);
}

/* ------------------------------ handler ------------------------------ */
export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '/', 'http://localhost');
  const kind = url.searchParams.get('kind') || '';
  const site = siteUrl();

  try {
    // ---- sitemap (only reaches here when the blog is on, otherwise the static dist/sitemap.xml is served) ----
    if (kind === 'sitemap') {
      const posts = blogEnabled() ? await allLivePosts(5000) : [];
      const used = new Set(posts.map((p) => p.category).filter(Boolean));
      const pages = STATIC_PAGES.concat(blogEnabled() ? ['/insights'] : []);
      const urls = [
        ...pages.map((p) => `  <url><loc>${site}${p}</loc></url>`),
        ...CATEGORIES.filter((c) => used.has(c)).map((c) => `  <url><loc>${site}/insights?category=${encodeURIComponent(c)}</loc></url>`),
        ...posts.map((p) => `  <url><loc>${site}/insights/${esc(p.slug)}</loc><lastmod>${new Date(p.updated_at).toISOString()}</lastmod></url>`),
      ].join('\n');
      return send(res, 200, 'application/xml; charset=utf-8',
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
    }

    // ---- blog switched off: these URLs do not exist (real 404 for search engines) ----
    if (!blogEnabled()) {
      if (kind === 'rss') return send(res, 404, 'text/plain; charset=utf-8', 'Not found', 'public, max-age=0');
      let page = '<h1>Page not found</h1>';
      try { page = await fetchStatic(req, '/404.html'); } catch { /* plain fallback */ }
      return send(res, 404, 'text/html; charset=utf-8', page, 'public, max-age=0, must-revalidate');
    }

    // ---- RSS ----
    if (kind === 'rss') {
      const posts = await allLivePosts(50, true);
      const items = posts.map((p) => {
        const link = `${site}/insights/${p.slug}`;
        const desc = p.seo_description || p.excerpt || plain(p.content || '').slice(0, 200);
        return `    <item>
      <title>${cdata(p.title)}</title>
      <link>${esc(link)}</link>
      <guid isPermaLink="true">${esc(link)}</guid>
      <pubDate>${new Date(p.published_at).toUTCString()}</pubDate>
      ${p.category ? `<category>${cdata(p.category)}</category>` : ''}
      <dc:creator>${cdata(p.author_name || SITE_NAME)}</dc:creator>
      <description>${cdata(desc)}</description>
      <content:encoded>${cdata(cleanHtml(p.content || ''))}</content:encoded>
    </item>`;
      }).join('\n');
      const last = posts[0]?.published_at ? new Date(posts[0].published_at).toUTCString() : new Date().toUTCString();
      return send(res, 200, 'application/rss+xml; charset=utf-8', `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE_NAME)} - Insights</title>
    <link>${site}/insights</link>
    <description>Regulatory compliance insights for manufacturers covering REACH, RoHS, PFAS, IMDS, SCIP and more.</description>
    <language>en</language>
    <lastBuildDate>${last}</lastBuildDate>
    <atom:link href="${site}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`);
    }

    const shell = await getShell(req);

    // ---- /insights ----
    if (kind === 'list') {
      const rawCat = url.searchParams.get('category');
      const category = rawCat && CATEGORIES.includes(rawCat) ? rawCat : null;
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
      const { posts, total } = await listPosts(page, category || undefined);
      const meta: PageMeta = {
        title: `${category ? `${category} insights & resources` : 'Insights & Resources'}${page > 1 ? ` - Page ${page}` : ''} | ${SITE_NAME}`,
        description: 'Practical guidance and updates on regulatory compliance, material declarations, sustainability and supply chain requirements for manufacturers.',
        path: href(category, page),
      };
      return send(res, 200, 'text/html; charset=utf-8', injectIntoShell(shell, meta, listBody(posts, total, page, category)));
    }

    // ---- /insights/:slug ----
    if (kind === 'post') {
      let slug = url.searchParams.get('slug') || '';
      try { slug = decodeURIComponent(slug); } catch { /* keep raw */ }
      const post = await getPost(slug);
      if (!post) {
        const meta: PageMeta = {
          title: `Article not found | ${SITE_NAME}`,
          description: 'The article you are looking for does not exist or has not been published.',
          path: `/insights/${encodeURIComponent(slug)}`,
          noindex: true,
        };
        const body = chrome(`<h1>We could not find that article</h1><p><a href="/insights" style="color:#1A6B3C">Browse all articles</a></p>`);
        return send(res, 404, 'text/html; charset=utf-8', injectIntoShell(shell, meta, body), 'public, max-age=0, s-maxage=30');
      }
      const description = post.seo_description || post.excerpt || plain(post.content || '').slice(0, 155);
      const baseTitle = post.seo_title || post.title;
      const meta: PageMeta = {
        title: baseTitle.includes('GS Comply') ? baseTitle : `${baseTitle} | ${SITE_NAME}`,
        description,
        path: `/insights/${post.slug}`,
        type: 'article',
        image: post.cover_image_url,
        published: post.published_at,
        modified: post.updated_at,
        section: post.category,
        jsonLd: articleJsonLd(post, description),
      };
      return send(res, 200, 'text/html; charset=utf-8', injectIntoShell(shell, meta, postBody(post)));
    }

    return send(res, 404, 'text/plain; charset=utf-8', 'Not found', 'public, max-age=0');
  } catch (err) {
    console.error('blog function failed:', err);
    return send(res, 503, 'text/plain; charset=utf-8', 'Temporarily unavailable. Please try again shortly.', 'no-store');
  }
}
