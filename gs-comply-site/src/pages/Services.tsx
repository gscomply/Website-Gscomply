import {
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
import { serviceCategories } from '@/data/services';

export default function Services() {
  return (
    <>
      <SEO
        title="Compliance Services | GS Comply Solutions"
        description="Product and material compliance, sustainability services (LCA, PCF, CBAM, CSRD), platform support (IMDS, CDX, CAMDS, SCIP) and training for manufacturers."
        path="/services"
      />

      <PageHero
        title="Our Services"
        subtitle="Compliance support with defined deliverables, clear timelines, and a structured approach for each engagement."
        breadcrumb="Services"
      />

      {/* Services by category */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
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

          {/* jump links to the four categories */}
          <nav aria-label="Service categories" className="flex flex-wrap justify-center gap-2 mb-16">
            {serviceCategories.map((cat) => (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                className="px-4 py-2 text-sm font-medium text-[#1A6B3C] bg-[#1A6B3C]/5 border border-[#1A6B3C]/15 rounded-full hover:bg-[#1A6B3C]/10 transition-colors"
              >
                {cat.title}
              </a>
            ))}
          </nav>

          <div className="space-y-20">
            {serviceCategories.map((cat) => (
              <div key={cat.id} id={cat.id} className="scroll-mt-28">
                <div className="mb-8 pb-5 border-b border-gray-200">
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">{cat.title}</h2>
                  <p className="mt-2 text-gray-600">{cat.intro}</p>
                </div>
                <div className="space-y-6">
                  {cat.services.map((service, idx) => (
                    <div
                      key={service.id}
                      id={service.id}
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
