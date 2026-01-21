import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, Plus, Eye, Edit, Users, Calendar, Clock } from 'lucide-react';

const TeacherAssignments = () => {
  const assignments = [
    { 
      id: 1,
      title: 'واجب 1: أساسيات البرمجة', 
      week: 1,
      dueDate: '20 يناير 2024',
      submissions: 42,
      total: 45,
      status: 'closed',
      avgScore: 85
    },
    { 
      id: 2,
      title: 'واجب 2: المتغيرات والأنواع', 
      week: 2,
      dueDate: '27 يناير 2024',
      submissions: 40,
      total: 45,
      status: 'closed',
      avgScore: 78
    },
    { 
      id: 3,
      title: 'واجب 3: الجمل الشرطية', 
      week: 3,
      dueDate: '3 فبراير 2024',
      submissions: 28,
      total: 45,
      status: 'active',
      avgScore: null
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">نشط</Badge>;
      case 'closed':
        return <Badge variant="secondary">مغلق</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="الواجبات">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            إنشاء وإدارة الواجبات الدراسية
          </p>
          <Button>
            <Plus className="w-4 h-4 ml-2" />
            إنشاء واجب جديد
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">3</p>
              <p className="text-sm text-muted-foreground">إجمالي الواجبات</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">1</p>
              <p className="text-sm text-muted-foreground">واجبات نشطة</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">82%</p>
              <p className="text-sm text-muted-foreground">متوسط التسليم</p>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          الأسبوع {assignment.week}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {assignment.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        التسليمات
                      </span>
                      <span className="font-semibold">{assignment.submissions}/{assignment.total}</span>
                    </div>
                    <Progress value={(assignment.submissions / assignment.total) * 100} className="h-2" />
                  </div>
                  
                  {assignment.avgScore && (
                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm text-muted-foreground mb-1">متوسط الدرجات</p>
                      <p className="text-2xl font-bold text-primary">{assignment.avgScore}%</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 ml-1" />
                    عرض التسليمات
                  </Button>
                  <Button variant="outline" size="sm">
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

export default TeacherAssignments;
