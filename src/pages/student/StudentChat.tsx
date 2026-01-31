import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, BookOpen, Loader2, AlertCircle, Mic, MicOff, Volume2, VolumeX, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useVoiceChat } from '@/hooks/useVoiceChat';

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
  const { user: authUser } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
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

  // Fetch course on mount
  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      setIsLoadingCourse(true);
      
      // For demo system, directly fetch any active course
      const { data: courses, error } = await supabase
        .from('courses')
        .select('id, title, code')
        .eq('is_active', true)
        .limit(1);

      if (error) {
        console.error('Course fetch error:', error);
        return;
      }

      if (courses && courses.length > 0) {
        setCourse(courses[0]);
        setMessages([{
          role: 'assistant',
          content: `Hello! I'm EduBot, your AI Tutor for "${courses[0].title}" (${courses[0].code}). How can I help you today? I can answer questions based on the course materials uploaded by your instructor.`
        }]);
      } else {
        setMessages([{
          role: 'assistant',
          content: `Hello! I'm EduBot, your AI Tutor. No course is currently available. Please contact your instructor.`
        }]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  const handleSend = async (inputMessage?: string) => {
    const messageToSend = inputMessage || message;
    if (!messageToSend.trim() || isLoading) return;

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

      // Auto-play voice response if enabled
      if (voiceEnabled) {
        speakResponse(data.response);
      }
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

  const handleVoiceInput = async () => {
    try {
      const transcript = await stopRecording();
      if (transcript && transcript.trim()) {
        setMessage(transcript);
        // Auto-send the voice message
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
        description: 'Failed to process voice input. Please try again.',
        variant: 'destructive',
      });
    }
  };

  // Toggle handler for conversational voice mode
  const handleVoiceToggle = async () => {
    if (isRecording) {
      // Stop recording and send
      await handleVoiceInput();
    } else {
      // Start recording
      startRecording();
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
              <div className="ml-auto flex items-center gap-2">
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
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium text-primary">AI Tutor</span>
                    </div>
                    {/* Speaker button for AI messages */}
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
              {/* Voice Input Button - Toggle Mode */}
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                size="icon"
                onClick={handleVoiceToggle}
                disabled={isLoading || !course || isProcessing}
                title={isRecording ? 'Click to stop and send' : 'Click to start recording'}
                className={isRecording ? 'animate-pulse' : ''}
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
                placeholder={course ? "Type your question here..." : "No course available"}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="flex-1"
                disabled={isLoading || !course}
              />
              <Button onClick={() => handleSend()} disabled={isLoading || !message.trim() || !course}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {isRecording ? (
                <span className="text-destructive flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                  Recording... Click mic to stop and send
                </span>
              ) : (
                'Click mic button to speak or type your question'
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentChat;
