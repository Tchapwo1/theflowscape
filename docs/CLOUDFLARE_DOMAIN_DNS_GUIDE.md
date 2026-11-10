# ✦ The Flowscape — Zero-Cost Custom Domain & Cloudflare Edge Routing

This guide walks you through connecting `theflowscape.com` to Cloudflare Pages/Workers at **100% zero extra cost** (included completely free in Cloudflare's standard free tier).

---

## 1. Cloudflare Nameservers (DNS)

If your domain registrar is Namecheap, GoDaddy, Google/Squarespace, or Porkbun:
1. Log into your registrar's dashboard.
2. Select `theflowscape.com` → **Manage DNS** → **Custom Nameservers**.
3. Set your nameservers to your assigned Cloudflare nameservers (e.g., `alec.ns.cloudflare.com` and `claire.ns.cloudflare.com`).

---

## 2. Cloudflare Pages / Workers Custom Domain Link

### For Cloudflare Workers / Pages:
1. In Cloudflare Dashboard, go to **Workers & Pages**.
2. Select your project: **`theflowscape`**.
3. Go to the **Settings** tab → **Domains & Routes** (or **Custom Domains** on Pages).
4. Click **Add a domain**.
5. Enter:
   - Primary: `theflowscape.com`
   - Secondary / Alias: `www.theflowscape.com`
6. Click **Continue** → Cloudflare automatically generates the free universal edge SSL/TLS certificate and provisions HTTPS within minutes.

---

## 3. Recommended Free Cloudflare Settings

In your Cloudflare dashboard for `theflowscape.com`:

| Setting | Location | Recommended Value | Cost |
| :--- | :--- | :--- | :--- |
| **SSL/TLS Encryption Mode** | *SSL/TLS → Overview* | **Full (Strict)** | Free |
| **Always Use HTTPS** | *SSL/TLS → Edge Certificates* | **On** | Free |
| **HTTP/3 (QUIC)** | *Speed → Optimization* | **On** | Free |
| **Brotli Compression** | *Speed → Optimization* | **On** | Free |
| **Early Hints** | *Speed → Optimization* | **On** | Free |
| **Auto Minify** | *Speed → Optimization* | CSS, JS, HTML | Free |
| **Security Level** | *Security → Settings* | **Medium** | Free |

---

## 4. Apex to WWW (or WWW to Apex) Redirect Rule

To prevent duplicate content in Google and consolidate domain authority:
1. In Cloudflare dashboard, go to **Rules** → **Redirect Rules**.
2. Click **Create rule**.
3. Rule Name: `Redirect WWW to Apex`.
4. If incoming request: `Hostname equals www.theflowscape.com`.
5. Then: Dynamic Redirect:
   - URL: `concat("https://theflowscape.com", http.request.uri.path)`
   - Status code: `301 - Moved Permanently`.
6. Save and Deploy.

Now, all traffic to `https://www.theflowscape.com/*` will cleanly redirect to `https://theflowscape.com/*` preserving 100% of Google link equity!
