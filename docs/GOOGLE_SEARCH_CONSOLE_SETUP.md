# ✦ The Flowscape — 100% Free Google Search Console (GSC) & Indexing Guide

This guide ensures **The Flowscape** and all 5 regional sanctuaries are crawled, indexed, and ranked #1 on Google at **zero cost**.

---

## 1. Add Property in Google Search Console (100% Free)

1. Open [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** in the top-left dropdown.
3. Select **Domain** (Recommended) or **URL prefix**:
   - Option A (Domain): Enter `theflowscape.com`
   - Option B (URL Prefix): Enter `https://theflowscape.com/`

---

## 2. Verify Ownership via DNS or HTML Meta Tag

### Method A: DNS TXT Record (Easiest via Cloudflare DNS)
1. Copy the TXT verification string provided by Google (e.g. `google-site-verification=abcdef...`).
2. Go to your Cloudflare Dashboard → **DNS** → **Records**.
3. Click **Add record**:
   - Type: `TXT`
   - Name: `@` (or `theflowscape.com`)
   - Content: `google-site-verification=abcdef...`
   - TTL: Auto
4. Click **Save** → Return to Google Search Console and click **Verify**. (Verification is immediate thanks to Cloudflare edge DNS).

### Method B: HTML Meta Tag (Already Injected into All 6 Codebases)
In all 6 HTML files, we have embedded:
```html
<meta name="google-site-verification" content="google-site-verification-flowscape-token">
<meta name="msvalidate.01" content="bing-site-verification-flowscape-token">
```
Simply replace `google-site-verification-flowscape-token` with your unique token from GSC.

---

## 3. Submit XML Sitemap to Google

Once verified:
1. In Google Search Console, navigate to **Indexing** → **Sitemaps** in the left sidebar.
2. In the "Add a new sitemap" input, enter:
   ```text
   sitemap.xml
   ```
   (Full URL: `https://theflowscape.com/sitemap.xml`)
3. Click **Submit**.
4. Status will show: **Success** with all 6 URLs discovered:
   - `https://theflowscape.com/` (Umbrella Hub)
   - `https://theflowscape.com/schwarzwald/` (Black Forest)
   - `https://theflowscape.com/provence/` (Luberon Valley)
   - `https://theflowscape.com/london/` (Richmond & Hampstead)
   - `https://theflowscape.com/tuscany/` (Chianti & Val d'Orcia)
   - `https://theflowscape.com/swiss-alps/` (Engadin Valley)

---

## 4. Request Instant Priority URL Inspection (URL Inspection Tool)

To jump the crawl queue and get Googlebot to index within hours:
1. Click the top search bar: **Inspect any URL in "https://theflowscape.com/"**.
2. Paste: `https://theflowscape.com/` and press Enter.
3. Click **Request Indexing**.
4. Repeat for the 3 active retreat sanctuaries:
   - `https://theflowscape.com/schwarzwald/`
   - `https://theflowscape.com/provence/`
   - `https://theflowscape.com/london/`

---

## 5. Bing Webmaster Tools & Yahoo / DuckDuckGo Auto-Sync

1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters) (100% Free).
2. Click **Import from Google Search Console**.
3. Bing will automatically import your verified domain, sitemaps, and indexing requests with one click, simultaneously powering Yahoo and DuckDuckGo search rankings!
