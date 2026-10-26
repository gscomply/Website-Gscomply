import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Calendar,
  PackageCheck,
  Layers,
  Leaf,
  Truck,
  Database,
  ShieldCheck,
  Globe2,
  FileCheck,
  Users,
  Settings,
  ClipboardCheck,
  TrendingUp,
  Eye,
  Cpu,
  Factory,
  Award,
  Briefcase,
  BookOpen,
  Lightbulb,
  Handshake,
} from 'lucide-react';
import SEO from '@/components/SEO';
import CTABanner from '@/components/CTABanner';
import { credentials, company } from '@/data/company';
import { IMAGES, srcSet } from '@/lib/images';

const whyPartner = [
  { icon: ShieldCheck, title: 'Proven Expertise', desc: 'Deep industry knowledge and global experience' },
  { icon: Users, title: 'Trusted by Industry', desc: 'Long-term partnerships built on reliability' },
  { icon: Lightbulb, title: 'Smart & Efficient', desc: 'Streamlined processes for better outcomes' },
  { icon: Settings, title: 'Customized Approach', desc: 'Solutions designed for your unique needs' },
  { icon: Globe2, title: 'Global Reach', desc: 'Supporting businesses across borders' },
  { icon: Handshake, title: 'Integrity Always', desc: 'Transparent, ethical and dependable' },
  { icon: TrendingUp, title: 'Long-Term Value', desc: 'Your success is our priority' },
];

const aboutHighlights = [
  { icon: Factory, title: 'Manufacturer-Focused', desc: 'Built around the realities of production environments and engineering teams, not generic legal advisory.' },
  { icon: Cpu, title: 'Technical Expertise', desc: 'Deep understanding of material compositions, substance data, and the regulatory frameworks that apply to them.' },
  { icon: Globe2, title: 'Global Regulatory Knowledge', desc: 'Coverage across EU, North America, Asia and other international markets with region-specific requirements.' },
  { icon: Settings, title: 'Practical Execution', desc: 'From SVHC screening and MDS creation to SCIP notifications and customer submission, we do the work.' },
  { icon: Users, title: 'Supplier Engagement', desc: 'Structured data request processes, follow-up cycles, and validation of supplier-provided declarations.' },
  { icon: FileCheck, title: 'Customer Approval Support', desc: 'We resolve MDS rejections, respond to customer clarifications, and drive submissions to approval.' },
];

const services = [
  { icon: PackageCheck, title: 'Product & Material Compliance', desc: 'Technical documentation, declarations of conformity, and market access requirements for your products. Material composition analysis, substance data collection, and regulatory material declarations. REACH, RoHS, SCIP, TSCA, POPs, California Proposition 65, PFAS and other applicable requirements' },
  { icon: Database, title: 'IMDS & CDX', desc: 'Account setup, MDS creation, supplier data validation, submission, and rejection resolution.' },
  { icon: Truck, title: 'Supply Chain Compliance', desc: 'Supplier communication, CMRT and EMRT collection, data validation, and documentation management.' },
  { icon: Leaf, title: 'Sustainability Services', desc: 'Life Cycle Assessment (LCA), Product Carbon Footprint (PCF), carbon accounting, ESG reporting, CBAM and PPWR.' },
];

const regulations = [
  'REACH / SVHC', 'RoHS', 'SCIP', 'IMDS', 'CDX', 'TSCA', 'POPs',
  'California Proposition 65', 'PFAS', 'CMRT', 'EMRT', 'IEC 62474',
  'EU Battery Regulation', 'ELV', 'CBAM', 'PPWR', 'CE Requirements', 'China RoHS',
];

const industriesGrid = [
  { name: 'Automotive', icon: Factory },
  { name: 'Aerospace & Defense', icon: ShieldCheck },
  { name: 'Heavy Equipment', icon: Settings },
  { name: 'Electrical & Electronics', icon: Cpu },
  { name: 'HVAC', icon: PackageCheck },
  { name: 'Industrial Equipment', icon: Layers },
  { name: 'Machinery', icon: Settings },
  { name: 'Medical Devices', icon: FileCheck },
  { name: 'Telecom', icon: Globe2 },
  { name: 'Renewable Energy', icon: Leaf },
  { name: 'Semiconductors', icon: Cpu },
  { name: 'Chemicals', icon: PackageCheck },
];

