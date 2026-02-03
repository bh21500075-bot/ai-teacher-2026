export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      assignment_submissions: {
        Row: {
          assignment_id: string
          content: string | null
          file_url: string | null
          id: string
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at: string
        }
        Insert: {
          assignment_id: string
          content?: string | null
          file_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at?: string
        }
        Update: {
          assignment_id?: string
          content?: string | null
          file_url?: string | null
          id?: string
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
          submitted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignment_submissions_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          ai_generated_content: string | null
          course_id: string
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          instructions: string | null
          lesson_id: string | null
          max_score: number | null
          status: Database["public"]["Enums"]["content_status"]
          teacher_approved: boolean | null
          title: string
        }
        Insert: {
          ai_generated_content?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          max_score?: number | null
          status?: Database["public"]["Enums"]["content_status"]
          teacher_approved?: boolean | null
          title: string
        }
        Update: {
          ai_generated_content?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          instructions?: string | null
          lesson_id?: string | null
          max_score?: number | null
          status?: Database["public"]["Enums"]["content_status"]
          teacher_approved?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assignments_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "weekly_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          role: Database["public"]["Enums"]["chat_role"]
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["chat_role"]
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["chat_role"]
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          course_id: string
          ended_at: string | null
          id: string
          started_at: string
          student_id: string
        }
        Insert: {
          course_id: string
          ended_at?: string | null
          id?: string
          started_at?: string
          student_id: string
        }
        Update: {
          course_id?: string
          ended_at?: string | null
          id?: string
          started_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_materials: {
        Row: {
          content_text: string | null
          course_id: string
          file_type: Database["public"]["Enums"]["file_type"] | null
          file_url: string | null
          id: string
          is_processed: boolean | null
          material_type: Database["public"]["Enums"]["material_type"] | null
          title: string
          uploaded_at: string
        }
        Insert: {
          content_text?: string | null
          course_id: string
          file_type?: Database["public"]["Enums"]["file_type"] | null
          file_url?: string | null
          id?: string
          is_processed?: boolean | null
          material_type?: Database["public"]["Enums"]["material_type"] | null
          title: string
          uploaded_at?: string
        }
        Update: {
          content_text?: string | null
          course_id?: string
          file_type?: Database["public"]["Enums"]["file_type"] | null
          file_url?: string | null
          id?: string
          is_processed?: boolean | null
          material_type?: Database["public"]["Enums"]["material_type"] | null
          title?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_materials_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          code: string
          created_at: string
          description: string | null
          grading_rubric: string | null
          id: string
          is_active: boolean | null
          learning_outcomes: string | null
          syllabus: string | null
          teacher_id: string
          title: string
        }
        Insert: {
          code: string
          created_at?: string
          description?: string | null
          grading_rubric?: string | null
          id?: string
          is_active?: boolean | null
          learning_outcomes?: string | null
          syllabus?: string | null
          teacher_id: string
          title: string
        }
        Update: {
          code?: string
          created_at?: string
          description?: string | null
          grading_rubric?: string | null
          id?: string
          is_active?: boolean | null
          learning_outcomes?: string | null
          syllabus?: string | null
          teacher_id?: string
          title?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          course_id: string
          enrolled_at: string
          id: string
          status: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
        }
        Insert: {
          course_id: string
          enrolled_at?: string
          id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id: string
        }
        Update: {
          course_id?: string
          enrolled_at?: string
          id?: string
          status?: Database["public"]["Enums"]["enrollment_status"]
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      grades: {
        Row: {
          ai_confidence: number | null
          ai_feedback: string | null
          ai_score: number | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          id: string
          student_id: string
          submission_id: string
          submission_type: Database["public"]["Enums"]["submission_type"]
          teacher_approved: boolean | null
          teacher_feedback: string | null
          teacher_score: number | null
        }
        Insert: {
          ai_confidence?: number | null
          ai_feedback?: string | null
          ai_score?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          student_id: string
          submission_id: string
          submission_type: Database["public"]["Enums"]["submission_type"]
          teacher_approved?: boolean | null
          teacher_feedback?: string | null
          teacher_score?: number | null
        }
        Update: {
          ai_confidence?: number | null
          ai_feedback?: string | null
          ai_score?: number | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          id?: string
          student_id?: string
          submission_id?: string
          submission_type?: Database["public"]["Enums"]["submission_type"]
          teacher_approved?: boolean | null
          teacher_feedback?: string | null
          teacher_score?: number | null
        }
        Relationships: []
      }
      guest_documents: {
        Row: {
          content_text: string
          created_at: string
          document_name: string
          document_title: string
          id: string
          section_title: string | null
        }
        Insert: {
          content_text: string
          created_at?: string
          document_name: string
          document_title: string
          id?: string
          section_title?: string | null
        }
        Update: {
          content_text?: string
          created_at?: string
          document_name?: string
          document_title?: string
          id?: string
          section_title?: string | null
        }
        Relationships: []
      }
      lesson_slides: {
        Row: {
          ai_generated: boolean | null
          content: string | null
          id: string
          lesson_id: string
          slide_number: number
          teacher_approved: boolean | null
          title: string | null
        }
        Insert: {
          ai_generated?: boolean | null
          content?: string | null
          id?: string
          lesson_id: string
          slide_number: number
          teacher_approved?: boolean | null
          title?: string | null
        }
        Update: {
          ai_generated?: boolean | null
          content?: string | null
          id?: string
          lesson_id?: string
          slide_number?: number
          teacher_approved?: boolean | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_slides_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "weekly_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      quiz_answers: {
        Row: {
          id: string
          is_correct: boolean | null
          points_earned: number | null
          question_id: string
          student_answer: string | null
          submission_id: string
        }
        Insert: {
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          question_id: string
          student_answer?: string | null
          submission_id: string
        }
        Update: {
          id?: string
          is_correct?: boolean | null
          points_earned?: number | null
          question_id?: string
          student_answer?: string | null
          submission_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_answers_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "quiz_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          ai_generated: boolean | null
          correct_answer: string
          id: string
          options: Json | null
          points: number | null
          question_number: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          quiz_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          correct_answer: string
          id?: string
          options?: Json | null
          points?: number | null
          question_number: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          quiz_id: string
        }
        Update: {
          ai_generated?: boolean | null
          correct_answer?: string
          id?: string
          options?: Json | null
          points?: number | null
          question_number?: number
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          quiz_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_submissions: {
        Row: {
          id: string
          quiz_id: string
          started_at: string
          status: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at: string | null
        }
        Insert: {
          id?: string
          quiz_id: string
          started_at?: string
          status?: Database["public"]["Enums"]["submission_status"]
          student_id: string
          submitted_at?: string | null
        }
        Update: {
          id?: string
          quiz_id?: string
          started_at?: string
          status?: Database["public"]["Enums"]["submission_status"]
          student_id?: string
          submitted_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_submissions_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          ai_generated: boolean | null
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          lesson_id: string | null
          max_attempts: number | null
          status: Database["public"]["Enums"]["content_status"]
          teacher_approved: boolean | null
          title: string
        }
        Insert: {
          ai_generated?: boolean | null
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          status?: Database["public"]["Enums"]["content_status"]
          teacher_approved?: boolean | null
          title: string
        }
        Update: {
          ai_generated?: boolean | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          lesson_id?: string | null
          max_attempts?: number | null
          status?: Database["public"]["Enums"]["content_status"]
          teacher_approved?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "weekly_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          completion_status: Database["public"]["Enums"]["progress_status"]
          course_id: string
          id: string
          last_accessed: string | null
          lesson_id: string
          student_id: string
          time_spent_minutes: number | null
        }
        Insert: {
          completion_status?: Database["public"]["Enums"]["progress_status"]
          course_id: string
          id?: string
          last_accessed?: string | null
          lesson_id: string
          student_id: string
          time_spent_minutes?: number | null
        }
        Update: {
          completion_status?: Database["public"]["Enums"]["progress_status"]
          course_id?: string
          id?: string
          last_accessed?: string | null
          lesson_id?: string
          student_id?: string
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "weekly_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          objectives: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["content_status"]
          title: string
          week_number: number
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          objectives?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          week_number: number
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          objectives?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          week_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "weekly_lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_course_teacher: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      is_enrolled: {
        Args: { _course_id: string; _user_id: string }
        Returns: boolean
      }
      is_student: { Args: { _user_id: string }; Returns: boolean }
      is_teacher: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      chat_role: "user" | "ai"
      content_status: "draft" | "published" | "completed" | "active" | "closed"
      enrollment_status: "active" | "completed" | "dropped"
      file_type: "pdf" | "doc" | "ppt" | "other"
      material_type: "textbook" | "manual" | "rubric" | "other"
      progress_status: "not_started" | "in_progress" | "completed"
      question_type: "multiple_choice" | "true_false" | "short_answer"
      submission_status: "submitted" | "graded" | "approved" | "in_progress"
      submission_type: "assignment" | "quiz"
      user_role: "teacher" | "student"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      chat_role: ["user", "ai"],
      content_status: ["draft", "published", "completed", "active", "closed"],
      enrollment_status: ["active", "completed", "dropped"],
      file_type: ["pdf", "doc", "ppt", "other"],
      material_type: ["textbook", "manual", "rubric", "other"],
      progress_status: ["not_started", "in_progress", "completed"],
      question_type: ["multiple_choice", "true_false", "short_answer"],
      submission_status: ["submitted", "graded", "approved", "in_progress"],
      submission_type: ["assignment", "quiz"],
      user_role: ["teacher", "student"],
    },
  },
} as const
