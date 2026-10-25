// Build-time renderer: turns each public route into real HTML for search engines.
import { Writable } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { routes } from './routes';
import { BLOG_ENABLED } from './config/features';

/** Pages that exist as real, indexable URLs. Used for prerendering AND the sitemap. */
export const PAGES = [
  '/', '/about', '/services', '/industries', '/regulations', '/imds-cdx',
  '/sustainability', '/scip-notification-services',
  '/product-material-compliance', '/training-services', '/contact', '/privacy-policy', '/terms',
];
export const blogEnabled = BLOG_ENABLED;

export async function render(url: string): Promise<{ html: string; helmet: any }> {
  const handler = createStaticHandler(routes);
  const context = await handler.query(new Request(new URL(url, 'http://localhost')));
  if (context instanceof Response) throw new Error(`Unexpected redirect while rendering ${url}`);
  const router = createStaticRouter(handler.dataRoutes, context);
  const helmetContext: { helmet?: any } = {};

  const html = await new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];
    const { pipe } = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>
        <StaticRouterProvider router={router} context={context} hydrate={false} />
      </HelmetProvider>,
      {
        // wait for lazy page chunks so the full page is in the output
        onAllReady() {
          pipe(
            new Writable({
              write(chunk, _enc, cb) { chunks.push(Buffer.from(chunk)); cb(); },
              final(cb) { resolve(Buffer.concat(chunks).toString('utf8')); cb(); },
            })
          );
        },
        onShellError: reject,
        onError: reject,
      }
    );
  });
  return { html, helmet: helmetContext.helmet };
}
