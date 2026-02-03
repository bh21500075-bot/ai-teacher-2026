import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, BookOpen, Loader2, AlertCircle, Mic, MicOff, Volume2, VolumeX, Square, Network, Route, Layers, Globe, ChevronDown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface Course {
  id: string;
  title: string;
  code: string;
  description: string | null;
}

type GuestTab = 'chat' | 'colleges' | 'programs' | 'contact';

const LEVEL_ICONS: Record<string, React.ReactNode> = {
  'CCNA1': <Network className="w-8 h-8" />,
  'CCNA2': <Route className="w-8 h-8" />,
  'CCNA3': <Layers className="w-8 h-8" />,
  'CCNA4': <Globe className="w-8 h-8" />,
};

const LEVEL_COLORS: Record<string, string> = {
  'CCNA1': 'bg-blue-500',
  'CCNA2': 'bg-green-500',
  'CCNA3': 'bg-purple-500',
  'CCNA4': 'bg-orange-500',
};

const StudentChat = () => {
  const { user: authUser } = useAuth();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [showCourseSelector, setShowCourseSelector] = useState(true);
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

  // Fetch all CCNA courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoadingCourses(true);
      
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select('id, title, code, description')
        .eq('is_active', true)
        .like('code', 'CCNA%')
        .order('code');

      if (error) {
        console.error('Courses fetch error:', error);
        return;
      }

      if (coursesData && coursesData.length > 0) {
        setCourses(coursesData);
        // Show welcome message with level selection
        setMessages([{
          role: 'assistant',
          content: `Hello! I'm EduBot, your AI Tutor for **CCNA 200-301**.

Please select which level you're studying to get started:

• **Level 1**: Networking Fundamentals (OSI Model, IP Addressing, Subnetting)
• **Level 2**: Routing (Static Routing, RIP, EIGRP, OSPF)
• **Level 3**: Switching (VLANs, STP, Inter-VLAN Routing)
• **Level 4**: WAN Technologies (ACLs, Security, QoS)`
        }]);
      } else {
        setMessages([{
          role: 'assistant',
          content: `Hello! I'm EduBot, your AI Tutor. No CCNA courses are currently available. Please contact your instructor.`
        }]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const selectCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseSelector(false);
    
    const levelNumber = course.code.replace('CCNA', '');
    const levelName = course.title.split(': ')[1] || course.title;
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Great! You've selected **Level ${levelNumber}: ${levelName}**.

I'll now answer your questions based on this level's materials. Ask me anything about:
${course.description}

How can I help you today?`
    }]);
  };

  const switchCourse = (course: Course) => {
    if (course.id === selectedCourse?.id) return;
    
    setSelectedCourse(course);
    const levelNumber = course.code.replace('CCNA', '');
    const levelName = course.title.split(': ')[1] || course.title;
    
    setMessages(prev => [...prev, {
      role: 'assistant',
      content: `Switched to **Level ${levelNumber}: ${levelName}**.

I'll now answer questions based on this level's materials. Topics covered:
${course.description}`
    }]);
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
          courseId: selectedCourse?.id
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

  // Toggle handler for conversational voice mode with auto-stop callback
  const handleVoiceToggle = async () => {
    if (isRecording) {
      // Stop recording and send
      await handleVoiceInput();
    } else {
      // Start recording with auto-stop callback
      startRecording(handleVoiceInput);
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
              <div className="flex-1">
                <h2 className="font-semibold">EduBot AI</h2>
                {isLoadingCourses ? (
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading courses...
                  </p>
                ) : selectedCourse ? (
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-auto p-1 text-sm text-muted-foreground hover:text-foreground">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {selectedCourse.title}
                          <ChevronDown className="w-3 h-3 ml-1" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        {courses.map(course => (
                          <DropdownMenuItem 
                            key={course.id}
                            onClick={() => switchCourse(course)}
                            className={course.id === selectedCourse.id ? 'bg-accent' : ''}
                          >
                            <div className={`w-2 h-2 rounded-full mr-2 ${LEVEL_COLORS[course.code] || 'bg-gray-500'}`} />
                            {course.code}: {course.title.split(': ')[1] || course.title}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <p className="text-sm text-warning flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    Select a level to start
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
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

        {/* Course Selection Cards */}
        {showCourseSelector && courses.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {courses.map(course => {
              const levelNumber = course.code.replace('CCNA', '');
              const levelName = course.title.split(': ')[1] || course.title;
              
              return (
                <Card 
                  key={course.id}
                  onClick={() => selectCourse(course)}
                  className="cursor-pointer hover:ring-2 ring-primary transition-all hover:shadow-lg"
                >
                  <CardContent className="p-6 text-center">
                    <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center text-white ${LEVEL_COLORS[course.code] || 'bg-gray-500'}`}>
                      {LEVEL_ICONS[course.code] || <BookOpen className="w-8 h-8" />}
                    </div>
                    <h4 className="font-bold text-lg mb-1">Level {levelNumber}</h4>
                    <p className="text-sm text-muted-foreground">{levelName}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

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
              {/* Voice Input Button - Large Toggle Mode */}
              <Button
                variant={isRecording ? 'destructive' : 'outline'}
                onClick={handleVoiceToggle}
                disabled={isLoading || !selectedCourse || isProcessing}
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
                placeholder={selectedCourse ? "Type your question here..." : "Select a level first..."}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                className="flex-1"
                disabled={isLoading || !selectedCourse}
              />
              <Button onClick={() => handleSend()} disabled={isLoading || !message.trim() || !selectedCourse}>
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              {isRecording ? (
                <span className="text-destructive flex items-center justify-center gap-1">
                  <span className="w-2 h-2 bg-destructive rounded-full animate-pulse"></span>
                  Recording... (auto-stops after 2s silence or 15s max)
                </span>
              ) : !selectedCourse ? (
                'Please select a CCNA level above to start chatting'
              ) : (
                'Click mic to speak • Auto-stops when you pause'
              )}
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentChat;