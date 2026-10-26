import {
  PackageCheck, Layers, ScrollText, Database, Truck, Recycle, Footprints,
  Globe2, FileBarChart, Network, ShieldCheck, GraduationCap, TrendingDown, Battery, type LucideIcon,
} from 'lucide-react';

// ============================================================
// SERVICES: the single source of truth.
//
//  - The Services page (src/pages/Services.tsx) draws these as 4 category sections.
//  - The navbar "Services" menu (src/data/navigation.ts) links to the same ids,
//    so a menu link always lands on a real section.
//
// To ADD a service: add an object to a category's `services` below.
// `navLabels` = the menu entries that should jump to that service card
// (several labels can point to the same card, e.g. IMDS and CDX).
// ============================================================

export interface Service {
  /** Anchor on the Services page: /services#<id> */
  id: string;
  icon: LucideIcon;
  title: string;
  who: string;
  /** Longer explanation, shown on the service's own page where it has one (e.g. /sustainability) */
  about?: string;
  deliverables: string[];
  /** Menu entries that link to this card. Defaults to [title]. */
  navLabels?: string[];
  /** Dedicated page for this service. Menu links go here instead of /services#<id>. */
  path?: string;
}

export interface ServiceCategory {
  /** Anchor on the Services page: /services#<id> */
  id: string;
  title: string;
  /** Short line under the title in the navbar menu */
  description: string;
  /** Intro text above the cards on the Services page */
  intro: string;
  /** Text of the "All ... ↗" link in the navbar menu */
  allLabel: string;
  /** Dedicated page for the whole category. Defaults to its section on /services. */
  path?: string;
  services: Service[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'product-material-compliance',
    path: '/product-material-compliance',
    title: 'Product & Material Compliance',
    description: 'REACH, RoHS, PFAS, GADSL, ELV and more',
    intro: 'Demonstrate product, material and substance compliance for market access and customer requirements.',
    allLabel: 'All Compliance Services',
    services: [
      {
        id: 'product-compliance',
        icon: PackageCheck,
        title:'Product & Material Compliance',
        who: 'For manufacturers who need to demonstrate product-level regulatory compliance for market access or customer requirements.',
        deliverables: [
          'Technical documentation files',
          'Declarations of conformity',
          'Product compliance assessment reports',
          'Customer-specific compliance documentation',
          'Material composition analysis reports',
          'REACH SVHC screening reports',
          'RoHS compliance assessments',
          'SCIP notification submissions',
          'PFAS and TSCA compliance documentation',
          'Supplier declaration collection (CMRT, EMRT)',
          'Data validation and gap analysis reports',
          'Supplier follow-up tracking and escalation',
          'Compliance documentation management',
        ],
        path: '/product-material-compliance',
      },
      {
        id: 'compliance-data-management',
        icon: Database,
        title: 'Compliance Data Management',
        who: 'For manufacturers who need a centralized system to manage regulatory, material and supplier compliance data.',
        deliverables: [
          'Centralized compliance data repository',
          'Supplier compliance tracking dashboards',
          'Material and substance data management',
          'Audit-ready documentation packages',
          'Material composition analysis reports',
          'Substance data collection and structuring',
          'Material declarations (MDS, IMDS, CDX format)',
          'Regulatory substance screening reports',
        ],
        path: '/product-material-compliance#support',
      },
    ],
  },
  {
    id: 'sustainability-services',
    path: '/sustainability',
    title: 'Sustainability Services',
    description: 'LCA, PCF, carbon accounting, CBAM, CSRD, ESG',
    intro: 'Collect, structure and report the environmental and ESG data your customers and regulators ask for.',
    allLabel: 'All Sustainability Services',
    services: [
      {
        id: 'lca',
        icon: Recycle,
        title: 'Life Cycle Assessment (LCA)',
        who: 'For product and sustainability teams who need to quantify the environmental impact of a product across its life cycle.',
        about: 'Life Cycle Assessment measures the environmental impact of a product from raw materials through manufacturing, transport, use and end of life. Customers, tenders and sustainability programs increasingly ask for it. We handle the data-heavy part: defining the goal and scope, collecting inventory data on materials, energy, transport and waste, and structuring the results into a report you can share. The approach follows the principles of ISO 14040 and ISO 14044.',
        deliverables: [
          'Goal and scope definition',
          'Life cycle inventory data collection',
          'Environmental impact assessment results',
          'LCA report for customers or internal use',
        ],
        navLabels: ['LCA (Life Cycle Assessment)'],
        path: '/sustainability#lca',
      },
      {
        id: 'pcf',
        icon: Footprints,
        title: 'Product Carbon Footprint (PCF)',
        who: 'For suppliers who are asked by customers to report the carbon footprint of the products they supply.',
        about: 'A Product Carbon Footprint states the greenhouse-gas emissions linked to one product, usually in kg CO2e per unit. OEMs and large buyers now request PCF values from their suppliers. We collect the emission data and its sources, calculate the footprint, show which stages contribute most (hotspots), and prepare a customer-ready report. Calculations follow recognised methods such as ISO 14067 and the GHG Protocol, depending on what your customer asks for.',
        deliverables: [
          'Product carbon footprint calculation',
          'Emission data and source documentation',
          'Hotspot analysis across the product life cycle',
          'Customer-ready PCF report',
        ],
        navLabels: ['PCF (Product Carbon Footprint)'],
        path: '/sustainability#pcf',
      },
      {
        id: 'carbon-accounting',
        icon: TrendingDown,
        title: 'Carbon Accounting',
        who: 'For sustainability and finance teams who need organisation-level emissions data for reporting and customer requests.',
        about: 'Carbon accounting turns activity data (energy, fuel, travel, purchased goods and more) into emissions figures across Scope 1 (direct), Scope 2 (purchased energy) and Scope 3 (value chain). We set up the data collection from your sites and suppliers, check it for gaps and consistency, and summarise it in the format your reporting or customer request needs.',
        deliverables: [
          'Scope 1, 2 and 3 data collection templates',
          'Supplier and site sustainability data collection',
          'Carbon accounting data summaries',
          'Data gap analysis and follow-up',
        ],
        navLabels: ['Carbon Accounting'],
        path: '/sustainability#carbon-accounting',
      },
      {
        id: 'cbam',
        icon: Globe2,
        title: 'CBAM Support',
        who: 'For importers and suppliers of goods that fall under the EU Carbon Border Adjustment Mechanism.',
        about: 'The EU Carbon Border Adjustment Mechanism puts a carbon cost on certain imported goods, such as steel, aluminium, cement, fertilisers, electricity and hydrogen. Importers need embedded-emissions data from the producers of those goods. We check whether your products are covered, collect the emissions data from suppliers, structure it for CBAM reporting, and keep the documentation organised.',
        deliverables: [
          'CBAM applicability check by product',
          'Embedded emissions data collection from suppliers',
          'Data structuring for CBAM reporting',
          'Reporting support and documentation',
        ],
        navLabels: ['CBAM Support'],
        path: '/sustainability#cbam',
      },
      {
        id: 'ppwr-battery',
        icon: Battery,
        title: 'PPWR & EU Battery Regulation Support',
        who: 'For manufacturers and importers of packaging, batteries and products that contain them.',
        about: 'The EU Packaging and Packaging Waste Regulation (PPWR) and the EU Battery Regulation add sustainability, labelling and documentation duties for packaging and batteries. We help you work out which requirements touch your products, collect the supporting data from suppliers, and prepare the documentation that shows you meet them.',
        deliverables: [
          'Applicability check by product and packaging',
          'Supplier data and declaration collection',
          'Documentation and evidence packages',
          'Tracking of upcoming requirements',
        ],
        navLabels: ['PPWR & Battery Regulation'],
        path: '/sustainability#ppwr-battery',
      },
      {
        id: 'csrd-esg',
        icon: FileBarChart,
        title: 'CSRD & ESG Reporting Support',
        who: 'For companies preparing sustainability disclosures and answering customer ESG questionnaires.',
        about: 'The Corporate Sustainability Reporting Directive (CSRD) and customer ESG questionnaires create a steady stream of data requests, even for companies that are not themselves in scope, because their customers are. We collect and structure environmental, social and governance data, find the gaps, and prepare reporting-ready data packages and consistent answers to questionnaires.',
        deliverables: [
          'ESG and sustainability data collection',
          'Support for customer ESG questionnaires',
          'Data gap analysis',
          'Reporting-ready data packages',
        ],
        navLabels: ['CSRD & ESG Reporting'],
        path: '/sustainability#csrd-esg',
      },
    ],
  },
  {
    id: 'platform-based-support',
    title: 'Platform Based Support',
    description: 'IMDS, CDX, CAMDS, SCIP database',
    intro: 'Hands-on support for the industry and regulatory platforms where your material data must be submitted.',
    allLabel: 'All Platform Services',
    services: [
      {
        id: 'imds-cdx',
        icon: Database,
        title: 'IMDS & CDX',
        who: 'For automotive and industrial manufacturers who need to create, submit, and maintain material data sheets.',
        deliverables: [
          'IMDS & CDX account setup and configuration',
          'MDS creation with correct material structuring',
          'Supplier MDS validation and approval',
          'Submission and rejection resolution',
        ],
        navLabels: ['IMDS', 'CDX'],
        path: '/imds-cdx',
      },
      {
        id: 'camds',
        icon: Network,
        title: 'CAMDS',
        who: 'For suppliers to Chinese automotive customers who must submit material data in the China Automotive Material Data System.',
        deliverables: [
          'CAMDS access and account guidance',
          'Material data entry and structuring',
          'Submission and customer approval follow-up',
          'Rejection analysis and correction',
        ],
        navLabels: ['CAMDS'],
        path: '/imds-cdx#camds',
      },
      {
        id: 'scip',
        icon: ShieldCheck,
        title: 'SCIP Notification Services',
        who: 'For suppliers of articles in the EU that contain Candidate List (SVHC) substances and must notify the ECHA SCIP database.',
        deliverables: [
          'SVHC presence screening',
          'SCIP notification data preparation',
          'Submission to the ECHA SCIP database',
          'Updates when the Candidate List changes',
        ],
        navLabels: ['SCIP Notification Services'],
        path: '/scip-notification-services',
      },
    ],
  },
  {
    id: 'training-programs',
    path: '/training-services',
    title: 'Training Programs',
    description: 'Classroom, individual & online training',
    intro: 'Build compliance skills inside your own team, in the format that suits you.',
    allLabel: 'All Training Programs',
    services: [
      {
        id: 'training',
        icon: GraduationCap,
        title: 'Training Programs',
        who: 'For compliance, engineering, procurement and quality teams who want to build in-house compliance skills.',
        deliverables: [
          'Classroom training, at your site or ours',
          'Online live and recorded sessions',
          'Topics: regulations (REACH, RoHS, PFAS), platforms (IMDS, CDX, CAMDS) and sustainability (LCA, PCF, CSRD)',
        ],
        navLabels: [
          'Classroom Training',
          'Online Training',
        ],
        path: '/training-services',
      },
    ],
  },
];
