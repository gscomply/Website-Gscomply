import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ChevronRight, ArrowRight, ArrowUpRight, Calendar } from 'lucide-react';
import { company } from '@/data/company';
import { visibleNavigation, type NavItem, type NavMenu } from '@/data/navigation';

const isActive = (pathname: string, item: NavItem) =>
  item.path === '/' ? pathname === '/' : pathname === item.path || pathname.startsWith(`${item.path}/`);

const panelId = (item: NavItem) => `menu-${item.label.replace(/\W+/g, '-').toLowerCase()}`;

function Bullet() {
  return <span className="mt-[9px] w-1.5 h-1.5 rounded-full bg-[#1A6B3C]/70 shrink-0" aria-hidden="true" />;
}

/** Desktop dropdown panel (full width, sits directly under the header bar). */
function DesktopPanel({ item, menu, open }: { item: NavItem; menu: NavMenu; open: boolean }) {
  const [activeCat, setActiveCat] = useState(0);

  // Always start on the first category when the panel is reopened
  useEffect(() => {
    if (open) setActiveCat(0);
  }, [open]);

  return (
    <div
      id={panelId(item)}
      hidden={!open}
      className="absolute left-0 right-0 top-full bg-white border-t border-gray-200 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.18)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-[320px_minmax(0,1fr)] min-h-[420px]">
          {/* left: categories */}
          <div className="py-8 pr-6 border-r border-gray-200 flex flex-col">
            <p className="text-[13px] font-semibold text-slate-500 uppercase tracking-wider mb-5">{menu.heading}</p>
            <ul className="space-y-2">
              {menu.categories.map((cat, i) => {
                const active = i === activeCat;
                return (
                  <li key={cat.title}>
                    <button
                      type="button"
                      aria-pressed={active}
                      onMouseEnter={() => setActiveCat(i)}
                      onFocus={() => setActiveCat(i)}
                      onClick={() => setActiveCat(i)}
                      className={`w-full text-left flex items-center justify-between gap-3 rounded-lg border px-4 py-3.5 transition-colors ${
                        active ? 'bg-[#e8f3ec] border-[#bcdcc9]' : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <span className="min-w-0">
                        <span className={`block text-[15.5px] font-semibold leading-snug ${active ? 'text-[#1A6B3C]' : 'text-gray-900'}`}>
                          {cat.title}
                        </span>
                        <span className="block text-[13.5px] text-slate-500 leading-snug mt-1">{cat.description}</span>
                      </span>
                      <ChevronRight className={`w-4 h-4 shrink-0 ${active ? 'text-[#1A6B3C]' : 'text-slate-400'}`} aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <div className="mt-auto pt-6">
              <div className="border-t border-gray-200 pt-5">
                <Link to={menu.footer.path} className="inline-flex items-center gap-2 text-[14.5px] font-semibold text-[#1A6B3C] hover:gap-3 transition-all">
                  {menu.footer.label}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>

          {/* right: items of the active category */}
          <div className="py-8 pl-10">
            {menu.categories.map((cat, i) => (
              <div key={cat.title} hidden={i !== activeCat}>
                <div className="flex items-center justify-between gap-6">
                  <h3 className="text-[18px] font-semibold text-gray-900">{cat.title}</h3>
                  <Link to={cat.path} className="inline-flex items-center gap-1 text-[14.5px] font-semibold text-[#1A6B3C] hover:underline">
                    {cat.allLabel}
                    <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
                  </Link>
                </div>
                <ul className="mt-8 grid grid-cols-3 gap-x-10 gap-y-5">
                  {cat.items.map((leaf) => (
                    <li key={leaf.label} className="flex items-start gap-3">
                      <Bullet />
                      <Link to={leaf.path} className="text-[17px] text-gray-800 hover:text-[#1A6B3C] leading-snug transition-colors">
                        {leaf.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
  const [mobileCat, setMobileCat] = useState<string | null>(null);
  const location = useLocation();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
    setMobileSection(null);
    setMobileCat(null);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenu(null);
        setMobileOpen(false);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const openWithIntent = useCallback((label: string) => {
    clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }, []);
  const closeWithIntent = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 160);
  }, []);

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
        scrolled && !openMenu ? 'shadow-sm' : ''
      } ${openMenu ? '' : 'border-b border-gray-100'}`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[70] focus:px-4 focus:py-2 focus:bg-[#1A6B3C] focus:text-white focus:rounded-md"
      >
        Skip to content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] lg:h-20 gap-4">
          <Link to="/" className="flex items-center shrink-0" aria-label="GS Comply Solutions home">
            <img src="/logo.png" alt="GS Comply Solutions" width={198} height={49} className="h-10 lg:h-[46px] w-auto" />
          </Link>

          {/* desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-1 xl:gap-2">
              {visibleNavigation.map((item) => {
                const active = isActive(location.pathname, item);
                const open = openMenu === item.label;
                const cls = `inline-flex items-center gap-1.5 px-3.5 py-2 text-[16px] font-medium rounded-md transition-colors whitespace-nowrap ${
                  active || open ? 'text-[#1A6B3C]' : 'text-gray-900 hover:text-[#1A6B3C]'
                }`;

                if (!item.menu) {
                  return (
                    <li key={item.label}>
                      <Link to={item.path} aria-current={active ? 'page' : undefined} className={cls}>
                        {item.label}
                      </Link>
                    </li>
                  );
                }

                return (
                  <li
                    key={item.label}
                    onMouseEnter={() => openWithIntent(item.label)}
                    onMouseLeave={closeWithIntent}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
                    }}
                  >
                    <button
                      type="button"
                      aria-expanded={open}
                      aria-controls={panelId(item)}
                      onClick={() => setOpenMenu(open ? null : item.label)}
                      className={cls}
                    >
                      {item.label}
                      <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    <div onMouseEnter={() => openWithIntent(item.label)}>
                      <DesktopPanel item={item} menu={item.menu} open={open} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* 30-minute call booking (link set in src/data/company.ts > calendlyUrl) */}
            <a
              href={company.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-2 px-5 py-3 text-[16px] font-semibold text-[#1A6B3C] border border-[#1A6B3C]/40 rounded-lg hover:bg-[#1A6B3C]/5 transition-colors whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Book a 30-min Call
            </a>
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center px-6 py-3 bg-[#1A6B3C] text-white text-[16px] font-semibold rounded-lg hover:bg-[#155a32] transition-colors whitespace-nowrap"
            >
              Get a Free Consultation
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 -mr-2 text-gray-800 rounded-md"
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* mobile navigation */}
      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-[72px] bottom-0 bg-white overflow-y-auto border-t border-gray-100">
          <nav aria-label="Mobile" className="px-4 py-4 pb-28">
            <ul className="divide-y divide-gray-100">
              {visibleNavigation.map((item) => {
                const active = isActive(location.pathname, item);
                const expanded = mobileSection === item.label;
                if (!item.menu) {
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.path}
                        aria-current={active ? 'page' : undefined}
                        className={`block py-3.5 text-base font-medium ${active ? 'text-[#1A6B3C]' : 'text-gray-900'}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const menu = item.menu;
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setMobileSection(expanded ? null : item.label)}
                      className={`w-full flex items-center justify-between py-3.5 text-base font-medium ${active || expanded ? 'text-[#1A6B3C]' : 'text-gray-900'}`}
                    >
                      {item.label}
                      <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>

                    {expanded && (
                      <div className="pb-4 pl-3 border-l-2 border-[#1A6B3C]/20 ml-1">
                        <ul className="space-y-1">
                          {menu.categories.map((cat) => {
                            const catOpen = mobileCat === cat.title;
                            return (
                              <li key={cat.title}>
                                <button
                                  type="button"
                                  aria-expanded={catOpen}
                                  onClick={() => setMobileCat(catOpen ? null : cat.title)}
                                  className="w-full flex items-center justify-between gap-3 py-2.5 text-left"
                                >
                                  <span>
                                    <span className={`block text-[15px] font-semibold ${catOpen ? 'text-[#1A6B3C]' : 'text-gray-900'}`}>{cat.title}</span>
                                    <span className="block text-xs text-slate-500 mt-0.5">{cat.description}</span>
                                  </span>
                                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${catOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                                </button>
                                {catOpen && (
                                  <ul className="pl-3 pb-2">
                                    {cat.items.map((leaf) => (
                                      <li key={leaf.label}>
                                        <Link to={leaf.path} className="block py-1.5 text-[14.5px] text-gray-700">{leaf.label}</Link>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                        <Link to={menu.footer.path} className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A6B3C]">
                          {menu.footer.label} <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <Link to="/contact" className="mt-6 block px-4 py-3.5 bg-[#1A6B3C] text-white text-base font-semibold rounded-lg text-center">
              Get a Free Consultation
            </Link>
            <a
              href={company.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 flex items-center justify-center gap-2 px-4 py-3.5 text-base font-semibold text-[#1A6B3C] border border-[#1A6B3C]/40 rounded-lg"
            >
              <Calendar className="w-5 h-5" aria-hidden="true" />
              Book a 30-min Call
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
