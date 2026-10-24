import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * The single blog administrator, from the VITE_ADMIN_EMAIL env variable.
 * This only decides what the UI shows. The database (RLS + is_blog_admin())
 * is what actually stops anyone else from reading drafts or writing posts.
 * If the variable is missing, nobody is treated as admin (fail closed).
 */
const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!ADMIN_EMAIL && !!email && email.trim().toLowerCase() === ADMIN_EMAIL;
}

export const adminEmailConfigured = !!ADMIN_EMAIL;

interface AuthContextValue {
  session: Session | null;
  loading: boolean;
  /** True only for a signed-in user whose email matches VITE_ADMIN_EMAIL */
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!adminEmailConfigured) {
      return { error: 'Admin email is not configured (VITE_ADMIN_EMAIL). See SETUP.md.' };
    }
    // Do not even attempt a login for any other address
    if (!isAdminEmail(email)) {
      return { error: 'Invalid login credentials' };
    }
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    return { error: error?.message || null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = isAdminEmail(session?.user?.email);

  return (
    <AuthContext.Provider value={{ session, loading, isAdmin, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
