import { BLOG_ENABLED } from '@/config/features';
import { serviceCategories } from '@/data/services';

// ============================================================
// SITE NAVIGATION: edit this file to change the menu bar.
//
//   Home - Industries - Services (dropdown) - Regulations & Standards - About - Contact
//
// The Services dropdown is built automatically from src/data/services.ts,
// so adding a service there adds it to the menu and to the Services page.
// Items marked `blog: true` stay hidden while the blog is switched off.
// ============================================================

export interface NavLeaf {
  label: string;
  path: string;
}

export interface MegaCategory {
  title: string;
  description: string;
  /** Clicking the category card goes here (its section on the Services page) */
  path: string;
  /** Text for the "All ... ↗" link above the items */
  allLabel: string;
  items: NavLeaf[];
}

export interface NavMenu {
  heading: string;
  categories: MegaCategory[];
  footer: NavLeaf;
}

export interface NavItem {
  label: string;
  path: string;
  menu?: NavMenu;
  /** Hidden unless the blog feature is enabled */
  blog?: boolean;
}

const servicesMenu: NavMenu = {
  heading: 'Services by category',
  footer: { label: 'View All Services', path: '/services' },
  categories: serviceCategories.map((cat) => ({
    title: cat.title,
    description: cat.description,
    path: cat.path ?? `/services#${cat.id}`,
    allLabel: cat.allLabel,
    items: cat.services.flatMap((s) =>
      (s.navLabels ?? [s.title]).map((label) => ({ label, path: s.path ?? `/services#${s.id}` }))
    ),
  })),
};

export const navigation: NavItem[] = [
  { label: 'Home', path: '/' },
  { label: 'Industries', path: '/industries' },
  { label: 'Services', path: '/services', menu: servicesMenu },
  { label: 'Regulations & Standards', path: '/regulations' },
  { label: 'Insights', path: '/insights', blog: true },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
];

/** Navigation with blog-only items removed while the blog is switched off. */
export const visibleNavigation: NavItem[] = navigation.filter((i) => !i.blog || BLOG_ENABLED);
