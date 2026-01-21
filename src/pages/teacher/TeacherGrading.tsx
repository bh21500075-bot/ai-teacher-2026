import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Eye, 
  ChevronDown,
  AlertTriangle,
  Sparkles,
  User
} from 'lucide-react';
import { useState } from 'react';

const TeacherGrading = () => {
  const [selectedFilter, setSelectedFilter] = useState('pending');

  const pendingGrades = [
    { 
      id: 1,
      student: 'علي عبدالعزيز',
      studentId: 'S001',
      assignment: 'واجب 3: الجمل الشرطية',
      type: 'assignment',
      aiGrade: 85,
      aiConfidence: 92,
      submittedAt: 'منذ 3 ساعات',
      feedback: 'إجابات صحيحة في معظم الأسئلة مع بعض الأخطاء البسيطة في التنسيق.'
    },
    { 
      id: 2,
      student: 'فاطمة العلي',
      studentId: 'S003',
      assignment: 'واجب 3: الجمل الشرطية',
      type: 'assignment',
      aiGrade: 92,
      aiConfidence: 88,
      submittedAt: 'منذ 5 ساعات',
      feedback: 'أداء ممتاز مع فهم عميق للمفاهيم.'
    },
    { 
      id: 3,
      student: 'محمد الأحمد',
      studentId: 'S002',
      assignment: 'اختبار الأسبوع 2',
      type: 'quiz',
      aiGrade: 78,
      aiConfidence: 95,
      submittedAt: 'منذ يوم',
      feedback: 'يحتاج لمراجعة قسم المتغيرات.'
    },
    { 
      id: 4,
      student: 'سارة محمود',
      studentId: 'S004',
      assignment: 'واجب 3: الجمل الشرطية',
      type: 'assignment',
      aiGrade: 65,
      aiConfidence: 75,
      submittedAt: 'منذ يومين',
      feedback: 'يوجد أخطاء منطقية تحتاج مراجعة. الثقة منخفضة - يُنصح بالمراجعة اليدوية.'
    },
  ];

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge className="bg-success/20 text-success">ثقة عالية {confidence}%</Badge>;
    } else if (confidence >= 80) {
      return <Badge className="bg-warning/20 text-warning">ثقة متوسطة {confidence}%</Badge>;
    } else {
      return <Badge className="bg-destructive/20 text-destructive">ثقة منخفضة {confidence}%</Badge>;
    }
  };

  return (
    <DashboardLayout title="اعتماد الدرجات">
      <div className="space-y-6">
        {/* Human in the Loop Banner */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-warning/5 to-accent/5 border-l-4 border-l-warning">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-warning" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">مراجعة الإنسان مطلوبة</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  جميع الدرجات المقترحة من AI تتطلب اعتمادك قبل إرسالها للطلاب. 
                  راجع التغذية الراجعة ومستوى الثقة قبل الاعتماد.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">{pendingGrades.length}</p>
              <p className="text-sm text-muted-foreground">بانتظار الاعتماد</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">156</p>
              <p className="text-sm text-muted-foreground">تم اعتمادها</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-destructive">3</p>
              <p className="text-sm text-muted-foreground">تم رفضها</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Grades List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>الدرجات المقترحة من AI</CardTitle>
                <CardDescription>راجع واعتمد أو عدّل الدرجات</CardDescription>
              </div>
              <Button variant="outline" className="gap-2">
                اعتماد الكل (ثقة عالية)
                <CheckCircle className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingGrades.map((grade) => (
              <div 
                key={grade.id}
                className="border rounded-xl p-4 space-y-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{grade.student}</p>
                      <p className="text-sm text-muted-foreground">{grade.studentId}</p>
                    </div>
                  </div>
                  {getConfidenceBadge(grade.aiConfidence)}
                </div>

                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">{grade.assignment}</p>
                  <p className="text-xs text-muted-foreground">تم التسليم {grade.submittedAt}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">الدرجة المقترحة</span>
                    </div>
                    <p className="text-3xl font-bold text-primary">{grade.aiGrade}%</p>
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-muted-foreground mb-1 block">تعديل الدرجة</label>
                    <Input 
                      type="number" 
                      defaultValue={grade.aiGrade}
                      className="text-lg font-semibold"
                      min={0}
                      max={100}
                    />
                  </div>
                </div>

                <div className="bg-muted/20 rounded-lg p-3">
                  <p className="text-sm font-medium mb-1">التغذية الراجعة من AI:</p>
                  <p className="text-sm text-muted-foreground">{grade.feedback}</p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button size="sm" className="flex-1 gap-2">
                    <CheckCircle className="w-4 h-4" />
                    اعتماد
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="w-4 h-4" />
                    مراجعة التسليم
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive hover:text-destructive gap-2">
                    <XCircle className="w-4 h-4" />
                    رفض
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherGrading;
