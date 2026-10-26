import { srcSet } from '@/lib/images';

interface PageHeroProps {
  title: string;
  subtitle?: string;
  breadcrumb?: string;
  image?: string;
}

export default function PageHero({ title, subtitle, breadcrumb, image }: PageHeroProps) {
  return (
    <section className="relative pt-28 lg:pt-36 pb-16 lg:pb-24 overflow-hidden bg-gradient-to-br from-[#155a32] via-[#1A6B3C] to-[#0d3d22]">
      {image && (
        <div className="absolute inset-0 z-0">
          <img {...({ fetchpriority: "high" } as Record<string, string>)} decoding="async" src={image} srcSet={srcSet(image)} sizes="100vw" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/80 to-gray-950/50" />
        </div>
      )}
      {!image && (
        <>
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
          <div className="absolute inset-0 bg-gradient-to-r from-[#0d3d22]/60 to-transparent" />
        </>
      )}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {breadcrumb && (
          <nav className="mb-4">
            <a href="/" className="text-xs font-medium text-gray-300 hover:text-white transition-colors">
              Home
            </a>
            <span className="text-gray-500 mx-2">/</span>
            <span className="text-xs font-medium text-[#4ade80]">{breadcrumb}</span>
          </nav>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-3xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-base lg:text-lg text-gray-200 leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
