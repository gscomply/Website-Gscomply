import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const NOTIFICATION_EMAIL = "info.gscomply@gmail.com";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const resendApiKey = Deno.env.get("RESEND_API_KEY") as string;

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body = await req.json();
    const {
      full_name, email, company, country, message,
      phone, job_title, industry, service_required,
    } = body;

    if (!full_name || !email || !company || !country || !message || !phone) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1A6B3C; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 20px;">New Enquiry — GS Comply Solutions</h1>
        </div>
        <div style="background: #f9fafb; padding: 24px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151; width: 160px;">Full Name:</td><td style="padding: 8px 0; color: #4b5563;">${full_name}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Business Email:</td><td style="padding: 8px 0; color: #4b5563;"><a href="mailto:${email}" style="color: #1A6B3C;">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Company:</td><td style="padding: 8px 0; color: #4b5563;">${company}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Country:</td><td style="padding: 8px 0; color: #4b5563;">${country}</td></tr>
            ${job_title ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Job Title:</td><td style="padding: 8px 0; color: #4b5563;">${job_title}</td></tr>` : ''}
            ${phone ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Phone:</td><td style="padding: 8px 0; color: #4b5563;">${phone}</td></tr>` : ''}
            ${industry ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Industry:</td><td style="padding: 8px 0; color: #4b5563;">${industry}</td></tr>` : ''}
            ${service_required ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Service Required:</td><td style="padding: 8px 0; color: #4b5563;">${service_required}</td></tr>` : ''}
          </table>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
            <p style="font-weight: bold; color: #374151; margin: 0 0 8px 0;">Requirement / Message:</p>
            <p style="color: #4b5563; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
        </div>
        <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 20px;">
          This enquiry was submitted via the GS Comply Solutions website contact form.
        </p>
      </div>
    `;

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "GS Comply Website <onboarding@resend.dev>",
        to: [NOTIFICATION_EMAIL],
        subject: `New Enquiry from ${full_name} — ${company}`,
        html: emailHtml,
        reply_to: email,
      }),
    });

    if (!resendResponse.ok) {
      const errText = await resendResponse.text();
      console.error("Resend API error:", errText);
      return new Response(
        JSON.stringify({ error: "Failed to send notification email" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
