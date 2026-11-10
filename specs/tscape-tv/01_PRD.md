# 📋 Pillar 1: Product Requirements Document (PRD) — TSCAPE TV

## 1. Product Vision & Purpose
**TSCAPE TV** (`theflowscape.com/tv/`) is the official editorial video media network of **The Flowscape**. Rather than fragmented social clips, TSCAPE TV acts as a calm, architectural broadcast sanctuary communicating the ethos, landscapes, somatic practices, and guided audio-visual rituals of The Flowscape across Europe.

## 2. Core Objectives
1. **Communicate Sanctuary Atmosphere**: Immerse prospective guests in the visual silence and tactile beauty of Schwarzwald, Provence, London, Tuscany, and the Swiss Alps before booking.
2. **Deliver Immediate Practice Value**: Offer guided sound baths, breathwork sessions, and yoga nidra audio-visual transmissions that build guest trust and retention.
3. **100% Zero-Cost Hybrid Media Engine**:
   - **Option 1 — YouTube (`youtube-nocookie.com`)**: Privacy-first, lazy-loaded video facades for long-form documentaries, masterclasses, and 4K sanctuary films with zero hosting or egress charges.
   - **Option 2 — Direct Storage (Supabase Storage / Website Assets)**: Custom HTML5 luxury video playback backed by **Supabase** (`tscape_videos` table + `tscape-tv` Storage bucket) or static files under `/tv/media/`.
4. **Google Video SEO Dominance**: Structured `VideoObject` JSON-LD metadata on every broadcast episode to capture Google Video Search carousels.

## 3. Scope & Features (MVP)
- **Featured Broadcast Cinema Hero**: Full-bleed cinema stage displaying the flagship Flowscape anthology film with one-click play modal or inline cinema theater.
- **Channel Category Filter Engine**:
  - *All Transmissions*
  - *Sanctuary Films* (Documentary explorations of retreats)
  - *Guided Practices* (Vinyasa, Breathwork, Sound Baths, Nidra)
  - *Terroir & Culinary* (Soil-to-table chef stories & nature rituals)
  - *Short Reels* (Direct storage / 15–60s atmospheric moments)
- **Hybrid Playback Theater Modal / Inline Stage**:
  - Automatically renders privacy-enhanced YouTube iframe for `source_type: "youtube"`.
  - Automatically renders styled native HTML5 `<video>` player with chapters/poster for `source_type: "supabase"` or `"local"`.
- **Supabase Catalog Sync + Graceful Fallback**:
  - Dynamically fetches live episodes via Cloudflare Worker (`/api/tv/catalog`) connected to Supabase Postgres if environment secrets exist, or falls back deterministically to curated static `catalog.json`.

## 4. Out-of-Scope Boundaries (MVP)
- No user-uploaded comments or community forums (preserves curated luxury calm).
- No third-party ad networks or pre-roll tracking pixels.
- No paywalled video subscriptions (all broadcasts are open editorial communication).
