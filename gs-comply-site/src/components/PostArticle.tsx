import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, ArrowLeft, Image as ImageIcon, Tag, User, ListTree } from 'lucide-react';
import CTABanner from '@/components/CTABanner';
import { renderPostContent } from '@/lib/sanitize';
import { formatDate, readTimeOf, type Post, type PostListItem } from '@/lib/blog';
import { company } from '@/data/company';

/** The shape needed to draw an article. A saved Post fits; so does an unsaved editor draft. */
export type ArticleData = Pick<
  Post,
  'title' | 'excerpt' | 'content' | 'cover_image_url' | 'category' | 'author_name' | 'published_at'
> & { read_time_minutes?: number | null };

export function RelatedPostCard({ post }: { post: PostListItem }) {
  return (
    <Link
      to={`/insights/${post.slug}`}
      className="group rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
        {post.cover_image_url ? (
          <img
            src={post.cover_image_url}
            alt=""
            loading="lazy"
            width={400}
            height={225}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#1A6B3C]/10">
            <ImageIcon className="w-8 h-8 text-[#1A6B3C]/30" aria-hidden="true" />
          </div>
        )}
      </div>
      <div className="p-4">
        {post.category && (
          <span className="text-[10px] font-semibold text-[#1A6B3C] uppercase tracking-wider">{post.category}</span>
        )}
        <h3 className="text-sm font-semibold text-gray-900 mt-1 group-hover:text-[#1A6B3C] transition-colors line-clamp-2">
          {post.title}
        </h3>
        {post.published_at && <p className="text-xs text-gray-400 mt-2">{formatDate(post.published_at)}</p>}
      </div>
    </Link>
  );
}

export default function PostArticle({
  post,
  related = [],
  preview = false,
}: {
  post: ArticleData;
  related?: PostListItem[];
  preview?: boolean;
}) {
  const { html, toc } = useMemo(() => renderPostContent(post.content), [post.content]);
  const readTime = readTimeOf(post);
  const showToc = toc.length > 1;

  return (
    <>
      {/* Hero */}
      <header className="pt-28 lg:pt-36 pb-14 bg-gradient-to-br from-[#155a32] via-[#1A6B3C] to-[#0d3d22]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <Link
              to="/insights"
              className="inline-flex items-center gap-1.5 text-xs text-green-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
              All articles
            </Link>
          </nav>
          {post.category && (
            <span className="inline-block px-3 py-1 text-[11px] font-semibold text-[#4ade80] bg-[#4ade80]/10 border border-[#4ade80]/20 rounded uppercase tracking-wider mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight">
            {post.title || 'Untitled post'}
          </h1>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-green-100">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4" aria-hidden="true" />
              {post.author_name || company.name}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              {post.published_at ? (
                <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
              ) : (
                <span>{formatDate(new Date().toISOString())}{preview ? ' (preview)' : ''}</span>
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" aria-hidden="true" />
              {readTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* Cover */}
      {post.cover_image_url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
          <div className="rounded-xl overflow-hidden shadow-xl bg-gray-100 aspect-[2/1]">
            <img
              src={post.cover_image_url}
              alt={post.title}
              width={1200}
              height={600}
              {...({ fetchpriority: "high" } as Record<string, string>)}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <section className="py-14 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={showToc ? 'grid lg:grid-cols-[250px_minmax(0,1fr)] gap-8 lg:gap-12' : ''}>
            {showToc && (
              <aside className="order-first">
                <nav
                  aria-label="Table of contents"
                  className="lg:sticky lg:top-28 p-5 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <h2 className="flex items-center gap-2 text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                    <ListTree className="w-4 h-4 text-[#1A6B3C]" aria-hidden="true" />
                    On this page
                  </h2>
                  <ol className="space-y-2">
                    {toc.map((h) => (
                      <li key={h.id} className={h.level === 3 ? 'pl-3' : ''}>
                        <a
                          href={`#${h.id}`}
                          className="block text-[13px] text-gray-600 hover:text-[#1A6B3C] transition-colors leading-snug"
                        >
                          {h.text}
                        </a>
                      </li>
                    ))}
                  </ol>
                </nav>
              </aside>
            )}

            <article className={showToc ? 'min-w-0' : 'max-w-3xl mx-auto'}>
              {post.excerpt && (
                <p className="text-lg text-gray-600 leading-relaxed mb-8 font-medium border-l-4 border-[#1A6B3C] pl-4">
                  {post.excerpt}
                </p>
              )}

              {html ? (
                // Sanitised with DOMPurify (allow-list) in renderPostContent()
                <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />
              ) : (
                <p className="text-gray-400 italic">This post has no content yet.</p>
              )}

              {/* Call to action */}
              <aside
                aria-label="Talk to GS Comply"
                className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-[#1A6B3C]/10 to-[#1A6B3C]/[0.03] border border-[#1A6B3C]/15"
              >
                <h2 className="text-xl font-bold text-gray-900">
                  Need help with {post.category && post.category !== 'General' ? post.category : 'compliance'} for your products?
                </h2>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  Tell us what you are working on and we will come back with a clear plan, scope and timeline.
                </p>
                <div className="mt-5 flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1A6B3C] text-white text-sm font-semibold rounded-md hover:bg-[#155a32] transition-colors"
                  >
                    Discuss your requirement
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <a
                    href={company.calendlyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[#1A6B3C] text-sm font-semibold border border-[#1A6B3C]/30 rounded-md hover:bg-white transition-colors"
                  >
                    Book a 30-min call
                  </a>
                </div>
              </aside>

              <div className="mt-10 pt-8 border-t border-gray-100">
                <Link
                  to="/insights"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1A6B3C] hover:gap-2.5 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  Back to all articles
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="py-14 lg:py-20 bg-gray-50" aria-labelledby="related-heading">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <Tag className="w-5 h-5 text-[#1A6B3C]" aria-hidden="true" />
              <h2 id="related-heading" className="text-2xl font-bold text-gray-900 tracking-tight">
                Related articles
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rp) => (
                <RelatedPostCard key={rp.id} post={rp} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CTABanner />
    </>
  );
}
