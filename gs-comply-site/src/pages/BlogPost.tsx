import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AlertCircle, ArrowLeft, FileQuestion, RefreshCw } from 'lucide-react';
import SEO, { absoluteUrl } from '@/components/SEO';
import PostArticle from '@/components/PostArticle';
import { fetchPostBySlug, fetchRelatedPosts } from '@/lib/blogApi';
import { plainText, type Post, type PostListItem } from '@/lib/blog';
import { company } from '@/data/company';

export function buildArticleJsonLd(post: Post, seoDescription: string) {
  const url = `${company.domain}/insights/${post.slug}`;
  const authorName = post.author_name || company.name;
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      headline: post.title.slice(0, 110),
      description: seoDescription,
      image: post.cover_image_url ? [absoluteUrl(post.cover_image_url)] : undefined,
      datePublished: post.published_at || post.created_at,
      dateModified: post.updated_at,
      articleSection: post.category || undefined,
      author:
        authorName === company.name
          ? { '@type': 'Organization', name: company.name, url: company.domain }
          : { '@type': 'Person', name: authorName },
      publisher: {
        '@type': 'Organization',
        name: company.name,
        url: company.domain,
        logo: { '@type': 'ImageObject', url: `${company.domain}/GS_comply__Logo.jpg` },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: company.domain },
        { '@type': 'ListItem', position: 2, name: 'Insights', item: `${company.domain}/insights` },
        { '@type': 'ListItem', position: 3, name: post.title, item: url },
      ],
    },
  ];
}

function PostSkeleton() {
  return (
    <div role="status" aria-label="Loading article" className="animate-pulse">
      <div className="pt-28 lg:pt-36 pb-14 bg-gradient-to-br from-[#155a32] via-[#1A6B3C] to-[#0d3d22]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-4 bg-white/20 rounded w-24 mb-6" />
          <div className="h-5 bg-white/15 rounded w-20 mb-4" />
          <div className="h-10 bg-white/25 rounded w-11/12 mb-3" />
          <div className="h-10 bg-white/25 rounded w-2/3 mb-6" />
          <div className="h-4 bg-white/15 rounded w-64" />
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="aspect-[2/1] rounded-xl bg-gray-200 shadow-xl" />
      </div>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-4">
        {[100, 92, 96, 70, 100, 88, 60].map((w, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [related, setRelated] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);
    setPost(null);
    setRelated([]);
    try {
      const data = slug ? await fetchPostBySlug(slug) : null;
      if (!data) {
        setNotFound(true);
        return;
      }
      setPost(data);
      // Related posts are a bonus: never fail the whole page because of them
      fetchRelatedPosts(data.category, data.id, 3).then(setRelated).catch(() => setRelated([]));
    } catch {
      setError('We could not load this article. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <PostSkeleton />;

  if (notFound) {
    return (
      <>
        <SEO
          title="Article not found"
          description="The article you are looking for does not exist or has not been published."
          path={`/insights/${slug || ''}`}
          noindex
        />
        <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-[#155a32] via-[#1A6B3C] to-[#0d3d22] pt-24">
          <div className="text-center px-4 max-w-md">
            <FileQuestion className="w-12 h-12 text-[#4ade80] mx-auto mb-4" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-white mb-3">We could not find that article</h1>
            <p className="text-green-100 mb-8">
              It may have been moved or unpublished, or the link may be mistyped.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/insights"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-[#1A6B3C] text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Browse all articles
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 text-white text-sm font-semibold border border-white/40 rounded-md hover:bg-white/10 transition-colors"
              >
                Contact us
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 pt-24">
        <div className="text-center px-4 max-w-md" role="alert">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" aria-hidden="true" />
          <p className="text-sm text-gray-600 mb-5">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A6B3C] text-white text-sm font-semibold rounded-md hover:bg-[#155a32] transition-colors"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" /> Try again
            </button>
            <Link
              to="/insights"
              className="inline-flex items-center px-5 py-2.5 text-[#1A6B3C] text-sm font-semibold border border-[#1A6B3C]/30 rounded-md hover:bg-white transition-colors"
            >
              All articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const seoDescription =
    post.seo_description || post.excerpt || plainText(post.content || '').slice(0, 155);

  return (
    <>
      <SEO
        title={post.seo_title || post.title}
        description={seoDescription}
        path={`/insights/${post.slug}`}
        type="article"
        image={post.cover_image_url}
        publishedTime={post.published_at}
        modifiedTime={post.updated_at}
        section={post.category}
        jsonLd={buildArticleJsonLd(post, seoDescription)}
      />
      <PostArticle post={post} related={related} />
    </>
  );
}
