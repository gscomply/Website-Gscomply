/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** Email of the one blog administrator. UI gate only; the database enforces the real rule. */
  readonly VITE_ADMIN_EMAIL?: string;
  /** "true" turns on the public blog and the admin area. Anything else = hidden. */
  readonly VITE_BLOG_ENABLED?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
