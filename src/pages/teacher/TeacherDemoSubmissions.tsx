import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const submissions = [
  { student: 'Ali Abdulaziz', id: 'S001', time: '2 hours ago', status: 'graded', grade: 85 },
  { student: 'Fatima Al-Ali', id: 'S003', time: '5 hours ago', status: 'graded', grade: 92 },
  { student: 'Mohammed Al-Ahmed', id: 'S002', time: '1 day ago', status: 'pending', grade: null },
  { student: 'Sara Mahmoud', id: 'S004', time: '1 day ago', status: 'pending', grade: null },
];

const TeacherDemoSubmissions = () => {
  return (
    <DashboardLayout title="Submissions">
      <div className="space-y-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <Badge className="bg-amber-500 text-white">DEMO</Badge>
          <span className="text-sm text-amber-700 dark:text-amber-300">This is a demo submissions view.</span>
        </div>

        <Link to="/teacher/assignments">
          <Button variant="ghost" size="sm"><ChevronLeft className="w-4 h-4 mr-1" />Back to Assignments</Button>
        </Link>

        <div>
          <h2 className="text-xl font-bold">Assignment 1: Network Basics</h2>
          <p className="text-muted-foreground">Network 1 • 42/45 submitted • Due: January 20, 2024</p>
        </div>

        <div className="space-y-3">
          {submissions.map((sub, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{sub.student}</p>
                      <p className="text-sm text-muted-foreground">{sub.id} • {sub.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {sub.status === 'graded' ? (
                      <Badge className="bg-success/20 text-success">{sub.grade}%</Badge>
                    ) : (
                      <Badge className="bg-warning/20 text-warning">Pending</Badge>
                    )}
                    <Button variant="outline" size="sm" onClick={() => toast({ title: `Viewing ${sub.student}'s submission` })}>
                      <Eye className="w-4 h-4 mr-1" />View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDemoSubmissions;
