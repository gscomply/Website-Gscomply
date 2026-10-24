import { supabase } from '@/lib/supabase';
import { POST_LIST_COLUMNS, type Post, type PostListItem, type PostStatus } from '@/lib/blog';

/* ------------------------------------------------------------------ */
/* PUBLIC reads                                                        */
/*                                                                     */
/* Row-level security already limits anonymous visitors to live posts. */
/* We ALSO filter explicitly, because when the admin is signed in the  */
/* database lets them read drafts, and drafts must never leak onto the */
/* public site.                                                        */
/* ------------------------------------------------------------------ */

const liveFilter = (q: any) =>
  q.in('status', ['published', 'scheduled']).lte('published_at', new Date().toISOString());

export async function fetchPublishedPosts(
  page = 1,
  perPage = 9,
  category?: string
): Promise<{ posts: PostListItem[]; total: number }> {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = liveFilter(
    supabase.from('posts').select(POST_LIST_COLUMNS, { count: 'exact' })
  )
    .order('published_at', { ascending: false })
    .range(from, to);

  if (category && category !== 'All') query = query.eq('category', category);

  const { data, error, count } = await query;
  if (error) throw error;
  return { posts: (data || []) as PostListItem[], total: count || 0 };
}

export async function fetchPostBySlug(slug: string): Promise<Post | null> {
  const { data, error } = await liveFilter(supabase.from('posts').select('*'))
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return (data as Post | null) ?? null;
}

/** Same category first; top up with the newest other posts so the section is rarely empty. */
export async function fetchRelatedPosts(
  category: string | null,
  excludeId: string,
  limit = 3
): Promise<PostListItem[]> {
  const base = () =>
    liveFilter(supabase.from('posts').select(POST_LIST_COLUMNS))
      .neq('id', excludeId)
      .order('published_at', { ascending: false });

  let related: PostListItem[] = [];
  if (category) {
    const { data, error } = await base().eq('category', category).limit(limit);
    if (error) throw error;
    related = (data || []) as PostListItem[];
  }
  if (related.length < limit) {
    const { data, error } = await base().limit(limit + related.length + 1);
    if (error) throw error;
    const have = new Set(related.map((p) => p.id));
    for (const p of (data || []) as PostListItem[]) {
      if (related.length >= limit) break;
      if (!have.has(p.id)) related.push(p);
    }
  }
  return related;
}

/* ------------------------------------------------------------------ */
/* ADMIN (all enforced again by RLS: only the admin user can do these) */
/* ------------------------------------------------------------------ */

export async function fetchAllPostsAdmin(): Promise<PostListItem[]> {
  const { data, error } = await supabase
    .from('posts')
    .select(POST_LIST_COLUMNS)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data || []) as PostListItem[];
}

export async function fetchPostById(id: string): Promise<Post | null> {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return (data as Post | null) ?? null;
}

export type PostWrite = Partial<
  Pick<
    Post,
    | 'title' | 'slug' | 'excerpt' | 'content' | 'cover_image_url' | 'category'
    | 'status' | 'published_at' | 'seo_title' | 'seo_description' | 'author_name'
  >
>;

export class SlugTakenError extends Error {
  constructor() {
    super('That URL slug is already used by another post. Please choose a different one.');
  }
}

function mapError(error: { code?: string; message: string }): Error {
  if (error.code === '23505') return new SlugTakenError();
  if (error.code === '42501' || /row-level security/i.test(error.message)) {
    return new Error('You do not have permission to do that. Sign in with the admin account.');
  }
  if (error.code === '23514') return new Error(error.message);
  return new Error(error.message);
}

export async function createPost(post: PostWrite): Promise<Post> {
  const { data, error } = await supabase.from('posts').insert(post).select('*').single();
  if (error) throw mapError(error);
  return data as Post;
}

export async function updatePost(id: string, updates: PostWrite): Promise<Post> {
  const { data, error } = await supabase.from('posts').update(updates).eq('id', id).select('*').single();
  if (error) throw mapError(error);
  return data as Post;
}

export async function deletePost(id: string): Promise<void> {
  const { error } = await supabase.from('posts').delete().eq('id', id);
  if (error) throw mapError(error);
}

export async function duplicatePost(id: string): Promise<Post | null> {
  const original = await fetchPostById(id);
  if (!original) return null;
  return createPost({
    title: `${original.title} (Copy)`,
    slug: `${original.slug}-copy-${Date.now().toString(36)}`,
    excerpt: original.excerpt,
    content: original.content,
    cover_image_url: original.cover_image_url,
    category: original.category,
    status: 'draft' as PostStatus,
    published_at: null,
    seo_title: original.seo_title,
    seo_description: original.seo_description,
    author_name: original.author_name,
  });
}

/* ------------------------------ images ------------------------------ */

export const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const EXT: Record<string, string> = {
  'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif',
};

export function validateImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return 'Use a JPG, PNG, WebP, GIF or AVIF image.';
  if (file.size > MAX_IMAGE_BYTES) return 'Image is larger than 5 MB. Please compress it first.';
  return null;
}

export async function uploadBlogImage(file: File, folder: 'covers' | 'inline' = 'covers'): Promise<string> {
  const problem = validateImage(file);
  if (problem) throw new Error(problem);

  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${EXT[file.type]}`;
  const { error } = await supabase.storage
    .from('blog-images')
    .upload(path, file, { contentType: file.type, cacheControl: '31536000' });
  if (error) throw mapError(error as any);

  return supabase.storage.from('blog-images').getPublicUrl(path).data.publicUrl;
}
