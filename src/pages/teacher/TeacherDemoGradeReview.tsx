import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChevronLeft, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const TeacherDemoGradeReview = () => {
  const [teacherGrade, setTeacherGrade] = useState('85');
  const [feedback, setFeedback] = useState('');
  const [approved, setApproved] = useState(false);

  return (
    <DashboardLayout title="Grade Review">
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <Badge className="bg-amber-500 text-white">DEMO</Badge>
          <span className="text-sm text-amber-700 dark:text-amber-300">This is a demo grade review page.</span>
        </div>

        <Link to="/teacher/grading">
          <Button variant="ghost" size="sm"><ChevronLeft className="w-4 h-4 mr-1" />Back to Grade Approval</Button>
        </Link>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-xl font-bold">Assignment 3: IP Addressing</h2>
              <p className="text-muted-foreground">Student: Ali Abdulaziz (S001) • Submitted 3 hours ago</p>
            </div>

            <div className="bg-muted/30 rounded-xl p-4 space-y-3">
              <h3 className="font-semibold">Student's Answers:</h3>
              <div className="space-y-2 text-sm">
                <div><strong>Q1:</strong> A hub broadcasts to all ports while a switch sends data only to the intended recipient using MAC addresses.</div>
                <div><strong>Q2:</strong> Star topology is more reliable because if one connection fails, others remain unaffected. It's also easier to troubleshoot.</div>
                <div><strong>Q3:</strong> 254 usable addresses. 2^8 - 2 = 254 (excluding network and broadcast addresses).</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-primary/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">AI Suggested Grade</span>
                </div>
                <p className="text-3xl font-bold text-primary">85%</p>
                <p className="text-xs text-muted-foreground mt-1">Confidence: 92%</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Your Grade</label>
                <Input
                  type="number"
                  value={teacherGrade}
                  onChange={(e) => setTeacherGrade(e.target.value)}
                  min={0} max={100}
                  className="text-xl font-bold"
                  disabled={approved}
                />
              </div>
            </div>

            <div className="bg-muted/20 rounded-xl p-4">
              <p className="text-sm font-medium mb-1">AI Feedback:</p>
              <p className="text-sm text-muted-foreground">Correct answers on most questions with minor formatting errors. Good understanding of subnetting concepts.</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Your Feedback (Optional)</label>
              <Textarea
                placeholder="Add your feedback..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                disabled={approved}
              />
            </div>

            {!approved ? (
              <div className="flex gap-2">
                <Button className="flex-1 gap-2" onClick={() => { setApproved(true); toast({ title: 'Grade Approved!', description: `Grade of ${teacherGrade}% approved for Ali Abdulaziz` }); }}>
                  <CheckCircle className="w-4 h-4" />Approve Grade
                </Button>
                <Button variant="outline" className="text-destructive gap-2" onClick={() => toast({ title: 'Grade Rejected', variant: 'destructive' })}>
                  <XCircle className="w-4 h-4" />Reject
                </Button>
              </div>
            ) : (
              <div className="bg-success/10 rounded-xl p-4 text-center">
                <CheckCircle className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="font-semibold text-success">Grade Approved: {teacherGrade}%</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDemoGradeReview;
