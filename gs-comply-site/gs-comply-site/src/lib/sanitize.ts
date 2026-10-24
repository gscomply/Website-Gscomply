import DOMPurify from 'isomorphic-dompurify';

/**
 * Allow-list for blog HTML. Everything the TipTap editor can produce is here;
 * anything else (script, iframe, style, on* handlers, javascript: URLs) is removed.
 */
const ALLOWED_TAGS = [
  'h2', 'h3', 'h4', 'p', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote',
  'strong', 'b', 'em', 'i', 'u', 's', 'code', 'pre', 'span', 'a', 'img',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'colgroup', 'col', 'caption',
];
const ALLOWED_ATTR = [
  'href', 'target', 'rel', 'src', 'alt', 'title', 'width', 'height', 'loading',
  'class', 'id', 'colspan', 'rowspan', 'colwidth',
];

let hooked = false;
function ensureHooks() {
  if (hooked) return;
  hooked = true;
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A') {
      const href = node.getAttribute('href') || '';
      if (/^https?:\/\//i.test(href)) {
        node.setAttribute('target', '_blank');
        node.setAttribute('rel', 'noopener noreferrer');
      } else {
        node.removeAttribute('target');
      }
    }
    if (node.tagName === 'IMG') {
      node.setAttribute('loading', 'lazy');
      if (!node.getAttribute('alt')) node.setAttribute('alt', '');
    }
  });
}

export function sanitizeHtml(html: string): string {
  ensureHooks();
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOW_DATA_ATTR: false,
    // http(s), mailto, tel, and relative / hash links only
    ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
  });
}

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface RenderedContent {
  html: string;
  toc: TocItem[];
}

function slugForId(text: string, used: Set<string>): string {
  const base =
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 60)
      .replace(/-+$/g, '') || 'section';
  let id = base;
  let n = 2;
  while (used.has(id)) id = `${base}-${n++}`;
  used.add(id);
  return id;
}

/** Sanitise, give every h2/h3 a stable id and build the table of contents. */
export function renderPostContent(rawHtml: string | null | undefined): RenderedContent {
  if (!rawHtml) return { html: '', toc: [] };
  const clean = sanitizeHtml(rawHtml);
  const doc = new DOMParser().parseFromString(`<div id="__root">${clean}</div>`, 'text/html');
  const root = doc.getElementById('__root')!;
  const used = new Set<string>();
  const toc: TocItem[] = [];
  root.querySelectorAll('h2, h3').forEach((h) => {
    const text = (h.textContent || '').trim();
    if (!text) return;
    const id = slugForId(text, used);
    h.setAttribute('id', id);
    toc.push({ id, text, level: h.tagName === 'H2' ? 2 : 3 });
  });
  return { html: root.innerHTML, toc };
}
