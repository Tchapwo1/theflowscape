# 🗄️ Pillar 5: Database Schema & Media Storage Contracts — TSCAPE TV

## 1. Hybrid Catalog Schema (`tscape_videos`)
Applies identically whether served from **Supabase PostgreSQL** (`public.tscape_videos`) or the static manifest (`tv/catalog.json`):

| Column | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | No (PK) | Unique identifier |
| `slug` | `text` | No (Unique) | URL-safe slug (`schwarzwald-forest-awakening`) |
| `title` | `text` | No | Editorial episode title |
| `description` | `text` | No | Narrative synopsis for viewers & VideoObject SEO |
| `category` | `text` | No | `documentary` \| `practice` \| `culinary` \| `reel` |
| `sanctuary` | `text` | No | `all` \| `schwarzwald` \| `provence` \| `london` \| `tuscany` \| `swiss-alps` |
| `sanctuary_url` | `text` | No | Target retreat URL (`../schwarzwald-yoga-escape/index.html` or `/schwarzwald/`) |
| `source_type` | `text` | No | **`youtube`** \| **`supabase`** \| **`local`** |
| `video_url` | `text` | No | For `youtube`: 11-char ID (e.g. `dQw4w9WgXcQ`) or embed URL. For `supabase`/`local`: full MP4 URL |
| `poster_url` | `text` | No | High-res WebP/JPG still frame (`16:9`) |
| `duration_label` | `text` | No | Display duration (`03:45`) |
| `duration_iso` | `text` | No | ISO 8601 duration for Google VideoObject (`PT3M45S`) |
| `is_featured` | `boolean` | No | Highlights episode in the Cinema Spotlight stage |
| `published_at` | `timestamptz` | No | Publication timestamp |
| `is_published` | `boolean` | No | Safety flag; only `true` rows visible publicly via RLS |

## 2. Supabase Storage Architecture (Free Tier)
- **Bucket ID**: `tscape-tv`
- **Public Access**: `true` (Read-only public URLs via CDN, no signed token expiration issues for public marketing media).
- **Recommended File Ceiling**: Compress uploaded clips via HandBrake/FFmpeg (`H.264 / AAC`, `1080p`, `< 15 MB`) so 1,000+ monthly streams fit effortlessly inside Supabase's free egress allowance, while hosting full 10–30 minute sessions on YouTube (`source_type: 'youtube'`).

## 3. Row-Level Security (RLS) Contract
- `SELECT`: Public anonymous users (`anon`) can read rows ONLY where `is_published = true`.
- `INSERT / UPDATE / DELETE`: Strictly restricted to authenticated admin (`service_role` or authenticated Studio Manager), preventing unauthorized content tampering.
