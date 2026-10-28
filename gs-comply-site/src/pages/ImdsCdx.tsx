import { company } from '@/data/company';
import {
  ArrowRight,
  UserPlus,
  ClipboardList,
  Layers,
  Users,
  FileCheck,
  Send,
  Eye,
  CheckCircle2,
  Database,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { IMAGES, srcSet } from '@/lib/images';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import SEO from '@/components/SEO';

const timelineSteps = [
  { num: 1, icon: UserPlus, title: 'Account Setup', desc: 'IMDS/CDX account configuration and initial system setup for your organization.' },
  { num: 2, icon: ClipboardList, title: 'Product & BOM Review', desc: 'Review your product structure and bill of materials to plan the MDS hierarchy.' },
  { num: 3, icon: Layers, title: 'Material & Substance Mapping', desc: 'Map materials and substances to the correct IMDS material categories and data entries.' },
  { num: 4, icon: Users, title: 'Supplier Data Collection', desc: 'Coordinate with suppliers to collect required MDS data and material declarations.' },
  { num: 5, icon: FileCheck, title: 'MDS Creation & Validation', desc: 'Create and validate MDS entries, checking for accuracy and completeness before submission.' },
  { num: 6, icon: Send, title: 'Submission', desc: 'Submit MDS data to the appropriate recipients and customer systems.' },
  { num: 7, icon: Eye, title: 'Customer Review', desc: 'Support the customer review process, responding to questions and clarifications.' },
  { num: 8, icon: CheckCircle2, title: 'Rejection Resolution & Approval', desc: 'Resolve rejections, update data as needed, and achieve final customer approval.' },
];

const capabilities = [
  { icon: Database, title: 'IMDS Account Setup', desc: 'Complete account configuration and user management for the International Material Data System.' },
  { icon: Layers, title: 'MDS Creation', desc: 'Professional MDS creation with correct material structuring and substance data entry.' },
  { icon: Settings, title: 'Component & Material Structuring', desc: 'Proper structuring of components, sub-components and materials in the MDS hierarchy.' },
  { icon: FileCheck, title: 'Supplier MDS Validation', desc: 'Validation of supplier-provided MDS data for accuracy, completeness and compliance.' },
  { icon: Send, title: 'MDS Submission', desc: 'Submission of completed MDS data to customers and coordination through the review process.' },
  { icon: Users, title: 'Customer Approval Support', desc: 'Direct support during customer review, including clarifications and additional data requests.' },
  { icon: RefreshCw, title: 'Rejection Resolution', desc: 'Analysis and resolution of MDS rejections, including data corrections and resubmission.' },
  { icon: ClipboardList, title: 'Supplier Declaration Collection', desc: 'Systematic collection of supplier declarations and material data across your supply chain.' },
  { icon: Database, title: 'IMDS Data Management', desc: 'Ongoing management and maintenance of IMDS data, including updates and corrections.' },
  { icon: Settings, title: 'CDX Setup & Support', desc: 'Complete CDX platform setup and ongoing support for material data exchange requirements.' },
];

export default function ImdsCdx() {
  return (
    <>
      <SEO
        title={"IMDS & CDX Support: MDS Creation, Submission & Rejection Resolution"}
        description="End-to-end IMDS, CDX and CAMDS support for suppliers: account setup, material data sheet (MDS) creation, submission, customer approval and rejection handling."
        path="/imds-cdx"
      />
      <PageHero
        title="IMDS & CDX Support"
        subtitle="Complete support throughout the IMDS/CDX lifecycle — from account setup to MDS creation, submission, customer approval and rejection resolution."
        image={IMAGES.engineDetail}
        breadcrumb="IMDS & CDX"
      />

      {/* Intro */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
                IMDS & CDX
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                IMDS & CDX Support From Data Collection to Customer Approval
              </h2>
              <p className="mt-5 text-base text-gray-600 leading-relaxed">
                IMDS (International Material Data System) and CDX (Corporate Data Exchange) are
                critical platforms for material data reporting in the automotive and industrial
                sectors. GS Comply supports manufacturers throughout the entire lifecycle.
              </p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                From initial account setup and product/BOM review through material mapping,
                supplier data collection, MDS creation, validation, submission and customer
                approval — we handle every step of the process.
              </p>
              <a
                href={company.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-7 inline-flex items-center gap-2 px-6 py-3 bg-[#1A6B3C] text-white text-sm font-semibold rounded-md hover:bg-[#155a32] transition-colors"
              >
                Discuss Your Requirement
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
            <div className="relative">
              <img loading="lazy" decoding="async"
                src={IMAGES.engineComponents}
                srcSet={srcSet(IMAGES.engineComponents)}
                sizes="(min-width: 1024px) 50vw, 100vw"
                alt="IMDS material data management"
                className="rounded-2xl shadow-xl w-full object-cover h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Our Process
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              The IMDS/CDX lifecycle
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              A structured 8-step process covering everything from initial setup to final
              customer approval.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {timelineSteps.map((step, i) => (
              <div
                key={step.num}
                className="relative p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-11 h-11 rounded-full bg-[#1A6B3C] flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold text-gray-200">{step.num}</span>
                </div>
                <h3 className="text-sm font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
                {i < timelineSteps.length - 1 && i % 4 !== 3 && (
                  <ArrowRight className="hidden lg:block absolute top-1/2 -right-3 w-5 h-5 text-gray-300" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Full Capabilities
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Complete IMDS & CDX support
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {capabilities.map((cap) => (
              <div
                key={cap.title}
                className="group flex items-start gap-4 p-6 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#1A6B3C]/30 hover:bg-white hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1A6B3C] transition-colors">
                  <cap.icon className="w-5 h-5 text-[#1A6B3C] group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{cap.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{cap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAMDS */}
      <section id="camds" className="scroll-mt-28 py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">Also supported</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
              CAMDS: China Automotive Material Data System
            </h2>
            <p className="mt-5 text-base text-gray-600 leading-relaxed">
              CAMDS is the material data platform used in China's automotive industry, operated by CATARC (China
              Automotive Technology and Research Center). Like IMDS, it collects material and substance data for vehicle
              parts, and it supports China's end-of-life vehicle requirements, including restrictions on substances such as
              lead, mercury, cadmium and hexavalent chromium.
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              If you supply parts to a Chinese vehicle manufacturer, or to a global OEM that builds vehicles in China,
              you may be asked to submit your material data in CAMDS as well as, or instead of, IMDS. The data
              you already hold for IMDS is a strong starting point, so we reuse it wherever we can.
            </p>
          </div>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Users, title: 'Access & account guidance', desc: 'Help getting access to the platform and setting up your supplier account and users.' },
              { icon: Layers, title: 'Material data entry & structuring', desc: 'Structuring parts, materials and substances correctly, and entering them into the system.' },
              { icon: FileCheck, title: 'Data validation', desc: 'Checking material and substance data for completeness and consistency before you submit.' },
              { icon: Send, title: 'Submission', desc: 'Submitting completed data to your customer through the platform.' },
              { icon: ClipboardList, title: 'Customer approval follow-up', desc: 'Tracking the review, answering questions and supplying extra information when requested.' },
              { icon: RefreshCw, title: 'Rejection analysis & correction', desc: 'Finding why a submission was rejected, correcting the data and resubmitting.' },
            ].map((item) => (
              <div key={item.title} className="group flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-100 hover:border-[#1A6B3C]/30 hover:shadow-md transition-all">
                <div className="w-11 h-11 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center shrink-0 group-hover:bg-[#1A6B3C] transition-colors">
                  <item.icon className="w-5 h-5 text-[#1A6B3C] group-hover:text-white transition-colors" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a
              href={company.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A6B3C] text-white text-sm font-semibold rounded-md hover:bg-[#155a32] transition-colors"
            >
              Discuss Your Requirement
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
            <p className="text-sm text-gray-500">Requirements and access rules are set by your customer and the platform operator.</p>
          </div>
        </div>
      </section>

      <CTABanner
        title="Need IMDS, CDX or CAMDS support?"
        subtitle="Whether you're setting up a new account or resolving rejections on existing submissions, our IMDS specialists can help."
      />
    </>
  );
}
