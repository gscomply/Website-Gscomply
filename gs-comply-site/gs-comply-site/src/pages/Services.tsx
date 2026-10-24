import { Link } from 'react-router-dom';
import {
  PackageCheck,
  Layers,
  ScrollText,
  Database,
  Truck,
  Leaf,
  ArrowRight,
  FileText,
  CheckCircle2,
  Settings,
  UserCheck,
  Users,
  Clock,
} from 'lucide-react';
import SEO from '@/components/SEO';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import { slugify } from '@/lib/blog';

const services = [
  {
    icon: PackageCheck,
    title: 'Product & Material Compliance',
    who: 'For manufacturers who need to demonstrate product-level regulatory compliance for market access or customer requirements.',
    deliverables: [
      'Technical documentation files',
      'Declarations of conformity',
      'Product compliance assessment reports',
      'Customer-specific compliance documentation',
      'Material composition analysis reports',
      'Substance data collection and structuring',
      'Material declarations (MDS, IMDS, CDX format)',
      'Regulatory substance screening reports',
      'REACH SVHC screening reports',
      'RoHS compliance assessments',
      'SCIP notification submissions',
      'PFAS and TSCA compliance documentation',
      Supplier declaration collection (CMRT, EMRT)',
      'Data validation and gap analysis reports',
      'Supplier follow-up tracking and escalation',
      'Compliance documentation management',
    ],
  },
  {
    icon: Database,
    title: 'IMDS & CDX',
    who: 'For automotive and industrial manufacturers who need to create, submit, and maintain material data sheets.',
    deliverables: [
      'IMDS & CDX account setup and configuration',
      'MDS creation with correct material structuring',
      'Supplier MDS validation and approval',
      'Submission and rejection resolution',
      'Centralized compliance data repository',
      'Supplier compliance tracking dashboards',
      'Material and substance data management',
      'Audit-ready documentation packages',
    ],
  },
  {
    icon: Leaf,
    title: 'Sustainability Support',
    who: 'For sustainability and environmental teams who need to collect, structure, and report ESG and carbon data.',
    deliverables: [
      'Sustainability data collection templates',
      'Carbon accounting data summaries (Scope 1, 2, 3)',
      'LCA data gathering and structuring',
      'ESG reporting data packages',
      'CBAM and PPWR compliance documentation',
    ],
  },
];

export default function Services() {
  return (
    <>
      <SEO
        title="Compliance Services | GS Comply Solutions"
        description="Product compliance, material compliance, IMDS and CDX, supply chain, sustainability and regulatory support services for manufacturers."
        path="/services"
      />

      <PageHero
        title="Our Services"
        subtitle="Compliance support with defined deliverables, clear timelines, and a structured approach for each engagement."
        breadcrumb="Services"
      />

      {/* Services Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              What We Do
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Services with clear outputs
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Each service specifies who it is for, what we deliver, and a typical timeline so you
              know what to expect before we start.
            </p>
          </div>
          <div className="space-y-6">
            {services.map((service, idx) => (
              <div
                key={service.title}
                id={slugify(service.title)}
                className={`scroll-mt-28 grid lg:grid-cols-3 gap-6 p-7 lg:p-10 rounded-2xl border transition-all ${
                  idx % 2 === 0
                    ? 'bg-gray-50 border-gray-100 hover:shadow-lg'
                    : 'bg-white border-gray-100 hover:shadow-lg'
                }`}
              >
                <div>
                  <div className="w-14 h-14 rounded-xl bg-[#1A6B3C]/10 flex items-center justify-center mb-5">
                    <service.icon className="w-7 h-7 text-[#1A6B3C]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
                  <div className="flex items-start gap-2 mt-3">
                    <Users className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-gray-500 leading-relaxed">{service.who}</p>
                  </div>
                </div>
                <div className="lg:col-span-2 grid sm:grid-cols-2 gap-3">
                  {service.deliverables.map((item) => (
                    <div key={item} className="flex items-start gap-2.5 p-3.5 rounded-lg bg-white border border-gray-100">
                      <CheckCircle2 className="w-5 h-5 text-[#1A6B3C] shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 font-medium">{item}</span>
                    </div>
                  ))}
                  <div className="sm:col-span-2 flex items-start gap-2.5 p-3.5 rounded-lg bg-[#1A6B3C]/5 border border-[#1A6B3C]/10">
                    <Clock className="w-5 h-5 text-[#1A6B3C] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700"><strong>Typical timeline:</strong> {service.timeline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Strip */}
      <section className="py-20 lg:py-28 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#4ade80] uppercase tracking-wider">
              Our Process
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-white tracking-tight">
              How we deliver compliance support
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Settings, title: 'Assess & Plan', desc: 'We review your products, markets, and applicable requirements to build a compliance plan.' },
              { icon: FileText, title: 'Collect & Prepare', desc: 'We coordinate with suppliers and internal teams to gather data and prepare documentation.' },
              { icon: UserCheck, title: 'Submit & Support', desc: 'We manage submissions, handle rejections, and provide ongoing compliance support.' },
            ].map((item) => (
              <div key={item.title} className="p-7 rounded-xl bg-gray-900 border border-gray-800">
                <div className="w-12 h-12 rounded-lg bg-[#1A6B3C] flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2.5">{item.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
