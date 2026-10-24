import { Link } from 'react-router-dom';
import { ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { slugify } from '@/lib/blog';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';

const regulationCategories = [
  {
    category: 'Chemical & Substance Regulations',
    items: [
      { name: 'REACH / SVHC', desc: 'EU regulation on the Registration, Evaluation, Authorisation and Restriction of Chemicals, including Substances of Very High Concern.' },
      { name: 'TSCA', desc: 'US Toxic Substances Control Act — managing chemical substance requirements under EPA regulations.' },
      { name: 'POPs', desc: 'Persistent Organic Pollutants regulation restricting specific hazardous substances in products and articles.' },
      { name: 'California Proposition 65', desc: 'California state regulation requiring warnings for products containing listed chemicals.' },
      { name: 'PFAS', desc: 'Per- and polyfluoroalkyl substances — emerging global restrictions on PFAS in products and materials.' },
    ],
  },
  {
    category: 'Material & Product Declarations',
    items: [
      { name: 'IMDS', desc: 'International Material Data System — the global standard for material data reporting in the automotive industry.' },
      { name: 'CDX', desc: 'Corporate Data Exchange — managing material and substance data through the CDX platform.' },
      { name: 'CMRT', desc: 'Conflict Minerals Reporting Template — declaration template for 3TG (tin, tungsten, tantalum, gold).' },
      { name: 'EMRT', desc: 'Extended Materials Reporting Template — broader material declaration reporting beyond conflict minerals.' },
      { name: 'IEC 62474', desc: 'International standard for material declaration information exchange in electrotechnical products.' },
    ],
  },
  {
    category: 'Product & Market Regulations',
    items: [
      { name: 'RoHS', desc: 'Restriction of Hazardous Substances — limiting specific hazardous substances in electronic and electrical equipment.' },
      { name: 'China RoHS', desc: 'China\'s restriction of hazardous substances in electronic information products.' },
      { name: 'CE Requirements', desc: 'CE marking requirements for products placed on the European Economic Area market.' },
      { name: 'ELV', desc: 'End-of-Life Vehicles Directive — material and substance restrictions for automotive products.' },
    ],
  },
  {
    category: 'Environmental & Sustainability Regulations',
    items: [
      { name: 'SCIP', desc: 'Substances of Concern In articles as such or in complex objects (Products) — ECHA database notification requirement.' },
      { name: 'EU Battery Regulation', desc: 'Regulation on batteries and waste batteries — sustainability, safety and labeling requirements.' },
      { name: 'CBAM', desc: 'Carbon Border Adjustment Mechanism — carbon pricing on imported goods to the EU.' },
      { name: 'PPWR', desc: 'Packaging and Packaging Waste Regulation — EU requirements for packaging sustainability and recyclability.' },
    ],
  },
];

export default function Regulations() {
  return (
    <>
      <PageHero
        title="Regulations & Standards"
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
              not issue official government certifications. Certification and official declarations
              must be obtained through the appropriate regulatory bodies and notified bodies.
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
