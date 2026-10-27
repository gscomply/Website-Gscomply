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

## 6. Environment variables (Vercel)
Vercel dashboard > your project > **Settings > Environment Variables**. Add these for **Production** (and Preview if you use it),
then redeploy. The same names go in your local `.env` file.

| Variable | Value | Used by |
|---|---|---|
| `VITE_SUPABASE_URL` | your Supabase project URL | website + blog function |
| `VITE_SUPABASE_ANON_KEY` | the **anon public** key (never the service_role key) | website + blog function |
| `VITE_ADMIN_EMAIL` | your admin email (same as step 3) | admin login (only when the blog is on) |
| `VITE_BLOG_ENABLED` | `false` (default) or `true` | shows/hides blog + admin (section 10) |
| `SITE_URL` | `https://gscomply.com` (your real domain, no trailing slash) | canonical URLs, sitemap, RSS |

## 7. Deploy to Vercel
1. Push the project to GitHub/GitLab/Bitbucket and **Import** it in Vercel (Framework preset: **Vite**; the build command and
   output folder are already set in `vercel.json`: `npm run build` and `dist`).
2. Add the environment variables above, then **Deploy**.
3. Project > **Settings > Domains**: add `gscomply.com` and `www.gscomply.com`, follow the DNS instructions, and set one of them to redirect to the other.
4. What the build does: `npm run build` pre-renders every public page to real HTML (`dist/about.html` etc.), writes `sitemap.xml`, `404.html`
   and `200.html`. `vercel.json` serves `/about` from `about.html` (clean URLs) and returns a real 404 status for unknown URLs.
5. The folder `api/` holds ONE function (`api/blog.ts`). It does nothing until the blog is enabled; then it serves `/insights`, `/insights/:slug`,
   `/rss.xml` and `/sitemap.xml` live from Supabase, so publishing a post needs no redeploy (CDN cache: up to ~2 to 5 minutes).

Other hosts: the `dist/` folder is plain static files and works anywhere; only `vercel.json` and `api/blog.ts` are Vercel-specific
(they only matter for clean URLs, the admin fallback and the live blog).

## 8. Use it
- `/admin/login` > sign in > **New post**.
- Delete the sample draft from `/admin`.
- Submit `https://YOURDOMAIN/sitemap.xml` in Google Search Console.

## Notes
- The older `supabase/functions/rss-feed` is no longer used; RSS is `/rss.xml`.

## 9. Legal pages (Privacy Policy, Terms of Service): must do before going live
Pages: `/privacy-policy` and `/terms`. Linked from the footer, cookie banner and contact form.
1. Open `src/data/company.ts`, block `legal`. Replace EVERY value in [square brackets]
   (legal entity name, address, registration number, EU representative, Supabase region, retention period, governing law, courts).
   Unreplaced placeholders show **highlighted in yellow** on the live pages so they cannot be missed.
2. Make sure the mailbox `support@gscomply.com` exists (set in `legal.contactEmail`); someone must answer GDPR requests within 1 month.
3. Sign a Data Processing Agreement with Supabase, Vercel, Resend and Google (all offer one in their dashboards/legal pages).
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

    VITE_BLOG_ENABLED=true     (in .env AND in Vercel > Settings > Environment Variables, then redeploy)

While it is not "true": /insights and /admin return the 404 page (real 404 status for search engines),
/rss.xml returns 404, and the sitemap lists only the normal pages. The database and all code stay in place,
nothing to rebuild. To enable later: set it to `true`, complete sections 1 to 6 above, redeploy.

## 11. Navigation and icons
- Menu bar order: `src/data/navigation.ts`. The Services dropdown is built automatically from `src/data/services.ts`,
  which also feeds the Services page, so add/edit a service in that ONE file and both update (links can never break).
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
1. Deploy on your real domain **https://gscomply.com** (and set `SITE_URL` in Vercel to it). Redirect www <-> non-www to ONE version.
2. **Google Search Console** (search.google.com/search-console): add the property, verify the domain (DNS), submit `https://gscomply.com/sitemap.xml`,
   then use "URL inspection > Request indexing" for the home page and each main page.
3. **Bing Webmaster Tools**: import from Search Console (also feeds DuckDuckGo/Yahoo/ChatGPT search).
4. **Google Business Profile** and consistent company name/address/phone everywhere (also fill the `[City]`/`[Country]` placeholders in `src/data/company.ts`).
5. Publish useful content regularly (enable the blog), get links from industry sites, directories, LinkedIn, partners and customers.
6. Replace remaining placeholders (team names/photos, credentials) with real data. Thin or placeholder content ranks poorly.

## 13. Contact form and "Book a 30-min Call" (read this if either stops working)
**Environment variables only reach the website when it is BUILT.** After adding or editing any variable in
Vercel > Settings > Environment Variables you must **redeploy** (Deployments > the latest one > ⋯ > Redeploy,
and untick "Use existing Build Cache"). Editing a variable alone changes nothing on the live site.

| Variable | Used for |
|---|---|
| `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | saving enquiries (required) |
| `RESEND_API_KEY` | the notification email (without it the enquiry is still saved, just no email) |
| `CONTACT_NOTIFICATION_EMAIL` | where notifications go (default `VITE_CONTACT_EMAIL`, then info.gscomply@gmail.com) |
| `CONTACT_FROM_EMAIL` (or `RESEND_FROM_EMAIL`) | sender, e.g. `GS Comply Website <enquiries@gscomply.com>` (needs a domain verified in Resend) |
| `CONTACT_AUTOREPLY` | set to `false` to stop the confirmation email sent to the person who submitted the form (default: on; needs a sender on a domain verified in Resend) |
| `VITE_CALENDLY_URL` | the "Book a 30-min Call" buttons, e.g. `https://calendly.com/your-name/30min` |

**Quick health check:** open `https://YOUR-DOMAIN/api/contact?check=1`. It lists which settings are present and whether the
`enquiries` table is reachable (no secret values are shown). `database: "table_missing"` means run
`supabase/migrations/20260923060206_create_enquiries_table.sql` in Supabase > SQL Editor.

Notes
- The form posts to `/api/contact` (a Vercel function). Errors are written to Vercel > project > Logs, lines start with `[contact]`.
- Resend's default sender `onboarding@resend.dev` can only deliver to the email address of your own Resend account.
  To email any other address, verify your domain in Resend and set `CONTACT_FROM_EMAIL`.
- Every enquiry is also stored in Supabase > Table Editor > `enquiries`, so none are lost if an email fails.
- Booking-link typos are tolerated (quotes, a missing `https://`, a trailing `/` are fixed automatically), but the
  link itself must be your real Calendly page.
