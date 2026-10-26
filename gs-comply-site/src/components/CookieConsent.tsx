import { useState, useEffect, useId } from 'react';
import { Link } from 'react-router-dom';
import { Cookie } from 'lucide-react';
import {
  getConsent, setConsent, loadAnalytics, clearAnalyticsCookies, OPEN_EVENT, type ConsentChoice,
} from '@/lib/consent';

const btn = 'px-5 py-2.5 text-sm font-semibold rounded-md transition-colors whitespace-nowrap';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [managing, setManaging] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (getConsent() === null) setVisible(true);
    const open = () => {
      setAnalytics(getConsent() === 'accepted');
      setManaging(true);
      setVisible(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const choose = (choice: ConsentChoice) => {
    const was = getConsent();
    setConsent(choice);
    setVisible(false);
    setManaging(false);
    if (choice === 'accepted') {
      loadAnalytics(); // no reload needed
    } else if (was === 'accepted') {
      // Withdrawal: remove cookies and reload so the analytics script is gone from the page
      clearAnalyticsCookies();
      window.location.reload();
    }
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      className="fixed bottom-0 left-0 right-0 z-[100] bg-gray-950 border-t border-gray-800 p-3 sm:p-6 max-h-[90vh] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto">
        {!managing ? (
          <div className="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
            <div className="flex items-start gap-3 flex-1">
              <Cookie className="w-5 h-5 text-[#4ade80] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <p id={titleId} className="text-sm font-semibold text-white">Your privacy choices</p>
                <p className="text-[13px] sm:text-sm text-gray-300 leading-snug sm:leading-relaxed mt-1">
                  We use essential storage to make this site work. With your permission we also use analytics cookies
                  (Google) to understand how the site is used. Nothing optional is loaded unless you accept. See our{' '}
                  <Link to="/privacy-policy" className="text-[#4ade80] underline hover:text-[#22c55e]">Privacy Policy</Link>.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 shrink-0">
              <button
                type="button"
                onClick={() => { setAnalytics(false); setManaging(true); }}
                className="col-span-2 order-last sm:order-none px-3 py-2.5 text-sm font-medium text-gray-300 underline underline-offset-2 hover:text-white"
              >
                Manage preferences
              </button>
              {/* Equal prominence on purpose: rejecting must be as easy as accepting */}
              <button type="button" onClick={() => choose('rejected')} className={`${btn} bg-gray-700 text-white hover:bg-gray-600`}>
                Reject all
              </button>
              <button type="button" onClick={() => choose('accepted')} className={`${btn} bg-[#1A6B3C] text-white hover:bg-[#155a32]`}>
                Accept all
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p id={titleId} className="text-sm font-semibold text-white mb-3">Cookie preferences</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg border border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">Essential</span>
                  <span className="text-xs text-gray-400">Always on</span>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Remembers your cookie choice and keeps the site secure and working. No tracking.
                </p>
              </div>
              <div className="rounded-lg border border-gray-800 p-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="analytics-toggle" className="text-sm font-medium text-white">Analytics</label>
                  <button
                    id="analytics-toggle"
                    type="button"
                    role="switch"
                    aria-checked={analytics}
                    onClick={() => setAnalytics((v) => !v)}
                    className={`relative w-10 h-6 rounded-full transition-colors ${analytics ? 'bg-[#1A6B3C]' : 'bg-gray-600'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${analytics ? 'translate-x-4' : ''}`} />
                    <span className="sr-only">{analytics ? 'On' : 'Off'}</span>
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                  Google Tag Manager / Analytics: anonymous statistics about page visits so we can improve the site.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 justify-end">
              <button type="button" onClick={() => choose('rejected')} className={`${btn} bg-gray-700 text-white hover:bg-gray-600`}>
                Reject all
              </button>
              <button type="button" onClick={() => choose('accepted')} className={`${btn} bg-gray-700 text-white hover:bg-gray-600`}>
                Accept all
              </button>
              <button type="button" onClick={() => choose(analytics ? 'accepted' : 'rejected')} className={`${btn} bg-[#1A6B3C] text-white hover:bg-[#155a32]`}>
                Save my choices
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
