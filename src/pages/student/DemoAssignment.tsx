import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const questions = [
  'Explain the difference between a hub and a switch in networking.',
  'What are the advantages of Star topology over Bus topology?',
  'Given the IP address 192.168.1.0/24, how many usable host addresses are available? Show your calculation.',
];

const DemoAssignment = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    toast({ title: 'Assignment Submitted!', description: 'Your answers have been submitted for grading.' });
  };

  return (
    <DashboardLayout title="Assignment">
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <Badge className="bg-amber-500 text-white">DEMO</Badge>
          <span className="text-sm text-amber-700 dark:text-amber-300">This is a demo assignment. Answers are not saved.</span>
        </div>

        <Link to="/student">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="mb-4">
          <h2 className="text-xl font-bold">Assignment 3: Conditional Statements</h2>
          <p className="text-muted-foreground">Network 1 • Due: Tomorrow • Max Score: 100</p>
        </div>

        {questions.map((q, i) => (
          <Card key={i} className="border-0 shadow-sm">
            <CardContent className="p-5">
              <p className="font-medium mb-3">
                <span className="text-muted-foreground mr-2">Q{i + 1}.</span>
                {q}
              </p>
              <Textarea
                placeholder="Type your answer here..."
                value={answers[i] || ''}
                onChange={(e) => setAnswers({ ...answers, [i]: e.target.value })}
                disabled={submitted}
                rows={4}
              />
            </CardContent>
          </Card>
        ))}

        {!submitted ? (
          <Button onClick={handleSubmit} className="w-full" size="lg">Submit Assignment</Button>
        ) : (
          <Card className="border-0 shadow-sm bg-success/5">
            <CardContent className="p-6 text-center">
              <p className="text-lg font-bold text-success">✓ Assignment Submitted Successfully</p>
              <p className="text-muted-foreground text-sm">Your teacher will review and grade your submission.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DemoAssignment;
