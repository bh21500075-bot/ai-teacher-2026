import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Loader2, Mic, MicOff, Volume2, VolumeX, Square, BookOpen, ClipboardList, CheckCircle, FileQuestion } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useCourses } from '@/components/CourseSelector';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

type FeedbackTopic = 'lessons' | 'assignments' | 'quizzes' | 'general';

const TeacherChat = () => {
  const { user: authUser } = useAuth();
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse, COURSE_DISPLAY_NAMES, isLoading: isLoadingCourses } = useCourses();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackTopic, setFeedbackTopic] = useState<FeedbackTopic>('general');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    isRecording,
    isPlaying,
    isProcessing,
    voiceEnabled,
    startRecording,
    stopRecording,
    speakResponse,
    stopPlaying,
    toggleVoice,
  } = useVoiceChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!isLoadingCourses) {
      setMessages([{
        role: 'assistant',
        content: `Hello! I'm your AI Teaching Assistant. I can help you with:

• **Lesson Feedback**: Get suggestions for improving your lesson content
• **Assignment Review**: Get AI feedback on assignment designs
• **Quiz Analysis**: Analyze quiz effectiveness and difficulty balance
• **General Support**: Ask any teaching-related questions

${selectedCourse ? `Currently viewing: **${COURSE_DISPLAY_NAMES[selectedCourse.code] || selectedCourse.code}**` : 'Select a course to get started.'}

How can I help you today?`
      }]);
    }
  }, [isLoadingCourses, selectedCourse]);

  const handleSend = async (inputMessage?: string) => {
    const messageToSend = inputMessage || message;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const systemContext = `You are an AI Teaching Assistant helping a teacher with their ${COURSE_DISPLAY_NAMES[selectedCourse?.code || ''] || 'networking'} course.
      
Current focus area: ${feedbackTopic}
${selectedCourse ? `Course: ${selectedCourse.title}` : ''}

Provide helpful, constructive feedback and suggestions. Be encouraging but also point out areas for improvement.`;

      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          courseId: selectedCourseId,
          systemOverride: systemContext
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const aiResponse: Message = { role: 'assistant', content: data.response };
      setMessages(prev => [...prev, aiResponse]);

      if (voiceEnabled) {
        speakResponse(data.response);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get AI response.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    try {
      const transcript = await stopRecording();
      if (transcript && transcript.trim()) {
        setMessage(transcript);
        handleSend(transcript);
      } else {
        toast({
          title: 'No Speech Detected',
          description: 'Could not detect any speech. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Voice input error:', error);
      toast({
        title: 'Voice Error',
        description: 'Failed to process voice input.',
        variant: 'destructive',
      });
    }
  };

  const handleVoiceToggle = async () => {
    if (isRecording) {
      await handleVoiceInput();
    } else {
      startRecording(handleVoiceInput);
    }
  };

  const topicIcons: Record<FeedbackTopic, React.ReactNode> = {
    lessons: <BookOpen className="w-4 h-4" />,
    assignments: <ClipboardList className="w-4 h-4" />,
    quizzes: <CheckCircle className="w-4 h-4" />,
    general: <FileQuestion className="w-4 h-4" />,
  };

  return (
    <DashboardLayout title="AI Assistant">
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold">Teaching Assistant AI</h2>
                <p className="text-sm text-muted-foreground">Get feedback on your course content</p>
              </div>
              
              {/* Course Selector */}
              <Select value={selectedCourseId || ''} onValueChange={setSelectedCourseId}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select Course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {COURSE_DISPLAY_NAMES[course.code] || course.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Topic Selector */}
              <Select value={feedbackTopic} onValueChange={(v) => setFeedbackTopic(v as FeedbackTopic)}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="lessons">Lessons</SelectItem>
                  <SelectItem value="assignments">Assignments</SelectItem>
                  <SelectItem value="quizzes">Quizzes</SelectItem>
                </SelectContent>
              </Select>

              {/* Voice Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVoice}
                className={voiceEnabled ? 'text-primary' : 'text-muted-foreground'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 ${msg.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                {msg.role === 'assistant' && (
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">AI Assistant</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => isPlaying ? stopPlaying() : speakResponse(msg.content)}
                      className="h-7 w-7 p-0"
                    >
                      {isPlaying ? <Square className="w-3 h-3" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
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
                  <span className="text-sm text-muted-foreground">Thinking...</span>
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
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                onClick={handleVoiceToggle}
                disabled={isLoading || isProcessing}
                className={`h-12 w-12 rounded-full flex-shrink-0 ${isRecording ? 'animate-pulse' : ''}`}
              >
                {isProcessing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>
              
              <Input
                placeholder="Ask for feedback on your lessons, assignments, or quizzes..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={() => handleSend()} disabled={isLoading || !message.trim()}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {isRecording ? (
                <span className="text-destructive flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                  Recording...
                </span>
              ) : (
                'Ask me about your course content or for teaching suggestions'
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherChat;
