import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, Eye, Edit, Sparkles, Clock, HelpCircle } from 'lucide-react';

const TeacherQuizzes = () => {
  const quizzes = [
    { 
      id: 1,
      title: 'اختبار الأسبوع 1', 
      week: 1,
      questions: 10,
      duration: '30 دقيقة',
      status: 'published',
      aiGenerated: true,
      attempts: 44
    },
    { 
      id: 2,
      title: 'اختبار الأسبوع 2', 
      week: 2,
      questions: 15,
      duration: '45 دقيقة',
      status: 'published',
      aiGenerated: true,
      attempts: 41
    },
    { 
      id: 3,
      title: 'اختبار الأسبوع 3', 
      week: 3,
      questions: 12,
      duration: '35 دقيقة',
      status: 'draft',
      aiGenerated: true,
      attempts: 0
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">منشور</Badge>;
      case 'draft':
        return <Badge variant="secondary">مسودة</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="الاختبارات">
      <div className="space-y-6">
        {/* AI Quiz Generator Banner */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">توليد اختبار بالذكاء الاصطناعي</h3>
                  <p className="text-muted-foreground">
                    أنشئ اختبارات تلقائياً من محتوى الدروس المرفوعة
                  </p>
                </div>
              </div>
              <Button>
                <Sparkles className="w-4 h-4 ml-2" />
                توليد اختبار جديد
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            إدارة الاختبارات والتقييمات
          </p>
          <Button variant="outline">
            <Plus className="w-4 h-4 ml-2" />
            إنشاء يدوي
          </Button>
        </div>

        {/* Quizzes Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center gap-2">
                    {quiz.aiGenerated && (
                      <Badge variant="outline" className="text-xs">
                        <Sparkles className="w-3 h-3 ml-1" />
                        AI
                      </Badge>
                    )}
                    {getStatusBadge(quiz.status)}
                  </div>
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
                  {quiz.status === 'published' && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">المحاولات</span>
                      <span className="font-medium">{quiz.attempts}</span>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 ml-1" />
                    عرض
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 ml-1" />
                    تعديل
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherQuizzes;
