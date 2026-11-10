# 📈 Google Search Console (GSC) Onboarding Runbook — The Flowscape

This runbook guides claiming, verifying, and indexing **The Flowscape** (`theflowscape.com`) and its three regional sanctuaries in Google Search Console to secure #1 search rankings.

---

## 1. Property Setup in Google Search Console

1. Navigate to [Google Search Console](https://search.google.com/search-console).
2. Click **Add Property** in the top-left dropdown.
3. Select **Domain** (Recommended):
   - Enter: `theflowscape.com`
   - Copy the TXT verification record provided by Google.
   - Add this TXT record to your Cloudflare DNS tab:
     - **Type**: `TXT`
     - **Name**: `@`
     - **Content**: `google-site-verification=...`
     - **TTL**: Auto
4. Alternatively, select **URL Prefix**:
   - Enter `https://theflowscape.com`
   - Choose **HTML Tag** verification.
   - Replace the `google_verification_token_flowscape` in `index.html` with your custom token.

---

## 2. Submit XML Sitemap

Once verified:
1. In the left navigation, click **Sitemaps**.
2. Under **Add a new sitemap**, enter:
   ```
   sitemap.xml
   ```
3. Click **Submit**.
4. Verify that Google reads all 4 retreat URLs and images with status **Success**:
   - `https://theflowscape.com/` (Umbrella Hub)
   - `https://theflowscape.com/schwarzwald/` (Germany)
   - `https://theflowscape.com/provence/` (France)
   - `https://theflowscape.com/london/` (UK)

---

## 3. Request Priority URL Inspection & Indexing

To trigger Googlebot to index the new pages within hours rather than waiting weeks:
1. Paste `https://theflowscape.com/` into the top search bar (**Inspect any URL**).
2. Click **Request Indexing**.
3. Repeat for each retreat sub-path:
   - `https://theflowscape.com/schwarzwald/`
   - `https://theflowscape.com/provence/`
   - `https://theflowscape.com/london/`

---

## 4. Rich Results & Schema Validation Check

Verify that Google recognizes your structured data:
1. Open the [Google Rich Results Test](https://search.google.com/test/rich-results).
2. Test `https://theflowscape.com/`.
3. Confirm that Google detects:
   - ✅ **FAQ Rich Snippets**
   - ✅ **Events & Offers**
   - ✅ **Breadcrumbs**
   - ✅ **LodgingBusiness Knowledge Graph**

---

## 5. Bing Webmaster Tools & IndexNow (Instant Multi-Engine Syndication)
1. Open [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Choose **Import from Google Search Console** (1-click sync).
3. All sitemaps, canonical tags, and verification will sync automatically to Bing and Yahoo.
