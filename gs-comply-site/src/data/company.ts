// ============================================================
// COMPANY DATA - Edit all company-specific values here
// TODO: Replace placeholder values with real data
// ============================================================

export const company = {
  name: 'GS Comply Solutions',
  domain: import.meta.env.VITE_SITE_URL || 'https://gscomply.com',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'info@gscomply.com',
  // TODO: Replace with real city and country
  city: 'Chennai',
  country: 'India',
  // TODO: Replace with real working hours and time zone coverage
  workingHours: 'Mon to Fri, 8:00 to 18:00 CET (covers EU morning and US East overlap)',
  linkedinUrl: import.meta.env.VITE_LINKEDIN_URL || 'https://www.linkedin.com/company/gs-comply-solutions',
  calendlyUrl: import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/gscomply/30min',
  notificationEmail: import.meta.env.VITE_CONTACT_EMAIL || 'info@gscomply.com',
};

// ============================================================
// LEGAL DETAILS used by the Privacy Policy and Terms of Service.
// Anything still in [square brackets] shows highlighted in yellow on the
// pages so it cannot be missed. Replace every one before going live.
// ============================================================
export interface LegalDetails {
  lastUpdated: string;
  version: string;
  legalName: string;
  registeredAddress: string;
  registrationNumber?: string;
  vatNumber?: string;
  contactEmail: string;
  dpo?: string;
  euRepresentative?: string;
  databaseRegion: string;
  enquiryRetention: string;
  governingLaw: string;
  courts: string;
}

export const legal: LegalDetails = {
  lastUpdated: '24 October 2026',
  version: '1.0',
  // The company that owns the website and decides how personal data is used (the GDPR "controller")
  legalName: ' GS Comply Solutions',
  registeredAddress: 'Rajiv Gandhi Saalai, Thayyur, Kelambakkam, Chennai, India ',
   registrationNumber: '',
   vatNumber: '',
  // Mailbox for privacy requests (access, deletion, ...) and legal questions
  contactEmail: 'contact@gscomply.com',
  // Only fill in if you have appointed a Data Protection Officer; otherwise leave ''
  dpo: '',
  // Representative in the EU / UK, required by GDPR Art. 27 if the company is outside the EEA/UK and targets EU customers
  euRepresentative: '',
  // Where Supabase (database) is hosted, check Supabase > Project Settings > General
  databaseRegion: 'Asia',
  // How long enquiries are kept after the last contact
  enquiryRetention: '24 months',
  governingLaw: 'India',
  courts: 'India',
};

// TODO: Replace placeholder credentials with real figures
export const credentials = {
  yearsExperience: '',
  mdsSubmissions: '5,000+',
  industriesServed: '20+',
  regulationsCovered: '18+',
};

// TODO: Replace with real team member details
export interface TeamMember {
  name: string;
  role: string;
  yearsExperience: string;
  linkedinUrl: string;
  photo?: string;
  bio?: string;
}

export const team: TeamMember[] = [
{
    name: '[Founder Name]',
    role: 'Founder & Principal Consultant',
    yearsExperience: '15+ years in regulatory compliance',
    // TODO: Replace with real LinkedIn profile URL
    linkedinUrl: 'https://www.linkedin.com/in/',
    // TODO: Replace /team/founder.jpg with a real photo (400x400)
   // photo: '/team/founder.jpg',
   // bio: '[Short bio: describe the founder background, experience with IMDS, REACH, automotive compliance, and what drives GS Comply Solutions. 2-3 sentences.]',
  },
  // TODO: Add more team members as needed
  // {
  //   name: '[Team Member Name]',
  //   role: '[Role]',
  //   yearsExperience: '[X] years in [field]',
  //   linkedinUrl: 'https://www.linkedin.com/in/',
  //   photo: '/team/member2.jpg',
  //   bio: '[Short bio.]',
  // },
];

// TODO: Replace with anonymised real case studies. Do not use real client names.
export const caseStudies = [
  {
    industry: 'Automotive Tier 1 Supplier',
    problem: 'A Tier 1 automotive supplier faced recurring IMDS rejections from an OEM customer due to incomplete material data from sub-tier suppliers.',
    whatWeDid: 'Reviewed the full BOM, identified missing supplier declarations, coordinated data collection across 40+ suppliers, and restructured the MDS hierarchy to match OEM requirements.',
    result: 'All MDS submissions approved within the customer deadline. Established an ongoing supplier data collection process to prevent future rejections.',
  },
  {
    industry: 'Electronics Manufacturer',
    problem: 'An electronics manufacturer needed to demonstrate RoHS and REACH compliance for a new product line entering the EU market.',
    whatWeDid: 'Conducted a full substance screening across all components, collected material declarations from the supply chain, and prepared the technical documentation file required for CE marking.',
    result: 'Compliance documentation completed ahead of the product launch date, enabling on-time market entry without regulatory delays.',
  },
  {
    industry: 'Industrial Equipment Manufacturer',
    problem: 'A heavy equipment manufacturer struggled with SCIP notification obligations under ECHA requirements for products containing SVHC substances above threshold.',
    whatWeDid: 'Identified articles containing SVHC candidates above the 0.1% threshold, collected substance data from suppliers, and prepared and submitted SCIP notifications to the ECHA database.',
    result: 'All SCIP notifications submitted within the regulatory deadline. The manufacturer now has a repeatable process for future SVHC updates.',
  },
];

