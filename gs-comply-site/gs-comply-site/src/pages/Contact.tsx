import { useState } from 'react';
import { Mail, MapPin, Phone, Globe2, Send, CheckCircle2, Loader2, Building2 } from 'lucide-react';
import { IMAGES } from '@/lib/images';
import { supabase } from '@/lib/supabase';

const serviceOptions = [
  'Product Compliance',
  'Material Compliance',
  'Regulatory Compliance',
  'IMDS',
  'CDX',
  'REACH',
  'RoHS',
  'PFAS',
  'Supply Chain Compliance',
  'Sustainability',
  'Carbon Accounting',
  'LCA Support',
  'Other',
];

const countries = [
  'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Sweden', 'Poland',
  'United Kingdom', 'United States', 'Canada', 'Mexico', 'Brazil',
  'China', 'Japan', 'South Korea', 'India', 'Singapore', 'Malaysia', 'Thailand',
  'Taiwan', 'Vietnam', 'Australia', 'Other',
];

export default function Contact() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    company: '',
    country: '',
    message: '',
    phone: '',
    job_title: '',
    industry: '',
    service_required: '',
    consent: false,
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.consent) {
      setErrorMsg('Please agree to be contacted regarding your enquiry.');
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    try {
      const { error } = await supabase.from('enquiries').insert({
        full_name: form.full_name,
        email: form.email,
        company: form.company,
        country: form.country,
        message: form.message,
        phone: form.phone || null,
        job_title: form.job_title || null,
        industry: form.industry || null,
        service_required: form.service_required || null,
        consent: form.consent,
      });
      if (error) throw error;

      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-enquiry-notification`;
      await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          full_name: form.full_name,
          email: form.email,
          company: form.company,
          country: form.country,
          message: form.message,
          phone: form.phone || null,
          job_title: form.job_title || null,
          industry: form.industry || null,
          service_required: form.service_required || null,
        }),
      }).catch(() => null);

      setStatus('success');
      setForm({
        full_name: '', email: '', company: '', country: '', message: '',
        phone: '', job_title: '', industry: '', service_required: '', consent: false,
      });
    } catch (err) {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again or email us directly at info@gscomply.com.');
    }
  };

  const inputClass = 'w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#1A6B3C] focus:ring-1 focus:ring-[#1A6B3C]/20 transition-colors';
  const labelClass = 'block text-xs font-semibold text-gray-700 mb-1.5';

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 lg:pt-36 pb-16 lg:pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={IMAGES.handshake2} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/85 to-gray-950/50" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight tracking-tight max-w-2xl">
            Let's Discuss Your Compliance Requirement
          </h1>
          <p className="mt-5 text-base lg:text-lg text-gray-300 leading-relaxed max-w-2xl">
            Tell us about your product, market or compliance requirement. Our team will review
            your enquiry and get back to you.
          </p>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Info Column */}
            <div className="lg:col-span-1 space-y-6">
              <div className="p-7 rounded-xl bg-white border border-gray-100">
                <h3 className="text-base font-bold text-gray-900 mb-5">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-[#1A6B3C]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                      <a href="mailto:info@gscomply.com" className="text-sm text-gray-700 hover:text-[#1A6B3C] transition-colors">
                        info@gscomply.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center shrink-0">
                      <Globe2 className="w-5 h-5 text-[#1A6B3C]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Website</p>
                      <span className="text-sm text-gray-700">gscomply.com</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#1A6B3C]/10 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-[#1A6B3C]" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Coverage</p>
                      <span className="text-sm text-gray-700">Europe, North America & Asia</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-7 rounded-xl bg-[#1A6B3C] text-white">
                <Building2 className="w-8 h-8 text-white/80 mb-4" />
                <h3 className="text-base font-bold mb-2">Manufacturer-Focused Support</h3>
                <p className="text-sm text-white/80 leading-relaxed">
                  We work with engineering, quality, procurement and sustainability teams to
                  deliver practical compliance support tailored to your products and markets.
                </p>
              </div>
            </div>

            {/* Form Column */}
            <div className="lg:col-span-2">
              {status === 'success' ? (
                <div className="p-10 rounded-xl bg-white border border-gray-100 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#1A6B3C]/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-[#1A6B3C]" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you.</h3>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-md mx-auto">
                    Your enquiry has been received. Our team will review your requirement and get
                    back to you shortly.
                  </p>
                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#1A6B3C] text-white text-sm font-semibold rounded-md hover:bg-[#155a32] transition-colors"
                  >
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-7 lg:p-8 rounded-xl bg-white border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Enquiry Form</h3>
                  {status === 'error' && (
                    <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200">
                      <p className="text-sm text-red-700">{errorMsg}</p>
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    {/* Required fields */}
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input
                        type="text"
                        name="full_name"
                        required
                        value={form.full_name}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Business Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="john@company.com"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Company Name *</label>
                      <input
                        type="text"
                        name="company"
                        required
                        value={form.company}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Your Company Ltd."
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Country *</label>
                      <select
                        name="country"
                        required
                        value={form.country}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select country</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    {/* Optional fields */}
                    <div>
                      <label className={labelClass}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="+49 123 456 7890"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Job Title</label>
                      <input
                        type="text"
                        name="job_title"
                        value={form.job_title}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Compliance Manager"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Industry</label>
                      <input
                        type="text"
                        name="industry"
                        value={form.industry}
                        onChange={handleChange}
                        className={inputClass}
                        placeholder="Automotive"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Service Required</label>
                      <select
                        name="service_required"
                        value={form.service_required}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="">Select service</option>
                        {serviceOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-5">
                    <label className={labelClass}>Requirement / Message *</label>
                    <textarea
                      name="message"
                      required
                      value={form.message}
                      onChange={handleChange}
                      rows={5}
                      className={inputClass}
                      placeholder="Tell us about your product, market or compliance requirement..."
                    />
                  </div>
                  <div className="mt-5">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="consent"
                        checked={form.consent}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-gray-300 text-[#1A6B3C] focus:ring-[#1A6B3C]/20"
                      />
                      <span className="text-sm text-gray-600 leading-relaxed">
                        I agree to be contacted regarding my enquiry.
                      </span>
                    </label>
                  </div>
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="mt-6 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1A6B3C] text-white text-sm font-semibold rounded-md hover:bg-[#155a32] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Enquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
