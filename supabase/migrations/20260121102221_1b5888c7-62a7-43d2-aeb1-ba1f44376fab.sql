-- Make the course-materials bucket public for demo
UPDATE storage.buckets SET public = true WHERE id = 'course-materials';

-- Drop existing restrictive storage policies
DROP POLICY IF EXISTS "Teachers can upload course materials" ON storage.objects;
DROP POLICY IF EXISTS "Teachers can delete course materials" ON storage.objects;
DROP POLICY IF EXISTS "Teachers can update course materials" ON storage.objects;
DROP POLICY IF EXISTS "Course materials are publicly readable" ON storage.objects;

-- Create permissive storage policies for demo
CREATE POLICY "Allow uploads to course-materials for demo"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'course-materials');

CREATE POLICY "Allow reading course-materials for demo"
ON storage.objects
FOR SELECT
USING (bucket_id = 'course-materials');

CREATE POLICY "Allow deleting course-materials for demo"
ON storage.objects
FOR DELETE
USING (bucket_id = 'course-materials');

CREATE POLICY "Allow updating course-materials for demo"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'course-materials');