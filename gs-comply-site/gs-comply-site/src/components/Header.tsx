import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Calendar, ChevronDown, ArrowRight } from 'lucide-react';
import { company } from '@/data/company';
import { navigation, type NavItem } from '@/data/navigation';

const isActive = (pathname: string, item: NavItem) =>
  item.path === '/' ? pathname === '/' : pathname === item.path || pathname.startsWith(`${item.path}/`);

const colsClass = { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' } as const;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileSection, setMobileSection] = useState<string | null>(null);
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
    closeTimer.current = setTimeout(() => setOpenMenu(null), 140);
  }, []);

  const solid = scrolled || !!openMenu || mobileOpen;

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        solid ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-white/90 backdrop-blur-sm'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-2 focus:z-[70] focus:px-4 focus:py-2 focus:bg-[#1A6B3C] focus:text-white focus:rounded-md"
      >
        Skip to content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
          <Link to="/" className="flex items-center shrink-0 group" aria-label="GS Comply Solutions home">
            <img
              src="/GS_comply__Logo.jpg"
              alt="GS Comply Solutions"
              className="h-10 lg:h-12 w-auto object-contain group-hover:opacity-90 transition-opacity"
            />
          </Link>

          {/* desktop navigation */}
          <nav aria-label="Main" className="hidden lg:block flex-1 min-w-0">
            <ul className="flex items-center justify-center gap-0.5 xl:gap-1">
              {navigation.map((item) => {
                const active = isActive(location.pathname, item);
                const open = openMenu === item.label;
                const linkCls = `relative inline-flex items-center px-3 py-2 text-[13.5px] font-medium rounded-md transition-colors ${
                  active || open ? 'text-[#1A6B3C]' : 'text-gray-700 hover:text-[#1A6B3C]'
                }`;

                if (!item.menu) {
                  return (
                    <li key={item.label}>
                      <Link to={item.path} aria-current={active ? 'page' : undefined} className={linkCls}>
                        {item.label}
                        {active && <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-[#1A6B3C] rounded" />}
                      </Link>
                    </li>
                  );
                }

                const panelId = `menu-${item.label.replace(/\W+/g, '-').toLowerCase()}`;
                return (
                  <li
                    key={item.label}
                    onMouseEnter={() => openWithIntent(item.label)}
                    onMouseLeave={closeWithIntent}
                    onBlur={(e) => {
                      if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpenMenu(null);
                    }}
                  >
                    <div className="flex items-center">
                      <Link to={item.path} aria-current={active ? 'page' : undefined} className={linkCls + ' !pr-1'}>
                        {item.label}
                        {active && <span className="absolute left-3 right-1 -bottom-0.5 h-0.5 bg-[#1A6B3C] rounded" />}
                      </Link>
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-controls={panelId}
                        aria-label={`${open ? 'Close' : 'Open'} ${item.label} menu`}
                        onClick={() => setOpenMenu(open ? null : item.label)}
                        className={`p-1 -ml-0.5 rounded-md transition-colors ${open ? 'text-[#1A6B3C]' : 'text-gray-500 hover:text-[#1A6B3C]'}`}
                      >
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                      </button>
                    </div>

                    <div
                      id={panelId}
                      hidden={!open}
                      className="absolute left-0 right-0 top-full bg-white border-t border-gray-100 shadow-xl"
                      onMouseEnter={() => openWithIntent(item.label)}
                    >
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-10">
                        <div className="w-60 shrink-0 hidden xl:block">
                          <p className="text-xs font-semibold text-[#1A6B3C] uppercase tracking-wider">{item.label}</p>
                          {item.menu.intro && (
                            <p className="mt-2 text-sm text-gray-500 leading-relaxed">{item.menu.intro}</p>
                          )}
                          <Link
                            to={item.menu.footer.path}
                            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A6B3C] hover:gap-2.5 transition-all"
                          >
                            {item.menu.footer.label}
                            <ArrowRight className="w-4 h-4" aria-hidden="true" />
                          </Link>
                        </div>

                        <div className={`flex-1 grid ${colsClass[item.menu.columns]} gap-x-8 gap-y-6`}>
                          {item.menu.groups.map((group, gi) => (
                            <div key={gi}>
                              {group.heading && (
                                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-3 pb-2 border-b border-gray-100">
                                  {group.heading}
                                </p>
                              )}
                              <ul className="space-y-0.5">
                                {group.items.map((leaf) => (
                                  <li key={leaf.path}>
                                    <Link to={leaf.path} className="block -mx-2 px-2 py-2 rounded-md hover:bg-[#1A6B3C]/5 group/leaf transition-colors">
                                      <span className="block text-sm font-medium text-gray-800 group-hover/leaf:text-[#1A6B3C]">
                                        {leaf.label}
                                      </span>
                                      {leaf.description && (
                                        <span className="block text-xs text-gray-500 mt-0.5 leading-snug">{leaf.description}</span>
                                      )}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href={company.calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold text-[#1A6B3C] border border-[#1A6B3C]/30 rounded-md hover:bg-[#1A6B3C]/5 transition-colors"
            >
              <Calendar className="w-4 h-4" aria-hidden="true" />
              Book a Call
            </a>
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center px-5 py-2.5 bg-[#1A6B3C] text-white text-[13px] font-semibold rounded-md hover:bg-[#155a32] transition-colors shadow-sm whitespace-nowrap"
            >
              Discuss Your Requirement
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="lg:hidden p-2 -mr-2 text-gray-700 rounded-md"
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
        <div id="mobile-menu" className="lg:hidden fixed inset-x-0 top-16 bottom-0 bg-white overflow-y-auto border-t border-gray-100">
          <nav aria-label="Mobile" className="px-4 py-4 pb-28">
            <ul className="divide-y divide-gray-100">
              {navigation.map((item) => {
                const active = isActive(location.pathname, item);
                const expanded = mobileSection === item.label;
                if (!item.menu) {
                  return (
                    <li key={item.label}>
                      <Link
                        to={item.path}
                        aria-current={active ? 'page' : undefined}
                        className={`block py-3.5 text-base font-medium ${active ? 'text-[#1A6B3C]' : 'text-gray-800'}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.label}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setMobileSection(expanded ? null : item.label)}
                      className={`w-full flex items-center justify-between py-3.5 text-base font-medium ${active || expanded ? 'text-[#1A6B3C]' : 'text-gray-800'}`}
                    >
                      {item.label}
                      <ChevronDown className={`w-5 h-5 transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" />
                    </button>
                    {expanded && (
                      <div className="pb-4 pl-3 border-l-2 border-[#1A6B3C]/20 ml-1 space-y-4">
                        <Link to={item.menu.footer.path} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A6B3C]">
                          {item.menu.footer.label}
                          <ArrowRight className="w-4 h-4" aria-hidden="true" />
                        </Link>
                        {item.menu.groups.map((group, gi) => (
                          <div key={gi}>
                            {group.heading && (
                              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">{group.heading}</p>
                            )}
                            <ul>
                              {group.items.map((leaf) => (
                                <li key={leaf.path}>
                                  <Link to={leaf.path} className="block py-2 text-sm text-gray-700 hover:text-[#1A6B3C]">
                                    {leaf.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 space-y-3">
              <Link to="/contact" className="block px-4 py-3 bg-[#1A6B3C] text-white text-sm font-semibold rounded-md text-center">
                Discuss Your Requirement
              </Link>
              <a
                href={company.calendlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-[#1A6B3C] border border-[#1A6B3C]/30 rounded-md"
              >
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Book a 30-min Call
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
