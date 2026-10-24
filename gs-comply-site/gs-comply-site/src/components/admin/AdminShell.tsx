import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';

/** Common frame for /admin pages. Adds noindex and the top bar. */
export default function AdminShell({
  title,
  children,
  bar,
}: {
  title: string;
  children: ReactNode;
  /** Optional custom bar content (editor actions). Replaces the default right-hand links. */
  bar?: ReactNode;
}) {
  const { signOut, session } = useAuth();
  return (
    <>
      <Helmet>
        <title>{title} | GS Comply Admin</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 min-h-14 py-2">
            <div className="flex items-center gap-3 min-w-0">
              <Link to="/admin" className="flex items-center gap-3 shrink-0">
                <img src="/GS_comply__Logo.jpg" alt="GS Comply" className="h-7 w-auto" />
                <span className="hidden sm:inline text-sm font-semibold text-gray-400">/ Blog admin</span>
              </Link>
            </div>
            {bar ?? (
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-xs text-gray-400 truncate max-w-[200px]">
                  {session?.user?.email}
                </span>
                <Link
                  to="/insights"
                  className="text-xs font-medium text-gray-500 hover:text-gray-800 flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" /> View blog
                </Link>
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-md hover:bg-gray-50"
                >
                  <LogOut className="w-3.5 h-3.5" aria-hidden="true" /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>
        {children}
      </div>
    </>
  );
}
