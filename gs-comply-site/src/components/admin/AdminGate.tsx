import { type ReactNode } from 'react';
import { AuthProvider } from '@/lib/auth';
import ProtectedRoute from '@/components/ProtectedRoute';

/**
 * Admin-only guard. Inside AdminAuthLayout the auth context already exists (withAuth={false});
 * the public-layout preview route has none, so it brings its own (default).
 */
export default function AdminGate({ children, withAuth = true }: { children: ReactNode; withAuth?: boolean }) {
  const guarded = <ProtectedRoute>{children}</ProtectedRoute>;
  return withAuth ? <AuthProvider>{guarded}</AuthProvider> : guarded;
}
