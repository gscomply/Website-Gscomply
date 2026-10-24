import {
  Factory,
  ShieldCheck,
  Settings,
  Cpu,
  PackageCheck,
  Layers,
  FileCheck,
  Globe2,
  Leaf,
  Truck,
  Microscope,
  FlaskConical,
  Recycle,
  Boxes,
  Battery,
  Train,
  Ship,
  Wrench,
  Wifi,
} from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { slugify } from '@/lib/blog';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import SEO from '@/components/SEO';

const industries = [
  { name: 'Automotive', icon: Factory, desc: 'IMDS, ELV, REACH, RoHS and customer-specific requirements for OEM and tier suppliers.', image: IMAGES.heroManufacturing },
  { name: 'Aerospace & Defense', icon: ShieldCheck, desc: 'Material compliance, substance declarations and regulatory documentation for aerospace programs.', image: IMAGES.aerospaceFactory },
  { name: 'Heavy Equipment', icon: Settings, desc: 'Compliance support for construction, mining and agricultural equipment manufacturers.', image: IMAGES.industrialMachinery },
  { name: 'Electrical & Electronics', icon: Cpu, desc: 'RoHS, REACH, material declarations and supply chain compliance for electronics.', image: IMAGES.circuitBoard },
  { name: 'HVAC', icon: PackageCheck, desc: 'Regulatory compliance and material data management for heating, ventilation and cooling systems.', image: IMAGES.mechanicalGears },
  { name: 'Industrial Equipment', icon: Layers, desc: 'Compliance documentation and supply chain data collection for industrial machinery.', image: IMAGES.factoryFloor },
  { name: 'Machinery', icon: Settings, desc: 'CE-related requirements, material declarations and regulatory compliance for machinery.', image: IMAGES.industrialGears },
  { name: 'Medical', icon: FileCheck, desc: 'Material compliance, substance data and regulatory documentation for medical device manufacturers.', image: IMAGES.medicalDevice },
  { name: 'Telecom', icon: Globe2, desc: 'RoHS, REACH and material declaration support for telecommunications equipment.', image: IMAGES.circuitBoard2 },
  { name: 'Renewable Energy', icon: Leaf, desc: 'Sustainability reporting, material compliance and environmental data for renewable energy.', image: IMAGES.windTurbines },
  { name: 'Semiconductors', icon: Cpu, desc: 'Substance compliance, material declarations and supply chain data for semiconductor manufacturing.', image: IMAGES.microchip },
  { name: 'Chemicals', icon: FlaskConical, desc: 'REACH, TSCA and regulatory compliance support for chemical manufacturers.', image: IMAGES.pharmaceutical },
  { name: 'Plastics', icon: Recycle, desc: 'Material composition data, substance declarations and regulatory compliance for plastics.', image: IMAGES.productionLine },
  { name: 'Metals', icon: Boxes, desc: 'Material declarations, IMDS support and supply chain compliance for metal component manufacturers.', image: IMAGES.engineComponents },
  { name: 'Batteries', icon: Battery, desc: 'EU Battery Regulation, material data, sustainability reporting and supply chain compliance.', image: IMAGES.microchip2 },
  { name: 'Packaging', icon: PackageCheck, desc: 'PPWR, material compliance and packaging waste regulation support for manufacturers.', image: IMAGES.cargoContainers },
  { name: 'Railways', icon: Train, desc: 'Material compliance, substance declarations and regulatory documentation for rail industry.', image: IMAGES.cargoShip },
  { name: 'Marine', icon: Ship, desc: 'Material compliance, environmental regulations and supply chain data for marine equipment.', image: IMAGES.cargoShip },
  { name: 'Automation', icon: Wrench, desc: 'RoHS, REACH and material declaration support for industrial automation systems.', image: IMAGES.conveyorSystem },
  { name: 'IoT', icon: Wifi, desc: 'Regulatory compliance, material data and supply chain declarations for IoT devices.', image: IMAGES.pcbDetail },
];

export default function Industries() {
  return (
    <>
      <SEO
        title={"Industries We Support: Compliance for Manufacturers"}
        description="Compliance support for automotive, aerospace, electronics, medical, batteries, machinery and 15+ other manufacturing industries: REACH, RoHS, IMDS, SCIP and more."
        path="/industries"
      />
      <PageHero
        title="Industries We Support"
        subtitle="Compliance support tailored to the specific regulatory and material requirements of each manufacturing industry."
        image={IMAGES.shippingPort}
        breadcrumb="Industries"
      />

      {/* Industry Grid */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Industries
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Compliance Support Across Manufacturing Industries
            </h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              We understand that each industry faces unique regulatory challenges. Our support
              is tailored to the specific requirements of your sector — we do not assume that
              every regulation applies to every industry.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industries.map((industry) => (
              <div
                key={industry.name}
                id={slugify(industry.name)}
                className="scroll-mt-28 group rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all overflow-hidden"
              >
                <div className="relative h-40 overflow-hidden">
                  <img loading="lazy" decoding="async"
                    src={industry.image}
                    alt={industry.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent" />
                  <div className="absolute bottom-3 left-4 flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-[#1A6B3C] flex items-center justify-center">
                      <industry.icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white">{industry.name}</h3>
                  </div>
                </div>
                <p className="p-5 text-sm text-gray-600 leading-relaxed">{industry.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 leading-relaxed">
            Not all regulations apply to every industry. We assess your specific products, markets,
            and customer requirements to determine which regulations are relevant to your business.
          </p>
        </div>
      </section>

      <CTABanner
        title="Need compliance support for your industry?"
        subtitle="Tell us about your products and markets. We'll help you understand which regulations apply and how to manage them efficiently."
      />
    </>
  );
}
