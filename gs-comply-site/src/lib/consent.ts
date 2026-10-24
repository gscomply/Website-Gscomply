/**
 * Cookie / analytics consent (GDPR + ePrivacy).
 *
 *  - Nothing optional runs until the visitor clicks Accept.
 *  - Google Tag Manager is injected from here, never from index.html.
 *  - Google Consent Mode starts as "denied" for everything; only analytics is granted on Accept.
 *  - The choice is remembered for 12 months, then we ask again.
 *  - It can be changed or withdrawn at any time (footer: "Cookie settings").
 */
const STORAGE_KEY = 'gscomply_cookie_consent';
const MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000;
export const GTM_ID = 'GTM-NBVPB3NT';
export const OPEN_EVENT = 'gscomply:open-cookie-settings';

export type ConsentChoice = 'accepted' | 'rejected';

export function getConsent(): ConsentChoice | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    // Older versions stored the bare string "accepted" / "rejected" (no date): treat as expired and ask again
    if (raw === 'accepted' || raw === 'rejected') return null;
    const { choice, ts } = JSON.parse(raw) as { choice: ConsentChoice; ts: number };
    if ((choice !== 'accepted' && choice !== 'rejected') || Date.now() - ts > MAX_AGE_MS) return null;
    return choice;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ choice, ts: Date.now() }));
  } catch {
    /* storage blocked: the banner will simply show again next visit */
  }
}

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

let loaded = false;

/** Injects Google Tag Manager. Call only after consent. */
export function loadAnalytics() {
  if (loaded || typeof document === 'undefined') return;
  loaded = true;
  const w = window;
  w.dataLayer = w.dataLayer || [];
  function g(..._a: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer!.push(arguments);
  }
  g('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  g('consent', 'update', { analytics_storage: 'granted' }); // advertising stays denied
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`;
  document.head.appendChild(s);
}

/** Removes Google analytics cookies already set on this site (used when consent is withdrawn). */
export function clearAnalyticsCookies() {
  const host = location.hostname;
  const parts = host.split('.');
  const domains = new Set<string | undefined>([undefined, host, `.${host}`]);
  for (let i = 1; i < parts.length - 1; i++) domains.add(`.${parts.slice(i).join('.')}`);
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim();
    if (/^(_ga|_gid|_gat|_gcl|_dc_gtm)/.test(name)) {
      domains.forEach((d) => {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${d ? `; domain=${d}` : ''}`;
      });
    }
  });
}

/** Call on app start: loads analytics only if the visitor previously accepted. */
export function initConsent() {
  if (getConsent() === 'accepted') loadAnalytics();
}

export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}
