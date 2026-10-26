/**
 * Vercel Function: contact form + health check.
 *
 *   POST /api/contact          saves the enquiry in Supabase (table `enquiries`) and emails a notification via Resend
 *   GET  /api/contact?check=1  shows which settings are present and whether the database table is reachable
 *                              (booleans only, never the secret values)
 *
 * Everything is configured in ONE place: Vercel > Project > Settings > Environment Variables.
 * Changes only apply to NEW deployments, so redeploy after editing them.
 *
 *   VITE_SUPABASE_URL            required   Supabase project URL
 *   VITE_SUPABASE_ANON_KEY       required   anon public key (or set SUPABASE_SERVICE_ROLE_KEY instead)
 *   RESEND_API_KEY               optional   without it, enquiries are still saved but no email is sent
 *   CONTACT_NOTIFICATION_EMAIL   optional   where notifications go (default: VITE_CONTACT_EMAIL, then info.gscomply@gmail.com)
 *   CONTACT_FROM_EMAIL           optional   sender, e.g. "GS Comply Website <enquiries@gscomply.com>" (needs a domain verified in Resend;
 *                                           the default onboarding@resend.dev can only deliver to the email address of your Resend account)
 */
import type { IncomingMessage, ServerResponse } from 'node:http';

const env = (...names: string[]) => names.map((n) => process.env[n]).find(Boolean) || '';
const supabaseUrl = () => env('VITE_SUPABASE_URL', 'SUPABASE_URL').replace(/\/+$/, '');
const serviceKey = () => env('SUPABASE_SERVICE_ROLE_KEY');
const dbKey = () => serviceKey() || env('VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY');
const notifyTo = () => env('CONTACT_NOTIFICATION_EMAIL', 'VITE_CONTACT_EMAIL') || 'info.gscomply@gmail.com';
const notifyFrom = () => env('CONTACT_FROM_EMAIL') || 'GS Comply Website <onboarding@resend.dev>';

function send(res: ServerResponse, status: number, body: Record<string, unknown>) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > 50_000) throw new Error('too large');
    chunks.push(chunk as Buffer);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
const str = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

