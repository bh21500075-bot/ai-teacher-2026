import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Plus, Eye, Edit, Sparkles, Clock, HelpCircle } from 'lucide-react';
import { CourseSelector, useCourses } from '@/components/CourseSelector';

const TeacherQuizzes = () => {
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse, COURSE_DISPLAY_NAMES } = useCourses();

  const quizzes = [
    { 
      id: 1,
      title: 'Week 1 Quiz', 
      week: 1,
      questions: 10,
      duration: '30 minutes',
      status: 'published',
      aiGenerated: true,
      attempts: 44
    },
    { 
      id: 2,
      title: 'Week 2 Quiz', 
      week: 2,
      questions: 15,
      duration: '45 minutes',
      status: 'published',
      aiGenerated: true,
      attempts: 41
    },
    { 
      id: 3,
      title: 'Week 3 Quiz', 
      week: 3,
      questions: 12,
      duration: '35 minutes',
      status: 'draft',
      aiGenerated: true,
      attempts: 0
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      default:
        return null;
    }
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
          description="Choose which course to manage quizzes for"
        />

        {selectedCourseId && (
          <>
            {/* AI Quiz Generator Banner */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">AI Quiz Generator</h3>
                      <p className="text-muted-foreground">
                        Generate quizzes from {COURSE_DISPLAY_NAMES[selectedCourse?.code || ''] || 'course'} materials
                      </p>
                    </div>
                  </div>
                  <Button>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate New Quiz
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Header */}
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground">
                Manage quizzes and assessments for {COURSE_DISPLAY_NAMES[selectedCourse?.code || ''] || 'this course'}
              </p>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Manually
              </Button>
            </div>

            {/* Quizzes Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {quizzes.map((quiz) => (
                <Card key={quiz.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex items-center gap-2">
                        {quiz.aiGenerated && (
                          <Badge variant="outline" className="text-xs">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI
                          </Badge>
                        )}
                        {getStatusBadge(quiz.status)}
                      </div>
                    </div>
                    <CardTitle className="text-lg mt-3">{quiz.title}</CardTitle>
                    <CardDescription>Week {quiz.week}</CardDescription>
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
                      {quiz.status === 'published' && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Attempts</span>
                          <span className="font-medium">{quiz.attempts}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="w-4 h-4 mr-1" />
                        Edit
                      </Button>
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

export default TeacherQuizzes;
