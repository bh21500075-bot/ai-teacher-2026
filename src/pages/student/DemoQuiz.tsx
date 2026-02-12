import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ChevronLeft, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const questions = [
  {
    id: 1,
    text: 'Which layer of the OSI model is responsible for routing packets across networks?',
    options: ['Data Link Layer', 'Network Layer', 'Transport Layer', 'Session Layer'],
    correct: 1,
  },
  {
    id: 2,
    text: 'What does LAN stand for?',
    options: ['Large Area Network', 'Local Access Node', 'Local Area Network', 'Linked Area Network'],
    correct: 2,
  },
  {
    id: 3,
    text: 'Which topology connects all devices to a central hub?',
    options: ['Bus Topology', 'Ring Topology', 'Mesh Topology', 'Star Topology'],
    correct: 3,
  },
  {
    id: 4,
    text: 'What is the default subnet mask for a Class C IP address?',
    options: ['255.0.0.0', '255.255.0.0', '255.255.255.0', '255.255.255.255'],
    correct: 2,
  },
  {
    id: 5,
    text: 'Which protocol is used for reliable data delivery at the Transport layer?',
    options: ['UDP', 'IP', 'TCP', 'ARP'],
    correct: 2,
  },
];

const DemoQuiz = () => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) {
      toast({ title: 'Please answer all questions', variant: 'destructive' });
      return;
    }
    setSubmitted(true);
    const correct = questions.filter(q => answers[q.id] === q.correct).length;
    toast({ title: `Quiz Submitted! Score: ${correct}/${questions.length} (${Math.round(correct/questions.length*100)}%)` });
  };

  return (
    <DashboardLayout title="Quiz">
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <Badge className="bg-amber-500 text-white">DEMO</Badge>
          <span className="text-sm text-amber-700 dark:text-amber-300">This is a demo quiz. Answers are not saved.</span>
        </div>

        <Link to="/student/quizzes">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Quizzes
          </Button>
        </Link>

        <div className="mb-4">
          <h2 className="text-xl font-bold">Week 3 Quiz: IP Addressing</h2>
          <p className="text-muted-foreground">Network 1 • 5 Questions • 35 minutes</p>
        </div>

        {questions.map((q, qi) => (
          <Card key={q.id} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="font-medium mb-3">
                <span className="text-muted-foreground mr-2">Q{qi + 1}.</span>
                {q.text}
              </p>
              <RadioGroup
                value={answers[q.id]?.toString()}
                onValueChange={(v) => !submitted && setAnswers({ ...answers, [q.id]: parseInt(v) })}
                disabled={submitted}
              >
                {q.options.map((opt, oi) => (
                  <div key={oi} className={`flex items-center space-x-2 p-2 rounded-lg ${
                    submitted && oi === q.correct ? 'bg-success/10' :
                    submitted && answers[q.id] === oi && oi !== q.correct ? 'bg-destructive/10' : ''
                  }`}>
                    <RadioGroupItem value={oi.toString()} id={`q${q.id}-o${oi}`} />
                    <Label htmlFor={`q${q.id}-o${oi}`} className="flex-1 cursor-pointer">{opt}</Label>
                    {submitted && oi === q.correct && <CheckCircle className="w-4 h-4 text-success" />}
                    {submitted && answers[q.id] === oi && oi !== q.correct && <XCircle className="w-4 h-4 text-destructive" />}
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        {!submitted ? (
          <Button onClick={handleSubmit} className="w-full" size="lg">Submit Quiz</Button>
        ) : (
          <Card className="border-0 shadow-sm bg-primary/5">
            <CardContent className="p-6 text-center">
              <p className="text-2xl font-bold text-primary">
                {questions.filter(q => answers[q.id] === q.correct).length}/{questions.length}
              </p>
              <p className="text-muted-foreground">Correct Answers</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DemoQuiz;
