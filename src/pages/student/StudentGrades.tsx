import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, Trophy, Target } from 'lucide-react';

const StudentGrades = () => {
  const grades = [
    { type: 'assignment', title: 'واجب 1: أساسيات البرمجة', grade: 95, maxGrade: 100, weight: 10, date: '20 يناير' },
    { type: 'quiz', title: 'اختبار الأسبوع 1', grade: 90, maxGrade: 100, weight: 5, date: '18 يناير' },
    { type: 'assignment', title: 'واجب 2: المتغيرات', grade: 88, maxGrade: 100, weight: 10, date: '27 يناير' },
    { type: 'quiz', title: 'اختبار الأسبوع 2', grade: 82, maxGrade: 100, weight: 5, date: '25 يناير' },
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
    if (grade >= 90) return 'ممتاز';
    if (grade >= 80) return 'جيد جداً';
    if (grade >= 70) return 'جيد';
    if (grade >= 60) return 'مقبول';
    return 'ضعيف';
  };

  return (
    <DashboardLayout title="درجاتي">
      <div className="space-y-6">
        {/* Overall Grade */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1">المعدل التراكمي</p>
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
                  <span className="text-sm text-muted-foreground">الهدف</span>
                </div>
                <p className="text-2xl font-bold">{targetGrade}%</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">التقدم</span>
                </div>
                <p className="text-2xl font-bold text-success">+5%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>توزيع الدرجات</CardTitle>
            <CardDescription>نسبة كل جزء من الدرجة الكلية</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">الواجبات (40%)</span>
                <span className="font-medium">92%</span>
              </div>
              <Progress value={92} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">الاختبارات القصيرة (20%)</span>
                <span className="font-medium">86%</span>
              </div>
              <Progress value={86} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">الاختبار النهائي (40%)</span>
                <span className="font-medium text-muted-foreground">لم يُعقد بعد</span>
              </div>
              <Progress value={0} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Grades */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>تفاصيل الدرجات</CardTitle>
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
                      <p className="text-sm text-muted-foreground">{grade.date} • وزن {grade.weight}%</p>
                    </div>
                  </div>
                  <div className="text-left">
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
