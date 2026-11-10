-- ============================================================================
-- TSCAPE TV (The Flowscape Media) — Zero-Cost Supabase Setup Migration
-- Paste and Run inside Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Create tscape_videos Catalog Table
CREATE TABLE IF NOT EXISTS public.tscape_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('documentary', 'practice', 'culinary', 'reel')),
  sanctuary TEXT NOT NULL DEFAULT 'all' CHECK (sanctuary IN ('all', 'schwarzwald', 'provence', 'london', 'tuscany', 'swiss-alps')),
  sanctuary_url TEXT NOT NULL DEFAULT 'https://theflowscape.com/',
  source_type TEXT NOT NULL CHECK (source_type IN ('youtube', 'supabase', 'local')),
  video_url TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  duration_label TEXT NOT NULL DEFAULT '03:00',
  duration_iso TEXT NOT NULL DEFAULT 'PT3M0S',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row-Level Security (RLS)
ALTER TABLE public.tscape_videos ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous public viewers to read ONLY published episodes
CREATE POLICY "Public can view published TSCAPE TV episodes"
  ON public.tscape_videos
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- 4. Create Public Storage Bucket for Direct MP4 Uploads ('tscape-tv')
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'tscape-tv',
  'tscape-tv',
  true,
  52428800, -- 50MB max per clip (keeps free tier fast & clean)
  ARRAY['video/mp4', 'video/webm', 'image/jpeg', 'image/webp', 'image/png']
)
ON CONFLICT (id) DO NOTHING;

-- 5. Allow public read access to media files inside 'tscape-tv' bucket
CREATE POLICY "Public read access for TSCAPE TV media bucket"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'tscape-tv');

-- 6. Seed Starter Editorial Episodes (Modify video_url with your real YouTube IDs or Supabase Bucket URLs)
INSERT INTO public.tscape_videos (
  slug, title, description, category, sanctuary, sanctuary_url,
  source_type, video_url, poster_url, duration_label, duration_iso, is_featured
) VALUES
(
  'the-quiet-return-manifesto',
  'Move With The Landscape: The Quiet Return',
  'An architectural film exploring The Flowscape philosophy across Europe—where ancient pine canopies, Provençal limestone, and urban glasshouses restore natural circadian cadence.',
  'documentary',
  'all',
  'https://theflowscape.com/#collection',
  'youtube',
  'inpok4MKVLM',
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1400&q=85',
  '05:12',
  'PT5M12S',
  true
),
(
  'schwarzwald-canopy-vinyasa',
  'Schwarzwald: Morning Flow Beneath Ancient Pines',
  'Step inside our timber sanctuary near Freiburg as dawn mist lifts through the Black Forest. Guided solar vinyasa followed by cedarwood herbal sauna and silence.',
  'practice',
  'schwarzwald',
  'https://theflowscape.com/schwarzwald/',
  'youtube',
  'v7AYKMP6rOE',
  'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85',
  '12:30',
  'PT12M30S',
  false
)
ON CONFLICT (slug) DO NOTHING;
