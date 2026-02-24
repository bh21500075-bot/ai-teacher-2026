import { useState, useRef, useEffect } from 'react';
import ChatMessageContent from '@/components/ChatMessageContent';
import { GuestLayout, GuestTab } from '@/components/layout/GuestLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles, Loader2, Building2, Mic, MicOff, Volume2, VolumeX, Square } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { CollegesInfo } from './CollegesInfo';
import { ProgramsInfo } from './ProgramsInfo';
import { ContactInfo } from './ContactInfo';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const GuestChat = () => {
  const [activeTab, setActiveTab] = useState<GuestTab>('chat');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello! Welcome to the University of Technology Bahrain (UTB). I'm here to help you learn about our university, colleges, programs, and campus facilities.

Feel free to ask me about:

- Our colleges and academic programs
- Admission requirements and procedures
- Campus facilities and student life
- Contact information

How can I assist you today?`
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSend = async (inputMessage?: string) => {
    const messageToSend = inputMessage || message;
    if (!messageToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: messageToSend };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('guest-chat', {
        body: {
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          }))
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
        description: error instanceof Error ? error.message : 'Failed to get response. Please try again.',
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

  return (
    <GuestLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'colleges' && <CollegesInfo />}
      {activeTab === 'programs' && <ProgramsInfo />}
      {activeTab === 'contact' && <ContactInfo />}
      
      {activeTab === 'chat' && (
        <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
          {/* Header */}
          <Card className="border-0 shadow-sm mb-4">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold">UTB Information Assistant</h2>
                  <p className="text-sm text-muted-foreground">
                    Ask about our university, colleges, and programs
                  </p>
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
                    Guest Mode
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
                        <span className="text-sm font-medium text-primary">UTB Assistant</span>
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
                  <ChatMessageContent content={msg.content} isAi={msg.role === 'assistant'} />
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
                {/* Voice Input Button */}
                <Button
                  variant={isRecording ? 'destructive' : 'outline'}
                  onClick={handleVoiceToggle}
                  disabled={isLoading || isProcessing}
                  title={isRecording ? 'Click to stop and send' : 'Click to start recording'}
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
                  placeholder="Ask about UTB..."
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
                  'For course-specific questions, please log in as a student.'
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </GuestLayout>
  );
};

export default GuestChat;
