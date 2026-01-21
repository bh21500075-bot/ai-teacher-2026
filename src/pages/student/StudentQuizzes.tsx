import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play, HelpCircle, Trophy } from 'lucide-react';

const StudentQuizzes = () => {
  const quizzes = [
    { 
      id: 1,
      title: 'اختبار الأسبوع 1', 
      week: 1,
      questions: 10,
      duration: '30 دقيقة',
      status: 'completed',
      grade: 90,
      completedAt: '18 يناير 2024'
    },
    { 
      id: 2,
      title: 'اختبار الأسبوع 2', 
      week: 2,
      questions: 15,
      duration: '45 دقيقة',
      status: 'completed',
      grade: 82,
      completedAt: '25 يناير 2024'
    },
    { 
      id: 3,
      title: 'اختبار الأسبوع 3', 
      week: 3,
      questions: 12,
      duration: '35 دقيقة',
      status: 'available',
      grade: null,
      completedAt: null
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">مكتمل</Badge>;
      case 'available':
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">متاح</Badge>;
      case 'locked':
        return <Badge variant="outline" className="text-muted-foreground">مقفل</Badge>;
      default:
        return null;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-success';
    if (grade >= 70) return 'text-primary';
    if (grade >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <DashboardLayout title="الاختبارات">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">3</p>
              <p className="text-sm text-muted-foreground">إجمالي الاختبارات</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">2</p>
              <p className="text-sm text-muted-foreground">تم إنجازها</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold">86%</p>
              <p className="text-sm text-muted-foreground">متوسط الدرجات</p>
            </CardContent>
          </Card>
        </div>

        {/* Quizzes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    quiz.status === 'completed' ? 'bg-success/10' : 'bg-primary/10'
                  }`}>
                    {quiz.status === 'completed' ? (
                      <Trophy className="w-5 h-5 text-success" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-primary" />
                    )}
                  </div>
                  {getStatusBadge(quiz.status)}
                </div>
                <CardTitle className="text-lg mt-3">{quiz.title}</CardTitle>
                <CardDescription>الأسبوع {quiz.week}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <HelpCircle className="w-4 h-4" />
                      الأسئلة
                    </span>
                    <span className="font-medium">{quiz.questions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      المدة
                    </span>
                    <span className="font-medium">{quiz.duration}</span>
                  </div>
                </div>

                {quiz.status === 'completed' && quiz.grade !== null && (
                  <div className="bg-muted/30 rounded-xl p-4 mb-4 text-center">
                    <p className="text-sm text-muted-foreground mb-1">درجتك</p>
                    <p className={`text-3xl font-bold ${getGradeColor(quiz.grade)}`}>
                      {quiz.grade}%
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{quiz.completedAt}</p>
                  </div>
                )}
                
                <Button 
                  className="w-full" 
                  variant={quiz.status === 'completed' ? 'outline' : 'default'}
                >
                  {quiz.status === 'completed' ? (
                    <>عرض النتائج</>
                  ) : (
                    <>
                      <Play className="w-4 h-4 ml-1" />
                      ابدأ الاختبار
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentQuizzes;
