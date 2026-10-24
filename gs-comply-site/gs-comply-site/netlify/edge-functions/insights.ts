// Server-renders /insights and /insights/:slug so search engines get real HTML
// (content, meta tags, canonical, Open Graph, JSON-LD) without running JavaScript.
// The React app still loads afterwards and takes over, exactly as before.
import type { Context } from 'https://edge.netlify.com';
import {
  SITE_URL, SITE_NAME, BLOG_ENABLED, CATEGORIES, PER_PAGE, esc, plain, fmtDate, cleanHtml, addHeadingIds,
  listPosts, getPost, injectIntoShell, chrome, articleJsonLd, type PostRow, type PageMeta,
} from './_lib.ts';

export const config = { path: ['/insights', '/insights/*'], cache: 'manual' };

const CACHE = {
  // Browsers always revalidate; the CDN may serve a copy for 2 minutes (then refreshes in the background)
  'cache-control': 'public, max-age=0, must-revalidate',
  'netlify-cdn-cache-control': 'public, s-maxage=120, stale-while-revalidate=300',
};

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
  const items = posts
    .map(
      (p) => `<article style="margin:0 0 2rem">
<h2 style="margin:0 0 .25rem;font-size:20px"><a href="/insights/${esc(p.slug)}" style="color:#111827;text-decoration:none">${esc(p.title)}</a></h2>
<p style="margin:0 0 .5rem;font-size:13px;color:#6b7280">${p.category ? esc(p.category) + ' · ' : ''}<time datetime="${esc(p.published_at)}">${fmtDate(p.published_at)}</time> · ${p.read_time_minutes || 1} min read</p>
${p.excerpt ? `<p style="margin:0">${esc(p.excerpt)}</p>` : ''}
</article>`
    )
    .join('\n');
  const pager =
    pages > 1
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

export default async (req: Request, context: Context) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return context.next();

  const response = await context.next(); // the built SPA shell (index.html)
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const shell = await response.text();
  const passthrough = () => new Response(shell, { status: response.status, headers: response.headers });

  // Blog switched off: these URLs do not exist. Real 404 status so search engines drop them.
  if (!BLOG_ENABLED) {
    return new Response(shell, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, must-revalidate' } });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    const headers = { 'content-type': 'text/html; charset=utf-8', ...CACHE };

    /* ---------- /insights ---------- */
    if (path === '/insights') {
      const rawCat = url.searchParams.get('category');
      const category = rawCat && CATEGORIES.includes(rawCat) ? rawCat : null;
      const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10) || 1);
      const { posts, total } = await listPosts(page, category || undefined);
      const title = `${category ? `${category} insights & resources` : 'Insights & Resources'}${page > 1 ? ` - Page ${page}` : ''} | ${SITE_NAME}`;
      const meta: PageMeta = {
        title,
        description:
          'Practical guidance and updates on regulatory compliance, material declarations, sustainability and supply chain requirements for manufacturers.',
        path: href(category, page),
      };
      return new Response(injectIntoShell(shell, meta, listBody(posts, total, page, category)), { status: 200, headers });
    }

    /* ---------- /insights/:slug ---------- */
    const m = path.match(/^\/insights\/([^/]+)$/);
    if (!m) return passthrough();
    const slug = decodeURIComponent(m[1]);
    const post = await getPost(slug);

    if (!post) {
      // Unknown or unpublished: real 404 status + noindex. The React app shows the friendly 404 page.
      const meta: PageMeta = {
        title: `Article not found | ${SITE_NAME}`,
        description: 'The article you are looking for does not exist or has not been published.',
        path: `/insights/${encodeURIComponent(slug)}`,
        noindex: true,
      };
      const body = chrome(`<h1>We could not find that article</h1><p><a href="/insights" style="color:#1A6B3C">Browse all articles</a></p>`);
      return new Response(injectIntoShell(shell, meta, body), {
        status: 404,
        headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, must-revalidate', 'netlify-cdn-cache-control': 'public, s-maxage=30' },
      });
    }

    const description =
      post.seo_description || post.excerpt || plain(post.content || '').slice(0, 155);
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
    return new Response(injectIntoShell(shell, meta, postBody(post)), { status: 200, headers });
  } catch (err) {
    // Never break the site because pre-rendering failed: serve the normal SPA shell
    console.error('insights prerender failed:', err);
    return passthrough();
  }
};