const processSteps = [
  { num: '01', title: 'Understand', desc: 'We review your products, markets, customers and applicable regulatory requirements.' },
  { num: '02', title: 'Assess', desc: 'We audit your available technical, material and supplier information to identify gaps.' },
  { num: '03', title: 'Collect', desc: 'We coordinate with suppliers and internal stakeholders to obtain missing declarations and data.' },
  { num: '04', title: 'Validate', desc: 'We check all collected information against the applicable regulatory requirements.' },
  { num: '05', title: 'Support', desc: 'We prepare documentation, manage submissions, and provide ongoing compliance support.' },
];

const impactCards = [
  { icon: ClipboardCheck, title: 'Reduce Repetitive Work', desc: 'Cut manual supplier follow-ups and compliance administration with a structured data collection process.' },
  { icon: FileCheck, title: 'Faster Customer Approvals', desc: 'Improve the quality and completeness of MDS submissions to reduce rejection cycles.' },
  { icon: Eye, title: 'Improve Data Visibility', desc: 'Bring regulatory and material information into a structured, auditable format.' },
  { icon: Cpu, title: 'Reduce Engineering Workload', desc: 'Free engineering and quality teams to focus on core activities instead of compliance admin.' },
  { icon: Users, title: 'Strengthen Supplier Collaboration', desc: 'Create a consistent process for collecting and validating supplier declarations.' },
];

const imdsSteps = [
  'Account Setup', 'Product & BOM Review', 'Material & Substance Mapping',
  'Supplier Data Collection', 'MDS Creation & Validation', 'Submission',
  'Customer Review', 'Rejection Resolution & Approval',
];

const credentialsItems = [
  { icon: Award, label: 'Years of Experience', value: credentials.yearsExperience },
  { icon: Database, label: 'MDS Submissions Handled', value: credentials.mdsSubmissions },
  { icon: Briefcase, label: 'Industries Served', value: credentials.industriesServed },
  { icon: BookOpen, label: 'Regulations Covered', value: credentials.regulationsCovered },
];

