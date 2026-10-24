# Blog CMS: setup checklist

Do these once. After that, publishing a post never needs a redeploy.

## 1. Run the database migrations
Supabase Dashboard > SQL Editor > run, in order (skip any already applied):
1. `supabase/migrations/20261020042728_create_posts_table.sql`
2. `supabase/migrations/20261023090000_blog_cms_hardening.sql`  (safe to re-run)

This creates/updates the `posts` table, RLS, the public `blog-images` bucket (5 MB, images only,
admin-only upload) and one sample DRAFT post ("Sample Draft Post - Delete Me").

## 2. Create the admin user
Dashboard > Authentication > Users > **Add user > Create new user**
- Email: your admin email
- Password: a strong one
- Tick **Auto Confirm User**

## 3. Tell the database who the admin is
Postgres cannot read your frontend `.env`, so the admin email is stored once in the database
(this is what Row Level Security really enforces). Run:

```sql
UPDATE blog_config SET value = 'you@yourdomain.com' WHERE key = 'admin_email';
```
Check it: `SELECT value FROM blog_config WHERE key = 'admin_email';`

## 4. Disable public sign-ups
Dashboard > Authentication > Sign In / Providers (or Settings) > turn **off "Allow new users to sign up"**.
The login page has no sign-up, but this closes the API route too.

## 5. Confirm the storage bucket
Dashboard > Storage: `blog-images` should exist and be **Public**. (The migration creates it. Only the admin can upload.)

## 6. Environment variables
Same admin email in the frontend `.env` and in **Netlify > Site configuration > Environment variables**:

| Variable | Value | Used by |
|---|---|---|
| `VITE_SUPABASE_URL` | your project URL | site + edge functions |
| `VITE_SUPABASE_ANON_KEY` | anon key | site + edge functions |
| `VITE_ADMIN_EMAIL` | your admin email (same as step 3) | admin UI gate |
| `SITE_URL` | `https://gscomply.com` (your real domain, no trailing slash) | canonical URLs, sitemap, RSS |

Make sure the variables are available to **Functions / Edge Functions** scope too (not only "Builds").

## 7. Deploy once
Deploy this project to Netlify (it reads `netlify.toml`). Edge functions in `netlify/edge-functions/`
server-render `/insights` and `/insights/:slug` and generate `/rss.xml` and `/sitemap.xml` live from Supabase.
Changes to posts appear within ~2 to 5 minutes (CDN cache) with no redeploy.

## 8. Use it
- `/admin/login` > sign in > **New post**.
- Delete the sample draft from `/admin`.
- Submit `https://YOURDOMAIN/sitemap.xml` in Google Search Console.

## Notes
- If your host is not Netlify, the edge functions need porting (Vercel Edge Middleware / Cloudflare Worker); the Supabase side and the React app are host-independent.
- The older `supabase/functions/rss-feed` is no longer used; RSS is `/rss.xml`.
