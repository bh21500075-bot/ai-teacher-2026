import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Search, 
  TrendingUp, 
  TrendingDown,
  Eye,
  MessageSquare,
  Award
} from 'lucide-react';

const TeacherStudents = () => {
  const students = [
    { 
      id: 'S001',
      name: 'علي عبدالعزيز',
      progress: 85,
      avgGrade: 88,
      assignments: '3/3',
      quizzes: '2/2',
      lastActive: 'منذ ساعة',
      trend: 'up'
    },
    { 
      id: 'S002',
      name: 'محمد الأحمد',
      progress: 72,
      avgGrade: 75,
      assignments: '3/3',
      quizzes: '2/2',
      lastActive: 'منذ 3 ساعات',
      trend: 'down'
    },
    { 
      id: 'S003',
      name: 'فاطمة العلي',
      progress: 95,
      avgGrade: 92,
      assignments: '3/3',
      quizzes: '2/2',
      lastActive: 'منذ 30 دقيقة',
      trend: 'up'
    },
    { 
      id: 'S004',
      name: 'سارة محمود',
      progress: 60,
      avgGrade: 65,
      assignments: '2/3',
      quizzes: '2/2',
      lastActive: 'منذ يومين',
      trend: 'down'
    },
    { 
      id: 'S005',
      name: 'أحمد خالد',
      progress: 78,
      avgGrade: 80,
      assignments: '3/3',
      quizzes: '1/2',
      lastActive: 'منذ 5 ساعات',
      trend: 'up'
    },
  ];

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-success';
    if (progress >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  return (
    <DashboardLayout title="متابعة الطلاب">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">45</p>
              <p className="text-sm text-muted-foreground">إجمالي الطلاب</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">38</p>
              <p className="text-sm text-muted-foreground">نشط هذا الأسبوع</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">5</p>
              <p className="text-sm text-muted-foreground">يحتاجون متابعة</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold">82%</p>
              <p className="text-sm text-muted-foreground">متوسط التقدم</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="ابحث عن طالب..."
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>قائمة الطلاب</CardTitle>
            <CardDescription>تتبع تقدم وأداء الطلاب</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => (
                <div 
                  key={student.id}
                  className="border rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-bold text-primary">
                        {student.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {student.trend === 'up' ? (
                        <Badge className="bg-success/20 text-success">
                          <TrendingUp className="w-3 h-3 ml-1" />
                          تحسن
                        </Badge>
                      ) : (
                        <Badge className="bg-destructive/20 text-destructive">
                          <TrendingDown className="w-3 h-3 ml-1" />
                          تراجع
                        </Badge>
                      )}
                      <span className="text-xs text-muted-foreground">{student.lastActive}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">التقدم</p>
                      <p className="text-lg font-bold">{student.progress}%</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">متوسط الدرجات</p>
                      <p className="text-lg font-bold">{student.avgGrade}%</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">الواجبات</p>
                      <p className="text-lg font-bold">{student.assignments}</p>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 text-center">
                      <p className="text-xs text-muted-foreground mb-1">الاختبارات</p>
                      <p className="text-lg font-bold">{student.quizzes}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-muted-foreground">التقدم في المقرر</span>
                      <span className="text-sm font-medium">{student.progress}%</span>
                    </div>
                    <Progress 
                      value={student.progress} 
                      className={`h-2 ${getProgressColor(student.progress)}`}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 ml-1" />
                      عرض التفاصيل
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Award className="w-4 h-4 ml-1" />
                      الدرجات
                    </Button>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4" />
                    </Button>
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

export default TeacherStudents;
