
-- 1. Create Enums
CREATE TYPE public.user_role AS ENUM ('teacher', 'student');
CREATE TYPE public.enrollment_status AS ENUM ('active', 'completed', 'dropped');
CREATE TYPE public.file_type AS ENUM ('pdf', 'doc', 'ppt', 'other');
CREATE TYPE public.material_type AS ENUM ('textbook', 'manual', 'rubric', 'other');
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'completed', 'active', 'closed');
CREATE TYPE public.question_type AS ENUM ('multiple_choice', 'true_false', 'short_answer');
CREATE TYPE public.submission_status AS ENUM ('submitted', 'graded', 'approved', 'in_progress');
CREATE TYPE public.submission_type AS ENUM ('assignment', 'quiz');
CREATE TYPE public.chat_role AS ENUM ('user', 'ai');
CREATE TYPE public.progress_status AS ENUM ('not_started', 'in_progress', 'completed');

-- 2. User Management Tables
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role user_role NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Security Definer Functions (created before RLS policies)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
    )
$$;

CREATE OR REPLACE FUNCTION public.is_teacher(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(_user_id, 'teacher')
$$;

CREATE OR REPLACE FUNCTION public.is_student(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(_user_id, 'student')
$$;

-- 4. Course Management Tables
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    syllabus TEXT,
    grading_rubric TEXT,
    learning_outcomes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE public.enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    status enrollment_status DEFAULT 'active' NOT NULL,
    UNIQUE (student_id, course_id)
);

-- Helper function for enrollment check
CREATE OR REPLACE FUNCTION public.is_enrolled(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.enrollments
        WHERE student_id = _user_id
          AND course_id = _course_id
          AND status = 'active'
    )
$$;

-- Helper function for course ownership check
CREATE OR REPLACE FUNCTION public.is_course_teacher(_user_id UUID, _course_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.courses
        WHERE id = _course_id
          AND teacher_id = _user_id
    )
$$;

CREATE TABLE public.course_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    file_url TEXT,
    file_type file_type DEFAULT 'other',
    material_type material_type DEFAULT 'other',
    is_processed BOOLEAN DEFAULT false,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 5. Weekly Lessons Tables
CREATE TABLE public.weekly_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    week_number INTEGER NOT NULL CHECK (week_number >= 1 AND week_number <= 16),
    title TEXT NOT NULL,
    description TEXT,
    objectives TEXT,
    status content_status DEFAULT 'draft' NOT NULL,
    start_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE (course_id, week_number)
);

CREATE TABLE public.lesson_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.weekly_lessons(id) ON DELETE CASCADE NOT NULL,
    slide_number INTEGER NOT NULL,
    title TEXT,
    content TEXT,
    ai_generated BOOLEAN DEFAULT false,
    teacher_approved BOOLEAN DEFAULT false,
    UNIQUE (lesson_id, slide_number)
);

-- 6. Assignments Tables
CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.weekly_lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    ai_generated_content TEXT,
    teacher_approved BOOLEAN DEFAULT false,
    max_score INTEGER DEFAULT 100,
    due_date TIMESTAMP WITH TIME ZONE,
    status content_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE public.assignment_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES public.assignments(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    content TEXT,
    file_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    status submission_status DEFAULT 'submitted' NOT NULL,
    UNIQUE (assignment_id, student_id)
);

-- 7. Quizzes Tables
CREATE TABLE public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.weekly_lessons(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER DEFAULT 30,
    max_attempts INTEGER DEFAULT 1,
    ai_generated BOOLEAN DEFAULT false,
    teacher_approved BOOLEAN DEFAULT false,
    status content_status DEFAULT 'draft' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TABLE public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type question_type NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    points INTEGER DEFAULT 1,
    ai_generated BOOLEAN DEFAULT false,
    UNIQUE (quiz_id, question_number)
);

CREATE TABLE public.quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE,
    status submission_status DEFAULT 'in_progress' NOT NULL
);

CREATE TABLE public.quiz_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    submission_id UUID REFERENCES public.quiz_submissions(id) ON DELETE CASCADE NOT NULL,
    question_id UUID REFERENCES public.quiz_questions(id) ON DELETE CASCADE NOT NULL,
    student_answer TEXT,
    is_correct BOOLEAN,
    points_earned INTEGER DEFAULT 0,
    UNIQUE (submission_id, question_id)
);

-- 8. Grading Table (Human-in-the-Loop)
CREATE TABLE public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    submission_id UUID NOT NULL,
    submission_type submission_type NOT NULL,
    ai_score DECIMAL(5,2),
    ai_feedback TEXT,
    ai_confidence DECIMAL(3,2),
    teacher_score DECIMAL(5,2),
    teacher_feedback TEXT,
    teacher_approved BOOLEAN DEFAULT false,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 9. AI Chat Tables
