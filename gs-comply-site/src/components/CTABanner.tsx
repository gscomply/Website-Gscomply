import { ArrowRight } from 'lucide-react';
import { company } from '@/data/company';

interface CTABannerProps {
  title?: string;
  subtitle?: string;
}

export default function CTABanner({
  title = 'Ready to discuss your compliance requirement?',
  subtitle = 'Tell us about your product, market or compliance challenge. Our team will review your enquiry and get back to you within one business day.',
}: CTABannerProps) {
  return (
    <section className="bg-[#1A6B3C] py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight max-w-3xl mx-auto">
          {title}
        </h2>
        <p className="mt-4 text-base lg:text-lg text-white/80 max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={company.calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#1A6B3C] text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors shadow-lg"
          >
            Discuss Your Requirement
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
