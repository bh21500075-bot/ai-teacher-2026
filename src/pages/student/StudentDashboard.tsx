import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  ClipboardList, 
  CheckCircle, 
  Award,
  MessageSquare,
  Clock,
  TrendingUp,
  Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const courseProgress = 68;
  
  const upcomingTasks = [
    { type: 'assignment', title: 'Assignment 3: Conditional Statements', due: 'Tomorrow', urgent: true },
    { type: 'quiz', title: 'Week 4 Quiz', due: 'In 3 days', urgent: false },
  ];

  const recentGrades = [
    { title: 'Assignment 2', grade: 88, maxGrade: 100 },
    { title: 'Week 2 Quiz', grade: 82, maxGrade: 100 },
    { title: 'Assignment 1', grade: 95, maxGrade: 100 },
  ];

  const notifications = [
    { text: 'Assignment 2 grade published', time: '1 hour ago' },
    { text: 'New content: Week 4', time: '3 hours ago' },
    { text: 'Reminder: Assignment 3 due soon', time: 'Yesterday' },
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-6 text-primary-foreground">
          <h2 className="text-2xl font-bold mb-2">Welcome, Ali Abdulaziz 👋</h2>
          <p className="opacity-90 mb-4">Keep learning! You have an assignment due tomorrow</p>
          
          <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Your Course Progress</span>
              <span className="font-bold">{courseProgress}%</span>
            </div>
            <Progress value={courseProgress} className="h-3 bg-white/30" />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/student/lessons">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <p className="font-medium">Lessons</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/student/assignments">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <ClipboardList className="w-6 h-6 text-warning" />
                </div>
                <p className="font-medium">Assignments</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/student/quizzes">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
                <p className="font-medium">Quizzes</p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/student/chat">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full bg-gradient-to-br from-primary/5 to-accent/10">
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-primary-foreground" />
                </div>
                <p className="font-medium">AI Tutor</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Tasks */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="w-5 h-5 text-muted-foreground" />
                Upcoming Tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div 
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    task.urgent ? 'bg-destructive/10 border border-destructive/20' : 'bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {task.type === 'assignment' ? (
                      <ClipboardList className={`w-5 h-5 ${task.urgent ? 'text-destructive' : 'text-muted-foreground'}`} />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className={`text-sm ${task.urgent ? 'text-destructive' : 'text-muted-foreground'}`}>
                        {task.due}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant={task.urgent ? 'default' : 'outline'}>
                    Start
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Grades */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="w-5 h-5 text-muted-foreground" />
                  Recent Grades
                </CardTitle>
                <Link to="/student/grades">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentGrades.map((grade, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-xl"
                >
                  <span className="font-medium">{grade.title}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-primary">{grade.grade}</span>
                    <span className="text-muted-foreground">/ {grade.maxGrade}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bell className="w-5 h-5 text-muted-foreground" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notifications.map((notif, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-muted/30 rounded-xl"
              >
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm">{notif.text}</p>
                  <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
