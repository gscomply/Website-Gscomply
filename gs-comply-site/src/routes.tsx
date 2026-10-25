import { lazy, Suspense, type ReactNode } from 'react';
import { Outlet, type RouteObject } from 'react-router-dom';
import Layout from '@/components/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/lib/auth';
import { Loader2 } from 'lucide-react';
import { BLOG_ENABLED } from '@/config/features';

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Industries = lazy(() => import('@/pages/Industries'));
const Regulations = lazy(() => import('@/pages/Regulations'));
const ImdsCdx = lazy(() => import('@/pages/ImdsCdx'));
const Sustainability = lazy(() => import('@/pages/Sustainability'));
const ScipNotification = lazy(() => import('@/pages/ScipNotification'));
const Insights = lazy(() => import('@/pages/Insights'));
const BlogPost = lazy(() => import('@/pages/BlogPost'));
const Contact = lazy(() => import('@/pages/Contact'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('@/pages/TermsOfService'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminPostList = lazy(() => import('@/pages/admin/AdminPostList'));
const AdminPostEditor = lazy(() => import('@/pages/admin/AdminPostEditor'));
const AdminPostPreview = lazy(() => import('@/pages/admin/AdminPostPreview'));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center" role="status" aria-label="Loading">
      <Loader2 className="w-8 h-8 text-[#1A6B3C] animate-spin" />
    </div>
  );
}

const S = ({ children }: { children: ReactNode }) => <Suspense fallback={<PageLoader />}>{children}</Suspense>;

function Root() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

// Shared by the browser (App.tsx) and the build-time prerenderer (entry-server.tsx).
// A data router (instead of <BrowserRouter>) is needed so the post editor can
// warn before you navigate away with unsaved changes (useBlocker).
export const routes: RouteObject[] = [
  {
    element: <Root />,
    children: [
      {
        // Public site with shared header/footer
        element: <Layout />,
        children: [
          { path: '/', element: <S><Home /></S> },
          { path: '/about', element: <S><About /></S> },
          { path: '/services', element: <S><Services /></S> },
          { path: '/industries', element: <S><Industries /></S> },
          { path: '/regulations', element: <S><Regulations /></S> },
          { path: '/imds-cdx', element: <S><ImdsCdx /></S> },
          { path: '/sustainability', element: <S><Sustainability /></S> },
          { path: '/scip-notification-services', element: <S><ScipNotification /></S> },
          ...(BLOG_ENABLED
            ? [
                { path: '/insights', element: <S><Insights /></S> },
                { path: '/insights/:slug', element: <S><BlogPost /></S> },
              ]
            : []),
          { path: '/privacy-policy', element: <S><PrivacyPolicy /></S> },
          { path: '/terms', element: <S><TermsOfService /></S> },
          { path: '/contact', element: <S><Contact /></S> },
          // Real public layout, fed by the editor's unsaved draft. Admin only.
          ...(BLOG_ENABLED
            ? [{ path: '/admin/preview', element: <ProtectedRoute><S><AdminPostPreview /></S></ProtectedRoute> }]
            : []),
          { path: '*', element: <S><NotFound /></S> },
        ],
      },
      // Admin area: no public header/footer. Not registered at all while the blog is switched off.
      ...(BLOG_ENABLED
        ? [
            { path: '/admin/login', element: <S><AdminLogin /></S> },
            { path: '/admin', element: <ProtectedRoute><S><AdminPostList /></S></ProtectedRoute> },
            { path: '/admin/editor/:id', element: <ProtectedRoute><S><AdminPostEditor /></S></ProtectedRoute> },
          ]
        : []),
    ],
  },
];
