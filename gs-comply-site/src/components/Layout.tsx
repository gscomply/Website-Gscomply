import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CookieConsent from './CookieConsent';
import ScrollToTop from './ScrollToTop';
import JsonLd from './JsonLd';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <ScrollToTop />
      <JsonLd />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CookieConsent />
    </div>
  );
}
