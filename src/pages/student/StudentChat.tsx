import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Mic, Sparkles, BookOpen } from 'lucide-react';

const StudentChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'مرحباً! أنا المعلم الذكي الخاص بمقرر "مقدمة في البرمجة". كيف يمكنني مساعدتك اليوم؟ يمكنني الإجابة على أسئلتك المتعلقة بمحتوى المقرر فقط.' },
  ]);

  const handleSend = () => {
    if (!message.trim()) return;
    setMessages([...messages, { role: 'user', content: message }]);
    setMessage('');
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'شكراً على سؤالك! هذه إجابة تجريبية من المعلم الذكي. في النظام الفعلي، سيتم تحليل سؤالك والإجابة بناءً على محتوى المقرر المرفوع.' 
      }]);
    }, 1000);
  };

  return (
    <DashboardLayout title="المعلم الذكي">
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        {/* Header */}
        <Card className="border-0 shadow-sm mb-4">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">MENTOR AI</h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  مقرر: مقدمة في البرمجة - ITCS101
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="flex-1 overflow-auto space-y-4 mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 ${
                msg.role === 'user' 
                  ? 'chat-bubble-user' 
                  : 'chat-bubble-ai'
              }`}>
                {msg.role === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">المعلم الذكي</span>
                  </div>
                )}
                <p className="leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Mic className="w-5 h-5" />
              </Button>
              <Input
                placeholder="اكتب سؤالك هنا..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend}>
                <Send className="w-5 h-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              الأسئلة مقيدة بمحتوى المقرر الدراسي فقط
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentChat;
