import { Outlet } from 'react-router-dom';
import { AuthProvider } from '@/lib/auth';

/** Wraps the admin routes in the auth context. Lazy-loaded so public pages never pull in Supabase. */
export default function AdminAuthLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}