CREATE TABLE public.chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES public.chat_sessions(id) ON DELETE CASCADE NOT NULL,
    role chat_role NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 10. Student Progress Table
CREATE TABLE public.student_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.weekly_lessons(id) ON DELETE CASCADE NOT NULL,
    completion_status progress_status DEFAULT 'not_started' NOT NULL,
    time_spent_minutes INTEGER DEFAULT 0,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE (student_id, lesson_id)
);

-- 11. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;

-- 12. RLS Policies

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Teachers can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_teacher(auth.uid()));

-- Courses policies
CREATE POLICY "Anyone can view active courses" ON public.courses FOR SELECT TO authenticated USING (is_active = true);
CREATE POLICY "Teachers can insert courses" ON public.courses FOR INSERT TO authenticated WITH CHECK (public.is_teacher(auth.uid()) AND auth.uid() = teacher_id);
CREATE POLICY "Teachers can update own courses" ON public.courses FOR UPDATE TO authenticated USING (auth.uid() = teacher_id);
CREATE POLICY "Teachers can delete own courses" ON public.courses FOR DELETE TO authenticated USING (auth.uid() = teacher_id);

-- Enrollments policies
CREATE POLICY "Students can view own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Teachers can view course enrollments" ON public.enrollments FOR SELECT TO authenticated USING (public.is_course_teacher(auth.uid(), course_id));
CREATE POLICY "Teachers can manage enrollments" ON public.enrollments FOR ALL TO authenticated USING (public.is_course_teacher(auth.uid(), course_id));
CREATE POLICY "Students can enroll themselves" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id AND public.is_student(auth.uid()));

-- Course materials policies
CREATE POLICY "Enrolled users can view materials" ON public.course_materials FOR SELECT TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id) OR public.is_enrolled(auth.uid(), course_id));
CREATE POLICY "Teachers can manage materials" ON public.course_materials FOR ALL TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id));

-- Weekly lessons policies
CREATE POLICY "Enrolled users can view published lessons" ON public.weekly_lessons FOR SELECT TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id) OR (public.is_enrolled(auth.uid(), course_id) AND status = 'published'));
CREATE POLICY "Teachers can manage lessons" ON public.weekly_lessons FOR ALL TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id));

-- Lesson slides policies
CREATE POLICY "Users can view approved slides" ON public.lesson_slides FOR SELECT TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM public.weekly_lessons wl 
        WHERE wl.id = lesson_id 
        AND (public.is_course_teacher(auth.uid(), wl.course_id) OR 
             (public.is_enrolled(auth.uid(), wl.course_id) AND teacher_approved = true))
    ));
CREATE POLICY "Teachers can manage slides" ON public.lesson_slides FOR ALL TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM public.weekly_lessons wl 
        WHERE wl.id = lesson_id AND public.is_course_teacher(auth.uid(), wl.course_id)
    ));

-- Assignments policies
CREATE POLICY "Enrolled users can view active assignments" ON public.assignments FOR SELECT TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id) OR (public.is_enrolled(auth.uid(), course_id) AND status = 'active'));
CREATE POLICY "Teachers can manage assignments" ON public.assignments FOR ALL TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id));

-- Assignment submissions policies
CREATE POLICY "Students can view own submissions" ON public.assignment_submissions FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Teachers can view course submissions" ON public.assignment_submissions FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = assignment_id AND public.is_course_teacher(auth.uid(), a.course_id)));
CREATE POLICY "Students can submit assignments" ON public.assignment_submissions FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = student_id AND public.is_student(auth.uid()));
CREATE POLICY "Students can update own submissions" ON public.assignment_submissions FOR UPDATE TO authenticated USING (auth.uid() = student_id);

-- Quizzes policies
CREATE POLICY "Enrolled users can view active quizzes" ON public.quizzes FOR SELECT TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id) OR (public.is_enrolled(auth.uid(), course_id) AND status = 'active'));
CREATE POLICY "Teachers can manage quizzes" ON public.quizzes FOR ALL TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id));

-- Quiz questions policies
CREATE POLICY "Users can view questions for active quizzes" ON public.quiz_questions FOR SELECT TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM public.quizzes q 
        WHERE q.id = quiz_id 
        AND (public.is_course_teacher(auth.uid(), q.course_id) OR 
             (public.is_enrolled(auth.uid(), q.course_id) AND q.status = 'active'))
    ));
CREATE POLICY "Teachers can manage questions" ON public.quiz_questions FOR ALL TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_id AND public.is_course_teacher(auth.uid(), q.course_id)));

