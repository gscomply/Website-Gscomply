// WebMCP: exposes a few in-page tools to browser agents (Chrome, ChatGPT desktop browser, ...).
// Spec (W3C draft): tools are registered with document.modelContext.registerTool(); navigator.modelContext is
// only used as a fallback for browsers that still expose the earlier location.
//
// Browsers without WebMCP simply skip this file's work (feature detection), and it never runs at build time:
// it is called from src/main.tsx, which only runs in the browser (the prerenderer uses src/entry-server.tsx).
//
// The tools are read-only, except "navigate_to_page" which changes the page the visitor is on.
// To add a tool: add an object to `tools` below.
import { company } from '@/data/company';
import { serviceCategories } from '@/data/services';

interface ToolResult {
  content: { type: 'text'; text: string }[];
}

interface WebMcpTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations?: { readOnlyHint?: boolean };
  execute: (input: Record<string, unknown>) => Promise<ToolResult> | ToolResult;
}

interface ModelContextLike {
  registerTool: (tool: WebMcpTool) => unknown;
}

const json = (value: unknown): ToolResult => ({
  content: [{ type: 'text', text: JSON.stringify(value, null, 2) }],
});

/** Public pages an agent can open. Keep in sync with PAGES in src/entry-server.tsx. */
const pages: Record<string, string> = {
  home: '/',
  about: '/about',
  services: '/services',
  industries: '/industries',
  regulations: '/regulations',
  'imds-cdx': '/imds-cdx',
  sustainability: '/sustainability',
  'scip-notification': '/scip-notification-services',
  'product-material-compliance': '/product-material-compliance',
  'training-services': '/training-services',
  contact: '/contact',
  'privacy-policy': '/privacy-policy',
  terms: '/terms',
};

const tools: WebMcpTool[] = [
  {
    name: 'list_services',
    description:
      'List the compliance services offered by GS Comply Solutions, grouped by category, with who each service is for, its deliverables and the page that describes it.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute: () =>
      json(
        serviceCategories.map((cat) => ({
          category: cat.title,
          summary: cat.description,
          page: cat.path ?? `/services#${cat.id}`,
          services: cat.services.map((s) => ({
            title: s.title,
            whoItIsFor: s.who,
            deliverables: s.deliverables,
            page: s.path ?? `/services#${s.id}`,
          })),
        })),
      ),
  },
  {
    name: 'list_regulations',
    description:
      'List the regulations and standards GS Comply Solutions supports (for example REACH, RoHS, PFAS, IMDS, SCIP), with a short description of each. Optionally filter by a search term.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Optional text to filter by, e.g. "REACH" or "battery".' },
      },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true },
    execute: async (input) => {
      // Loaded on demand so the regulations text is not part of the main script.
      const { regulationCategories } = await import('@/data/regulations');
      const q = typeof input.query === 'string' ? input.query.trim().toLowerCase() : '';
      const result = regulationCategories
        .map((cat) => ({
          category: cat.category,
          regulations: cat.items
            .filter((r) => !q || `${r.name} ${r.desc}`.toLowerCase().includes(q))
            .map((r) => ({ name: r.name, description: r.desc })),
        }))
        .filter((cat) => cat.regulations.length > 0);
      return json({ page: '/regulations', results: result });
    },
  },
  {
    name: 'get_contact_options',
    description:
      'Get how to reach GS Comply Solutions: contact email, location, working hours, the contact (enquiry form) page and the link to book a free call.',
    inputSchema: { type: 'object', properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
    execute: () =>
      json({
        company: company.name,
        email: company.email,
        location: `${company.city}, ${company.country}`,
        workingHours: company.workingHours,
        enquiryFormPage: `${company.domain}/contact`,
        bookFreeCallUrl: company.calendlyUrl,
      }),
  },
  {
    name: 'navigate_to_page',
    description: 'Open a page of the GS Comply Solutions website in the current tab.',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'string', enum: Object.keys(pages), description: 'Which page to open.' },
      },
      required: ['page'],
      additionalProperties: false,
    },
    execute: (input) => {
      const key = typeof input.page === 'string' ? input.page : '';
      const path = pages[key];
      if (!path) return json({ ok: false, error: `Unknown page. Choose one of: ${Object.keys(pages).join(', ')}` });
      window.location.assign(path);
      return json({ ok: true, opened: path });
    },
  },
];

let registered = false;

/** Registers the tools once. Safe to call in any browser: does nothing where WebMCP is unavailable. */
export function registerWebMcpTools(): void {
  if (registered || typeof document === 'undefined') return;
  const modelContext =
    (document as unknown as { modelContext?: ModelContextLike }).modelContext ??
    (typeof navigator !== 'undefined' ? (navigator as unknown as { modelContext?: ModelContextLike }).modelContext : undefined);
  if (!modelContext || typeof modelContext.registerTool !== 'function') return;
  registered = true;
  for (const tool of tools) {
    try {
      modelContext.registerTool(tool);
    } catch (err) {
      // A tool that fails to register (for example a duplicate name) must never break the site.
      console.warn(`[webmcp] could not register "${tool.name}"`, err);
    }
  }
}
