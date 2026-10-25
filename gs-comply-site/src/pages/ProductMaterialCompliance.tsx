import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Globe2,
  Truck,
  FileWarning,
  Network,
  Building2,
  Info,
} from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { slugify } from '@/lib/blog';
import { industries } from '@/data/company';
import { regulationCategories } from '@/data/regulations';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import SEO from '@/components/SEO';

const whyItMatters = [
  { icon: Globe2, title: 'Market access', desc: 'Products placed on the EU, US, China and other markets must meet substance restrictions and documentation rules, or shipments and sales can be blocked.' },
  { icon: Truck, title: 'Customer and OEM requirements', desc: 'Customers routinely ask suppliers for material declarations, substance data and compliance statements before they approve parts or renew contracts.' },
  { icon: FileWarning, title: 'Fewer rejections and delays', desc: 'Complete, validated material and substance data avoids rejected submissions, repeated supplier chasing and last-minute documentation requests.' },
  { icon: Network, title: 'Supply chain visibility', desc: 'Knowing what substances are in your materials and components is the basis for every regulation, from REACH SVHC screening to PFAS restrictions.' },
  { icon: ShieldCheck, title: 'Staying ahead of change', desc: 'Candidate Lists, restrictions and reporting rules are updated regularly. Structured data makes each update a review, not a restart.' },
];

const supportOffered = [
  'Technical documentation and declarations support',
  'Material composition analysis and substance data collection',
  'REACH SVHC and RoHS screening',
  'Supplier declarations (CMRT, EMRT) and follow-up',
  'Material declarations in MDS, IMDS and CDX formats',
  'Data validation and gap analysis',
  'Compliance data management and audit-ready records',
  'SCIP notification support',
];

export default function ProductMaterialCompliance() {
  return (
    <>
      <SEO
        title="Product & Material Compliance: Regulations, Industries & Support"
        description="Product and material compliance support for manufacturers: REACH, RoHS, PFAS, TSCA, ELV, SCIP and more, across automotive, electronics, aerospace, medical and 20+ industries."
        path="/product-material-compliance"
      />
      <PageHero
        title="Product & Material Compliance"
        subtitle="Demonstrate product, material and substance compliance for market access and customer requirements, across the regulations and industries you work in."
        image={IMAGES.scipProduction}
        breadcrumb="Product & Material Compliance"
      />

      {/* Why it matters (directly under the hero) */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Why It Matters
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Why product and material compliance is important
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Every product is made of materials, and every material carries substances that regulators and customers
              want to know about. Getting this data right protects market access, customer relationships and your
              reputation.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyItMatters.map((item) => (
              <div key={item.title} className="p-7 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#1A6B3C]/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-[#1A6B3C]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2.5">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
            <div className="p-7 rounded-xl bg-[#1A6B3C] text-white md:col-span-2 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-3">How we help</h3>
              <ul className="space-y-2 text-sm text-white/90">
                {supportOffered.slice(0, 4).map((t) => (
                  <li key={t} className="flex gap-2"><span aria-hidden="true">•</span>{t}</li>
                ))}
              </ul>
              <a href="#support" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:gap-2.5 transition-all">
                See all support <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Regulations */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Regulations We Support
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Regulations and standards for products and materials
            </h2>
          </div>
          <div className="space-y-12">
            {regulationCategories.map((cat) => (
              <div key={cat.category}>
                <h3 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-200">{cat.category}</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      id={slugify(item.name)}
                      className="scroll-mt-28 p-5 rounded-xl bg-white border border-gray-100 hover:border-[#1A6B3C]/30 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <ShieldCheck className="w-5 h-5 text-[#1A6B3C] shrink-0 mt-0.5" aria-hidden="true" />
                        <h4 className="text-base font-semibold text-gray-900">{item.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed pl-8">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-center text-sm text-gray-600">
            Looking for the full reference?{' '}
            <Link to="/regulations" className="font-semibold text-[#1A6B3C] hover:underline">Regulations</Link>
            {' · '}
            <Link to="/scip-notification-services" className="font-semibold text-[#1A6B3C] hover:underline">SCIP Notification Services</Link>
          </p>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Industries We Serve
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Compliance support across {industries.length} industries
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Requirements differ by sector. We work with the regulations and customer systems that apply to yours.
            </p>
          </div>
          <ul className="flex flex-wrap justify-center gap-3">
            {industries.map((name) => (
              <li key={name} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1A6B3C]/5 border border-[#1A6B3C]/15 text-sm font-medium text-[#1A6B3C]">
                <Building2 className="w-4 h-4" aria-hidden="true" />
                {name}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-sm text-gray-600">
            <Link to="/industries" className="font-semibold text-[#1A6B3C] hover:underline">See how we support each industry</Link>
          </p>
        </div>
      </section>

      {/* Support offered */}
      <section id="support" className="scroll-mt-28 py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">What we deliver</h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {supportOffered.map((t) => (
              <li key={t} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-white border border-gray-100 text-sm text-gray-700 font-medium">
                <ShieldCheck className="w-5 h-5 text-[#1A6B3C] shrink-0 mt-0.5" aria-hidden="true" />
                {t}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-start gap-3 p-5 rounded-xl bg-white border border-gray-100">
            <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-gray-500 leading-relaxed">
              GS Comply Solutions provides compliance support and documentation assistance. We do not issue official
              certifications; declarations of conformity are issued by the manufacturer or an accredited body.
            </p>
          </div>
        </div>
      </section>

      <CTABanner
        title="Talk to us about your product and material compliance"
        subtitle="Tell us about your products, materials and the markets you supply. We will review your enquiry and get back to you within one business day."
      />
    </>
  );
}
