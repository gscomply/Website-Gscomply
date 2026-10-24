import { Link } from 'react-router-dom';
import {
  Leaf,
  ArrowRight,
  Recycle,
  Globe2,
  TrendingDown,
  FileBarChart,
  Factory,
  Sprout,
  Droplets,
  Wind,
} from 'lucide-react';
import { IMAGES } from '@/lib/images';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import SEO from '@/components/SEO';

const sustainabilityServices = [
  { icon: FileBarChart, title: 'Sustainability Data Collection', desc: 'Systematic collection of sustainability data from suppliers and internal sources, structured for reporting and analysis.' },
  { icon: TrendingDown, title: 'Carbon Accounting', desc: 'Support for carbon footprint calculation, Scope 1, 2 and 3 emissions data collection, and carbon reporting requirements.' },
  { icon: Recycle, title: 'LCA Support', desc: 'Life Cycle Assessment support — gathering material and process data to support environmental impact analysis.' },
  { icon: Factory, title: 'Environmental Reporting', desc: 'Preparation and management of environmental reports required by regulations, customers, or corporate sustainability programs.' },
  { icon: Globe2, title: 'ESG Data Support', desc: 'Collection and structuring of Environmental, Social and Governance data for ESG reporting frameworks.' },
  { icon: Leaf, title: 'Regulatory Sustainability Requirements', desc: 'Support for emerging sustainability regulations including CBAM, PPWR, EU Battery Regulation and related requirements.' },
];

const regulations = [
  { name: 'CBAM', desc: 'Carbon Border Adjustment Mechanism — carbon pricing on imported goods to the EU.' },
  { name: 'PPWR', desc: 'Packaging and Packaging Waste Regulation — EU requirements for packaging sustainability and recyclability.' },
  { name: 'EU Battery Regulation', desc: 'Sustainability, safety and labeling requirements for batteries and waste batteries.' },
  { name: 'CSRD', desc: 'Corporate Sustainability Reporting Directive — EU sustainability reporting framework.' },
];

const pillars = [
  { icon: Sprout, title: 'Environmental', desc: 'Carbon emissions, energy use, water consumption, waste management and ecological impact data.' },
  { icon: Globe2, title: 'Social', desc: 'Supply chain transparency, labor practices, health and safety, and community impact reporting.' },
  { icon: Factory, title: 'Governance', desc: 'Compliance management, ethics, risk management and regulatory reporting structures.' },
];

export default function Sustainability() {
  return (
    <>
      <SEO
        title={"Sustainability Support: LCA, Carbon Footprint, CBAM & ESG Data"}
        description="Support for sustainability data collection, carbon accounting, LCA, environmental reporting, ESG data and regulatory requirements such as CBAM and PPWR."
        path="/sustainability"
      />
      <PageHero
        title="Sustainability Support"
        subtitle="Support for sustainability data collection, carbon accounting, LCA support, environmental reporting, ESG data and regulatory sustainability requirements."
        image={IMAGES.windTurbines}
        breadcrumb="Sustainability"
      />

      {/* Intro */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <img loading="lazy" decoding="async"
                src={IMAGES.windTurbines3}
                alt="Renewable energy and sustainability"
                className="rounded-2xl shadow-xl w-full object-cover h-[400px]"
              />
            </div>
            <div>
              <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
                Sustainability
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Turning sustainability data into structured reporting
              </h2>
              <p className="mt-5 text-base text-gray-600 leading-relaxed">
                Sustainability requirements are becoming increasingly regulated and complex.
                Manufacturers need to collect, validate and report environmental data across
                their supply chains — from carbon emissions to material composition and
                packaging information.
              </p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                GS Comply helps manufacturers manage this data collection process, prepare
                sustainability reports, and meet emerging regulatory requirements with a
                structured, repeatable approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Our Sustainability Services
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Comprehensive sustainability support
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sustainabilityServices.map((service) => (
              <div
                key={service.title}
                className="group p-7 rounded-xl bg-white border border-gray-100 hover:border-[#1A6B3C]/30 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center mb-5 group-hover:bg-[#1A6B3C] transition-colors">
                  <service.icon className="w-6 h-6 text-[#1A6B3C] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2.5">{service.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESG Pillars */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              ESG Framework
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Supporting the three pillars of ESG
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {pillars.map((pillar) => (
              <div key={pillar.title} className="p-8 rounded-xl bg-gradient-to-br from-[#1A6B3C]/5 to-gray-50 border border-[#1A6B3C]/10">
                <div className="w-14 h-14 rounded-xl bg-[#1A6B3C] flex items-center justify-center mb-5">
                  <pillar.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{pillar.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulations */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Sustainability Regulations
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Regulatory sustainability requirements we support
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            {regulations.map((reg) => (
              <div
                key={reg.name}
                className="flex items-start gap-4 p-6 rounded-xl bg-white border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="w-11 h-11 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center shrink-0">
                  <Leaf className="w-5 h-5 text-[#1A6B3C]" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1.5">{reg.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{reg.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Need sustainability compliance support?"
        subtitle="From carbon data collection to ESG reporting, we help manufacturers meet their sustainability obligations with structured processes."
      />
    </>
  );
}
