# ☁️ Cloudflare Pages Production Deployment Guide — The Flowscape

This guide outlines the production deployment of **The Flowscape** (`theflowscape.com`) and its three regional sanctuaries (`/schwarzwald/`, `/provence/`, `/london/`) to **Cloudflare Pages**.

---

## 1. Quick Local Build & Preview

Before deploying, build the unified distribution bundle:

```bash
# 1. Run audit and verification checks
npm test

# 2. Build the production bundle into ./dist/
npm run build

# 3. Preview locally with Python
npm run preview
# Open http://localhost:3000 to test the complete multi-site ecosystem
```

---

## 2. Cloudflare Deployment Options

### Option A: Cloudflare Git Integration (Recommended for Continuous Delivery)
1. Push this repository to GitHub or GitLab.
2. In the **Cloudflare Dashboard** $\rightarrow$ **Workers & Pages** $\rightarrow$ **Create Application** $\rightarrow$ **Pages** $\rightarrow$ **Connect to Git**.
3. Select the repository and configure the build settings:
   - **Project Name**: `theflowscape`
   - **Framework Preset**: `None`
   - **Build Command**: `node scripts/build_cloudflare.js`
   - **Build Output Directory**: `dist`
4. Click **Save and Deploy**. Cloudflare Pages will automatically deploy preview branches for PRs and production releases for `main`.

---

### Option B: Cloudflare CLI Direct Deployment (Wrangler)
To deploy directly from the command line:

```bash
# 1. Compile the distribution package
npm run build

# 2. Deploy the dist directory directly to Cloudflare Pages
npx wrangler pages deploy dist --project-name=theflowscape
```

---

## 3. Custom Domain & DNS Mapping (`theflowscape.com`)

1. In Cloudflare Pages $\rightarrow$ **theflowscape** $\rightarrow$ **Custom Domains** $\rightarrow$ **Set up a domain**.
2. Enter `theflowscape.com` (and `www.theflowscape.com`).
3. Cloudflare automatically provisions an SSL/TLS edge certificate (Universal SSL) and binds the DNS `CNAME` / `A` apex records.

### Subpath Routing Verification
The bundle handles all three retreats under unified clean subpaths:
- Master Umbrella Portal: `https://theflowscape.com/`
- Schwarzwald Sanctuary: `https://theflowscape.com/schwarzwald/`
- Provence Sanctuary: `https://theflowscape.com/provence/`
- London Sanctuary: `https://theflowscape.com/london/`

URL trailing slashes and legacy shortcuts are managed via [`dist/_redirects`](file:///d:/Downloads/the%20flowscape%20project/dist/_redirects):
- `/schwarzwald` $\rightarrow$ `/schwarzwald/` (301)
- `/germany` $\rightarrow$ `/schwarzwald/` (301)
- `/france` $\rightarrow$ `/provence/` (301)
- `/uk` $\rightarrow$ `/london/` (301)

---

## 4. Edge Security & Performance Headers

Configured in [`dist/_headers`](file:///d:/Downloads/the%20flowscape%20project/dist/_headers):
- **Content Security Policy (CSP)**: Blocks cross-site scripting and unauthorized inline injections.
- **Strict-Transport-Security (HSTS)**: 1-year preload policy.
- **Cache-Control**: Immutable 1-year caching for static CSS/JS/images/SVGs, with instant revalidation (`max-age=0, must-revalidate`) for HTML pages to ensure retreat date announcements update in real time.
