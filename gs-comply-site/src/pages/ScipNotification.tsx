import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ClipboardCheck,
  FileSearch,
  FlaskConical,
  Send,
  FileCog,
  RefreshCw,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { IMAGES } from '@/lib/images';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import SEO from '@/components/SEO';

const capabilities = [
  {
    icon: ClipboardCheck,
    title: 'SCIP Applicability Assessment',
    desc: 'We review your product range and the markets you supply to, and help you work out which articles may fall under SCIP notification duties and which do not.',
  },
  {
    icon: FileSearch,
    title: 'Product & Material Information Collection',
    desc: 'We collect and review bills of materials, material declarations and supplier data, and chase gaps so the information needed for the notification is complete.',
  },
  {
    icon: FlaskConical,
    title: 'SVHC Identification & Validation',
    desc: 'We screen article and component data against the current REACH Candidate List and validate the concentration and substance information that goes into the notification.',
  },
  {
    icon: FileCog,
    title: 'IUCLID / SCIP Data Preparation',
    desc: 'Where applicable, we prepare and validate the data in the format required for the ECHA SCIP database, including IUCLID-based submissions.',
  },
  {
    icon: Send,
    title: 'Notification Preparation & Submission Support',
    desc: 'We prepare the notification content and support you through submission to the ECHA SCIP database, working with the account details you provide.',
  },
  {
    icon: RefreshCw,
    title: 'Updates & Documentation',
    desc: 'We support updates when products or the Candidate List change, and keep the related records organised so they are ready when a customer or authority asks.',
  },
];

const steps = [
  { title: 'Scope', desc: 'We agree which products, articles and markets are in scope and what data you already hold.' },
  { title: 'Collect', desc: 'We gather product, material and supplier information and identify missing declarations.' },
  { title: 'Validate', desc: 'We check SVHC data against the Candidate List and resolve inconsistencies with your suppliers.' },
  { title: 'Prepare & submit', desc: 'We prepare the notification data and support the submission to the SCIP database.' },
  { title: 'Maintain', desc: 'We help you keep notifications and records current as your products change.' },
];

export default function ScipNotification() {
  return (
    <>
      <SEO
        title="SCIP Notification Services: SVHC Data Preparation & Submission Support"
        description="Support for SCIP database notifications under the EU Waste Framework Directive: applicability assessment, SVHC data validation, IUCLID/SCIP data preparation and submission support for manufacturers."
        path="/scip-notification-services"
      />
      <PageHero
        title="SCIP Notification Services"
        subtitle="Support for companies that place articles containing Candidate List substances of very high concern (SVHCs) on the EU market and need to notify the ECHA SCIP database."
        image={IMAGES.scipHero}
        breadcrumb="SCIP Notification Services"
      />

      {/* Intro */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
                About SCIP
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Getting your article data ready for the SCIP database
              </h2>
              <p className="mt-5 text-base text-gray-600 leading-relaxed">
                SCIP (Substances of Concern In articles as such or in complex objects, Products) is a database run by the
                European Chemicals Agency (ECHA) under the EU Waste Framework Directive. Suppliers of articles that contain a
                Candidate List SVHC above 0.1% weight by weight may have to submit information about those articles to it.
              </p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                Whether a notification is needed depends on the article, the substances it contains and your role in the supply
                chain. We help you establish that first, then collect, validate and prepare the data when a notification applies.
              </p>
              <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-[#1A6B3C]/5 border border-[#1A6B3C]/10">
                <Info className="w-5 h-5 text-[#1A6B3C] shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  Not every product requires a SCIP notification. We provide compliance support and documentation, and the
                  notification itself remains the responsibility of the legally obliged supplier.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                loading="lazy"
                decoding="async"
                src={IMAGES.scipDocs}
                alt="Regulatory documents being reviewed and signed"
                width={800}
                height={1000}
                className="rounded-2xl shadow-xl w-full object-cover h-[360px] lg:h-[440px]"
              />
              <img
                loading="lazy"
                decoding="async"
                src={IMAGES.scipProduction}
                alt="Manufacturing line producing articles for the EU market"
                width={800}
                height={1000}
                className="rounded-2xl shadow-xl w-full object-cover h-[360px] lg:h-[440px] mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              What We Support
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              SCIP notification support, end to end
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Pick the parts you need. Scope is agreed with you per project.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((item) => (
              <div
                key={item.title}
                className="group p-7 rounded-xl bg-white border border-gray-100 hover:border-[#1A6B3C]/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center mb-5 group-hover:bg-[#1A6B3C] transition-colors">
                  <item.icon className="w-6 h-6 text-[#1A6B3C] group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2.5">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Approach, with image */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
                How We Work
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                A structured approach from data to notification
              </h2>
              <img
                loading="lazy"
                decoding="async"
                src={IMAGES.scipMaterials}
                alt="Electronic components and materials reviewed for substance data"
                width={1200}
                height={800}
                className="mt-8 rounded-2xl shadow-xl w-full object-cover h-[260px]"
              />
            </div>
            <ol className="lg:col-span-3 space-y-4">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-5 p-6 rounded-xl bg-gray-50 border border-gray-100">
                  <span className="w-10 h-10 rounded-full bg-[#1A6B3C] text-white font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Related pages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Related services</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { to: '/regulations', label: 'Regulations & Standards', desc: 'REACH, RoHS, PFAS, SCIP and more.' },
              { to: '/imds-cdx', label: 'IMDS & CDX Services', desc: 'Material data sheets and submissions.' },
              { to: '/product-material-compliance', label: 'Product & Material Compliance', desc: 'SVHC screening and declarations.' },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="group flex items-start justify-between gap-3 p-5 rounded-xl bg-white border border-gray-100 hover:border-[#1A6B3C]/30 hover:shadow-md transition-all"
              >
                <span>
                  <span className="flex items-center gap-2 font-semibold text-gray-900">
                    <CheckCircle2 className="w-4 h-4 text-[#1A6B3C]" aria-hidden="true" />
                    {item.label}
                  </span>
                  <span className="mt-1 block text-sm text-gray-600">{item.desc}</span>
                </span>
                <ArrowRight className="w-4 h-4 text-[#1A6B3C] mt-1 shrink-0 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Need help with SCIP notifications?"
        subtitle="Tell us about your products and the markets you supply. We will review your enquiry, tell you whether SCIP is likely to apply, and outline how we can help."
      />
    </>
  );
}
