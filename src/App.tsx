import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherContent from "./pages/teacher/TeacherContent";
import TeacherLessons from "./pages/teacher/TeacherLessons";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import TeacherQuizzes from "./pages/teacher/TeacherQuizzes";
import TeacherGrading from "./pages/teacher/TeacherGrading";
import TeacherStudents from "./pages/teacher/TeacherStudents";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentLessons from "./pages/student/StudentLessons";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentQuizzes from "./pages/student/StudentQuizzes";
import StudentGrades from "./pages/student/StudentGrades";
import StudentChat from "./pages/student/StudentChat";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: 'teacher' | 'student' }) {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'teacher' ? '/teacher' : '/student'} replace />;
  }
  
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={
        isAuthenticated ? (
          <Navigate to={user?.role === 'teacher' ? '/teacher' : '/student/chat'} replace />
        ) : (
          <Login />
        )
      } />
      
      {/* Teacher Routes */}
      <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/content" element={<ProtectedRoute role="teacher"><TeacherContent /></ProtectedRoute>} />
      <Route path="/teacher/lessons" element={<ProtectedRoute role="teacher"><TeacherLessons /></ProtectedRoute>} />
      <Route path="/teacher/assignments" element={<ProtectedRoute role="teacher"><TeacherAssignments /></ProtectedRoute>} />
      <Route path="/teacher/quizzes" element={<ProtectedRoute role="teacher"><TeacherQuizzes /></ProtectedRoute>} />
      <Route path="/teacher/grading" element={<ProtectedRoute role="teacher"><TeacherGrading /></ProtectedRoute>} />
      <Route path="/teacher/students" element={<ProtectedRoute role="teacher"><TeacherStudents /></ProtectedRoute>} />
      
      {/* Student Routes */}
      <Route path="/student" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/lessons" element={<ProtectedRoute role="student"><StudentLessons /></ProtectedRoute>} />
      <Route path="/student/assignments" element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
      <Route path="/student/quizzes" element={<ProtectedRoute role="student"><StudentQuizzes /></ProtectedRoute>} />
      <Route path="/student/grades" element={<ProtectedRoute role="student"><StudentGrades /></ProtectedRoute>} />
      <Route path="/student/chat" element={<ProtectedRoute role="student"><StudentChat /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
