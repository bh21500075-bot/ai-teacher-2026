-- Remove foreign key constraint to allow demo teacher IDs
ALTER TABLE public.courses 
DROP CONSTRAINT IF EXISTS courses_teacher_id_fkey;