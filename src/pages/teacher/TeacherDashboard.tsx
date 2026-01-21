import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  FileText, 
  ClipboardList, 
  CheckCircle, 
  TrendingUp,
  Clock,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

const TeacherDashboard = () => {
  const stats = [
    { title: 'إجمالي الطلاب', value: '45', icon: Users, color: 'text-primary' },
    { title: 'الدروس المرفوعة', value: '12', icon: FileText, color: 'text-success' },
    { title: 'الواجبات النشطة', value: '3', icon: ClipboardList, color: 'text-warning' },
    { title: 'بانتظار الاعتماد', value: '8', icon: CheckCircle, color: 'text-destructive' },
  ];

  const recentActivities = [
    { type: 'assignment', text: 'تم تسليم واجب "أساسيات البرمجة" من 15 طالب', time: 'منذ ساعتين' },
    { type: 'quiz', text: 'اختبار الأسبوع 5 جاهز للاعتماد', time: 'منذ 3 ساعات' },
    { type: 'student', text: 'سؤال جديد من الطالب محمد الأحمد', time: 'منذ 5 ساعات' },
    { type: 'content', text: 'تم رفع محتوى الأسبوع 6 بنجاح', time: 'أمس' },
  ];

  const pendingGrades = [
    { student: 'علي عبدالعزيز', assignment: 'واجب 3', aiGrade: 85, status: 'pending' },
    { student: 'فاطمة العلي', assignment: 'واجب 3', aiGrade: 92, status: 'pending' },
    { student: 'محمد الأحمد', assignment: 'اختبار 2', aiGrade: 78, status: 'pending' },
  ];

  return (
    <DashboardLayout title="لوحة التحكم">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-2">مرحباً، د. أحمد المحمود 👋</h2>
          <p className="opacity-90">لديك 8 درجات بانتظار الاعتماد و 3 واجبات نشطة</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Grades - Human in the Loop */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    درجات بانتظار الاعتماد
                  </CardTitle>
                  <CardDescription>
                    راجع واعتمد الدرجات المقترحة من AI
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  عرض الكل
                  <ArrowRight className="w-4 h-4 mr-2" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingGrades.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-xl"
                >
                  <div>
                    <p className="font-medium">{item.student}</p>
                    <p className="text-sm text-muted-foreground">{item.assignment}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">درجة AI</p>
                      <p className="text-lg font-bold text-primary">{item.aiGrade}%</p>
                    </div>
                    <Button size="sm" className="h-9">
                      اعتماد
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                آخر الأنشطة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="w-6 h-6" />
                <span>رفع محتوى جديد</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <ClipboardList className="w-6 h-6" />
                <span>إنشاء واجب</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <CheckCircle className="w-6 h-6" />
                <span>توليد اختبار</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>عرض التقارير</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
