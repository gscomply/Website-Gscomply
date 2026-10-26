import { Link } from 'react-router-dom';
import { Mail, MapPin, Clock, Linkedin, ArrowRight } from 'lucide-react';
import { openCookieSettings } from '@/lib/consent';
import { company } from '@/data/company';
import { BLOG_ENABLED } from '@/config/features';

interface FooterLink {
  label: string;
  path: string;
}

interface FooterGroup {
  title: string;
  links: FooterLink[];
}

const servicesGroup: FooterGroup = {
  title: 'Services',
  links: [
    { label: 'Product & Material Compliance', path: '/product-material-compliance' },
    { label: 'IMDS & CDX ', path: '/imds-cdx' },
    { label: 'SCIP Notification ', path: '/scip-notification-services' },
    { label: 'Training ', path: '/training-services' },
  ],
};

const linkCls = 'text-sm hover:text-white transition-colors flex items-center gap-1.5 group';
const Arrow = () => <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />;

const companyGroup: FooterGroup = {
  title: 'Company',
  links: [
    { label: 'About Us', path: '/about' },
    { label: 'Services', path: '/services' },
    { label: 'Industries', path: '/industries' },
    { label: 'Contact', path: '/contact' },
  ],
};

const expertiseGroup: FooterGroup = {
  title: 'Expertise',
  links: [
    { label: 'Regulations', path: '/regulations' },
    { label: 'Sustainability Reporting', path: '/sustainability' },
  ],
};

// Quick Links: Insights stays in the code and appears automatically once the blog is enabled
// (VITE_BLOG_ENABLED=true); until then it is hidden.
const quickLinksGroup: FooterGroup = {
  title: 'Quick Links',
  links: [
    ...(BLOG_ENABLED ? [{ label: 'Insights', path: '/insights' }] : []),
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms of Service', path: '/terms' },
  ],
};

const SimpleColumn = ({ title, links }: FooterGroup) => (
  <div>
    <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">{title}</h4>
    <ul className="space-y-2.5">
      {links.map((link) => (
        <li key={link.label}>
          <Link to={link.path} className={linkCls}>
            <Arrow />
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center mb-5">
              <img
                src="/logo-400.webp"
                width={400}
                height={99}
                loading="lazy"
                decoding="async"
                alt="GS Comply Solutions logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="text-sm leading-relaxed max-w-xs mb-6">
              Regulatory and compliance support for manufacturers managing product, material,
              environmental and supply-chain requirements across global markets.
            </p>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <a href={`mailto:${company.email}`} className="hover:text-white transition-colors">
                  {company.email}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <span>{company.name}, {company.city}, {company.country}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#4ade80] shrink-0 mt-0.5" />
                <span>{company.workingHours}</span>
              </div>
            </div>
          </div>

          <SimpleColumn {...companyGroup} />
          <SimpleColumn {...expertiseGroup} />
          <SimpleColumn {...servicesGroup} />

          <SimpleColumn {...quickLinksGroup} />
        </div>

        <div className="mt-14 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy-policy" className="text-xs text-gray-400 hover:text-white">Privacy</Link>
            <Link to="/terms" className="text-xs text-gray-400 hover:text-white">Terms</Link>
            <button type="button" onClick={openCookieSettings} className="text-xs text-gray-400 hover:text-white underline underline-offset-2">
              Cookie settings
            </button>
            <a
              href={company.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1A6B3C] transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-gray-300" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
