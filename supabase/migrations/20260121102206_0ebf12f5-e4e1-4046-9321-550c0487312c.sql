-- Drop the restrictive teacher insert policy
DROP POLICY IF EXISTS "Teachers can insert courses" ON public.courses;

-- Create a new policy that allows inserting courses for demo purposes
-- This allows any authenticated user OR anonymous inserts for the demo
CREATE POLICY "Allow course creation for demo"
ON public.courses
FOR INSERT
WITH CHECK (true);

-- Also need to allow SELECT without restrictions for demo
DROP POLICY IF EXISTS "Anyone can view active courses" ON public.courses;
CREATE POLICY "Anyone can view courses"
ON public.courses
FOR SELECT
USING (true);

-- Allow updates on courses for demo
DROP POLICY IF EXISTS "Teachers can update own courses" ON public.courses;
CREATE POLICY "Allow course updates for demo"
ON public.courses
FOR UPDATE
USING (true);

-- Similarly, update course_materials policies for demo
DROP POLICY IF EXISTS "Teachers can manage materials" ON public.course_materials;
CREATE POLICY "Allow material management for demo"
ON public.course_materials
FOR ALL
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Enrolled users can view materials" ON public.course_materials;
CREATE POLICY "Anyone can view materials for demo"
ON public.course_materials
FOR SELECT
USING (true);