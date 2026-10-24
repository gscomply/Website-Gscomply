import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Eye } from 'lucide-react';
import PostArticle, { type ArticleData } from '@/components/PostArticle';
import { PREVIEW_KEY, readPreview } from '@/lib/preview';

/** Renders the REAL public post layout from the editor's unsaved state. Never touches the database. */
export default function AdminPostPreview() {
  const [post, setPost] = useState<ArticleData | null>(() => readPreview());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === PREVIEW_KEY) setPost(readPreview());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <>
      <Helmet>
        <title>Preview | GS Comply Admin</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[55] flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white text-xs shadow-lg">
        <Eye className="w-3.5 h-3.5 text-[#4ade80]" aria-hidden="true" />
        Preview only. This is not published. Click Preview in the editor again to refresh.
      </div>
      {post ? (
        <PostArticle post={post} preview />
      ) : (
        <div className="min-h-[60vh] flex items-center justify-center pt-24 text-center px-4">
          <p className="text-gray-600">
            Nothing to preview yet. Open a post in the editor and click <strong>Preview</strong>.
          </p>
        </div>
      )}
    </>
  );
}
