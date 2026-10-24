/*
  # Blog CMS hardening (forward migration)

  Builds on 20261020042728_create_posts_table.sql. Safe to run more than once.

  1. Security
     - `blog_config` (holds the admin email) is locked down: RLS on, no policies,
       no grants for anon / authenticated. Only SECURITY DEFINER code can read it.
     - `is_blog_admin()` now also requires a CONFIRMED email and compares
       case-insensitively.
     - The public SELECT policy no longer includes "OR is_blog_admin()".
       Public = live posts only. Admin gets a separate "read everything" policy.
       (Previously an admin browsing the public site would have received drafts.)

  2. Data integrity
     - slug must be URL-safe (lowercase letters, digits, single hyphens).
     - A published post with no published_at gets now(). A scheduled post must
       have a published_at.
     - `read_time_minutes` is maintained by a trigger so list pages do not need
       to download full post bodies.

  3. Storage
     - `blog-images` bucket: public read, 5 MB limit, raster images only
       (SVG is excluded on purpose because SVG can carry scripts).
     - Upload / update / delete stay admin-only (policies from the earlier migration).

  IMPORTANT: set your admin email after running this (see SETUP.md):
     UPDATE blog_config SET value = 'you@yourdomain.com' WHERE key = 'admin_email';
*/

-- 1. Lock down blog_config ---------------------------------------------------
ALTER TABLE blog_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE blog_config FROM anon, authenticated;

-- 2. Admin check -------------------------------------------------------------
CREATE OR REPLACE FUNCTION is_blog_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN public.blog_config c ON c.key = 'admin_email'
    WHERE u.id = auth.uid()
      AND u.email_confirmed_at IS NOT NULL
      AND lower(u.email) = lower(btrim(c.value))
  );
$$;

REVOKE ALL ON FUNCTION is_blog_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_blog_admin() TO authenticated;

-- 3. Policies on posts -------------------------------------------------------
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_select_published_posts" ON posts;
DROP POLICY IF EXISTS "public_select_live_posts" ON posts;
CREATE POLICY "public_select_live_posts"
ON posts FOR SELECT
TO anon, authenticated
USING (
  status IN ('published', 'scheduled')
  AND published_at IS NOT NULL
  AND published_at <= now()
);

DROP POLICY IF EXISTS "admin_select_all_posts" ON posts;
CREATE POLICY "admin_select_all_posts"
ON posts FOR SELECT
TO authenticated
USING (is_blog_admin());

-- (admin_insert_posts / admin_update_posts / admin_delete_posts already exist
--  from the earlier migration and use is_blog_admin(); re-create to be certain.)
DROP POLICY IF EXISTS "admin_insert_posts" ON posts;
CREATE POLICY "admin_insert_posts" ON posts FOR INSERT TO authenticated
WITH CHECK (is_blog_admin());

DROP POLICY IF EXISTS "admin_update_posts" ON posts;
CREATE POLICY "admin_update_posts" ON posts FOR UPDATE TO authenticated
USING (is_blog_admin()) WITH CHECK (is_blog_admin());

DROP POLICY IF EXISTS "admin_delete_posts" ON posts;
CREATE POLICY "admin_delete_posts" ON posts FOR DELETE TO authenticated
USING (is_blog_admin());

-- 4. Data integrity ----------------------------------------------------------
ALTER TABLE posts ADD COLUMN IF NOT EXISTS read_time_minutes integer NOT NULL DEFAULT 1;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'posts_slug_format' AND conrelid = 'posts'::regclass
  ) THEN
    ALTER TABLE posts
      ADD CONSTRAINT posts_slug_format CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION posts_prepare()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  plain text;
  words integer;
BEGIN
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := now();
  END IF;

  IF NEW.status = 'scheduled' AND NEW.published_at IS NULL THEN
    RAISE EXCEPTION 'A scheduled post needs a publish date and time'
      USING ERRCODE = 'check_violation';
  END IF;

  plain := btrim(regexp_replace(COALESCE(NEW.content, ''), '<[^>]*>', ' ', 'g'));
  IF plain = '' THEN
    words := 0;
  ELSE
    words := array_length(regexp_split_to_array(plain, '\s+'), 1);
  END IF;
  NEW.read_time_minutes := GREATEST(1, CEIL(words / 200.0))::integer;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_prepare_trg ON posts;
CREATE TRIGGER posts_prepare_trg
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION posts_prepare();

-- Backfill read time for rows that already exist (fires the trigger)
UPDATE posts SET content = content;

CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts (published_at DESC);

-- 5. Storage bucket ----------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

UPDATE storage.buckets
SET public = true,
    file_size_limit = 5242880,
    allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
WHERE id = 'blog-images';

-- Policies from the earlier migration (re-created so this file is self-sufficient)
DROP POLICY IF EXISTS "public_read_blog_images" ON storage.objects;
CREATE POLICY "public_read_blog_images" ON storage.objects FOR SELECT
TO anon, authenticated USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "admin_upload_blog_images" ON storage.objects;
CREATE POLICY "admin_upload_blog_images" ON storage.objects FOR INSERT
TO authenticated WITH CHECK (bucket_id = 'blog-images' AND is_blog_admin());

DROP POLICY IF EXISTS "admin_update_blog_images" ON storage.objects;
CREATE POLICY "admin_update_blog_images" ON storage.objects FOR UPDATE
TO authenticated USING (bucket_id = 'blog-images' AND is_blog_admin());

DROP POLICY IF EXISTS "admin_delete_blog_images" ON storage.objects;
CREATE POLICY "admin_delete_blog_images" ON storage.objects FOR DELETE
TO authenticated USING (bucket_id = 'blog-images' AND is_blog_admin());

-- 6. Seed: one sample DRAFT (only if it does not exist; delete it from /admin)
INSERT INTO posts (title, slug, excerpt, content, category, status, author_name, seo_title, seo_description)
VALUES (
  'Sample Draft Post - Delete Me',
  'sample-draft-post-delete-me',
  'This is a sample draft post to verify the blog CMS is working. You can delete it from the admin area.',
  '<h2>Sample Draft Post</h2><p>This is a sample draft post created during setup. It will not appear on the public site until you publish it.</p><h2>What you can do</h2><p>Use the rich text editor to format your articles with headings, lists, links, tables, images and code blocks.</p>',
  'General', 'draft', 'GS Comply Solutions',
  'Sample Draft Post', 'A sample draft post for testing the blog CMS.'
)
ON CONFLICT (slug) DO NOTHING;
