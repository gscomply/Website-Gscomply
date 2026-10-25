import { Link } from 'react-router-dom';
import { ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { slugify } from '@/lib/blog';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import SEO from '@/components/SEO';
import { regulationCategories } from '@/data/regulations';

export default function Regulations() {
  return (
    <>
      <SEO
        title={"Regulations We Cover: REACH, RoHS, PFAS, IMDS, SCIP"}
        description="Understand REACH, RoHS, PFAS, SCIP, IMDS, CDX, CMRT, CBAM, PPWR and the EU Battery Regulation. We help manufacturers collect data and keep compliance documentation ready."
        path="/regulations"
      />
      <PageHero
        title="Regulations"
        subtitle="We help manufacturers understand applicable requirements, collect the right information and maintain the documentation needed to support customers and global market access."
        image={IMAGES.architectBlueprints}
        breadcrumb="Regulations"
      />

      {/* Categories */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Regulations We Support
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Navigate Complex Global Regulations With Confidence
            </h2>
          </div>
          <div className="space-y-12">
            {regulationCategories.map((cat) => (
              <div key={cat.category}>
                <h3 className="text-lg font-bold text-gray-900 mb-5 pb-3 border-b border-gray-100">
                  {cat.category}
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {cat.items.map((item) => (
                    <div
                      key={item.name}
                      id={slugify(item.name)}
                      className="scroll-mt-28 group p-5 rounded-xl bg-gray-50 border border-gray-100 hover:border-[#1A6B3C]/30 hover:bg-white hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <ShieldCheck className="w-5 h-5 text-[#1A6B3C] shrink-0 mt-0.5" />
                        <h4 className="text-base font-semibold text-gray-900">{item.name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed pl-8">{item.desc}</p>
                      <p className="mt-3 ml-8 pl-3 border-l-2 border-amber-300 text-[13px] text-gray-600 leading-relaxed">
                        <strong className="text-gray-800">If not complied: </strong>{item.consequence}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="flex items-start gap-3 p-5 rounded-xl bg-white border border-gray-100">
            <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500 leading-relaxed">
              GS Comply Solutions provides compliance support and documentation assistance. We do
              not issue official government certifications. Penalties vary by country and case and are described here in general terms only; they are not legal advice. Certification and official declarations
              must be obtained through the appropriate regulatory bodies and notified bodies.
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
