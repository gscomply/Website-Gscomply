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

## 9. Legal pages (Privacy Policy, Terms of Service): must do before going live
Pages: `/privacy-policy` and `/terms`. Linked from the footer, cookie banner and contact form.
1. Open `src/data/company.ts`, block `legal`. Replace EVERY value in [square brackets]
   (legal entity name, address, registration number, EU representative, Supabase region, retention period, governing law, courts).
   Unreplaced placeholders show **highlighted in yellow** on the live pages so they cannot be missed.
2. Make sure the mailbox `support@gscomply.com` exists (set in `legal.contactEmail`); someone must answer GDPR requests within 1 month.
3. Sign a Data Processing Agreement with Supabase, Netlify, Resend and Google (all offer one in their dashboards/legal pages).
4. In Google Tag Manager, make sure the container only fires analytics tags (no advertising/remarketing tags),
   otherwise the cookie banner text must be extended.
5. Have a lawyer review both pages. They are a solid GDPR-structured starting point, not legal advice.
6. Optional but recommended: download the Pexels images used in `src/lib/images.ts` and host them yourself,
   so visitors' IP addresses are not sent to Pexels.
7. Handling requests: enquiries live in the Supabase table `enquiries` (Table Editor). To erase someone, delete their row(s).
   To enforce the retention period, run periodically:
   `DELETE FROM enquiries WHERE created_at < now() - interval '24 months';`

## 10. Blog switch (hidden by default)
The public blog (/insights, RSS), the "Insights" menu/footer links and the whole admin area (/admin/*) are
**hidden** until you set one environment variable:

    VITE_BLOG_ENABLED=true     (in .env AND in Netlify > Environment variables, then redeploy)

While it is not "true": /insights and /admin return the 404 page (real 404 status for search engines),
/rss.xml returns 404, and the sitemap lists only the normal pages. The database and all code stay in place,
nothing to rebuild. To enable later: set it to `true`, complete sections 1 to 6 above, redeploy.

## 11. Navigation and icons
- Menu content: `src/data/navigation.ts` (Services categories, Industries list, order of tabs).
- Logo used in the header: `public/logo.png` (trimmed from `GS_comply__Logo.jpg`).
- Browser-tab icon: `public/favicon.ico`, `favicon-16/32.png`, `apple-touch-icon.png`, `icon-192/512.png`, all cut
  from your logo's shield-and-tick mark. If you have an official square icon file, replace these (keep the names).
  Browsers cache favicons hard: hard-refresh (Ctrl+Shift+R) or use a private window to see the new one.

## 12. SEO (what is built in, and what you must do)
Built in:
- Every public page is **pre-rendered to real HTML at build time** (`npm run build` -> `scripts/prerender.mjs`), with its own unique
  title, meta description, canonical URL, Open Graph/Twitter tags, a single H1 and JSON-LD (Organization, WebSite, ProfessionalService,
  BreadcrumbList). Google, Bing and social-link scrapers see the full content without running JavaScript.
- `robots.txt` (allows everything, blocks `/admin/`, points to the sitemap) and `sitemap.xml` (generated at every build from the page list in
  `src/entry-server.tsx` > `PAGES`: add new pages there).
- Unknown URLs return a real **404** status (not a soft 404), the 404 page is `noindex`.
- Social share image `public/og-image.png` (1200x630), favicons, lazy-loaded images, fast cached assets.
- When the blog is enabled (section 10): blog pages are server-rendered live, with Article schema, a live sitemap with `lastmod`, and RSS.

You must do (these cannot be done in code):
1. Deploy on your real domain **https://gscomply.com** (and set `SITE_URL` in Netlify to it). Redirect www <-> non-www to ONE version.
2. **Google Search Console** (search.google.com/search-console): add the property, verify the domain (DNS), submit `https://gscomply.com/sitemap.xml`,
   then use "URL inspection > Request indexing" for the home page and each main page.
3. **Bing Webmaster Tools**: import from Search Console (also feeds DuckDuckGo/Yahoo/ChatGPT search).
4. **Google Business Profile** and consistent company name/address/phone everywhere (also fill the `[City]`/`[Country]` placeholders in `src/data/company.ts`).
5. Publish useful content regularly (enable the blog), get links from industry sites, directories, LinkedIn, partners and customers.
6. Replace remaining placeholders (team names/photos, credentials) with real data. Thin or placeholder content ranks poorly.
