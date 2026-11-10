# 🏁 Pillar 6: Implementation Plan & Milestones — TSCAPE TV

## 1. Chronological Milestones & Definition of Done (DoD)

### Milestone 1: Specs & Database Migration Contract
- [x] Populate all 6 specification pillars in `./specs/tscape-tv/`.
- [x] Create 1-click Supabase SQL migration (`specs/tscape-tv/supabase_migration.sql`) defining `tscape_videos`, RLS policies, and the `tscape-tv` public storage bucket.

### Milestone 2: Edge Catalog API (`worker.js` + `tv/catalog.json`)
- **Goal**: Enable seamless dual-source catalog resolution (`/api/tv/catalog`).
- **Definition of Done**:
  - Calling `/api/tv/catalog` returns live Supabase episodes if `SUPABASE_URL` & `SUPABASE_ANON_KEY` exist in Cloudflare Worker environment secrets, or cleanly falls back to static `catalog.json` with zero HTTP errors.

### Milestone 3: Hybrid Cinema Player & Broadcast Channel (`/tv/`)
- **Goal**: Build `theflowscape/tv/index.html`, `tv.css`, `tv.js` with obsidian architectural styling.
- **Definition of Done**:
  - Supports `youtube` (`youtube-nocookie.com` privacy lazy facade), `supabase` (public storage MP4 stream), and `local` (`/tv/media/*.mp4`) playback modes interchangeably.
  - Channel filter pills, search, Loading skeletons, Empty state, and focus-trapped accessible Theater Modal verified.

### Milestone 4: Homepage Integration, SEO & Audit Gates
- **Goal**: Surface **TSCAPE TV** across `theflowscape/index.html` nav/showcase strip, embed `VideoObject` JSON-LD schemas, add `/tv/` to `sitemap.xml`, and verify in `scripts/verify_audit.js`.
- **Definition of Done**:
  - `node scripts/verify_audit.js` passes all 7 routes including `/tv/`.
  - `node scripts/build_cloudflare.js` bundles `dist/tv/` cleanly and live Cloudflare deployment returns `HTTP 200 OK` on `https://theflowscape.com/tv/`.
