/*
# Create posts table for blog CMS

1. New Tables
- `posts` - Blog article storage with full CMS fields
  - id (uuid, PK)
  - title (text, not null)
  - slug (text, unique, not null) - URL-friendly identifier
  - excerpt (text) - short summary for listing pages
  - content (text) - HTML content from rich text editor
  - cover_image_url (text) - URL to cover image (Supabase Storage or external)
  - category (text) - e.g. REACH, RoHS, IMDS, PFAS, etc.
  - status (text, not null, default 'draft') - draft | scheduled | published
  - published_at (timestamptz) - when the post becomes visible publicly
  - seo_title (text) - title for search engines
  - seo_description (text) - meta description for search engines
  - author_name (text, default 'GS Comply Solutions') - author display name
  - created_at (timestamptz, default now())
  - updated_at (timestamptz, default now())

2. Security (RLS)
- Public (anon) can SELECT only posts where status is 'published' or 'scheduled'
  AND published_at <= now(). This lets the public site read live posts.
- Authenticated users can SELECT all posts (including drafts).
- Only the admin user (identified by email match via a SECURITY DEFINER function)
  can INSERT, UPDATE, and DELETE posts.
- A helper function `is_admin()` checks if the authenticated user's email matches
  the BLOG_ADMIN_EMAIL environment variable stored in the auth.users table metadata.

3. Indexes
- idx_posts_slug on slug (unique)
- idx_posts_status_published on (status, published_at) for efficient public queries
- idx_posts_category on category for filtering

4. Notes
- A trigger updates updated_at automatically on row changes.
- A sample DRAFT post is inserted as seed data.
- The admin email is configured via the user's raw_app_meta_data or by checking
  auth.users.email directly. For simplicity, we check the email against an env
  var pattern using a SECURITY DEFINER function.
*/

CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text,
  content text,
  cover_image_url text,
  category text DEFAULT 'General',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  published_at timestamptz,
  seo_title text,
  seo_description text,
  author_name text DEFAULT 'GS Comply Solutions',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is the blog admin
-- Reads the admin email from a secure server-side config table
CREATE TABLE IF NOT EXISTS blog_config (
  key text PRIMARY KEY,
  value text NOT NULL
);

-- Insert default admin email config (TODO: update to your real email)
INSERT INTO blog_config (key, value) VALUES ('admin_email', 'admin@gscomply.com')
ON CONFLICT (key) DO NOTHING;

-- SECURITY DEFINER function so RLS policies can check admin email
-- without exposing auth.users to the anon role
CREATE OR REPLACE FUNCTION is_blog_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND email = (SELECT value FROM blog_config WHERE key = 'admin_email')
  );
$$;

-- Public SELECT: only published or scheduled posts that are live
DROP POLICY IF EXISTS "public_select_published_posts" ON posts;
CREATE POLICY "public_select_published_posts"
ON posts FOR SELECT
TO anon, authenticated
USING (
  status IN ('published', 'scheduled') AND published_at <= now()
  OR is_blog_admin()
);

-- Admin INSERT
DROP POLICY IF EXISTS "admin_insert_posts" ON posts;
CREATE POLICY "admin_insert_posts"
ON posts FOR INSERT
TO authenticated
WITH CHECK (is_blog_admin());

-- Admin UPDATE
DROP POLICY IF EXISTS "admin_update_posts" ON posts;
CREATE POLICY "admin_update_posts"
ON posts FOR UPDATE
TO authenticated
USING (is_blog_admin())
WITH CHECK (is_blog_admin());

-- Admin DELETE
DROP POLICY IF EXISTS "admin_delete_posts" ON posts;
CREATE POLICY "admin_delete_posts"
ON posts FOR DELETE
TO authenticated
USING (is_blog_admin());

-- Indexes
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS posts_updated_at ON posts;
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Seed a sample DRAFT post (safe to delete from admin)
INSERT INTO posts (title, slug, excerpt, content, category, status, author_name, seo_title, seo_description)
VALUES (
  'Sample Draft Post - Delete Me',
  'sample-draft-post-delete-me',
  'This is a sample draft post to verify the blog CMS is working. You can delete it from the admin area.',
  '<h2>Sample Draft Post</h2><p>This is a sample draft post created during setup. It will not appear on the public site until you publish it. You can edit or delete it from the admin area.</p><p>Use the rich text editor to format your articles with headings, lists, links, tables, and code blocks.</p>',
  'General',
  'draft',
  'GS Comply Solutions',
  'Sample Draft Post',
  'A sample draft post for testing the blog CMS.'
)
ON CONFLICT (slug) DO NOTHING;

-- Storage bucket for blog images
-- Insert into storage.buckets to create the bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public can read, only admin can upload
DROP POLICY IF EXISTS "public_read_blog_images" ON storage.objects;
CREATE POLICY "public_read_blog_images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "admin_upload_blog_images" ON storage.objects;
CREATE POLICY "admin_upload_blog_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'blog-images' AND is_blog_admin());

DROP POLICY IF EXISTS "admin_update_blog_images" ON storage.objects;
CREATE POLICY "admin_update_blog_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'blog-images' AND is_blog_admin());

DROP POLICY IF EXISTS "admin_delete_blog_images" ON storage.objects;
CREATE POLICY "admin_delete_blog_images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'blog-images' AND is_blog_admin());
