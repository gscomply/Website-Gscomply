import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';
import SEO from '@/components/SEO';

export default function NotFound() {
  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you are looking for does not exist."
        path="/404"
      />
      <section className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-[#155a32] via-[#1A6B3C] to-[#0d3d22]">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: `
              linear-gradient(white 1px, transparent 1px),
              linear-gradient(90deg, white 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-7xl lg:text-9xl font-bold text-white tracking-tight">404</h1>
          <p className="mt-4 text-lg text-gray-200">Page not found</p>
          <p className="mt-2 text-sm text-gray-400 max-w-md mx-auto">
            The page you are looking for may have been moved or no longer exists.
          </p>
          <Link
            to="/"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1A6B3C] text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </section>
    </>
  );
}
