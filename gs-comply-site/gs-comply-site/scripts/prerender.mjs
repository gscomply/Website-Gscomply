// Runs after `vite build` and `vite build --ssr`. Writes real HTML for every public page,
// plus sitemap.xml, 200.html (empty app shell) and 404.html (pre-rendered "not found" page).
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const dist = path.join(root, 'dist');
const { render, PAGES, blogEnabled } = await import(pathToFileURL(path.join(root, 'dist-server/entry-server.js')).href);

const SITE = (process.env.SITE_URL || 'https://gscomply.com').replace(/\/+$/, '');
const template = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// Pristine shell with an empty root: used for the client-only routes (/admin/*) and as the template for live blog pages
fs.writeFileSync(path.join(dist, '200.html'), template);

function strip(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<meta\s+name="(description|robots)"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+(property="og:[^"]*"|name="twitter:[^"]*")[^>]*>/gi, '');
}

function build(html, helmet) {
  const head = ['title', 'meta', 'link', 'script', 'base']
    .map((k) => (helmet?.[k] ? helmet[k].toString() : ''))
    .filter(Boolean)
    .join('\n    ');
  let out = strip(template).replace('</head>', `    ${head}\n  </head>`);
  if (!out.includes('<div id="root"></div>')) throw new Error('index.html has no empty <div id="root"></div>');
  return out.replace('<div id="root"></div>', `<div id="root">${html}</div>`);
}

const pages = [...PAGES];
if (blogEnabled) pages.push('/insights'); // /insights itself is rendered live by api/blog.ts

let count = 0;
for (const url of PAGES) {
  const { html, helmet } = await render(url);
  const out = build(html, helmet);
  const file = url === '/' ? 'index.html' : `${url.slice(1)}.html`;
  fs.writeFileSync(path.join(dist, file), out);
  count++;
  const title = /<title[^>]*>([^<]*)<\/title>/.exec(out)?.[1];
  console.log(`prerendered ${url.padEnd(18)} -> ${file.padEnd(24)} ${(out.length / 1024).toFixed(0)} KB  | ${title}`);
}

// Not-found page (static hosts such as Vercel serve 404.html with a real 404 status for unknown URLs)
{
  const { html, helmet } = await render('/this-page-does-not-exist');
  fs.writeFileSync(path.join(dist, '404.html'), build(html, helmet));
  console.log('prerendered 404.html');
}

// Sitemap (static pages; blog posts are added live by api/blog.ts when the blog is enabled)
const urls = pages.map((p) => `  <url><loc>${SITE}${p === '/' ? '/' : p}</loc></url>`).join('\n');
if (blogEnabled) {
  // A static file would shadow the live sitemap (api/blog.ts), which also lists blog posts. Do not write one.
  console.log('sitemap.xml: served live by /api/blog (blog enabled)');
} else {
  fs.writeFileSync(
    path.join(dist, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
  );
  console.log(`sitemap.xml: ${pages.length} URLs`);
}
console.log(`${count} pages prerendered`);
