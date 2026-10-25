import {
  GraduationCap,
  Users,
  Monitor,
  UserCheck,
  Video,
  ShieldCheck,
  Database,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { IMAGES } from '@/lib/images';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import SEO from '@/components/SEO';

const formats = [
  { icon: Users, title: 'Classroom Training', desc: 'Instructor-led sessions for your team, at your site or ours, with room for discussion of your own products and cases.' },
  { icon: UserCheck, title: 'Individual Training', desc: 'One-to-one sessions for a person who needs to get productive quickly on a regulation or platform.' },
  { icon: Monitor, title: 'Online Live Training', desc: 'Live remote sessions for teams spread across sites, plants or time zones.' },
  { icon: Video, title: 'Online Recorded Training', desc: 'Recorded sessions your team can watch on their own schedule and revisit when needed.' },
];

const topics = [
  { icon: ShieldCheck, title: 'Regulations', items: ['REACH and SVHC', 'RoHS', 'PFAS', 'SCIP notifications'] },
  { icon: Database, title: 'Platforms', items: ['IMDS', 'CDX', 'CAMDS', 'MDS creation and rejection handling'] },
  { icon: Leaf, title: 'Sustainability', items: ['Life Cycle Assessment (LCA)', 'Product Carbon Footprint (PCF)', 'CSRD and ESG data'] },
];

const audiences = ['Compliance teams', 'Engineering', 'Procurement', 'Quality'];

export default function TrainingServices() {
  return (
    <>
      <SEO
        title="Training Services: Classroom & Online Compliance Training"
        description="Classroom, individual and online compliance training for manufacturers: regulations (REACH, RoHS, PFAS), platforms (IMDS, CDX, CAMDS) and sustainability (LCA, PCF, CSRD)."
        path="/training-services"
      />
      <PageHero
        title="Training Services"
        subtitle="Build compliance skills inside your own team, in the format that suits you: classroom, individual or online."
        image={IMAGES.workersReviewing}
        breadcrumb="Training Services"
      />

      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="min-w-0">
              <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">Training</span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                Practical training for compliance, engineering, procurement and quality teams
              </h2>
              <p className="mt-5 text-base text-gray-600 leading-relaxed">
                Compliance knowledge often sits with one or two people. Our training spreads it across your team, using
                the regulations, platforms and sustainability topics your products and customers actually require.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {audiences.map((a) => (
                  <li key={a} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1A6B3C]/5 border border-[#1A6B3C]/15 text-sm font-medium text-[#1A6B3C]">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />{a}
                  </li>
                ))}
              </ul>
            </div>
            <img
              loading="lazy"
              decoding="async"
              src={IMAGES.engineerReviewing}
              alt="Team reviewing compliance documents during a training session"
              width={1200}
              height={800}
              className="rounded-2xl shadow-xl w-full min-w-0 max-w-full object-cover h-[360px]"
            />
          </div>
        </div>
      </section>

      <section id="formats" className="scroll-mt-28 py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">Formats</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">Classroom and online training</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {formats.map((f) => (
              <div key={f.title} className="p-7 rounded-xl bg-white border border-gray-100 hover:border-[#1A6B3C]/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center mb-5">
                  <f.icon className="w-6 h-6 text-[#1A6B3C]" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2.5">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="topics" className="scroll-mt-28 py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">Topics</span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">What the training covers</h2>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Content is agreed with you before we start, so sessions focus on what your team needs.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {topics.map((t) => (
              <div key={t.title} className="p-8 rounded-xl bg-gradient-to-br from-[#1A6B3C]/5 to-gray-50 border border-[#1A6B3C]/10">
                <div className="w-14 h-14 rounded-xl bg-[#1A6B3C] flex items-center justify-center mb-5">
                  <t.icon className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t.title}</h3>
                <ul className="space-y-2">
                  {t.items.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <GraduationCap className="w-4 h-4 text-[#1A6B3C] shrink-0 mt-0.5" aria-hidden="true" />{i}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner
        title="Plan a training for your team"
        subtitle="Tell us your team size, topics and preferred format. We will come back with a proposal."
      />
    </>
  );
}