export default function Home() {
  return (
    <>
      <SEO
        title="Global Product & Material Compliance Services | GS Comply Solutions"
        description="GS Comply Solutions helps manufacturers navigate REACH, RoHS, PFAS, IMDS, SCIP and more. Expert product compliance consulting for global industries."
        path="/"
      />

      {/* HERO */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-gradient-to-br from-[#155a32] via-[#1A6B3C] to-[#0d3d22]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(white 1px, transparent 1px),
              linear-gradient(90deg, white 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-0 w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white/10 border border-white/20 rounded-full mb-6">
                <ShieldCheck className="w-4 h-4 text-[#4ade80]" />
                <span className="text-xs font-medium text-[#4ade80] tracking-wide">
                  Regulatory Compliance for Manufacturers
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.1] tracking-tight">
                Global Compliance Support for Manufacturers
              </h1>
              <p className="mt-6 text-base lg:text-lg text-gray-200 leading-relaxed">
                We help manufacturers manage product, material, environmental and regulatory
                requirements across global markets. From SVHC screening and MDS creation to
                SCIP notifications and customer approvals.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-[#1A6B3C] text-sm font-semibold rounded-md hover:bg-gray-50 transition-colors shadow-lg"
                >
                  Discuss Your Requirement
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href={company.calendlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent text-white text-sm font-semibold rounded-md border border-white/30 hover:bg-white/10 transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Book a 30-min Call
                </a>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img {...({ fetchpriority: "high" } as Record<string, string>)} decoding="async"
                src={IMAGES.engineDetail}
                srcSet={srcSet(IMAGES.engineDetail)}
                sizes="(min-width: 1024px) 512px, 100vw"
                alt="Automotive engine components representing the type of products GS Comply helps manufacturers certify for compliance"
                width={500}
                height={400}
                className="w-full max-w-lg rounded-2xl shadow-2xl object-cover h-[260px] sm:h-[320px] lg:h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY PARTNER WITH GS COMPLY */}
      <section
        aria-labelledby="why-partner-heading"
        className="relative overflow-hidden py-14 lg:py-16 bg-gradient-to-br from-[#0b3b24] via-[#06231a] to-[#04150f]"
      >
        {/* faint dotted "world map" glow, top right */}
        <div
          aria-hidden="true"
          className="absolute -right-10 -top-10 w-[55%] h-[70%] opacity-[0.16] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #86efac 1px, transparent 1.4px)',
            backgroundSize: '9px 9px',
            WebkitMaskImage: 'radial-gradient(ellipse at 70% 40%, #000 0%, transparent 70%)',
            maskImage: 'radial-gradient(ellipse at 70% 40%, #000 0%, transparent 70%)',
          }}
        />
        {/* soft green glow, top left */}
        <div aria-hidden="true" className="absolute -left-24 -top-24 w-[420px] h-[420px] rounded-full bg-[#1A6B3C]/30 blur-3xl pointer-events-none" />
        {/* flowing wave lines, bottom */}
        <svg aria-hidden="true" className="absolute inset-x-0 bottom-0 w-full h-24 pointer-events-none" viewBox="0 0 1440 120" preserveAspectRatio="none" fill="none">
          <path d="M0 95 C 250 20, 480 20, 760 75 S 1220 110, 1440 40" stroke="#34d399" strokeOpacity="0.28" strokeWidth="1.2" />
          <path d="M0 110 C 300 60, 560 50, 820 95 S 1250 115, 1440 70" stroke="#34d399" strokeOpacity="0.18" strokeWidth="1" />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-4">
              <span className="hidden sm:block h-px w-16 bg-[#4ade80]/60" />
              <p className="text-xs sm:text-sm font-semibold text-[#4ade80] uppercase tracking-[0.2em]">
                Why Partner with GS Comply Solutions
              </p>
              <span className="hidden sm:block h-px w-16 bg-[#4ade80]/60" />
            </div>
            <h2 id="why-partner-heading" className="mt-5 text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Your Trusted Partner for a
              <span className="block text-[#4ade80]">Safer, Compliant &amp; Sustainable Tomorrow</span>
            </h2>
            <p className="mt-4 text-sm lg:text-base text-gray-300">
              Built on experience. Driven by expertise. Focused on your success.
            </p>
          </div>

          <ul className="mt-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-y-10">
            {whyPartner.map((item) => (
              <li
                key={item.title}
                className="flex flex-col items-center text-center px-3 lg:border-l lg:border-[#4ade80]/15 lg:first:border-l-0"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-b from-[#1f8a4f] to-[#0f4d2c] border border-white/10 shadow-lg shadow-black/30 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-white" strokeWidth={1.6} />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-white leading-tight">{item.title}</h3>
                <p className="mt-1.5 text-xs text-gray-400 leading-relaxed max-w-[150px]">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CREDENTIALS STRIP */}
      <section className="bg-white py-10 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {credentialsItems.map((item) => (
              <div key={item.label} className="text-center">
                <div className="w-12 h-12 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-6 h-6 text-[#1A6B3C]" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900">{item.value}</div>
                <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
                About GS Comply
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Compliance support built for manufacturing teams
              </h2>
              <p className="mt-5 text-base text-gray-600 leading-relaxed">
                GS Comply Solutions works with engineering, quality, procurement, sourcing,
                sustainability and regulatory teams to simplify compliance activities and
                reduce repetitive workload.
              </p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                We do not just advise on requirements. We collect supplier data, create MDS
                entries, prepare SCIP notifications, conduct SVHC screenings, and manage
                submissions through to customer approval.
              </p>
              <Link
                to="/about"
                className="mt-5 py-2 inline-flex items-center gap-2 text-sm font-semibold text-[#1A6B3C] hover:gap-3 transition-all"
              >
                Learn More About GS Comply
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {aboutHighlights.map((item) => (
                <div key={item.title} className="p-5 rounded-xl border border-gray-100 hover:border-[#1A6B3C]/20 hover:shadow-md transition-all bg-gray-50/50">
                  <div className="w-10 h-10 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center mb-3">
                    <item.icon className="w-5 h-5 text-[#1A6B3C]" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Our Services
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Compliance services with defined deliverables
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Each service produces specific outputs: MDS files, SCIP notification confirmations,
              SVHC screening reports, supplier declaration sets, and technical documentation files.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="group p-7 rounded-xl bg-white border border-gray-100 hover:border-[#1A6B3C]/30 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center mb-5 group-hover:bg-[#1A6B3C] transition-colors">
                  <service.icon className="w-6 h-6 text-[#1A6B3C] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2.5">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
            <div className="group p-7 rounded-xl bg-[#1A6B3C] border border-[#1A6B3C] flex flex-col justify-center items-center text-center hover:shadow-lg transition-all duration-300">
              <Database className="w-10 h-10 text-white mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Compliance Data Management</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-5">
                Centralized management of regulatory, material and supplier compliance information.
              </p>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:gap-3 transition-all"
              >
                View All Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* REGULATIONS */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Regulations
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Navigate global regulations with confidence
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              We help manufacturers understand applicable requirements, collect the right
              information, and maintain the documentation needed to support customers and
              global market access.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
            {regulations.map((reg) => (
              <span
                key={reg}
                className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-[#1A6B3C]/5 hover:border-[#1A6B3C]/30 hover:text-[#1A6B3C] transition-all cursor-default"
              >
                {reg}
              </span>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/regulations"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A6B3C] hover:gap-3 transition-all"
            >
              View All Regulations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* IMDS & CDX FEATURE */}
      <section className="py-20 lg:py-28 bg-gray-950 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(white 1px, transparent 1px),
              linear-gradient(90deg, white 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <span className="text-xs font-semibold text-[#4ade80] uppercase tracking-wider">
                IMDS & CDX
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
                IMDS & CDX support from data collection to customer approval
              </h2>
              <p className="mt-5 text-base text-gray-400 leading-relaxed">
                We support manufacturers through the full IMDS and CDX lifecycle: account setup,
                BOM review, material mapping, supplier data collection, MDS creation, validation,
                submission, and rejection resolution.
              </p>
              <Link
                to="/contact"
                className="mt-7 inline-flex items-center gap-2 px-6 py-3 bg-[#1A6B3C] text-white text-sm font-semibold rounded-md hover:bg-[#155a32] transition-colors"
              >
                Talk to an IMDS Specialist
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex justify-center">
              <img
                src={IMAGES.engineGears}
                srcSet={srcSet(IMAGES.engineGears)}
                sizes="(min-width: 1024px) 512px, 100vw"
                alt="Close-up view of a modern car engine showing gears and mechanical components, representing the detailed material data managed in IMDS"
                width={600}
                height={500}
                loading="lazy"
                className="w-full max-w-lg rounded-2xl shadow-xl object-cover h-[420px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Industries
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Compliance support across manufacturing industries
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {industriesGrid.map((industry) => (
              <div
                key={industry.name}
                className="group p-5 rounded-xl bg-white border border-gray-100 hover:border-[#1A6B3C]/30 hover:shadow-md transition-all text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1A6B3C] transition-colors">
                  <industry.icon className="w-6 h-6 text-[#1A6B3C] group-hover:text-white transition-colors" />
                </div>
                <span className="text-xs font-medium text-gray-700 leading-tight block">
                  {industry.name}
                </span>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/industries"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#1A6B3C] hover:gap-3 transition-all"
            >
              View All Industries
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              How We Work
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              A structured approach to compliance
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {processSteps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < processSteps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-0.5 bg-gradient-to-r from-[#1A6B3C]/30 to-transparent" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-full bg-[#1A6B3C]/10 flex items-center justify-center mb-4">
                    <span className="text-lg font-bold text-[#1A6B3C]">{step.num}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BUSINESS IMPACT */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Business Impact
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Turning compliance work into a structured process
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {impactCards.map((card) => (
              <div
                key={card.title}
                className="p-7 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center mb-5">
                  <card.icon className="w-6 h-6 text-[#1A6B3C]" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{card.desc}</p>
              </div>
            ))}
            <div className="p-7 rounded-xl bg-gradient-to-br from-[#1A6B3C] to-[#155a32] flex flex-col justify-center text-center">
              <TrendingUp className="w-10 h-10 text-white/90 mx-auto mb-4" />
              <h3 className="text-base font-semibold text-white mb-2">Structured Outcomes</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Transforming ad-hoc compliance tasks into a repeatable, well-managed process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* GLOBAL MARKET */}
      <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
                Global Market
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
                Supporting manufacturers across international markets
              </h2>
              <p className="mt-5 text-base text-gray-600 leading-relaxed">
                We help manufacturers navigate regulatory requirements across Europe, North
                America, Asia and global supply chains.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Europe', 'North America', 'Asia', 'Global Supply Chains'].map((region) => (
                  <span
                    key={region}
                    className="px-6 py-3 text-sm font-semibold text-[#1A6B3C] bg-[#1A6B3C]/5 border border-[#1A6B3C]/20 rounded-lg"
                  >
                    {region}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={IMAGES.shippingPort}
                srcSet={srcSet(IMAGES.shippingPort)}
                sizes="(min-width: 1024px) 512px, 100vw"
                alt="Aerial view of a busy shipping port with stacked cargo containers and cranes, representing global supply chain coverage"
                width={600}
                height={400}
                loading="lazy"
                className="w-full max-w-lg rounded-2xl shadow-xl object-cover h-[400px]"
              />
            </div>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
