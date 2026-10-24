import {
  PackageCheck, Layers, ScrollText, Database, Truck, Leaf, Recycle, Footprints,
  Globe2, FileBarChart, Network, ShieldCheck, GraduationCap, type LucideIcon,
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
  deliverables: string[];
  /** Menu entries that link to this card. Defaults to [title]. */
  navLabels?: string[];
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
  services: Service[];
}

const SCOPED = 'Scoped per project and agreed in your proposal';

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'product-material-compliance',
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
      },
    ],
  },
  {
    id: 'sustainability-services',
    title: 'Sustainability Services',
    description: 'LCA, PCF, CBAM, CSRD, ESG reporting',
    intro: 'Collect, structure and report the environmental and ESG data your customers and regulators ask for.',
    allLabel: 'All Sustainability Services',
    services: [
      {
        id: 'sustainability-support',
        icon: Leaf,
        title: 'Sustainability Support',
        who: 'For sustainability and environmental teams who need to collect, structure, and report ESG and carbon data.',
        deliverables: [
          'Sustainability data collection templates',
          'Carbon accounting data summaries (Scope 1, 2, 3)',
          'LCA data gathering and structuring',
          'ESG reporting data packages',
          'CBAM and PPWR compliance documentation',
        ],
        navLabels: ['Sustainability Support'],
      },
      {
        id: 'lca',
        icon: Recycle,
        title: 'Life Cycle Assessment (LCA)',
        who: 'For product and sustainability teams who need to quantify the environmental impact of a product across its life cycle.',
        deliverables: [
          'Goal and scope definition',
          'Life cycle inventory data collection',
          'Environmental impact assessment results',
          'LCA report for customers or internal use',
        ],
        navLabels: ['LCA (Life Cycle Assessment)'],
      },
      {
        id: 'pcf',
        icon: Footprints,
        title: 'Product Carbon Footprint (PCF)',
        who: 'For suppliers who are asked by customers to report the carbon footprint of the products they supply.',
        deliverables: [
          'Product carbon footprint calculation',
          'Emission data and source documentation',
          'Hotspot analysis across the product life cycle',
          'Customer-ready PCF report',
        ],
        navLabels: ['PCF (Product Carbon Footprint)'],
      },
      {
        id: 'cbam',
        icon: Globe2,
        title: 'CBAM Support',
        who: 'For importers and suppliers of goods that fall under the EU Carbon Border Adjustment Mechanism.',
        deliverables: [
          'CBAM applicability check by product',
          'Embedded emissions data collection from suppliers',
          'Data structuring for CBAM reporting',
          'Reporting support and documentation',
        ],
        navLabels: ['CBAM Support'],
      },
      {
        id: 'csrd-esg',
        icon: FileBarChart,
        title: 'CSRD & ESG Reporting Support',
        who: 'For companies preparing sustainability disclosures and answering customer ESG questionnaires.',
        deliverables: [
          'ESG and sustainability data collection',
          'Support for customer ESG questionnaires',
          'Data gap analysis',
          'Reporting-ready data packages',
        ],
        navLabels: ['CSRD & ESG Reporting'],
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
        timeline: SCOPED,
        navLabels: ['CAMDS'],
      },
      {
        id: 'scip',
        icon: ShieldCheck,
        title: 'SCIP Database Notification',
        who: 'For suppliers of articles in the EU that contain Candidate List (SVHC) substances and must notify the ECHA SCIP database.',
        deliverables: [
          'SVHC presence screening',
          'SCIP notification data preparation',
          'Submission to the ECHA SCIP database',
          'Updates when the Candidate List changes',
        ],
        navLabels: ['SCIP Database'],
      },
    ],
  },
  {
    id: 'training-programs',
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
          'Regulation Training (REACH, RoHS, PFAS...)',
          'Platform Training (IMDS, CDX, CAMDS)',
          'Sustainability Training (LCA, PCF, CSRD)',
        ],
      },
    ],
  },
];