// TODO: Replace with real testimonials. Do not invent client names or companies.
export const testimonials = [
  {
    quote: 'We sincerely appreciate GS Comply Solutions for their valuable support in IMDS submissions and substance analysis, ensuring alignment with customer requirements. Their technical expertise, attention to detail, and timely support helped streamline the compliance process and ensure accurate, reliable submissions.',
    author: 'Quality Director - Tier1 sensor manufacturer',
    role: 'Quality director',
    company: '',
  },
  {
    quote: '[Real testimonial quote.]',
    author: '[Client Name]',
    role: '[Job Title]',
    company: '[Company / Industry]',
  },
];

export const faqItems = [
  {
    question: 'What is your typical turnaround time for an IMDS submission?',
    answer: 'Turnaround depends on the complexity of the product and the availability of supplier data. For a straightforward component with complete supplier declarations, we can typically create and submit an MDS within 2 to 5 business days. Larger assemblies or products with missing supplier data may take longer, and we will give you an estimated timeline after the initial review.',
  },
  {
    question: 'How does your pricing model work?',
    answer: 'We offer both project-based and retainer-based engagements. Project pricing depends on the scope: number of parts, complexity of the BOM, supplier base, and the regulations involved. Retainer arrangements are available for manufacturers who need ongoing compliance support. Contact us with your requirement and we will provide a quote.',
  },
  {
    question: 'Will you sign an NDA before reviewing our product data?',
    answer: 'Yes. We routinely sign mutual NDAs before reviewing product specifications, BOMs, or supplier information. Your technical and commercial data is treated as confidential and handled under the terms agreed in the NDA.',
  },
  {
    question: 'How do you engage with our suppliers for data collection?',
    answer: 'We can work directly with your suppliers or through your procurement team. We send structured data request forms, follow up on missing declarations, validate the responses, and flag any data that does not meet the applicable regulatory requirements. The process is designed to reduce the administrative burden on your internal teams.',
  },
  {
    question: 'Can you help with IMDS rejections from our customer?',
    answer: 'Yes. We review the rejection reasons, identify the data gaps or formatting issues, correct the MDS, coordinate with suppliers if additional information is needed, and resubmit. We also provide feedback to help prevent similar rejections on future submissions.',
  },
  {
    question: 'Which time zones do you cover?',
    answer: 'Our working hours cover European and US East Coast time zones, with overlap for US West Coast morning. For suppliers in Asia, we coordinate asynchronously with structured request templates and follow-up schedules. Contact us to discuss your specific time zone requirements.',
  },
  {
    question: 'Do you provide ongoing compliance support or only one-off projects?',
    answer: 'Both. We handle one-off projects such as a single SCIP notification or a new product compliance assessment, and we also provide ongoing retainer support for manufacturers who need continuous regulatory monitoring, supplier data management, and submission support across product lines.',
  },
  {
    question: 'Do you issue official certifications?',
    answer: 'No. GS Comply Solutions provides compliance support, documentation, and submission services. Official certifications and declarations of conformity must be issued by the manufacturer or by an accredited notified body, depending on the regulation. We prepare the documentation that supports those declarations.',
  },
];

export const industries = [
  'Automotive', 'Aerospace & Defense', 'Heavy Equipment', 'Electrical & Electronics',
  'HVAC', 'Industrial Equipment', 'Machinery', 'Medical Devices',
  'Telecom', 'Renewable Energy', 'Semiconductors', 'Chemicals',
  'Plastics', 'Metals', 'Batteries', 'Packaging',
  'Railways', 'Marine', 'Automation', 'IoT',
];

export const industryDropdown = [
  'Automotive', 'Aerospace & Defense', 'Heavy Equipment', 'Electrical & Electronics',
  'HVAC', 'Industrial Equipment', 'Machinery', 'Medical Devices',
  'Telecom', 'Renewable Energy', 'Semiconductors', 'Chemicals',
  'Plastics', 'Metals', 'Batteries', 'Packaging',
  'Railways', 'Marine', 'Automation', 'IoT', 'Other',
];
