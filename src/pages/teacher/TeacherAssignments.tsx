import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ClipboardList, Plus, Eye, Edit, Users, Calendar, Clock, Sparkles } from 'lucide-react';
import { CourseSelector, useCourses } from '@/components/CourseSelector';

const TeacherAssignments = () => {
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse, COURSE_DISPLAY_NAMES } = useCourses();

  const assignments = [
    { 
      id: 1,
      title: 'Assignment 1: Network Basics', 
      week: 1,
      dueDate: 'January 20, 2024',
      submissions: 42,
      total: 45,
      status: 'closed',
      avgScore: 85
    },
    { 
      id: 2,
      title: 'Assignment 2: OSI Model', 
      week: 2,
      dueDate: 'January 27, 2024',
      submissions: 40,
      total: 45,
      status: 'closed',
      avgScore: 78
    },
    { 
      id: 3,
      title: 'Assignment 3: IP Addressing', 
      week: 3,
      dueDate: 'February 3, 2024',
      submissions: 28,
      total: 45,
      status: 'active',
      avgScore: null
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">Active</Badge>;
      case 'closed':
        return <Badge variant="secondary">Closed</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Assignments">
      <div className="space-y-6">
        {/* Course Selector */}
        <CourseSelector
          value={selectedCourseId}
          onChange={setSelectedCourseId}
          courses={courses}
          label="Select Course"
          description="Choose which course to manage assignments for"
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {selectedCourse 
              ? `Manage assignments for ${COURSE_DISPLAY_NAMES[selectedCourse.code] || selectedCourse.code}`
              : 'Select a course to manage assignments'}
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled={!selectedCourseId}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </Button>
            <Button disabled={!selectedCourseId}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </div>
        </div>

        {selectedCourseId && (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-primary">3</p>
                  <p className="text-sm text-muted-foreground">Total Assignments</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-success">1</p>
                  <p className="text-sm text-muted-foreground">Active Assignments</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-warning">82%</p>
                  <p className="text-sm text-muted-foreground">Avg. Submission Rate</p>
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
                              Week {assignment.week}
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
                            Submissions
                          </span>
                          <span className="font-semibold">{assignment.submissions}/{assignment.total}</span>
                        </div>
                        <Progress value={(assignment.submissions / assignment.total) * 100} className="h-2" />
                      </div>
                      
                      {assignment.avgScore && (
                        <div className="bg-muted/30 rounded-lg p-3">
                          <p className="text-sm text-muted-foreground mb-1">Average Score</p>
                          <p className="text-2xl font-bold text-primary">{assignment.avgScore}%</p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        View Submissions
                      </Button>
                      <Button variant="outline" size="sm">
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

export default TeacherAssignments;
