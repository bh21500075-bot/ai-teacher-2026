import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
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
    { title: 'Total Students', value: '45', icon: Users, color: 'text-primary' },
    { title: 'Uploaded Lessons', value: '12', icon: FileText, color: 'text-success' },
    { title: 'Active Assignments', value: '3', icon: ClipboardList, color: 'text-warning' },
    { title: 'Pending Approval', value: '8', icon: CheckCircle, color: 'text-destructive' },
  ];

  const recentActivities = [
    { type: 'assignment', text: 'Assignment "Programming Basics" submitted by 15 students', time: '2 hours ago' },
    { type: 'quiz', text: 'Week 5 quiz ready for approval', time: '3 hours ago' },
    { type: 'student', text: 'New question from student Mohammed Al-Ahmed', time: '5 hours ago' },
    { type: 'content', text: 'Week 6 content uploaded successfully', time: 'Yesterday' },
  ];

  const pendingGrades = [
    { student: 'Ali Abdulaziz', assignment: 'Assignment 3', aiGrade: 85, status: 'pending' },
    { student: 'Fatima Al-Ali', assignment: 'Assignment 3', aiGrade: 92, status: 'pending' },
    { student: 'Mohammed Al-Ahmed', assignment: 'Quiz 2', aiGrade: 78, status: 'pending' },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-2">Welcome, Dr. Ahmed Al-Mahmoud 👋</h2>
          <p className="opacity-90">You have 8 grades pending approval and 3 active assignments</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const content = (
              <Card key={index} className={`border-0 shadow-sm ${stat.title === 'Total Students' ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}>
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
            );
            if (stat.title === 'Total Students') {
              return <Link key={index} to="/teacher/students">{content}</Link>;
            }
            return <div key={index}>{content}</div>;
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Pending Grades - Human in the Loop */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-warning" />
                    Grades Pending Approval
                  </CardTitle>
                  <CardDescription>
                    Review and approve AI-suggested grades
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-2" />
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
                      <p className="text-xs text-muted-foreground">AI Grade</p>
                      <p className="text-lg font-bold text-primary">{item.aiGrade}%</p>
                    </div>
                    {index === 0 ? (
                      <Link to="/teacher/grading/demo">
                        <Button size="sm" className="h-9">
                          Review
                          <Badge className="bg-amber-500 text-white text-[10px] ml-1">DEMO</Badge>
                        </Button>
                      </Link>
                    ) : (
                      <Button size="sm" className="h-9">
                        Review
                      </Button>
                    )}
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
                Recent Activity
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
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <FileText className="w-6 h-6" />
                <span>Upload Content</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <ClipboardList className="w-6 h-6" />
                <span>Create Assignment</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <CheckCircle className="w-6 h-6" />
                <span>Generate Quiz</span>
              </Button>
              <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>View Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
