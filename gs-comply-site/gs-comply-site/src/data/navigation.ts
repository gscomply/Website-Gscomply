import { slugify } from '@/lib/blog';
import { BLOG_ENABLED } from '@/config/features';

// ============================================================
// SITE NAVIGATION: edit this file to change the menu.
//
//  - "categories" menus (Services): a list of categories on the left,
//    the selected category's links on the right.
//  - "list" menus (Industries): one panel with a simple link list.
//  - Items marked `blog: true` are hidden while BLOG_ENABLED is off.
// ============================================================

export interface NavLeaf {
  label: string;
  path: string;
}

export interface MegaCategory {
  title: string;
  description: string;
  /** Where clicking the category card goes */
  path: string;
  /** Text for the "All ... ↗" link above the items */
  allLabel: string;
  items: NavLeaf[];
}

export type NavMenu =
  | { kind: 'categories'; heading: string; categories: MegaCategory[]; footer: NavLeaf }
  | { kind: 'list'; title: string; allLabel: string; allPath: string; items: NavLeaf[] };

export interface NavItem {
  label: string;
  path: string;
  menu?: NavMenu;
  /** Hidden unless the blog feature is enabled */
  blog?: boolean;
}

const svc = (label: string): NavLeaf => ({ label, path: `/services#${slugify(label)}` });
const reg = (label: string, text = label): NavLeaf => ({ label: text, path: `/regulations#${slugify(label)}` });
const ind = (label: string): NavLeaf => ({ label, path: `/industries#${slugify(label)}` });

const industries = [
  'Automotive', 'Aerospace & Defense', 'Heavy Equipment', 'Electrical & Electronics', 'HVAC',
  'Industrial Equipment', 'Machinery', 'Medical', 'Telecom', 'Renewable Energy', 'Semiconductors',
  'Chemicals', 'Plastics', 'Metals', 'Batteries', 'Packaging', 'Railways', 'Marine', 'Automation', 'IoT',
];

export const navigation: NavItem[] = [
  { label: 'Home', path: '/' },
  {
    label: 'Industries',
    path: '/industries',
    menu: {
      kind: 'list',
      title: 'Industries we support',
      allLabel: 'All Industries',
      allPath: '/industries',
      items: industries.map(ind),
    },
  },
  {
    label: 'Services',
    path: '/services',
    menu: {
      kind: 'categories',
      heading: 'Services by category',
      footer: { label: 'View All Services', path: '/services' },
      categories: [
        {
          title: 'Product & Material Compliance',
          description: 'REACH, RoHS, PFAS, GADSL, ELV and more',
          path: '/services',
          allLabel: 'All Product & Material Compliance',
          items: [
            svc('Product Compliance'),
            svc('Material Compliance'),
            svc('Regulatory Compliance'),
            svc('Supply Chain Compliance'),
            svc('Compliance Data Management'),
            { label: 'Regulations covered (REACH, RoHS, PFAS, ELV)', path: '/regulations' },
          ],
        },
        {
          title: 'Sustainability Services',
          description: 'LCA, PCF, CBAM, CSRD, ESG reporting',
          path: '/sustainability',
          allLabel: 'All Sustainability Services',
          items: [
            svc('Sustainability Support'),
            { label: 'Life Cycle Assessment (LCA)', path: '/sustainability' },
            { label: 'Product Carbon Footprint (PCF)', path: '/sustainability' },
            reg('CBAM', 'CBAM Support'),
            { label: 'CSRD & ESG Reporting', path: '/sustainability' },
            reg('PPWR', 'Packaging (PPWR)'),
          ],
        },
        {
          title: 'Platform Based Requirements',
          description: 'IMDS, CDX, CAMDS, SCIP database',
          path: '/imds-cdx',
          allLabel: 'All Platform Based Requirements',
          items: [
            reg('IMDS', 'IMDS (Material Data System)'),
            reg('CDX', 'CDX (Chemical Data Exchange)'),
            { label: 'CAMDS', path: '/imds-cdx' },
            reg('SCIP', 'SCIP Database Notification'),
            svc('IMDS & CDX'),
            reg('CMRT', 'CMRT & EMRT (Conflict Minerals)'),
          ],
        },
        {
          title: 'Training Programs',
          description: 'Classroom, individual & online training',
          path: '/contact',
          allLabel: 'All Training Programs',
          items: [
            { label: 'Classroom Training', path: '/contact' },
            { label: 'Regulation Training (REACH, RoHS, PFAS...)', path: '/contact' },
            { label: 'Individual Training', path: '/contact' },
            { label: 'Platform Training (IMDS, CDX, CAMDS)', path: '/contact' },
            { label: 'Online Training', path: '/contact' },
            { label: 'Sustainability Training (LCA, PCF, CSRD)', path: '/contact' },
          ],
        },
      ],
    },
  },
  { label: 'Insights', path: '/insights', blog: true },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

/** Navigation with blog-only items removed while the blog is switched off. */
export const visibleNavigation: NavItem[] = navigation.filter((i) => !i.blog || BLOG_ENABLED);
