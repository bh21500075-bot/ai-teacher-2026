import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Eye, Edit, Calendar } from 'lucide-react';

const TeacherLessons = () => {
  const weeks = [
    { 
      week: 1, 
      title: 'مقدمة في البرمجة', 
      slides: 25, 
      status: 'published',
      date: '15 يناير 2024'
    },
    { 
      week: 2, 
      title: 'المتغيرات والعمليات', 
      slides: 30, 
      status: 'published',
      date: '22 يناير 2024'
    },
    { 
      week: 3, 
      title: 'الجمل الشرطية', 
      slides: 28, 
      status: 'published',
      date: '29 يناير 2024'
    },
    { 
      week: 4, 
      title: 'الحلقات التكرارية', 
      slides: 32, 
      status: 'draft',
      date: '5 فبراير 2024'
    },
    { 
      week: 5, 
      title: 'الدوال والإجراءات', 
      slides: 0, 
      status: 'empty',
      date: '12 فبراير 2024'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">منشور</Badge>;
      case 'draft':
        return <Badge variant="secondary">مسودة</Badge>;
      case 'empty':
        return <Badge variant="outline">فارغ</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="الدروس الأسبوعية">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              إدارة الدروس الأسبوعية للمقرر
            </p>
          </div>
          <Button>
            <BookOpen className="w-4 h-4 ml-2" />
            إضافة أسبوع جديد
          </Button>
        </div>

        {/* Weeks Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {weeks.map((week) => (
            <Card key={week.week} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <span className="font-bold text-primary">{week.week}</span>
                  </div>
                  {getStatusBadge(week.status)}
                </div>
                <CardTitle className="text-lg mt-3">{week.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {week.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-muted-foreground">
                    {week.slides > 0 ? `${week.slides} شريحة` : 'لا يوجد محتوى'}
                  </span>
                </div>
                <div className="flex gap-2">
                  {week.status !== 'empty' ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 ml-1" />
                        عرض
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 ml-1" />
                        تعديل
                      </Button>
                    </>
                  ) : (
                    <Button size="sm" className="w-full">
                      <Play className="w-4 h-4 ml-1" />
                      إضافة محتوى
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

export default TeacherLessons;
