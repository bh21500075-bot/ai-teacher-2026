import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, TrendingUp, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

const grades = [
  { title: 'Assignment 1: Network Basics', type: 'Assignment', score: 92, maxScore: 100, date: 'Jan 20' },
  { title: 'Week 1 Quiz', type: 'Quiz', score: 90, maxScore: 100, date: 'Jan 18' },
  { title: 'Assignment 2: OSI Model', type: 'Assignment', score: 85, maxScore: 100, date: 'Jan 27' },
  { title: 'Week 2 Quiz', type: 'Quiz', score: 82, maxScore: 100, date: 'Jan 25' },
  { title: 'Assignment 3: IP Addressing', type: 'Assignment', score: 88, maxScore: 100, date: 'Feb 3' },
];

const TeacherDemoStudentDetail = () => {
  const avgGrade = Math.round(grades.reduce((acc, g) => acc + g.score, 0) / grades.length);

  return (
    <DashboardLayout title="Student Details">
      <div className="space-y-4 max-w-3xl mx-auto">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <Badge className="bg-amber-500 text-white">DEMO</Badge>
          <span className="text-sm text-amber-700 dark:text-amber-300">This is a demo student detail page.</span>
        </div>

        <Link to="/teacher/students">
          <Button variant="ghost" size="sm"><ChevronLeft className="w-4 h-4 mr-1" />Back to Students</Button>
        </Link>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-2xl font-bold text-primary">A</div>
              <div>
                <h2 className="text-xl font-bold">Ali Abdulaziz</h2>
                <p className="text-muted-foreground">S001 • Network 1</p>
                <Badge className="bg-success/20 text-success mt-1"><TrendingUp className="w-3 h-3 mr-1" />Improving</Badge>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">85%</p>
                <p className="text-xs text-muted-foreground">Progress</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold">{avgGrade}%</p>
                <p className="text-xs text-muted-foreground">Avg Grade</p>
              </div>
              <div className="bg-muted/30 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-success">5/5</p>
                <p className="text-xs text-muted-foreground">Submitted</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Course Progress</span>
                <span className="text-sm font-medium">85%</span>
              </div>
              <Progress value={85} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <h3 className="font-semibold flex items-center gap-2"><Award className="w-5 h-5" />Grade History</h3>
        <div className="space-y-3">
          {grades.map((g, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{g.title}</p>
                  <p className="text-sm text-muted-foreground">{g.type} • {g.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-primary">{g.score}%</p>
                  <p className="text-xs text-muted-foreground">/ {g.maxScore}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDemoStudentDetail;
