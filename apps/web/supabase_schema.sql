-- Table for Journey Timeline Events
CREATE TABLE IF NOT EXISTS public.journey_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    year TEXT NOT NULL,
    title TEXT NOT NULL,
    desc_content TEXT NOT NULL,
    img_left TEXT,
    img_right TEXT,
    display_order INTEGER DEFAULT 0
);

-- Table for Photo Grid Memories
CREATE TABLE IF NOT EXISTS public.memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    img_url TEXT NOT NULL,
    message TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- Table for Experience Feedback
CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    content TEXT NOT NULL,
    user_name TEXT -- Optional: if you want to track who sent it
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.journey_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policies for public reading (so everyone can see your journey/memories)
CREATE POLICY "Public Read Journey" ON public.journey_events FOR SELECT USING (true);
CREATE POLICY "Public Read Memories" ON public.memories FOR SELECT USING (true);

-- Policy for anyone to insert feedback
CREATE POLICY "Public Insert Feedback" ON public.feedback FOR INSERT WITH CHECK (true);

-- Note: Admin write policies should be added later or handled via Supabase Dashboard for simplicity.

-- STORAGE BUCKET SETUP
-- 1. Create a bucket named 'images' in the Supabase Dashboard Storage section.
-- 2. Make the bucket 'Public' so images can be viewed without a token.
-- 3. Run these policies if you want public viewing but restricted uploads (replace 'authenticated' with 'true' for local testing)

-- Allow public access to images
-- (This can also be done via the UI toggle 'Public')
-- CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING ( bucket_id = 'images' );

-- Allow uploads (In production, restrict to authenticated users)
-- CREATE POLICY "Public Upload" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'images' );
