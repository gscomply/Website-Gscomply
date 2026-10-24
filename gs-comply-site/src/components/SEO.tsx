import { Helmet } from 'react-helmet-async';
import { company } from '@/data/company';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  type?: string;
  /** Absolute URL or site-relative path. Defaults to the site OG image. */
  image?: string | null;
  noindex?: boolean;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  section?: string | null;
  /** Extra JSON-LD objects to embed */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${company.domain}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export default function SEO({
  title, description, path, type = 'website', image, noindex,
  publishedTime, modifiedTime, section, jsonLd,
}: SEOProps) {
  const url = `${company.domain}${path}`;
  const fullTitle = title.includes('GS Comply') ? title : `${title} | GS Comply Solutions`;
  const img = absoluteUrl(image || '/og-image.png');
  const extra = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  // Breadcrumb trail for inner pages (shown in Google results). Name = the page title before ":" or "|".
  const crumbName = title.split('|')[0].split(':')[0].trim();
  const breadcrumb =
    path !== '/' && !noindex && !path.startsWith('/insights/') && crumbName
      ? [{
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: `${company.domain}/` },
            { '@type': 'ListItem', position: 2, name: crumbName, item: url },
          ],
        }]
      : [];
  const ld = [...extra, ...breadcrumb];

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      <link rel="canonical" href={url} />
      <meta property="og:site_name" content={company.name} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {section && <meta property="article:section" content={section} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={url} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {ld.map((obj, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(obj)}</script>
      ))}
    </Helmet>
  );
}
