// Live /rss.xml and /sitemap.xml generated from Supabase on request.
import type { Context } from 'https://edge.netlify.com';
import { BLOG_ENABLED, SITE_URL, SITE_NAME, CATEGORIES, allLivePosts, cleanHtml, esc, plain } from './_lib.ts';

export const config = { path: ['/rss.xml', '/sitemap.xml'], cache: 'manual' };

const CACHE = {
  'cache-control': 'public, max-age=0, must-revalidate',
  'netlify-cdn-cache-control': 'public, s-maxage=300, stale-while-revalidate=600',
};

const STATIC_PAGES: [string, string][] = [
  ['/', '1.0'], ['/about', '0.9'], ['/services', '0.9'], ['/industries', '0.8'], ['/regulations', '0.8'],
  ['/imds-cdx', '0.8'], ['/sustainability', '0.7'], ['/insights', '0.8'], ['/contact', '0.9'], ['/privacy-policy', '0.3'], ['/terms', '0.3'],
];

const cdata = (s: string) => `<![CDATA[${s.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;

export default async (req: Request, context: Context) => {
  const path = new URL(req.url).pathname;
  // Blog off: no RSS feed, and the sitemap lists only the regular pages
  if (!BLOG_ENABLED && path === '/rss.xml') return new Response('Not found', { status: 404 });
  // Blog off: the sitemap generated at build time (dist/sitemap.xml) is the one to serve
  if (!BLOG_ENABLED && path === '/sitemap.xml') return context.next();
  try {
    if (path === '/sitemap.xml') {
      const posts = BLOG_ENABLED ? await allLivePosts(5000) : [];
      const used = new Set(posts.map((p) => p.category).filter(Boolean));
      const urls = [
        ...STATIC_PAGES.filter(([p]) => BLOG_ENABLED || p !== '/insights').map(([p, pr]) => `  <url><loc>${SITE_URL}${p === '/' ? '' : p}${p === '/' ? '/' : ''}</loc><priority>${pr}</priority></url>`),
        ...CATEGORIES.filter((c) => used.has(c)).map(
          (c) => `  <url><loc>${SITE_URL}/insights?category=${encodeURIComponent(c)}</loc><priority>0.5</priority></url>`
        ),
        ...posts.map(
          (p) =>
            `  <url><loc>${SITE_URL}/insights/${esc(p.slug)}</loc><lastmod>${new Date(p.updated_at).toISOString()}</lastmod><priority>0.7</priority></url>`
        ),
      ].join('\n');
      return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        { headers: { 'content-type': 'application/xml; charset=utf-8', ...CACHE } }
      );
    }

    // RSS
    const posts = (await allLivePosts(50, true));
    const items = posts
      .map((p) => {
        const link = `${SITE_URL}/insights/${p.slug}`;
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
      })
      .join('\n');
    const last = posts[0]?.published_at ? new Date(posts[0].published_at).toUTCString() : new Date().toUTCString();
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${esc(SITE_NAME)} - Insights</title>
    <link>${SITE_URL}/insights</link>
    <description>Regulatory compliance insights for manufacturers covering REACH, RoHS, PFAS, IMDS, SCIP and more.</description>
    <language>en</language>
    <lastBuildDate>${last}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`,
      { headers: { 'content-type': 'application/rss+xml; charset=utf-8', ...CACHE } }
    );
  } catch (err) {
    console.error('feed generation failed:', err);
    // Sitemap: fall back to the static file shipped in /public. RSS has no fallback.
    if (path === '/sitemap.xml') return context.next();
    return new Response('Feed temporarily unavailable', { status: 503, headers: { 'retry-after': '300' } });
  }
};
