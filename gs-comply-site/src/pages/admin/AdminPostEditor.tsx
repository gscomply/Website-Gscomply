import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useBlocker, Link } from 'react-router-dom';
import {
  ArrowLeft, Save, Eye, Send, Calendar, Trash2, Loader2, AlertCircle, Check,
  Upload, RefreshCw, Globe2, Clock, FileEdit, Undo2,
} from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';
import Modal, { btnPrimary, btnSecondary, btnDanger } from '@/components/admin/Modal';
import RichTextEditor from '@/components/admin/RichTextEditor';
import {
  fetchPostById, createPost, updatePost, deletePost, uploadBlogImage,
  SlugTakenError, validateImage, type PostWrite,
} from '@/lib/blogApi';
import {
  BLOG_CATEGORIES, SEO_TITLE_MAX, SEO_DESCRIPTION_MAX, slugify, plainText, formatDate,
  effectiveStatus, toLocalInput, fromLocalInput, calculateReadTime, type PostStatus,
} from '@/lib/blog';
import { writePreview } from '@/lib/preview';
import { company } from '@/data/company';

interface Form {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  cover_image_url: string;
  seo_title: string;
  seo_description: string;
  author_name: string;
}

const emptyForm: Form = {
  title: '', slug: '', excerpt: '', category: 'General', cover_image_url: '',
  seo_title: '', seo_description: '', author_name: company.name,
};

const AUTOSAVE_MS = 30_000;
const input =
  'w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:border-[#1A6B3C] focus:ring-1 focus:ring-[#1A6B3C]/20';
const label = 'block text-xs font-semibold text-gray-700 mb-1.5';

function Counter({ value, max }: { value: number; max: number }) {
  const tone = value > max ? 'text-red-600 font-semibold' : value >= max * 0.9 ? 'text-amber-600' : 'text-gray-400';
  return (
    <span className={`text-xs tabular-nums ${tone}`}>
      {value}/{max}
      {value > max && <span className="sr-only"> (too long)</span>}
    </span>
  );
}

