/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** Email of the one blog administrator. UI gate only; the database enforces the real rule. */
  readonly VITE_ADMIN_EMAIL?: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
