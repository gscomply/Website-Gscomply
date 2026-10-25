import { Link } from 'react-router-dom';
import {
  Factory,
  Cpu,
  Globe2,
  Settings,
  Users,
  FileCheck,
  ArrowRight,
  Target,
  Eye,
  Handshake,
  ShieldCheck,
  Linkedin,
  Quote,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';
import SEO from '@/components/SEO';
import PageHero from '@/components/PageHero';
import CTABanner from '@/components/CTABanner';
import { team, caseStudies, testimonials,credentials } from '@/data/company'; 

// {/* To Do: Add team, caseStudies, testimonials, once enebled the testimonal and team */}

const highlights = [
  { icon: Factory, title: 'Manufacturer-Focused', desc: 'Built around the realities of production environments and engineering teams.' },
  { icon: Cpu, title: 'Technical Expertise', desc: 'Deep understanding of materials, substances, and regulatory frameworks.' },
  { icon: Globe2, title: 'Global Regulatory Knowledge', desc: 'Coverage across EU, North America, Asia and other international markets.' },
  { icon: Settings, title: 'Practical Execution', desc: 'Hands-on support from data collection to final submission and approval.' },
  { icon: Users, title: 'Supplier Engagement', desc: 'Structured processes for supplier communication and data validation.' },
  { icon: FileCheck, title: 'Customer Approval Support', desc: 'Helping you meet customer requirements and resolve rejections efficiently.' },
];

const values = [
  { icon: Target, title: 'Our Mission', desc: 'To simplify compliance for manufacturers by providing hands-on support that reduces workload and improves data quality across global regulatory requirements.' },
  { icon: Eye, title: 'Our Vision', desc: 'To be a trusted compliance partner that manufacturers rely on for navigating the increasing complexity of global product, material and environmental regulations.' },
  { icon: Handshake, title: 'Our Approach', desc: 'We work as an extension of your team, engaging with engineering, quality, procurement and sustainability functions to build structured, repeatable compliance processes.' },
];

const teamsList = [
  'Engineering Teams',
  'Quality Teams',
  'Procurement & Sourcing',
  'Sustainability Teams',
  'Regulatory Affairs',
  'Product Development',
];

export default function About() {
  return (
    <>
      <SEO
        title="About Us | GS Comply Solutions"
        description="Learn about GS Comply Solutions, a manufacturer-focused compliance consultancy with expertise in REACH, IMDS, SCIP and global regulatory support."
        path="/about"
      />

      <PageHero
        title="About GS Comply Solutions"
        subtitle="A technical compliance partner for manufacturers dealing with increasingly complex global product and material requirements."
        breadcrumb="About"
      />

      {/* Intro */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
                Who We Are
              </span>
              <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                A technical compliance partner for manufacturers
              </h2>
              <p className="mt-5 text-base text-gray-600 leading-relaxed">
                GS Comply Solutions provides regulatory and compliance support to manufacturers
                dealing with increasingly complex global product and material requirements.
              </p>
              <p className="mt-4 text-base text-gray-600 leading-relaxed">
                We work with engineering, quality, procurement, sourcing, sustainability,
                regulatory and product development teams to simplify compliance activities and
                reduce repetitive workload. Our approach is hands-on: we collect supplier data,
                create MDS entries, prepare SCIP notifications, and manage submissions through
                to customer approval.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((item) => (
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

      {/* Credentials Strip */}
      <section className="bg-[#1A6B3C] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-white">{credentials.yearsExperience}</div>
              <div className="text-xs text-white/70 mt-1">Years of Experience</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-white">{credentials.mdsSubmissions}</div>
              <div className="text-xs text-white/70 mt-1">MDS Submissions Handled</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-white">{credentials.industriesServed}</div>
              <div className="text-xs text-white/70 mt-1">Industries Served</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold text-white">{credentials.regulationsCovered}</div>
              <div className="text-xs text-white/70 mt-1">Regulations Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Approach */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((item) => (
              <div key={item.title} className="p-8 rounded-xl bg-gray-50 border border-gray-100">
                <div className="w-14 h-14 rounded-xl bg-[#1A6B3C] flex items-center justify-center mb-5">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder / Team */}
{/* TODO: Replace team member details in src/data/company.ts with real information
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              The people behind GS Comply
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="p-7 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all">
                // TODO: Replace with real photo at the path specified in company.ts 
                <div className="w-24 h-24 rounded-full bg-[#1A6B3C]/10 flex items-center justify-center mb-5 overflow-hidden">
                  {member.photo && member.photo !== '/team/founder.jpg' ? (
                    <img loading="lazy" decoding="async" src={member.photo} alt={member.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="w-10 h-10 text-[#1A6B3C]/40" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-sm font-medium text-[#1A6B3C] mt-1">{member.role}</p>
                <p className="text-xs text-gray-500 mt-1">{member.yearsExperience}</p>
                {member.bio && <p className="text-sm text-gray-600 leading-relaxed mt-4">{member.bio}</p>}
                <a
                  href={member.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#1A6B3C] hover:gap-2.5 transition-all"
                >
                  <Linkedin className="w-4 h-4" />
                  LinkedIn Profile
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
*/}

      {/* Case Studies */}
      {/* TODO: Replace anonymised case studies with real examples in src/data/company.ts 
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Case Studies
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              How we help manufacturers
            </h2>
            <p className="mt-4 text-sm text-gray-500">Anonymised examples. Real client names are withheld under NDA.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudies.map((study, i) => (
              <div key={i} className="p-7 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-2.5 mb-4">
                  <Briefcase className="w-5 h-5 text-[#1A6B3C]" />
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{study.industry}</span>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Problem</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{study.problem}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">What We Did</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{study.whatWeDid}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#1A6B3C] uppercase tracking-wider mb-1">Result</h4>
                    <p className="text-sm text-gray-700 leading-relaxed font-medium">{study.result}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
*/}
      {/* Testimonials */}
      {/* TODO: Replace placeholder testimonials with real quotes in src/data/company.ts
      <section className="py-20 lg:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              What our clients say
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {testimonials.map((t, i) => (
              <div key={i} className="p-8 rounded-xl bg-white border border-gray-100 hover:shadow-lg transition-all">
                <Quote className="w-8 h-8 text-[#1A6B3C]/20 mb-4" />
                <p className="text-base text-gray-700 leading-relaxed italic mb-6">"{t.quote}"</p>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{t.author}</p>
                  <p className="text-xs text-gray-500">{t.role}, {t.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
*/}
      {/* Teams We Work With */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">
              Teams We Support
            </span>
            <h2 className="mt-3 text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
              Working across your organization
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-3xl mx-auto">
            {teamsList.map((teamName) => (
              <div key={teamName} className="flex items-center gap-2.5 p-4 rounded-lg bg-gray-50 border border-gray-100">
                <ShieldCheck className="w-4 h-4 text-[#1A6B3C] shrink-0" />
                <span className="text-sm font-medium text-gray-700">{teamName}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
