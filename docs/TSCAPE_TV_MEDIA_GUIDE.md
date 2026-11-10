# ✦ TSCAPE TV — Zero-Cost Video Media & Supabase Guide

**TSCAPE TV** (`https://theflowscape.com/tv/`) runs on a **Hybrid Dual-Source Engine** supporting both **YouTube** and **Direct Storage (Website MP4 or Supabase Storage)**. Everything stays **100% free**.

---

## Option 1: Publish via YouTube (Best for Full Films & Long Practices)
- **Cost**: 100% Free (unlimited 4K bandwidth & storage).
- **Privacy**: Automatically embeds via `youtube-nocookie.com` with lazy thumbnails so your page loads in `< 0.8s`.
- **How to Add**:
  1. Upload your film or meditation to YouTube (Unlisted or Public).
  2. Copy the 11-character Video ID from the URL (e.g. `youtube.com/watch?v=inpok4MKVLM` → ID is `inpok4MKVLM`).
  3. Add an entry in `theflowscape/tv/catalog.json` (or your Supabase table) with:
     ```json
     "source_type": "youtube",
     "video_url": "YOUR_YOUTUBE_ID"
     ```

---

## Option 2A: Website Static Storage (Best for 6–30s Reels & Hero Loops)
- **Cost**: 100% Free on Cloudflare Workers (up to `25 MB` per `.mp4` file, unlimited bandwidth!).
- **How to Add**:
  1. Drop any compressed `.mp4` clip into `theflowscape/tv/media/` (for example `tuscany-sunset.mp4`).
  2. Add an entry in `catalog.json` with:
     ```json
     "source_type": "local",
     "video_url": "media/tuscany-sunset.mp4"
     ```
  3. Push to GitHub—Cloudflare distributes it worldwide automatically.

---

## Option 2B: Connect Free Supabase (Dynamic CMS + Cloud Video Bucket)
Whenever you want to upload videos and edit episodes from a dashboard without touching code:
1. Create a free project at **[supabase.com](https://supabase.com)** (includes 500 MB database + 1 GB video bucket + 2 GB/month egress free).
2. Open **SQL Editor** inside Supabase, paste the entire contents of [`specs/tscape-tv/supabase_migration.sql`](../specs/tscape-tv/supabase_migration.sql), and click **Run**.
   *(This automatically creates the `tscape_videos` table, public RLS read rules, and the `tscape-tv` storage bucket!)*
3. In Cloudflare Dashboard → **Workers & Pages → `theflowscape` → Settings → Runtime variables and secrets**:
   - Add Variable: `SUPABASE_URL` = your Supabase Project URL
   - Add Variable (or Secret): `SUPABASE_ANON_KEY` = your Supabase `anon public` API key
4. Upload `.mp4` videos to Supabase **Storage → `tscape-tv`**, copy their public URL, and insert rows into **Table Editor → `tscape_videos`** with `source_type: "supabase"`. Your live Worker (`/api/tv/catalog`) switches seamlessly to Supabase!
