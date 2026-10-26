import { CheckCircle2, Globe2, Factory, Sprout, Leaf } from 'lucide-react';
import { IMAGES, srcSet } from '@/lib/images';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import SEO from '@/components/SEO';
import { serviceCategories } from '@/data/services';

const sustainabilityServices = serviceCategories.find((c) => c.id === 'sustainability-services')!.services;

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
        title={"Sustainability Services: LCA, PCF, CBAM & ESG Data"}
        description="Sustainability services for manufacturers: Life Cycle Assessment (LCA), Product Carbon Footprint (PCF), carbon accounting, ESG and CSRD data, and CBAM and PPWR requirements."
        path="/sustainability"
      />
      <PageHero
        title="Sustainability Services"
        subtitle="Life Cycle Assessment (LCA), Product Carbon Footprint (PCF), carbon accounting, ESG data and regulatory sustainability requirements."
        image={IMAGES.windTurbines}
        breadcrumb="Sustainability Services"
      />

      {/* Intro */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <img loading="lazy" decoding="async"
                src={IMAGES.windTurbines3}
                srcSet={srcSet(IMAGES.windTurbines3)}
                sizes="(min-width: 1024px) 50vw, 100vw"
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

      {/* Services, in detail (data comes from src/data/services.ts, so the menu and this page never disagree) */}
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Our Sustainability Services
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Every sustainability service, in detail
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              What each service is, who it is for, and what you receive.
            </p>
          </div>
          <nav aria-label="Sustainability services" className="flex flex-wrap justify-center gap-2 mb-14">
            {sustainabilityServices.map((service) => (
              <a
                key={service.id}
                href={`#${service.id}`}
                className="px-4 py-2.5 text-sm font-medium text-[#1A6B3C] bg-white border border-[#1A6B3C]/15 rounded-full hover:bg-[#1A6B3C]/10 transition-colors"
              >
                {service.navLabels?.[0] ?? service.title}
              </a>
            ))}
          </nav>
          <div className="space-y-6">
            {sustainabilityServices.map((service) => (
              <article
                key={service.id}
                id={service.id}
                className="scroll-mt-28 grid lg:grid-cols-5 gap-6 lg:gap-10 p-7 lg:p-10 rounded-2xl bg-white border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="lg:col-span-3">
                  <div className="w-14 h-14 rounded-xl bg-[#1A6B3C]/10 flex items-center justify-center mb-5">
                    <service.icon className="w-7 h-7 text-[#1A6B3C]" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl lg:text-2xl font-bold text-gray-900">{service.title}</h3>
                  {service.about && <p className="mt-4 text-[15px] text-gray-600 leading-relaxed">{service.about}</p>}
                  <p className="mt-4 text-sm text-gray-500 leading-relaxed">
                    <strong className="text-gray-700">Who it is for: </strong>{service.who}
                  </p>
                </div>
                <div className="lg:col-span-2">
                  <h4 className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider mb-3">What you receive</h4>
                  <ul className="space-y-2.5">
                    {service.deliverables.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 p-3 rounded-lg bg-gray-50 border border-gray-100 text-sm text-gray-700 font-medium">
                        <CheckCircle2 className="w-5 h-5 text-[#1A6B3C] shrink-0 mt-0.5" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
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
