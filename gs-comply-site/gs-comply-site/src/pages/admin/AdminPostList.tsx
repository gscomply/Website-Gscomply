import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, Plus, Edit2, Trash2, Copy, FileText, Calendar, AlertCircle,
  ExternalLink, Check, Clock, FileEdit, RefreshCw, Loader2,
} from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Modal, { btnPrimary, btnSecondary, btnDanger } from '@/components/admin/Modal';
import { fetchAllPostsAdmin, deletePost, duplicatePost } from '@/lib/blogApi';
import { formatDate, effectiveStatus, type PostListItem, type PostStatus } from '@/lib/blog';

const statusConfig: Record<PostStatus, { label: string; color: string; icon: typeof Check }> = {
  published: { label: 'Published', color: 'bg-green-100 text-green-800', icon: Check },
  scheduled: { label: 'Scheduled', color: 'bg-amber-100 text-amber-800', icon: Clock },
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700', icon: FileEdit },
};

type Filter = 'all' | PostStatus;

function RowSkeleton() {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4"><div className="h-4 bg-gray-200 rounded w-64 mb-2" /><div className="h-3 bg-gray-100 rounded w-40" /></td>
      <td className="px-3 py-4 hidden md:table-cell"><div className="h-3 bg-gray-200 rounded w-20" /></td>
      <td className="px-3 py-4"><div className="h-5 bg-gray-200 rounded w-20" /></td>
      <td className="px-3 py-4 hidden lg:table-cell"><div className="h-3 bg-gray-200 rounded w-24" /></td>
      <td className="px-5 py-4"><div className="h-6 bg-gray-200 rounded w-24 ml-auto" /></td>
    </tr>
  );
}

export default function AdminPostList() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [deleteTarget, setDeleteTarget] = useState<PostListItem | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setPosts(await fetchAllPostsAdmin());
    } catch {
      setError('We could not load your posts. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const counts = useMemo(() => {
    const c = { all: posts.length, published: 0, scheduled: 0, draft: 0 };
    posts.forEach((p) => { c[effectiveStatus(p)]++; });
    return c;
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (filter !== 'all' && effectiveStatus(p) !== filter) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.slug.toLowerCase().includes(q) ||
        (p.category || '').toLowerCase().includes(q) ||
        (p.excerpt || '').toLowerCase().includes(q)
      );
    });
  }, [posts, search, filter]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setBusyId(deleteTarget.id);
    try {
      await deletePost(deleteTarget.id);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to delete post.');
      setDeleteTarget(null);
    } finally {
      setBusyId(null);
    }
  };

  const handleDuplicate = async (id: string) => {
    setBusyId(id);
    setError(null);
    try {
      const copy = await duplicatePost(id);
      if (copy) navigate(`/admin/editor/${copy.id}`);
      else await loadPosts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to duplicate post.');
    } finally {
      setBusyId(null);
    }
  };

  const tabs: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'published', label: 'Published' },
    { key: 'scheduled', label: 'Scheduled' },
    { key: 'draft', label: 'Drafts' },
  ];

  const iconBtn = 'p-2 text-gray-400 hover:text-[#1A6B3C] hover:bg-[#1A6B3C]/5 rounded-md transition-colors disabled:opacity-40';

  return (
    <AdminShell title="Posts">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blog posts</h1>
            <p className="text-sm text-gray-500 mt-0.5">{loading ? 'Loading…' : `${posts.length} total`}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                type="search"
                aria-label="Search posts"
                placeholder="Search title, slug, category…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A6B3C] focus:ring-1 focus:ring-[#1A6B3C]/20"
              />
            </div>
            <Link to="/admin/editor/new" className={btnPrimary + ' whitespace-nowrap'}>
              <Plus className="w-4 h-4" aria-hidden="true" /> New post
            </Link>
          </div>
        </div>

        <div role="tablist" aria-label="Filter by status" className="flex gap-1 mb-4 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              role="tab"
              aria-selected={filter === t.key}
              onClick={() => setFilter(t.key)}
              className={`px-3.5 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                filter === t.key ? 'bg-[#1A6B3C] text-white font-medium' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {t.label} <span className="opacity-70">{counts[t.key]}</span>
            </button>
          ))}
        </div>

        {error && (
          <div role="alert" className="mb-5 flex items-center gap-2.5 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" aria-hidden="true" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button type="button" onClick={loadPosts} className="inline-flex items-center gap-1 text-xs font-medium text-red-700 underline">
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          </div>
        )}

        {!loading && !error && filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" aria-hidden="true" />
            <p className="text-sm text-gray-500 mb-4">
              {search || filter !== 'all' ? 'No posts match your search or filter.' : 'No posts yet. Create your first post.'}
            </p>
            <Link to="/admin/editor/new" className={btnPrimary}>
              <Plus className="w-4 h-4" /> New post
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <caption className="sr-only">Blog posts</caption>
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th scope="col" className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Title</th>
                    <th scope="col" className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden md:table-cell">Category</th>
                    <th scope="col" className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3">Status</th>
                    <th scope="col" className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-3 hidden lg:table-cell">Date</th>
                    <th scope="col" className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading && Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
                  {!loading &&
                    filtered.map((post) => {
                      const st = effectiveStatus(post);
                      const cfg = statusConfig[st];
                      const Icon = cfg.icon;
                      const busy = busyId === post.id;
                      return (
                        <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4 max-w-[340px]">
                            <Link
                              to={`/admin/editor/${post.id}`}
                              className="text-sm font-medium text-gray-900 hover:text-[#1A6B3C] transition-colors block truncate"
                            >
                              {post.title}
                            </Link>
                            <span className="text-xs text-gray-400 block truncate">/insights/{post.slug}</span>
                          </td>
                          <td className="px-3 py-4 hidden md:table-cell text-xs font-medium text-gray-600">{post.category}</td>
                          <td className="px-3 py-4">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${cfg.color}`}>
                              <Icon className="w-3 h-3" aria-hidden="true" /> {cfg.label}
                            </span>
                          </td>
                          <td className="px-3 py-4 hidden lg:table-cell">
                            {post.published_at ? (
                              <span className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                                <Calendar className="w-3 h-3" aria-hidden="true" />
                                {formatDate(post.published_at)}
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">Updated {formatDate(post.updated_at)}</span>
                            )}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center justify-end gap-0.5">
                              <Link to={`/admin/editor/${post.id}`} className={iconBtn} aria-label={`Edit ${post.title}`} title="Edit">
                                <Edit2 className="w-4 h-4" />
                              </Link>
                              {st === 'published' && (
                                <Link to={`/insights/${post.slug}`} target="_blank" className={iconBtn} aria-label={`View ${post.title} on the site`} title="View on site">
                                  <ExternalLink className="w-4 h-4" />
                                </Link>
                              )}
                              <button type="button" onClick={() => handleDuplicate(post.id)} disabled={busy} className={iconBtn} aria-label={`Duplicate ${post.title}`} title="Duplicate">
                                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteTarget(post)}
                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                aria-label={`Delete ${post.title}`}
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <Modal
        open={!!deleteTarget}
        title="Delete this post?"
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setDeleteTarget(null)}>Cancel</button>
            <button type="button" className={btnDanger} onClick={handleDelete} disabled={!!busyId}>
              {busyId ? 'Deleting…' : 'Delete permanently'}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          “{deleteTarget?.title}” will be removed permanently. This cannot be undone.
        </p>
      </Modal>
    </AdminShell>
  );
}
