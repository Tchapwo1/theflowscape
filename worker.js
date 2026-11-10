/**
 * The Flowscape — Cloudflare Edge Gateway Worker
 * Serves static multi-sanctuary assets directly from the global edge cache
 * and provides zero-cost serverless concierge inquiry handling.
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. CORS Preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    // 2. Health Check Probe
    if (url.pathname === "/api/health") {
      return new Response(
        JSON.stringify({
          status: "healthy",
          platform: "The Flowscape Edge Gateway",
          timestamp: new Date().toISOString(),
          version: "1.3.0",
        }),
        {
          headers: {
            "Content-Type": "application/json",
            ...CORS_HEADERS,
          },
        }
      );
    }

    // 2b. TSCAPE TV Catalog Endpoint (Supabase Postgres + Static Fallback)
    if (url.pathname === "/api/tv/catalog" && request.method === "GET") {
      if (env && env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
        try {
          const sbUrl = `${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/tscape_videos?is_published=eq.true&order=is_featured.desc,published_at.desc`;
          const sbRes = await fetch(sbUrl, {
            headers: {
              apikey: env.SUPABASE_ANON_KEY,
              Authorization: `Bearer ${env.SUPABASE_ANON_KEY}`,
              Accept: "application/json",
            },
          });

          if (sbRes.ok) {
            const videos = await sbRes.json();
            if (Array.isArray(videos) && videos.length > 0) {
              return new Response(JSON.stringify({ source: "supabase", videos }), {
                headers: {
                  "Content-Type": "application/json",
                  "Cache-Control": "public, max-age=60",
                  ...CORS_HEADERS,
                },
              });
            }
          }
        } catch (sbErr) {
          console.warn("Supabase catalog fallback triggered:", sbErr);
        }
      }

      // Deterministic Static Manifest Fallback
      try {
        const assetRes = await env.ASSETS.fetch(new Request(new URL("/tv/catalog.json", request.url)));
        if (assetRes.ok) {
          const videos = await assetRes.json();
          return new Response(JSON.stringify({ source: "static", videos }), {
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "public, max-age=300",
              ...CORS_HEADERS,
            },
          });
        }
      } catch (e) {}

      return new Response(JSON.stringify({ source: "empty", videos: [] }), {
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }

    // 3. Priority Circle Concierge Inquiry API
    if (url.pathname === "/api/inquiry" && request.method === "POST") {
      try {
        let payload = {};
        const contentType = request.headers.get("content-type") || "";

        if (contentType.includes("application/json")) {
          payload = await request.json();
        } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
          const formData = await request.formData();
          for (const [key, value] of formData.entries()) {
            payload[key] = value;
          }
        }

        // Anti-spam Honeypot Check
        if (payload.website_check || payload._honey) {
          // Silently discard bot submission
          return new Response(JSON.stringify({ success: true, discarded: true }), {
            headers: { "Content-Type": "application/json", ...CORS_HEADERS },
          });
        }

        // Basic Validation
        const email = String(payload.email || "").trim();
        const name = String(payload.name || "").trim();
        const destination = String(payload.destination || "all").trim();

        if (!email || !email.includes("@")) {
          return new Response(
            JSON.stringify({ success: false, error: "A valid email address is required." }),
            { status: 400, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
          );
        }

        const inquiryRecord = {
          id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          timestamp: new Date().toISOString(),
          name: name || "Anonymous Guest",
          email,
          destination,
          season: payload.season || "any",
          accommodations: payload.accommodations || "standard",
          notes: payload.notes || "",
          referrer: request.headers.get("referer") || "direct",
          clientIp: request.headers.get("cf-connecting-ip") || "unknown",
          country: request.headers.get("cf-ipcountry") || "unknown",
        };

        // Free Webhook Relay (Discord, Telegram, Slack, or webhook.site) if configured
        if (env && env.CONCIERGE_WEBHOOK_URL) {
          try {
            await fetch(env.CONCIERGE_WEBHOOK_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                content: `✦ **New Flowscape VIP Inquiry Received**\n- **Name:** ${inquiryRecord.name}\n- **Email:** ${inquiryRecord.email}\n- **Destination:** ${inquiryRecord.destination}\n- **Season:** ${inquiryRecord.season}\n- **Country:** ${inquiryRecord.country}\n- **Timestamp:** ${inquiryRecord.timestamp}`,
              }),
            });
          } catch (e) {
            console.error("Webhook relay warning:", e);
          }
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: "Priority inquiry received. Our concierge team will reach out within 24 hours.",
            inquiryId: inquiryRecord.id,
          }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              ...CORS_HEADERS,
            },
          }
        );
      } catch (err) {
        return new Response(
          JSON.stringify({ success: false, error: "Failed to process inquiry." }),
          { status: 500, headers: { "Content-Type": "application/json", ...CORS_HEADERS } }
        );
      }
    }

    // 4. Default: Static Asset Edge Serving
    return env.ASSETS.fetch(request);
  },
};
