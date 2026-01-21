import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, BookOpen, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Course {
  id: string;
  title: string;
  code: string;
}

const StudentChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch enrolled course on mount
  useEffect(() => {
    fetchEnrolledCourse();
  }, []);

  const fetchEnrolledCourse = async () => {
    try {
      setIsLoadingCourse(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get student's enrolled course
      const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          courses:course_id (id, title, code)
        `)
        .eq('student_id', user.id)
        .eq('status', 'active')
        .limit(1);

      if (enrollError) {
        console.error('Enrollment fetch error:', enrollError);
        return;
      }

      if (enrollments && enrollments.length > 0 && enrollments[0].courses) {
        const courseData = enrollments[0].courses as unknown as Course;
        setCourse(courseData);
        setMessages([{
          role: 'assistant',
          content: `Hello! I'm EduBot, your AI Tutor for "${courseData.title}" (${courseData.code}). How can I help you today? I can answer questions based on the course materials uploaded by your instructor.`
        }]);
      } else {
        // Fallback: get any active course
        const { data: courses } = await supabase
          .from('courses')
          .select('id, title, code')
          .eq('is_active', true)
          .limit(1);

        if (courses && courses.length > 0) {
          setCourse(courses[0]);
          setMessages([{
            role: 'assistant',
            content: `Hello! I'm EduBot, your AI Tutor for "${courses[0].title}" (${courses[0].code}). How can I help you today? I can answer questions based on the course materials.`
          }]);
        } else {
          setMessages([{
            role: 'assistant',
            content: `Hello! I'm EduBot, your AI Tutor. No course is currently assigned. Please contact your instructor for enrollment.`
          }]);
        }
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          courseId: course?.id
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      const aiResponse: Message = { 
        role: 'assistant', 
        content: data.response 
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout title="AI Tutor">
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">EduBot AI</h2>
                {isLoadingCourse ? (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading course...
                  </p>
                ) : course ? (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    Course: {course.title} - {course.code}
                  </p>
                ) : (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    No course assigned
                  </p>
                )}
              </div>
              <div className="ml-auto">
                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                  Powered by Gemini AI
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 ${
                msg.role === 'user' 
                  ? 'chat-bubble-user' 
                  : 'chat-bubble-ai'
              }`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">AI Tutor</span>
                  </div>
                )}
                <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-4 chat-bubble-ai">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Input
                placeholder={course ? "Type your question here..." : "No course available"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="flex-1"
                disabled={isLoading || !course}
              />
              <Button onClick={handleSend} disabled={isLoading || !message.trim() || !course}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Questions are answered based on uploaded course materials
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentChat;
