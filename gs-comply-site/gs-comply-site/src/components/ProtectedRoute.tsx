import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/lib/auth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading, isAdmin, signOut } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50" role="status" aria-label="Loading">
        <Loader2 className="w-8 h-8 text-[#1A6B3C] animate-spin" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center bg-white rounded-xl border border-gray-100 shadow-sm p-8">
          <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h1 className="text-lg font-bold text-gray-900">Not authorised</h1>
          <p className="mt-2 text-sm text-gray-600">
            This account does not have access to the blog admin area.
          </p>
          <button
            onClick={() => signOut()}
            className="mt-5 px-4 py-2 text-sm font-semibold text-white bg-[#1A6B3C] rounded-md hover:bg-[#155a32]"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
