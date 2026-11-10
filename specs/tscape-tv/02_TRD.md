# ⚙️ Pillar 2: Technical Requirements Document (TRD) — TSCAPE TV

## 1. Tech Stack & Zero-Cost Architecture
- **Frontend**: Vanilla HTML5, CSS3 Custom Properties, Semantic ES6+ JavaScript (zero bloated frameworks; instant First Contentful Paint `< 0.5s`).
- **Edge Compute / Proxy**: Cloudflare Workers (`worker.js`) exposing `GET /api/tv/catalog`.
- **Media Storage & Database Options (Hybrid Zero-Cost)**:
  1. **YouTube Privacy-Enhanced (`youtube-nocookie.com`)**: Lazy facade pattern (`loading="lazy"` poster + Play overlay -> injects iframe only on interaction, preserving `CLS = 0` and 100 Lighthouse Performance).
  2. **Supabase Free Tier (Postgres + Public Bucket)**:
     - Database table: `public.tscape_videos`
     - Storage bucket: `public` bucket `tscape-tv` (serves MP4/WebM with Byte-Range header streaming).
  3. **Website Static Storage (`/tv/media/`)**: Hosted directly inside Cloudflare Workers Static Assets (`<= 25 MiB` per clip ceiling).

## 2. File Tree Contract
```text
theflowscape/
├── index.html                  (Add "TSCAPE TV" nav link & editorial showcase strip)
├── sitemap.xml                 (Include https://theflowscape.com/tv/)
└── tv/
    ├── index.html              (TSCAPE TV Channel Hub + VideoObject JSON-LD)
    ├── tv.css                  (Cinema theater, broadcast grid & modal styles)
    ├── tv.js                   (Hybrid YouTube + Supabase/MP4 player & catalog loader)
    ├── catalog.json            (Default offline/deterministic broadcast manifest)
    └── media/                  (Optional local optimized MP4 clips & video posters)

specs/tscape-tv/
├── 01_PRD.md ... 06_IMPLEMENTATION_PLAN.md
└── supabase_migration.sql      (1-click Postgres & Storage Bucket setup SQL)

worker.js                       (Add GET /api/tv/catalog endpoint querying Supabase if configured)
```

## 3. Performance & Spatial Budgets
- **Page Weight Target (Initial Load)**: `< 250 KB` HTML/CSS/JS before video playback begins (no pre-fetched YouTube scripts or auto-buffered gigabyte MP4s!).
- **Core Web Vitals**: `LCP <= 1.2s`, `CLS = 0.00`, `preload="none"` or `"metadata"` on direct video tags.
- **Accessibility**: Full keyboard navigation (`Escape` closes theater modal, Space/Enter toggles playback, visible focus rings, `aria-live="polite"` status announcements).
