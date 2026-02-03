import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Play, CheckCircle, Lock, Clock } from 'lucide-react';
import { CourseSelector, useCourses } from '@/components/CourseSelector';

const StudentLessons = () => {
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse, COURSE_DISPLAY_NAMES } = useCourses();

  const weeks = [
    { 
      week: 1, 
      title: 'Introduction to Networking', 
      slides: 25, 
      status: 'completed',
      progress: 100,
      duration: '45 minutes'
    },
    { 
      week: 2, 
      title: 'OSI Model Layers', 
      slides: 30, 
      status: 'completed',
      progress: 100,
      duration: '55 minutes'
    },
    { 
      week: 3, 
      title: 'IP Addressing', 
      slides: 28, 
      status: 'in_progress',
      progress: 65,
      duration: '50 minutes'
    },
    { 
      week: 4, 
      title: 'Subnetting', 
      slides: 32, 
      status: 'available',
      progress: 0,
      duration: '60 minutes'
    },
    { 
      week: 5, 
      title: 'Network Protocols', 
      slides: 35, 
      status: 'locked',
      progress: 0,
      duration: '65 minutes'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">In Progress</Badge>;
      case 'available':
        return <Badge variant="secondary">Available</Badge>;
      case 'locked':
        return <Badge variant="outline" className="text-muted-foreground">Locked</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-6 h-6 text-success" />;
      case 'in_progress':
        return <Play className="w-6 h-6 text-primary" />;
      case 'available':
        return <BookOpen className="w-6 h-6 text-muted-foreground" />;
      case 'locked':
        return <Lock className="w-6 h-6 text-muted-foreground" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Lessons">
      <div className="space-y-6">
        {/* Course Selector */}
        <CourseSelector
          value={selectedCourseId}
          onChange={setSelectedCourseId}
          courses={courses}
          label="Select Course"
          description="Choose which course to view lessons for"
        />

        {selectedCourseId && (
          <>
            {/* Course Progress */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {COURSE_DISPLAY_NAMES[selectedCourse?.code || ''] || selectedCourse?.code}
                    </h3>
                    <p className="text-muted-foreground">{selectedCourse?.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">68%</p>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                  </div>
                </div>
                <Progress value={68} className="h-3" />
              </CardContent>
            </Card>

            {/* Weeks List */}
            <div className="space-y-4">
              {weeks.map((week) => (
                <Card 
                  key={week.week} 
                  className={`border-0 shadow-sm transition-all ${
                    week.status === 'locked' ? 'opacity-60' : 'hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      {/* Week Number */}
                      <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        week.status === 'completed' ? 'bg-success/10' :
                        week.status === 'in_progress' ? 'bg-primary/10' :
                        'bg-muted'
                      }`}>
                        {getStatusIcon(week.status)}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-lg">
                            Week {week.week}: {week.title}
                          </h3>
                          {getStatusBadge(week.status)}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {week.slides} slides
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {week.duration}
                          </span>
                        </div>

                        {(week.status === 'completed' || week.status === 'in_progress') && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{week.progress}%</span>
                            </div>
                            <Progress value={week.progress} className="h-2" />
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div>
                        {week.status === 'locked' ? (
                          <Button disabled variant="outline">
                            <Lock className="w-4 h-4 mr-1" />
                            Locked
                          </Button>
                        ) : week.status === 'completed' ? (
                          <Button variant="outline">
                            <Play className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        ) : (
                          <Button>
                            <Play className="w-4 h-4 mr-1" />
                            {week.status === 'in_progress' ? 'Continue' : 'Start'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentLessons;
