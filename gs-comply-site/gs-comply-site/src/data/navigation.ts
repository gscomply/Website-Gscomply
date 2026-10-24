import { slugify } from '@/lib/blog';

// ============================================================
// SITE NAVIGATION: edit this file to change the menu.
// Each top-level item can have a dropdown ("menu") made of
// groups of links. Anchors (#...) scroll to the matching card
// on the target page.
// ============================================================

export interface NavLeaf {
  label: string;
  path: string;
  description?: string;
}

export interface NavGroup {
  heading?: string;
  items: NavLeaf[];
}

export interface NavMenu {
  /** Number of columns of groups on desktop */
  columns: 1 | 2 | 3 | 4;
  groups: NavGroup[];
  /** "View all" link shown at the bottom of the panel */
  footer: NavLeaf;
  /** Short intro text shown at the left of the panel */
  intro?: string;
}

export interface NavItem {
  label: string;
  path: string;
  menu?: NavMenu;
}

const svc = (label: string, description: string): NavLeaf => ({
  label,
  description,
  path: `/services#${slugify(label)}`,
});
const ind = (label: string): NavLeaf => ({ label, path: `/industries#${slugify(label)}` });
const reg = (label: string): NavLeaf => ({ label, path: `/regulations#${slugify(label)}` });

export const navigation: NavItem[] = [
  {
    label: 'Services',
    path: '/services',
    menu: {
      columns: 2,
      intro: 'Compliance support with defined deliverables, clear timelines and a structured approach.',
      groups: [
        {
          items: [
            svc('Product Compliance', 'Product-level regulatory assessment and documentation'),
            svc('Material Compliance', 'Material and substance data, declarations and reviews'),
            svc('Regulatory Compliance', 'Interpretation and tracking of global regulations'),
            svc('IMDS & CDX', 'MDS creation, submission and rejection handling'),
          ],
        },
        {
          items: [
            svc('Supply Chain Compliance', 'Supplier data collection and follow-up'),
            svc('Sustainability Support', 'Sustainability data and reporting support'),
            svc('Compliance Data Management', 'Central, audit-ready compliance records'),
          ],
        },
      ],
      footer: { label: 'View all services', path: '/services' },
    },
  },
  {
    label: 'Industries',
    path: '/industries',
    menu: {
      columns: 3,
      intro: 'Compliance support tailored to the regulatory and material requirements of each manufacturing industry.',
      groups: [
        { items: ['Automotive', 'Aerospace & Defense', 'Heavy Equipment', 'Electrical & Electronics', 'HVAC', 'Industrial Equipment', 'Machinery'].map(ind) },
        { items: ['Medical', 'Telecom', 'Renewable Energy', 'Semiconductors', 'Chemicals', 'Plastics', 'Metals'].map(ind) },
        { items: ['Batteries', 'Packaging', 'Railways', 'Marine', 'Automation', 'IoT'].map(ind) },
      ],
      footer: { label: 'View all industries', path: '/industries' },
    },
  },
  {
    label: 'Regulations',
    path: '/regulations',
    menu: {
      columns: 4,
      groups: [
        { heading: 'Chemical & substance', items: ['REACH / SVHC', 'TSCA', 'POPs', 'California Proposition 65', 'PFAS'].map(reg) },
        { heading: 'Material declarations', items: ['IMDS', 'CDX', 'CMRT', 'EMRT', 'IEC 62474'].map(reg) },
        { heading: 'Product & market', items: ['RoHS', 'China RoHS', 'CE Requirements', 'ELV'].map(reg) },
        { heading: 'Environmental', items: ['SCIP', 'EU Battery Regulation', 'CBAM', 'PPWR'].map(reg) },
      ],
      footer: { label: 'View all regulations & standards', path: '/regulations' },
    },
  },
  { label: 'IMDS & CDX', path: '/imds-cdx' },
  { label: 'Sustainability', path: '/sustainability' },
  { label: 'Insights', path: '/insights' },
  { label: 'About', path: '/about' },
];