-- Quiz submissions policies
CREATE POLICY "Students can view own quiz submissions" ON public.quiz_submissions FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Teachers can view course quiz submissions" ON public.quiz_submissions FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = quiz_id AND public.is_course_teacher(auth.uid(), q.course_id)));
CREATE POLICY "Students can submit quizzes" ON public.quiz_submissions FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = student_id AND public.is_student(auth.uid()));
CREATE POLICY "Students can update own quiz submissions" ON public.quiz_submissions FOR UPDATE TO authenticated USING (auth.uid() = student_id);

-- Quiz answers policies
CREATE POLICY "Students can view own answers" ON public.quiz_answers FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.quiz_submissions qs WHERE qs.id = submission_id AND qs.student_id = auth.uid()));
CREATE POLICY "Teachers can view course answers" ON public.quiz_answers FOR SELECT TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM public.quiz_submissions qs 
        JOIN public.quizzes q ON q.id = qs.quiz_id 
        WHERE qs.id = submission_id AND public.is_course_teacher(auth.uid(), q.course_id)
    ));
CREATE POLICY "Students can submit answers" ON public.quiz_answers FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (SELECT 1 FROM public.quiz_submissions qs WHERE qs.id = submission_id AND qs.student_id = auth.uid()));

-- Grades policies (Human-in-the-Loop: students see only approved grades)
CREATE POLICY "Students can view approved grades" ON public.grades FOR SELECT TO authenticated 
    USING (auth.uid() = student_id AND teacher_approved = true);
CREATE POLICY "Teachers can view all grades" ON public.grades FOR SELECT TO authenticated 
    USING (public.is_teacher(auth.uid()));
CREATE POLICY "Teachers can manage grades" ON public.grades FOR ALL TO authenticated 
    USING (public.is_teacher(auth.uid()));

-- Chat sessions policies
CREATE POLICY "Students can view own sessions" ON public.chat_sessions FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Students can create sessions" ON public.chat_sessions FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = student_id AND public.is_enrolled(auth.uid(), course_id));
CREATE POLICY "Teachers can view course sessions" ON public.chat_sessions FOR SELECT TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id));

-- Chat messages policies
CREATE POLICY "Session owners can view messages" ON public.chat_messages FOR SELECT TO authenticated 
    USING (EXISTS (SELECT 1 FROM public.chat_sessions cs WHERE cs.id = session_id AND cs.student_id = auth.uid()));
CREATE POLICY "Session owners can send messages" ON public.chat_messages FOR INSERT TO authenticated 
    WITH CHECK (EXISTS (SELECT 1 FROM public.chat_sessions cs WHERE cs.id = session_id AND cs.student_id = auth.uid()));
CREATE POLICY "Teachers can view course messages" ON public.chat_messages FOR SELECT TO authenticated 
    USING (EXISTS (
        SELECT 1 FROM public.chat_sessions cs 
        WHERE cs.id = session_id AND public.is_course_teacher(auth.uid(), cs.course_id)
    ));

-- Student progress policies
CREATE POLICY "Students can view own progress" ON public.student_progress FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Students can update own progress" ON public.student_progress FOR ALL TO authenticated 
    USING (auth.uid() = student_id);
CREATE POLICY "Teachers can view course progress" ON public.student_progress FOR SELECT TO authenticated 
    USING (public.is_course_teacher(auth.uid(), course_id));

-- 13. Create Storage Buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('course-materials', 'course-materials', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('assignment-submissions', 'assignment-submissions', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('lesson-slides', 'lesson-slides', false);

-- 14. Storage Policies
CREATE POLICY "Teachers can upload course materials" ON storage.objects FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'course-materials' AND public.is_teacher(auth.uid()));
CREATE POLICY "Enrolled users can view course materials" ON storage.objects FOR SELECT TO authenticated 
    USING (bucket_id = 'course-materials');
CREATE POLICY "Teachers can delete course materials" ON storage.objects FOR DELETE TO authenticated 
    USING (bucket_id = 'course-materials' AND public.is_teacher(auth.uid()));

CREATE POLICY "Students can upload submissions" ON storage.objects FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'assignment-submissions' AND public.is_student(auth.uid()));
CREATE POLICY "Users can view own submissions" ON storage.objects FOR SELECT TO authenticated 
    USING (bucket_id = 'assignment-submissions');

CREATE POLICY "Teachers can upload lesson slides" ON storage.objects FOR INSERT TO authenticated 
    WITH CHECK (bucket_id = 'lesson-slides' AND public.is_teacher(auth.uid()));
CREATE POLICY "Enrolled users can view lesson slides" ON storage.objects FOR SELECT TO authenticated 
    USING (bucket_id = 'lesson-slides');

-- 15. Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, name, email)
    VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', 'User'), NEW.email);
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 16. Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- 17. Enable realtime for chat messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
