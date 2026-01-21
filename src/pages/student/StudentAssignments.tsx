import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Clock, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const StudentAssignments = () => {
  const assignments = [
    { 
      id: 1,
      title: 'واجب 1: أساسيات البرمجة', 
      week: 1,
      dueDate: '20 يناير 2024',
      status: 'graded',
      grade: 95,
      submittedAt: '19 يناير 2024'
    },
    { 
      id: 2,
      title: 'واجب 2: المتغيرات والأنواع', 
      week: 2,
      dueDate: '27 يناير 2024',
      status: 'graded',
      grade: 88,
      submittedAt: '26 يناير 2024'
    },
    { 
      id: 3,
      title: 'واجب 3: الجمل الشرطية', 
      week: 3,
      dueDate: '3 فبراير 2024',
      status: 'pending',
      grade: null,
      submittedAt: null
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">تم التقييم</Badge>;
      case 'submitted':
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">تم التسليم</Badge>;
      case 'pending':
        return <Badge className="bg-warning/20 text-warning hover:bg-warning/30">مستحق</Badge>;
      case 'late':
        return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30">متأخر</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="الواجبات">
      <div className="space-y-6">
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
              <p className="text-3xl font-bold text-success">2</p>
              <p className="text-sm text-muted-foreground">تم إنجازها</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">1</p>
              <p className="text-sm text-muted-foreground">مستحقة</p>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card 
              key={assignment.id} 
              className={`border-0 shadow-sm ${
                assignment.status === 'pending' ? 'ring-2 ring-warning/30' : ''
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      assignment.status === 'graded' ? 'bg-success/10' :
                      assignment.status === 'pending' ? 'bg-warning/10' :
                      'bg-primary/10'
                    }`}>
                      {assignment.status === 'graded' ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : assignment.status === 'pending' ? (
                        <AlertCircle className="w-6 h-6 text-warning" />
                      ) : (
                        <ClipboardList className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>الأسبوع {assignment.week}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {assignment.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>

                {assignment.status === 'graded' && (
                  <div className="bg-success/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">الدرجة</p>
                        <p className="text-3xl font-bold text-success">{assignment.grade}%</p>
                      </div>
                      <div className="text-left">
                        <p className="text-sm text-muted-foreground">تم التسليم</p>
                        <p className="font-medium">{assignment.submittedAt}</p>
                      </div>
                    </div>
                  </div>
                )}

                {assignment.status === 'pending' && (
                  <div className="bg-warning/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 text-warning">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">لم يتم التسليم بعد - الموعد النهائي: {assignment.dueDate}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {assignment.status === 'pending' ? (
                    <Button className="flex-1">
                      <Upload className="w-4 h-4 ml-1" />
                      تسليم الواجب
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1">
                      عرض التفاصيل
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
