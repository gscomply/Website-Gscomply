import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Do not crash the build or the page: only features that use the database (contact form, blog) fail.
  console.warn('Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see SETUP.md).');
}

export const supabase = createClient(
  supabaseUrl || 'https://not-configured.invalid',
  supabaseAnonKey || 'not-configured',
);
