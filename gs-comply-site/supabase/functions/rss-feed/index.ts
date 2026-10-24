import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: posts, error } = await supabase
      .from('posts')
      .select('title, slug, excerpt, category, published_at, author_name, seo_description')
      .in('status', ['published', 'scheduled'])
      .order('published_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const domain = "https://gscomply.com";
    const items = (posts || []).map((p: any) => {
      const url = `${domain}/insights/${p.slug}`;
      const pubDate = p.published_at ? new Date(p.published_at).toUTCString() : new Date().toUTCString();
      const desc = p.seo_description || p.excerpt || '';
      return `    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description><![CDATA[${desc}]]></description>
      <category>${p.category || 'General'}</category>
      <author>${p.author_name || 'GS Comply Solutions'}</author>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    }).join('\n');

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>GS Comply Solutions - Insights</title>
    <link>${domain}/insights</link>
    <description>Regulatory compliance insights for manufacturers covering REACH, RoHS, PFAS, IMDS, SCIP and more.</description>
    <language>en</language>
    <atom:link href="${domain}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(rss, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error("RSS feed error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate RSS feed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
