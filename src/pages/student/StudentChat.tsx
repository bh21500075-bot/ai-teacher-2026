import { useState, useRef, useEffect } from 'react';
import ChatMessageContent from '@/components/ChatMessageContent';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, BookOpen, Loader2, AlertCircle, Mic, MicOff, Volume2, VolumeX, Square, Network, Route, Layers, Globe, Settings2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { useCourses } from '@/components/CourseSelector';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
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

type ExplanationMode = 'simple' | 'exam' | 'advanced';

const EXPLANATION_MODES = {
  simple: { label: 'Simple', description: 'Easy-to-understand explanations' },
  exam: { label: 'Exam-focused', description: 'Concise, exam-relevant answers' },
  advanced: { label: 'Advanced', description: 'Deep technical explanations' },
};

const StudentChat = () => {
  const { user: authUser } = useAuth();
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse, COURSE_DISPLAY_NAMES, COURSE_ICONS, isLoading: isLoadingCourses } = useCourses();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [explanationMode, setExplanationMode] = useState<ExplanationMode>('simple');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const {
    isRecording,
    isPlaying,
    isProcessing,
    voiceEnabled,
    startRecording,
    stopRecording,
    cancelRecording,
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

  // Set initial welcome message
  useEffect(() => {
    if (!isLoadingCourses) {
      setMessages([{
        role: 'assistant',
      content: `Hello, I am AI Educational Robot.

You can select a specific course to focus on, or ask general networking questions and I'll help you across all materials.

**Available courses:**

- **Network 1**: Networking Fundamentals
- **Network 2**: Routing
- **Network 3**: Switching
- **Network 4**: WAN Technologies

You can also say or type something like "I want to study Network 2" to switch focus.

How can I help you today?`
      }]);
    }
  }, [isLoadingCourses]);

  // Detect course selection from message
  const detectCourseFromMessage = (text: string): string | null => {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('network 1') || lowerText.includes('networking fundamentals') || lowerText.includes('level 1')) {
      return courses.find(c => c.code === 'CCNA1')?.id || null;
    }
    if (lowerText.includes('network 2') || lowerText.includes('routing') || lowerText.includes('level 2')) {
      return courses.find(c => c.code === 'CCNA2')?.id || null;
    }
    if (lowerText.includes('network 3') || lowerText.includes('switching') || lowerText.includes('level 3')) {
      return courses.find(c => c.code === 'CCNA3')?.id || null;
    }
    if (lowerText.includes('network 4') || lowerText.includes('wan') || lowerText.includes('level 4')) {
      return courses.find(c => c.code === 'CCNA4')?.id || null;
    }
    
    return null;
  };

  const handleSend = async (inputMessage?: string) => {
    const messageToSend = inputMessage || message;
    if (!messageToSend.trim() || isLoading) return;

    // Check if user is selecting a course via chat
    const detectedCourseId = detectCourseFromMessage(messageToSend);
    if (detectedCourseId && detectedCourseId !== selectedCourseId) {
      setSelectedCourseId(detectedCourseId);
      const detectedCourse = courses.find(c => c.id === detectedCourseId);
      
      const userMessage: Message = { role: 'user', content: messageToSend };
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      
      const confirmMessage: Message = {
        role: 'assistant',
        content: `Great! I'm now focusing on **${COURSE_DISPLAY_NAMES[detectedCourse?.code || ''] || detectedCourse?.code}**.

I'll answer questions based on this course's materials. Topics covered:
${detectedCourse?.description || 'Various networking concepts'}

What would you like to learn about?`
      };
      setMessages(prev => [...prev, confirmMessage]);
      
      if (voiceEnabled) {
        speakResponse(confirmMessage.content);
      }
      return;
    }

    const userMessage: Message = { role: 'user', content: messageToSend };
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
          courseId: selectedCourseId,
          explanationMode: explanationMode
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

      // Auto-play voice response if enabled
      if (voiceEnabled) {
        speakResponse(data.response);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get AI response. Please try again.',
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
      toast({
        title: 'Voice Error',
        description: 'Failed to process voice input. Please try again.',
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

  return (
    <DashboardLayout title="AI Tutor">
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold">EduBot AI</h2>
                {isLoadingCourses ? (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading courses...
                  </p>
                ) : selectedCourse ? (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    Focused on {COURSE_DISPLAY_NAMES[selectedCourse.code] || selectedCourse.code}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    General mode - select a course to focus
                  </p>
                )}
              </div>
              
              {/* Course Selector */}
              <Select value={selectedCourseId || 'all'} onValueChange={(v) => setSelectedCourseId(v === 'all' ? null : v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {COURSE_DISPLAY_NAMES[course.code] || course.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Explanation Mode */}
              <Select value={explanationMode} onValueChange={(v) => setExplanationMode(v as ExplanationMode)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(EXPLANATION_MODES).map(([key, { label, description }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col">
                        <span>{label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Voice Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={toggleVoice}
                className={voiceEnabled ? 'text-primary' : 'text-muted-foreground'}
                title={voiceEnabled ? 'Voice enabled' : 'Voice disabled'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                Gemini AI
              </span>
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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">AI Tutor</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => isPlaying ? stopPlaying() : speakResponse(msg.content)}
                      className="h-7 w-7 p-0"
                      title={isPlaying ? 'Stop playing' : 'Play response'}
                    >
                      {isPlaying ? (
                        <Square className="w-3 h-3" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                )}
                <ChatMessageContent content={msg.content} isAi={msg.role === 'assistant'} />
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
              {/* Voice Input Button */}
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                onClick={handleVoiceToggle}
                disabled={isLoading || isProcessing}
                title={isRecording ? 'Click to stop and send' : 'Click to start recording'}
                className={`h-16 w-16 rounded-full flex-shrink-0 ${isRecording ? 'animate-pulse' : ''}`}
              >
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-8 h-8" />
                ) : (
                  <Mic className="w-8 h-8" />
                )}
              </Button>
              
              <Input
                placeholder="Type your question or say 'I want to study Network 2'..."
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
                  Recording... (auto-stops after 2s silence or 15s max)
                </span>
              ) : (
                `Mode: ${EXPLANATION_MODES[explanationMode].description} • Click mic to speak`
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentChat;