function StatusChip({ status }: { status: PostStatus }) {
  const map = {
    draft: { text: 'Draft', cls: 'bg-gray-100 text-gray-700', Icon: FileEdit },
    scheduled: { text: 'Scheduled', cls: 'bg-amber-100 text-amber-800', Icon: Clock },
    published: { text: 'Published', cls: 'bg-green-100 text-green-800', Icon: Globe2 },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${map.cls}`}>
      <map.Icon className="w-3 h-3" aria-hidden="true" /> {map.text}
    </span>
  );
}

export default function AdminPostEditor() {
  const { id } = useParams<{ id: string }>();
  const isNewRoute = id === 'new';
  const navigate = useNavigate();

  const [form, setForm] = useState<Form>(emptyForm);
  const [status, setStatus] = useState<PostStatus>('draft');
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [postId, setPostId] = useState<string | null>(isNewRoute ? null : id ?? null);
  const [initialHtml, setInitialHtml] = useState('');
  const [editorKey, setEditorKey] = useState(0);

  const [loading, setLoading] = useState(!isNewRoute);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | 'save' | 'publish' | 'schedule' | 'delete' | 'unpublish'>(null);
  const [autosaving, setAutosaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugError, setSlugError] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [dirty, setDirty] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleValue, setScheduleValue] = useState('');
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [unpublishOpen, setUnpublishOpen] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  // Refs so the autosave timer always sees the latest values without re-subscribing
  const formRef = useRef(form);
  const contentRef = useRef('');
  const statusRef = useRef(status);
  const postIdRef = useRef(postId);
  const dirtyRef = useRef(false);
  const busyRef = useRef(busy);
  const publishedAtRef = useRef(publishedAt);
  formRef.current = form;
  statusRef.current = status;
  postIdRef.current = postId;
  busyRef.current = busy;
  publishedAtRef.current = publishedAt;

  const markDirty = useCallback(() => {
    dirtyRef.current = true;
    setDirty(true);
  }, []);
  const markClean = useCallback(() => {
    dirtyRef.current = false;
    setDirty(false);
  }, []);

  /* ------------------------------ load ------------------------------ */
  const load = useCallback(async (postIdToLoad: string) => {
    setLoading(true);
    setLoadError(null);
    try {
      const post = await fetchPostById(postIdToLoad);
      if (!post) {
        setLoadError('This post does not exist (it may have been deleted).');
        return;
      }
      const f: Form = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || '',
        category: post.category || 'General',
        cover_image_url: post.cover_image_url || '',
        seo_title: post.seo_title || '',
        seo_description: post.seo_description || '',
        author_name: post.author_name || company.name,
      };
      setForm(f);
      setStatus(post.status);
      setPublishedAt(post.published_at);
      setPostId(post.id);
      contentRef.current = post.content || '';
      setInitialHtml(post.content || '');
      setEditorKey((k) => k + 1);
      // Keep auto-slug only while the slug still mirrors the title (typically a fresh draft)
      setSlugTouched(post.status !== 'draft' || post.slug !== slugify(post.title));
      markClean();
    } catch {
      setLoadError('We could not load this post. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [markClean]);

  useEffect(() => {
    if (isNewRoute) {
      setLoading(false);
      return;
    }
    // After the first save of a brand-new post we swap /new for /<id>; the data is already here.
    if (id && id === postIdRef.current && formRef.current.title) return;
    if (id) load(id);
  }, [id, isNewRoute, load]);

  /* --------------------------- save plumbing --------------------------- */
  const buildPayload = (over: Partial<PostWrite> = {}): PostWrite => {
    const f = formRef.current;
    return {
      title: f.title.trim(),
      slug: f.slug || slugify(f.title),
      excerpt: f.excerpt.trim() || null,
      content: contentRef.current,
      cover_image_url: f.cover_image_url || null,
      category: f.category,
      seo_title: f.seo_title.trim() || null,
      seo_description: f.seo_description.trim() || null,
      author_name: f.author_name.trim() || company.name,
      ...over,
    };
  };

  /** Create or update. Returns true on success. Throws nothing; reports via `error`. */
  const persist = async (
    over: { status: PostStatus; published_at: string | null },
    opts: { silent?: boolean; stay?: boolean } = {}
  ): Promise<boolean> => {
    try {
      const payload = buildPayload(over);
      let saved;
      if (postIdRef.current) {
        saved = await updatePost(postIdRef.current, payload);
      } else {
        saved = await createPost(payload);
        postIdRef.current = saved.id;
        setPostId(saved.id);
      }
      setForm((prev) => ({ ...prev, slug: saved.slug }));
      formRef.current = { ...formRef.current, slug: saved.slug };
      setStatus(saved.status);
      statusRef.current = saved.status;
      setPublishedAt(saved.published_at);
      setLastSaved(new Date());
      markClean();
      setSlugError(false);
      if (!opts.stay && (isNewRoute || id !== saved.id)) navigate(`/admin/editor/${saved.id}`, { replace: true });
      return true;
    } catch (e) {
      if (e instanceof SlugTakenError) setSlugError(true);
      if (!opts.silent) setError(e instanceof Error ? e.message : 'Could not save the post.');
      return false;
    }
  };

  /* ----------------------------- autosave ----------------------------- */
  useEffect(() => {
    const t = setInterval(async () => {
      if (!dirtyRef.current || busyRef.current) return;
      // Only drafts autosave. Live or scheduled posts change only when you press a button.
      if (statusRef.current !== 'draft') return;
      if (!formRef.current.title.trim()) return;
      setAutosaving(true);
      const ok = await persist({ status: 'draft', published_at: null }, { silent: true });
      setAutosaving(false);
      if (!ok) setError('Autosave failed. Your changes are not saved yet. Press "Save draft".');
    }, AUTOSAVE_MS);
    return () => clearInterval(t);
    // persist reads only refs, so a single timer is correct
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* --------------------- unsaved changes warnings --------------------- */
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      dirtyRef.current && currentLocation.pathname !== nextLocation.pathname
  );

  /* ------------------------------ actions ------------------------------ */
  const setField = <K extends keyof Form>(key: K, value: Form[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    markDirty();
  };

  const onTitle = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: !slugTouched && status === 'draft' ? slugify(value) : prev.slug,
    }));
    markDirty();
  };

  const onSlug = (value: string) => {
    setSlugTouched(true);
    setSlugError(false);
    setField('slug', slugify(value));
  };

  const onEditorChange = useCallback((html: string) => {
    contentRef.current = html;
    markDirty();
  }, [markDirty]);

  const validateForPublishing = (): string | null => {
    if (!form.title.trim()) return 'Add a title before publishing.';
    if (!(form.slug || slugify(form.title))) return 'Add a URL slug before publishing.';
    const hasBody = plainText(contentRef.current).length > 0 || /<img\s/i.test(contentRef.current);
    if (!hasBody) return 'The article is empty. Write some content before publishing.';
    return null;
  };

  const saveDraftOrChanges = async () => {
    setError(null);
    if (!form.title.trim()) {
      setError('Add a title first.');
      return;
    }
    setBusy('save');
    // Keeps whatever state the post is in (draft stays draft, live stays live)
    await persist({ status, published_at: publishedAt });
    setBusy(null);
  };

  const publishNow = async () => {
    setError(null);
    const problem = validateForPublishing();
    if (problem) return setError(problem);
    setBusy('publish');
    const alreadyLive = effectiveStatus({ status, published_at: publishedAt }) === 'published' && publishedAt;
    await persist({
      status: alreadyLive ? status : 'published',
      published_at: alreadyLive ? publishedAt : new Date().toISOString(),
    });
    setBusy(null);
  };

  const openSchedule = () => {
    setError(null);
    const problem = validateForPublishing();
    if (problem) return setError(problem);
    const existing = status === 'scheduled' && publishedAt && new Date(publishedAt) > new Date() ? publishedAt : null;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    setScheduleValue(toLocalInput(existing || tomorrow.toISOString()));
    setScheduleOpen(true);
  };

  const scheduleIso = fromLocalInput(scheduleValue);
  const scheduleInvalid = !scheduleIso || new Date(scheduleIso).getTime() < Date.now() + 60_000;

  const confirmSchedule = async () => {
    if (scheduleInvalid || !scheduleIso) return;
    setBusy('schedule');
    const ok = await persist({ status: 'scheduled', published_at: scheduleIso });
    setBusy(null);
    if (ok) setScheduleOpen(false);
  };

  const unpublish = async () => {
    setBusy('unpublish');
    const ok = await persist({ status: 'draft', published_at: null });
    setBusy(null);
    if (ok) setUnpublishOpen(false);
  };

  const confirmDelete = async () => {
    if (!postIdRef.current) {
      markClean();
      navigate('/admin');
      return;
    }
    setBusy('delete');
    try {
      await deletePost(postIdRef.current);
      markClean();
      navigate('/admin');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete the post.');
      setBusy(null);
      setDeleteOpen(false);
    }
  };

  const openPreview = () => {
    const ok = writePreview({
      title: form.title,
      excerpt: form.excerpt || null,
      content: contentRef.current,
      cover_image_url: form.cover_image_url || null,
      category: form.category,
      author_name: form.author_name || company.name,
      published_at: publishedAt || new Date().toISOString(),
      read_time_minutes: calculateReadTime(contentRef.current),
    });
    if (!ok) return setError('Your browser blocked the preview (storage disabled).');
    window.open('/admin/preview', 'gscomply-preview');
  };

  const uploadCover = async (file: File | undefined) => {
    if (!file) return;
    const problem = validateImage(file);
    if (problem) return setError(problem);
    setUploadingCover(true);
    setError(null);
    try {
      setField('cover_image_url', await uploadBlogImage(file, 'covers'));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Image upload failed.');
    } finally {
      setUploadingCover(false);
    }
  };

  /* ------------------------------- render ------------------------------- */
  const live = effectiveStatus({ status, published_at: publishedAt });
  const isLive = live === 'published' && !!publishedAt;
  const working = busy !== null;
  const publicUrl = `${company.domain}/insights/${form.slug || '…'}`;

  if (loading) {
    return (
      <AdminShell title="Editor">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-pulse" role="status" aria-label="Loading post">
          <div className="h-12 bg-gray-200 rounded-lg mb-4" />
          <div className="h-10 bg-gray-200 rounded-lg mb-4 w-2/3" />
          <div className="h-96 bg-gray-200 rounded-lg" />
        </div>
      </AdminShell>
    );
  }

  if (loadError) {
    return (
      <AdminShell title="Editor">
        <div className="max-w-md mx-auto py-24 text-center px-4" role="alert">
          <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
          <p className="text-sm text-gray-600">{loadError}</p>
          <div className="mt-5 flex justify-center gap-3">
            {id && id !== 'new' && (
              <button type="button" className={btnPrimary} onClick={() => load(id)}>
                <RefreshCw className="w-4 h-4" /> Try again
              </button>
            )}
            <Link to="/admin" className={btnSecondary}>Back to posts</Link>
          </div>
        </div>
      </AdminShell>
    );
  }

  const bar = (
    <div className="flex items-center gap-2 flex-wrap justify-end">
      <button type="button" onClick={openPreview} className={btnSecondary + ' !px-3 !py-1.5 !text-xs'}>
        <Eye className="w-3.5 h-3.5" aria-hidden="true" /> Preview
      </button>
      <button
        type="button"
        onClick={saveDraftOrChanges}
        disabled={working}
        className={btnSecondary + ' !px-3 !py-1.5 !text-xs'}
      >
        {busy === 'save' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" aria-hidden="true" />}
        {status === 'draft' ? 'Save draft' : 'Save changes'}
      </button>
      <button
        type="button"
        onClick={openSchedule}
        disabled={working}
        className={btnSecondary + ' !px-3 !py-1.5 !text-xs !text-[#1A6B3C] !border-[#1A6B3C]/40'}
      >
        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
        {status === 'scheduled' && !isLive ? 'Reschedule' : 'Schedule'}
      </button>
      <button
        type="button"
        onClick={publishNow}
        disabled={working}
        className={btnPrimary + ' !px-3 !py-1.5 !text-xs'}
      >
        {busy === 'publish' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" aria-hidden="true" />}
        {isLive ? 'Update live post' : 'Publish now'}
      </button>
    </div>
  );

  return (
    <AdminShell title={postId ? 'Edit post' : 'New post'} bar={bar}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
          <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800">
            <ArrowLeft className="w-4 h-4" aria-hidden="true" /> All posts
          </Link>
          <StatusChip status={live} />
          <div className="text-xs" role="status" aria-live="polite">
            {autosaving || busy === 'save' ? (
              <span className="inline-flex items-center gap-1 text-gray-500"><Loader2 className="w-3 h-3 animate-spin" /> Saving…</span>
            ) : dirty ? (
              <span className="text-amber-600 font-medium">Unsaved changes{status === 'draft' ? ' (autosaves every 30 s)' : ''}</span>
            ) : lastSaved ? (
              <span className="inline-flex items-center gap-1 text-green-700"><Check className="w-3 h-3" /> Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            ) : null}
          </div>
        </div>

        {error && (
          <div role="alert" className="mb-5 flex items-start gap-2.5 p-4 rounded-lg bg-red-50 border border-red-200">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button type="button" className="text-xs text-red-700 underline" onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        <div className="grid lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-start">
          {/* ---------------- main column ---------------- */}
          <div className="space-y-5 min-w-0">
            <div>
              <label htmlFor="title" className={label}>Title</label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(e) => onTitle(e.target.value)}
                placeholder="Article title"
                className={input + ' !text-lg !font-semibold !py-3'}
              />
            </div>

            <div>
              <label htmlFor="slug" className={label}>URL slug</label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 hidden sm:inline whitespace-nowrap">/insights/</span>
                <input
                  id="slug"
                  type="text"
                  value={form.slug}
                  onChange={(e) => onSlug(e.target.value)}
                  placeholder="auto-generated-from-title"
                  aria-invalid={slugError}
                  aria-describedby="slug-help"
                  className={input + (slugError ? ' !border-red-400' : '')}
                />
                <button
                  type="button"
                  onClick={() => { setSlugTouched(false); setSlugError(false); setField('slug', slugify(form.title)); }}
                  title="Regenerate from title"
                  aria-label="Regenerate slug from title"
                  className="p-2.5 text-gray-500 hover:text-[#1A6B3C] border border-gray-200 rounded-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
              <p id="slug-help" className={`mt-1 text-xs break-all ${slugError ? 'text-red-600' : 'text-gray-400'}`}>
                {slugError ? 'This slug is already used by another post. ' : ''}
                {publicUrl}
              </p>
              {isLive && (
                <p className="mt-1 text-xs text-amber-700">
                  This post is live. Changing the slug changes its address and breaks existing links.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="excerpt" className={label + ' flex justify-between'}>
                <span>Excerpt (shown on the Insights list)</span>
                <Counter value={form.excerpt.length} max={200} />
              </label>
              <textarea
                id="excerpt"
                rows={3}
                value={form.excerpt}
                onChange={(e) => setField('excerpt', e.target.value)}
                placeholder="One or two sentences that make someone want to read on"
                className={input}
              />
            </div>

            <div>
              <span className={label} id="content-label">Content</span>
              <RichTextEditor
                key={editorKey}
                initialHtml={initialHtml}
                onChange={onEditorChange}
                onError={setError}
              />
            </div>
          </div>

          {/* ---------------- side column ---------------- */}
          <aside className="space-y-5 lg:sticky lg:top-20">
            <section className="p-5 rounded-xl bg-white border border-gray-100 space-y-3" aria-labelledby="pub-h">
              <h2 id="pub-h" className="text-xs font-bold text-gray-900 uppercase tracking-wider">Publishing</h2>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <StatusChip status={live} />
              </div>
              {publishedAt && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">{isLive ? 'Published' : 'Goes live'}</span>
                  <span className="text-gray-800">
                    {formatDate(publishedAt)},{' '}
                    {new Date(publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
              {status !== 'draft' && postId && (
                <button
                  type="button"
                  onClick={() => setUnpublishOpen(true)}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-red-600"
                >
                  <Undo2 className="w-3.5 h-3.5" aria-hidden="true" /> Unpublish (back to draft)
                </button>
              )}
              {isLive && (
                <Link to={`/insights/${form.slug}`} target="_blank" className="block text-xs font-medium text-[#1A6B3C] hover:underline">
                  View live post →
                </Link>
              )}
            </section>

            <section className="p-5 rounded-xl bg-white border border-gray-100 space-y-4" aria-labelledby="det-h">
              <h2 id="det-h" className="text-xs font-bold text-gray-900 uppercase tracking-wider">Details</h2>
              <div>
                <label htmlFor="category" className={label}>Category</label>
                <select id="category" value={form.category} onChange={(e) => setField('category', e.target.value)} className={input}>
                  {BLOG_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="author" className={label}>Author</label>
                <input id="author" type="text" value={form.author_name} onChange={(e) => setField('author_name', e.target.value)} className={input} />
              </div>
            </section>

            <section className="p-5 rounded-xl bg-white border border-gray-100" aria-labelledby="cover-h">
              <h2 id="cover-h" className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Cover image</h2>
              {form.cover_image_url ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-200 aspect-[2/1] bg-gray-100">
                  <img src={form.cover_image_url} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setField('cover_image_url', '')}
                    aria-label="Remove cover image"
                    className="absolute top-2 right-2 p-2 bg-white/95 rounded-md text-gray-600 hover:text-red-600 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={(e) => { e.preventDefault(); setDragOver(false); uploadCover(e.dataTransfer.files?.[0]); }}
                  className={`flex flex-col items-center justify-center aspect-[2/1] border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center px-3 ${
                    dragOver ? 'border-[#1A6B3C] bg-[#1A6B3C]/5' : 'border-gray-200 hover:border-[#1A6B3C]'
                  } focus-within:border-[#1A6B3C]`}
                >
                  {uploadingCover ? (
                    <Loader2 className="w-6 h-6 text-[#1A6B3C] animate-spin" aria-label="Uploading" />
                  ) : (
                    <>
                      <Upload className="w-6 h-6 text-gray-400 mb-2" aria-hidden="true" />
                      <span className="text-xs text-gray-600 font-medium">Click or drop an image</span>
                      <span className="text-[11px] text-gray-400 mt-0.5">JPG, PNG, WebP · max 5 MB · 1200×600 works well</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
                    className="sr-only"
                    onChange={(e) => { uploadCover(e.target.files?.[0]); e.target.value = ''; }}
                  />
                </label>
              )}
            </section>

            <section className="p-5 rounded-xl bg-white border border-gray-100 space-y-4" aria-labelledby="seo-h">
              <h2 id="seo-h" className="text-xs font-bold text-gray-900 uppercase tracking-wider">Search appearance (SEO)</h2>
              <div>
                <label htmlFor="seo-title" className={label + ' flex justify-between'}>
                  <span>SEO title</span><Counter value={form.seo_title.length} max={SEO_TITLE_MAX} />
                </label>
                <input
                  id="seo-title"
                  type="text"
                  value={form.seo_title}
                  onChange={(e) => setField('seo_title', e.target.value)}
                  placeholder={form.title || 'Defaults to the post title'}
                  className={input}
                />
              </div>
              <div>
                <label htmlFor="seo-desc" className={label + ' flex justify-between'}>
                  <span>Meta description</span><Counter value={form.seo_description.length} max={SEO_DESCRIPTION_MAX} />
                </label>
                <textarea
                  id="seo-desc"
                  rows={3}
                  value={form.seo_description}
                  onChange={(e) => setField('seo_description', e.target.value)}
                  placeholder={form.excerpt || 'Defaults to the excerpt'}
                  className={input}
                />
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-3" aria-label="Search result preview">
                <p className="text-[11px] text-gray-400 truncate">{publicUrl}</p>
                <p className="text-sm text-blue-700 font-medium leading-snug line-clamp-2">
                  {(form.seo_title || form.title || 'Post title') + ' | GS Comply Solutions'}
                </p>
                <p className="text-xs text-gray-600 mt-0.5 line-clamp-3">
                  {form.seo_description || form.excerpt || 'Your description will appear here.'}
                </p>
              </div>
            </section>

            {postId && (
              <button
                type="button"
                onClick={() => setDeleteOpen(true)}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" aria-hidden="true" /> Delete post
              </button>
            )}
          </aside>
        </div>
      </div>

      {/* ---------------- dialogs ---------------- */}
      <Modal
        open={scheduleOpen}
        title="Schedule publication"
        onClose={() => !working && setScheduleOpen(false)}
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setScheduleOpen(false)} disabled={working}>Cancel</button>
            <button type="button" className={btnPrimary} onClick={confirmSchedule} disabled={scheduleInvalid || working}>
              {busy === 'schedule' ? <><Loader2 className="w-4 h-4 animate-spin" /> Scheduling…</> : 'Schedule post'}
            </button>
          </>
        }
      >
        <label htmlFor="sched" className={label}>Publish on (date and time)</label>
        <input
          id="sched"
          type="datetime-local"
          min={toLocalInput(new Date().toISOString())}
          value={scheduleValue}
          onChange={(e) => setScheduleValue(e.target.value)}
          className={input}
        />
        <p className="mt-2 text-xs text-gray-500">
          Your time zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}. The post appears on the site automatically at this time. No redeploy needed.
        </p>
        {scheduleValue && scheduleInvalid && (
          <p className="mt-2 text-xs text-red-600" role="alert">Choose a time in the future.</p>
        )}
      </Modal>

      <Modal
        open={unpublishOpen}
        title="Unpublish this post?"
        onClose={() => setUnpublishOpen(false)}
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setUnpublishOpen(false)}>Cancel</button>
            <button type="button" className={btnPrimary} onClick={unpublish} disabled={working}>
              {busy === 'unpublish' ? 'Saving…' : 'Unpublish'}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">
          The post will disappear from the website and go back to draft. Your content is kept.
        </p>
      </Modal>

      <Modal
        open={deleteOpen}
        title="Delete this post?"
        onClose={() => setDeleteOpen(false)}
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => setDeleteOpen(false)}>Cancel</button>
            <button type="button" className={btnDanger} onClick={confirmDelete} disabled={working}>
              {busy === 'delete' ? 'Deleting…' : 'Delete permanently'}
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">This cannot be undone.</p>
      </Modal>

      <Modal
        open={blocker.state === 'blocked'}
        title="Leave without saving?"
        onClose={() => blocker.state === 'blocked' && blocker.reset()}
        footer={
          <>
            <button type="button" className={btnSecondary} onClick={() => blocker.state === 'blocked' && blocker.reset()}>
              Keep editing
            </button>
            {status === 'draft' && form.title.trim() && (
              <button
                type="button"
                className={btnPrimary}
                disabled={working}
                onClick={async () => {
                  setBusy('save');
                  const ok = await persist({ status: 'draft', published_at: null }, { stay: true });
                  setBusy(null);
                  if (ok && blocker.state === 'blocked') blocker.proceed();
                }}
              >
                Save draft and leave
              </button>
            )}
            <button
              type="button"
              className={btnDanger}
              onClick={() => { markClean(); if (blocker.state === 'blocked') blocker.proceed(); }}
            >
              Discard changes
            </button>
          </>
        }
      >
        <p className="text-sm text-gray-600">You have changes that have not been saved yet.</p>
      </Modal>
    </AdminShell>
  );
}