async function dbCheck(): Promise<string> {
  if (!supabaseUrl() || !dbKey()) return 'not_configured';
  try {
    const r = await fetch(`${supabaseUrl()}/rest/v1/enquiries?select=id&limit=1`, {
      headers: { apikey: dbKey(), Authorization: `Bearer ${dbKey()}` },
    });
    if (r.ok) return 'ok';
    if (r.status === 404) return 'table_missing (run supabase/migrations/20260923060206_create_enquiries_table.sql)';
    if (r.status === 401 || r.status === 403) return 'key_rejected (wrong or expired Supabase key)';
    return `error_${r.status}`;
  } catch {
    return 'unreachable (check VITE_SUPABASE_URL)';
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url || '/', 'http://localhost');

  if (req.method === 'GET') {
    if (url.searchParams.get('check') !== '1') return send(res, 404, { error: 'Not found' });
    return send(res, 200, {
      VITE_SUPABASE_URL: !!supabaseUrl(),
      supabaseKey: serviceKey() ? 'service_role' : env('VITE_SUPABASE_ANON_KEY', 'SUPABASE_ANON_KEY') ? 'anon' : false,
      database: await dbCheck(),
      RESEND_API_KEY: !!env('RESEND_API_KEY'),
      notificationFrom: env('CONTACT_FROM_EMAIL') ? 'custom' : 'onboarding@resend.dev (only delivers to your Resend account email)',
      notificationTo: notifyTo().replace(/^(.).*(@.*)$/, '$1***$2'),
      VITE_CALENDLY_URL: !!env('VITE_CALENDLY_URL'),
      note: 'Environment variable changes only apply after a new deployment.',
    });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return send(res, 405, { ok: false, code: 'METHOD_NOT_ALLOWED' });
  }

  let body: Record<string, unknown>;
  try {
    body = await readJson(req);
  } catch {
    return send(res, 400, { ok: false, code: 'BAD_REQUEST' });
  }

  // Hidden "website" field: humans leave it empty, bots fill it. Pretend success and drop it.
  if (str(body.website, 200)) return send(res, 200, { ok: true, saved: true, emailed: false });

  const data = {
    full_name: str(body.full_name, 200),
    email: str(body.email, 200),
    company: str(body.company, 200),
    country: str(body.country, 100),
    message: str(body.message, 5000),
    phone: str(body.phone, 60) || null,
    job_title: str(body.job_title, 200) || null,
    industry: str(body.industry, 100) || null,
    service_required: str(body.service_required, 100) || null,
    consent: body.consent === true,
  };
  if (!data.full_name || !data.company || !data.country || !data.message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    return send(res, 400, { ok: false, code: 'INVALID_FIELDS' });
  }
  if (!data.consent) return send(res, 400, { ok: false, code: 'NO_CONSENT' });

  if (!supabaseUrl() || !dbKey()) {
    console.error('[contact] Supabase is not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Vercel and redeploy.');
    return send(res, 500, { ok: false, code: 'NOT_CONFIGURED' });
  }

  // 1) Save the enquiry (this is the part that must never be lost)
  try {
    const r = await fetch(`${supabaseUrl()}/rest/v1/enquiries`, {
      method: 'POST',
      headers: {
        apikey: dbKey(),
        Authorization: `Bearer ${dbKey()}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(data),
    });
    if (!r.ok) {
      console.error('[contact] Supabase insert failed', r.status, (await r.text()).slice(0, 500));
      return send(res, 502, { ok: false, code: r.status === 404 ? 'TABLE_MISSING' : 'DB_ERROR' });
    }
  } catch (err) {
    console.error('[contact] Supabase unreachable', err);
    return send(res, 502, { ok: false, code: 'DB_UNREACHABLE' });
  }

  // 2) Email notification (best effort: a failure here must not lose or hide the saved enquiry)
  let emailed = false;
  const resendKey = env('RESEND_API_KEY');
  if (!resendKey) {
    console.error('[contact] RESEND_API_KEY is not set: enquiry saved, but no notification email was sent.');
  } else {
    try {
      const rows: [string, string | null][] = [
        ['Full name', data.full_name], ['Business email', data.email], ['Company', data.company], ['Country', data.country],
        ['Job title', data.job_title], ['Phone', data.phone], ['Industry', data.industry], ['Service required', data.service_required],
      ];
      const html = `<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;padding:20px">
        <div style="background:#1A6B3C;padding:20px;border-radius:8px 8px 0 0"><h1 style="color:#fff;margin:0;font-size:20px">New enquiry: GS Comply Solutions</h1></div>
        <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px">
        <table style="width:100%;border-collapse:collapse">${rows
          .filter(([, v]) => v)
          .map(([k, v]) => `<tr><td style="padding:8px 0;font-weight:bold;color:#374151;width:160px">${k}:</td><td style="padding:8px 0;color:#4b5563">${esc(v)}</td></tr>`)
          .join('')}</table>
        <p style="font-weight:bold;color:#374151;margin:16px 0 8px">Message:</p>
        <p style="color:#4b5563;line-height:1.6;margin:0;white-space:pre-wrap">${esc(data.message)}</p></div></div>`;
      const r = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${resendKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: notifyFrom(),
          to: [notifyTo()],
          subject: `New enquiry from ${data.full_name} (${data.company})`,
          html,
          reply_to: data.email,
        }),
      });
      emailed = r.ok;
      if (!r.ok) console.error('[contact] Resend rejected the email', r.status, (await r.text()).slice(0, 500));
    } catch (err) {
      console.error('[contact] Resend unreachable', err);
    }
  }

  return send(res, 200, { ok: true, saved: true, emailed });
}
