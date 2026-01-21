-- Add content_text column to store extracted text from files
ALTER TABLE public.course_materials ADD COLUMN IF NOT EXISTS content_text TEXT;