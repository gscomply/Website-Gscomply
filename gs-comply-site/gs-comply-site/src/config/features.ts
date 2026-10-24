/**
 * Feature switches.
 *
 * BLOG_ENABLED  - the public blog (/insights, /insights/:slug, RSS, blog sitemap entries)
 *                 and the admin area (/admin/*).
 *
 * It is OFF unless the environment variable VITE_BLOG_ENABLED is exactly "true".
 * To turn the blog back on later: set VITE_BLOG_ENABLED=true (in .env and in Netlify),
 * then redeploy once. Nothing in the database or the code needs to change.
 */
export const BLOG_ENABLED = import.meta.env.VITE_BLOG_ENABLED === 'true';
