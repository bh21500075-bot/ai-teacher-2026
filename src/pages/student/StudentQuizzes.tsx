import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, Play, HelpCircle, Trophy } from 'lucide-react';
import { CourseSelector, useCourses } from '@/components/CourseSelector';
import { Link } from 'react-router-dom';

const StudentQuizzes = () => {
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse, COURSE_DISPLAY_NAMES } = useCourses();

  const quizzes = [
    { 
      id: 1,
      title: 'Week 1 Quiz', 
      week: 1,
      questions: 10,
      duration: '30 minutes',
      status: 'completed',
      grade: 90,
      completedAt: 'January 18, 2024'
    },
    { 
      id: 2,
      title: 'Week 2 Quiz', 
      week: 2,
      questions: 15,
      duration: '45 minutes',
      status: 'completed',
      grade: 82,
      completedAt: 'January 25, 2024'
    },
    { 
      id: 3,
      title: 'Week 3 Quiz', 
      week: 3,
      questions: 12,
      duration: '35 minutes',
      status: 'available',
      grade: null,
      completedAt: null
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">Completed</Badge>;
      case 'available':
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Available</Badge>;
      case 'locked':
        return <Badge variant="outline" className="text-muted-foreground">Locked</Badge>;
      default:
        return null;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-success';
    if (grade >= 70) return 'text-primary';
    if (grade >= 50) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <DashboardLayout title="Quizzes">
      <div className="space-y-6">
        {/* Course Selector */}
        <CourseSelector
          value={selectedCourseId}
          onChange={setSelectedCourseId}
          courses={courses}
          label="Select Course"
          description="Choose which course to view quizzes for"
        />

        {selectedCourseId && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">3</p>
                  <p className="text-sm text-muted-foreground">Total Quizzes</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-success">2</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold">86%</p>
                  <p className="text-sm text-muted-foreground">Average Grade</p>
                </CardContent>
              </Card>
            </div>

            {/* Quizzes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        quiz.status === 'completed' ? 'bg-success/10' : 'bg-primary/10'
                      }`}>
                        {quiz.status === 'completed' ? (
                          <Trophy className="w-5 h-5 text-success" />
                        ) : (
                          <CheckCircle className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      {getStatusBadge(quiz.status)}
                    </div>
                    <CardTitle className="text-lg mt-3">{quiz.title}</CardTitle>
                    <CardDescription>
                      {COURSE_DISPLAY_NAMES[selectedCourse?.code || ''] || 'Course'} • Week {quiz.week}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <HelpCircle className="w-4 h-4" />
                          Questions
                        </span>
                        <span className="font-medium">{quiz.questions}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Duration
                        </span>
                        <span className="font-medium">{quiz.duration}</span>
                      </div>
                    </div>

                    {quiz.status === 'completed' && quiz.grade !== null && (
                      <div className="bg-muted/30 rounded-xl p-4 mb-4 text-center">
                        <p className="text-sm text-muted-foreground mb-1">Your Grade</p>
                        <p className={`text-3xl font-bold ${getGradeColor(quiz.grade)}`}>
                          {quiz.grade}%
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{quiz.completedAt}</p>
                      </div>
                    )}
                    
                    {quiz.status === 'available' && quiz.id === 3 ? (
                      <Link to="/student/quizzes/demo" className="w-full">
                        <Button className="w-full">
                          <Play className="w-4 h-4 mr-1" />
                          Start Quiz
                          <Badge className="bg-amber-500 text-white text-[10px] ml-1">DEMO</Badge>
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        className="w-full" 
                        variant={quiz.status === 'completed' ? 'outline' : 'default'}
                      >
                        {quiz.status === 'completed' ? (
                          <>View Results</>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            Start Quiz
                          </>
                        )}
                      </Button>
                    )}
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

export default StudentQuizzes;
