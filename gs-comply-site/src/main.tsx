import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import './index.css';
import { initConsent } from './lib/consent';
import { registerWebMcpTools } from './lib/webmcp';

initConsent();
registerWebMcpTools();

const app = (
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);

// Pages are pre-rendered to HTML at build time (see scripts/prerender.mjs).
// If the HTML is already there, attach to it instead of replacing it, so visitors never see a blank flash.
const container = document.getElementById('root')!;
if (container.hasChildNodes()) {
  hydrateRoot(container, app);
} else {
  createRoot(container).render(app);
}
