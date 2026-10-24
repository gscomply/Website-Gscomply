import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import PageHero from '@/components/PageHero';
import { legal } from '@/data/company';

export interface LegalSection {
  id: string;
  title: string;
  body: ReactNode;
}

/** Renders a company-data value; unreplaced [placeholders] are highlighted so they are never missed. */
export function V({ children }: { children: string }) {
  if (children.startsWith('[')) {
    return <mark className="bg-yellow-200 text-yellow-900 px-1 rounded">{children}</mark>;
  }
  return <>{children}</>;
}

export default function LegalPage({
  title, subtitle, path, description, sections,
}: {
  title: string;
  subtitle: string;
  path: string;
  description: string;
  sections: LegalSection[];
}) {
  return (
    <>
      <SEO title={`${title} | GS Comply Solutions`} description={description} path={path} />
      <PageHero title={title} subtitle={subtitle} breadcrumb={title} />
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-[240px_minmax(0,1fr)] gap-10 lg:gap-14">
          <aside>
            <nav aria-label="Contents" className="lg:sticky lg:top-28 p-5 rounded-xl bg-gray-50 border border-gray-100">
              <h2 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Contents</h2>
              <ol className="space-y-2">
                {sections.map((s, i) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`} className="block text-[13px] text-gray-600 hover:text-[#1A6B3C] leading-snug">
                      {i + 1}. {s.title}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-5 pt-4 border-t border-gray-200 text-xs text-gray-500 space-y-1">
                <p>Version {legal.version}</p>
                <p>Last updated: {legal.lastUpdated}</p>
                <p className="pt-2">
                  <Link to="/privacy-policy" className="text-[#1A6B3C] hover:underline">Privacy Policy</Link>
                  {' · '}
                  <Link to="/terms" className="text-[#1A6B3C] hover:underline">Terms</Link>
                </p>
              </div>
            </nav>
          </aside>
          <div className="min-w-0 max-w-3xl">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-28 mb-10">
                <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                  {i + 1}. {s.title}
                </h2>
                <div className="article-content text-[15.5px] leading-[1.75]">{s.body}</div>
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
