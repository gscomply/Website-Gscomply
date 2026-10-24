import { useState } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { useAuth, adminEmailConfigured } from '@/lib/auth';

export default function AdminLogin() {
  const { session, loading, isAdmin, signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const from = (location.state as { from?: string })?.from || '/admin';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#1A6B3C] animate-spin" />
      </div>
    );
  }

  if (session && isAdmin) {
    return <Navigate to={from.startsWith('/admin') ? from : '/admin'} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setSubmitting(false);
    } else {
      navigate(from.startsWith('/admin') ? from : '/admin', { replace: true });
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | GS Comply Solutions</title>
        <meta name="description" content="Admin login area." />
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-[#0d3d22] px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img
              src="/logo.png"
              alt="GS Comply Solutions"
              className="h-14 w-auto object-contain mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white">Admin Login</h1>
            <p className="text-sm text-gray-400 mt-1">Sign in to manage blog posts</p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-xl shadow-xl p-8 space-y-5"
          >
            {!adminEmailConfigured && (
              <div role="alert" className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                Admin email is not configured. Set <code>VITE_ADMIN_EMAIL</code> (see SETUP.md).
              </div>
            )}
            {error && (
              <div role="alert" className="flex items-start gap-2.5 p-3.5 rounded-lg bg-red-50 border border-red-200">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A6B3C] focus:ring-1 focus:ring-[#1A6B3C]/20"
                  placeholder="you@yourdomain.com"
                  autoComplete="username"
                />
              </div>
            </div>
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A6B3C] focus:ring-1 focus:ring-[#1A6B3C]/20"
                  placeholder="Your password"
                  autoComplete="current-password"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#1A6B3C] text-white text-sm font-semibold rounded-lg hover:bg-[#155a32] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          <p className="text-center text-xs text-gray-500 mt-6">
            No public sign-up. Contact your administrator for access.
          </p>
        </div>
      </div>
    </>
  );
}
