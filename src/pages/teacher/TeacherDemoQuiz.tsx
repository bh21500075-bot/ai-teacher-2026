import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const questions = [
  { text: 'Which layer of the OSI model is responsible for routing?', type: 'Multiple Choice', answer: 'Network Layer' },
  { text: 'What does LAN stand for?', type: 'Multiple Choice', answer: 'Local Area Network' },
  { text: 'Star topology uses a central hub. True or False?', type: 'True/False', answer: 'True' },
  { text: 'What is the default subnet mask for Class C?', type: 'Multiple Choice', answer: '255.255.255.0' },
  { text: 'TCP provides reliable data delivery. True or False?', type: 'True/False', answer: 'True' },
];

const TeacherDemoQuiz = () => {
  return (
    <DashboardLayout title="Quiz Review">
      <div className="space-y-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <Badge className="bg-amber-500 text-white">DEMO</Badge>
          <span className="text-sm text-amber-700 dark:text-amber-300">This is a demo quiz review page.</span>
        </div>

        <Link to="/teacher/quizzes">
          <Button variant="ghost" size="sm"><ChevronLeft className="w-4 h-4 mr-1" />Back to Quizzes</Button>
        </Link>

        <div>
          <h2 className="text-xl font-bold">Week 1 Quiz</h2>
          <p className="text-muted-foreground">Network 1 • 5 Questions • 30 minutes • 44 attempts</p>
        </div>

        <div className="space-y-3">
          {questions.map((q, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">Q{i + 1}. {q.text}</p>
                    <p className="text-sm text-muted-foreground mt-1">Correct Answer: <span className="text-success font-medium">{q.answer}</span></p>
                  </div>
                  <Badge variant="outline">{q.type}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({ title: 'Edit mode would open here' })}>Edit Quiz</Button>
          <Button onClick={() => toast({ title: 'Quiz status updated!' })}>Publish Quiz</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDemoQuiz;
