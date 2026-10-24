import { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ArrowRight, Calendar, Clock, ChevronLeft, ChevronRight, AlertCircle,
  Image as ImageIcon, RefreshCw, Rss, SearchX,
} from 'lucide-react';
import SEO from '@/components/SEO';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import { fetchPublishedPosts } from '@/lib/blogApi';
import { BLOG_CATEGORIES, formatDate, readTimeOf, type PostListItem } from '@/lib/blog';

const PER_PAGE = 9;

function PostCard({ post }: { post: PostListItem }) {
  return (
    <article className="group rounded-xl bg-white border border-gray-100 hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden flex flex-col">
      <Link to={`/insights/${post.slug}`} className="block" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          {post.cover_image_url ? (
            <img
              src={post.cover_image_url}
              alt=""
              loading="lazy"
              width={600}
              height={338}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A6B3C]/10 to-[#1A6B3C]/5">
              <ImageIcon className="w-12 h-12 text-[#1A6B3C]/30" />
            </div>
          )}
          {post.category && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold text-white bg-[#1A6B3C] rounded uppercase tracking-wider">
              {post.category}
            </span>
          )}
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-1">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
          {post.published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" aria-hidden="true" />
            {readTimeOf(post)} min read
          </span>
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-[#1A6B3C] transition-colors line-clamp-2">
          <Link to={`/insights/${post.slug}`}>{post.title}</Link>
        </h2>
        {post.excerpt && (
          <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-3 flex-1">{post.excerpt}</p>
        )}
        <Link
          to={`/insights/${post.slug}`}
          aria-label={`Read more: ${post.title}`}
          className="mt-auto inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A6B3C] hover:gap-2.5 transition-all"
        >
          Read more
          <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function PostCardSkeleton() {
  return (
    <div className="rounded-xl bg-white border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-gray-200" />
      <div className="p-6">
        <div className="h-3 bg-gray-200 rounded w-40 mb-4" />
        <div className="h-5 bg-gray-200 rounded w-full mb-2" />
        <div className="h-5 bg-gray-200 rounded w-3/4 mb-4" />
        <div className="h-3 bg-gray-200 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 rounded w-5/6" />
      </div>
    </div>
  );
}

function href(category: string, page: number) {
  const p = new URLSearchParams();
  if (category !== 'All') p.set('category', category);
  if (page > 1) p.set('page', String(page));
  const qs = p.toString();
  return qs ? `/insights?${qs}` : '/insights';
}

export default function Insights() {
  const [params, setParams] = useSearchParams();
  const rawCategory = params.get('category') || 'All';
  const category = (['All', ...BLOG_CATEGORIES] as string[]).includes(rawCategory) ? rawCategory : 'All';
  const page = Math.max(1, parseInt(params.get('page') || '1', 10) || 1);

  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { posts: data, total: count } = await fetchPublishedPosts(page, PER_PAGE, category);
      setPosts(data);
      setTotal(count);
    } catch {
      setError('We could not load the articles. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [page, category]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // If someone opens ?page=99, go back to the last real page
  useEffect(() => {
    if (!loading && !error && total > 0 && page > totalPages) {
      setParams(new URLSearchParams(href(category, totalPages).split('?')[1] || ''), { replace: true });
    }
  }, [loading, error, total, page, totalPages, category, setParams]);

  const path = href(category, page);
  const title =
    category === 'All'
      ? 'Insights & Resources'
      : `${category} insights & resources`;

  return (
    <>
      <SEO
        title={`${title}${page > 1 ? ` - Page ${page}` : ''} | GS Comply Solutions`}
        description="Practical guidance and updates on regulatory compliance, material declarations, sustainability and supply chain requirements for manufacturers."
        path={path}
      />

      <PageHero
        title="Insights & Resources"
        subtitle="Practical guidance and updates on regulatory compliance, material declarations, sustainability and supply chain requirements for manufacturers."
        breadcrumb="Insights"
      />

      {/* Category filter */}
      <section className="py-6 bg-white border-b border-gray-100 sticky top-16 lg:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-4">
          <nav aria-label="Filter by category" className="flex-1 min-w-0">
            <ul className="flex gap-2 overflow-x-auto pb-1 -mb-1 sm:flex-wrap sm:overflow-visible">
              {['All', ...BLOG_CATEGORIES].map((cat) => (
                <li key={cat} className="shrink-0">
                  <Link
                    to={href(cat, 1)}
                    aria-current={category === cat ? 'true' : undefined}
                    className={`inline-block px-4 py-2 text-xs font-medium rounded-full transition-colors ${
                      category === cat
                        ? 'bg-[#1A6B3C] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <a
            href="/rss.xml"
            className="hidden md:inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-[#1A6B3C] shrink-0"
          >
            <Rss className="w-3.5 h-3.5" aria-hidden="true" /> RSS
          </a>
        </div>
      </section>

      {/* Posts */}
      <section className="py-14 lg:py-20 bg-gray-50" aria-live="polite" aria-busy={loading}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="max-w-md mx-auto text-center py-16" role="alert">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" aria-hidden="true" />
              <p className="text-sm text-gray-600">{error}</p>
              <button
                onClick={loadPosts}
                className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A6B3C] text-white text-sm font-semibold rounded-md hover:bg-[#155a32] transition-colors"
              >
                <RefreshCw className="w-4 h-4" aria-hidden="true" /> Try again
              </button>
            </div>
          )}

          {loading && !error && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading articles">
              {Array.from({ length: 6 }).map((_, i) => (
                <PostCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!loading && !error && posts.length === 0 && (
            <div className="text-center py-16 max-w-md mx-auto">
              <SearchX className="w-10 h-10 text-gray-300 mx-auto mb-4" aria-hidden="true" />
              <p className="text-gray-700 font-medium">
                {category === 'All' ? 'No articles published yet.' : `No ${category} articles yet.`}
              </p>
              <p className="text-sm text-gray-500 mt-1">Check back soon, or browse another category.</p>
              {category !== 'All' && (
                <Link
                  to="/insights"
                  className="mt-5 inline-flex px-5 py-2.5 text-[#1A6B3C] text-sm font-semibold border border-[#1A6B3C]/30 rounded-md hover:bg-white transition-colors"
                >
                  Show all articles
                </Link>
              )}
            </div>
          )}

          {!loading && !error && posts.length > 0 && (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {totalPages > 1 && (
                <nav aria-label="Pagination" className="flex items-center justify-center gap-4 mt-12">
                  {page > 1 ? (
                    <Link
                      to={href(category, page - 1)}
                      rel="prev"
                      className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Previous
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-100 rounded-md cursor-not-allowed" aria-disabled="true">
                      <ChevronLeft className="w-4 h-4" aria-hidden="true" /> Previous
                    </span>
                  )}
                  <span className="text-sm text-gray-500" aria-current="page">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link
                      to={href(category, page + 1)}
                      rel="next"
                      className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-400 bg-white border border-gray-100 rounded-md cursor-not-allowed" aria-disabled="true">
                      Next <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </span>
                  )}
                </nav>
              )}
            </>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}
