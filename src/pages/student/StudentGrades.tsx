import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, Trophy, Target } from 'lucide-react';

const StudentGrades = () => {
  const grades = [
    { type: 'assignment', title: 'Assignment 1: Programming Basics', grade: 95, maxGrade: 100, weight: 10, date: 'January 20' },
    { type: 'quiz', title: 'Week 1 Quiz', grade: 90, maxGrade: 100, weight: 5, date: 'January 18' },
    { type: 'assignment', title: 'Assignment 2: Variables', grade: 88, maxGrade: 100, weight: 10, date: 'January 27' },
    { type: 'quiz', title: 'Week 2 Quiz', grade: 82, maxGrade: 100, weight: 5, date: 'January 25' },
  ];

  const overallGrade = 88;
  const targetGrade = 90;

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-success';
    if (grade >= 70) return 'text-primary';
    if (grade >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getGradeLabel = (grade: number) => {
    if (grade >= 90) return 'Excellent';
    if (grade >= 80) return 'Very Good';
    if (grade >= 70) return 'Good';
    if (grade >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  };

  return (
    <DashboardLayout title="My Grades">
      <div className="space-y-6">
        {/* Overall Grade */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1">Cumulative Average</p>
                <div className="flex items-baseline gap-2">
                  <p className={`text-5xl font-bold ${getGradeColor(overallGrade)}`}>
                    {overallGrade}%
                  </p>
                  <span className={`text-lg ${getGradeColor(overallGrade)}`}>
                    {getGradeLabel(overallGrade)}
                  </span>
                </div>
              </div>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Target</span>
                </div>
                <p className="text-2xl font-bold">{targetGrade}%</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">Progress</span>
                </div>
                <p className="text-2xl font-bold text-success">+5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Grade Breakdown</CardTitle>
            <CardDescription>Percentage of each component in final grade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Assignments (40%)</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Quizzes (20%)</span>
                <span className="font-medium">86%</span>
              </div>
              <Progress value={86} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Final Exam (40%)</span>
                <span className="font-medium text-muted-foreground">Not yet taken</span>
              </div>
              <Progress value={0} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Grades */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Grade Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {grades.map((grade, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      grade.type === 'quiz' ? 'bg-primary/10' : 'bg-accent/10'
                    }`}>
                      <Award className={`w-5 h-5 ${
                        grade.type === 'quiz' ? 'text-primary' : 'text-accent'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium">{grade.title}</p>
                      <p className="text-sm text-muted-foreground">{grade.date} • Weight {grade.weight}%</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-2xl font-bold ${getGradeColor(grade.grade)}`}>
                      {grade.grade}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
