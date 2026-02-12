import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Eye, 
  AlertTriangle,
  Sparkles,
  User
} from 'lucide-react';
import { useState } from 'react';
import { CourseSelector, useCourses } from '@/components/CourseSelector';
import { Link } from 'react-router-dom';

const TeacherGrading = () => {
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse, COURSE_DISPLAY_NAMES } = useCourses();
  const [selectedFilter, setSelectedFilter] = useState('pending');

  const pendingGrades = [
    { 
      id: 1,
      student: 'Ali Abdulaziz',
      studentId: 'S001',
      assignment: 'Assignment 3: IP Addressing',
      type: 'assignment',
      aiGrade: 85,
      aiConfidence: 92,
      submittedAt: '3 hours ago',
      feedback: 'Correct answers on most questions with minor formatting errors.'
    },
    { 
      id: 2,
      student: 'Fatima Al-Ali',
      studentId: 'S003',
      assignment: 'Assignment 3: IP Addressing',
      type: 'assignment',
      aiGrade: 92,
      aiConfidence: 88,
      submittedAt: '5 hours ago',
      feedback: 'Excellent performance with deep understanding of concepts.'
    },
    { 
      id: 3,
      student: 'Mohammed Al-Ahmed',
      studentId: 'S002',
      assignment: 'Week 2 Quiz',
      type: 'quiz',
      aiGrade: 78,
      aiConfidence: 95,
      submittedAt: '1 day ago',
      feedback: 'Needs to review the OSI model section.'
    },
    { 
      id: 4,
      student: 'Sara Mahmoud',
      studentId: 'S004',
      assignment: 'Assignment 3: IP Addressing',
      type: 'assignment',
      aiGrade: 65,
      aiConfidence: 75,
      submittedAt: '2 days ago',
      feedback: 'Subnetting calculations need review. Low confidence - manual review recommended.'
    },
  ];

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 90) {
      return <Badge className="bg-success/20 text-success">High Confidence {confidence}%</Badge>;
    } else if (confidence >= 80) {
      return <Badge className="bg-warning/20 text-warning">Medium Confidence {confidence}%</Badge>;
    } else {
      return <Badge className="bg-destructive/20 text-destructive">Low Confidence {confidence}%</Badge>;
    }
  };

  return (
    <DashboardLayout title="Grade Approval">
      <div className="space-y-6">
        {/* Course Selector */}
        <CourseSelector
          value={selectedCourseId}
          onChange={setSelectedCourseId}
          courses={courses}
          label="Select Course"
          description="Choose which course to review grades for"
        />

        {selectedCourseId && (
          <>
            {/* Human in the Loop Banner */}
            <Card className="border-0 shadow-sm bg-gradient-to-r from-warning/5 to-accent/5 border-l-4 border-l-warning">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Human Review Required</h3>
                    <p className="text-muted-foreground text-sm mt-1">
                      Reviewing grades for {COURSE_DISPLAY_NAMES[selectedCourse?.code || ''] || 'this course'}. 
                      All AI-suggested grades require your approval.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-warning">{pendingGrades.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-success">156</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-3xl font-bold text-destructive">3</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </CardContent>
              </Card>
            </div>

            {/* Pending Grades List */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>AI-Suggested Grades</CardTitle>
                    <CardDescription>Review and approve or modify grades</CardDescription>
                  </div>
                  <Button variant="outline" className="gap-2">
                    Approve All (High Confidence)
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {pendingGrades.map((grade) => (
                  <div 
                    key={grade.id}
                    className="border rounded-xl p-4 space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold">{grade.student}</p>
                          <p className="text-sm text-muted-foreground">{grade.studentId}</p>
                        </div>
                      </div>
                      {getConfidenceBadge(grade.aiConfidence)}
                    </div>

                    <div className="bg-muted/30 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">{grade.assignment}</p>
                      <p className="text-xs text-muted-foreground">Submitted {grade.submittedAt}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-muted/30 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-sm text-muted-foreground">Suggested Grade</span>
                        </div>
                        <p className="text-3xl font-bold text-primary">{grade.aiGrade}%</p>
                      </div>
                      <div className="flex-1">
                        <label className="text-sm text-muted-foreground mb-1 block">Modify Grade</label>
                        <Input 
                          type="number" 
                          defaultValue={grade.aiGrade}
                          className="text-lg font-semibold"
                          min={0}
                          max={100}
                        />
                      </div>
                    </div>

                    <div className="bg-muted/20 rounded-lg p-3">
                      <p className="text-sm font-medium mb-1">AI Feedback:</p>
                      <p className="text-sm text-muted-foreground">{grade.feedback}</p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </Button>
                      {grade.id === 1 ? (
                        <Link to="/teacher/grading/demo" className="flex-1">
                          <Button variant="outline" size="sm" className="w-full gap-2">
                            <Eye className="w-4 h-4" />
                            Review Submission
                            <Badge className="bg-amber-500 text-white text-[10px] ml-1">DEMO</Badge>
                          </Button>
                        </Link>
                      ) : (
                        <Button variant="outline" size="sm" className="flex-1 gap-2">
                          <Eye className="w-4 h-4" />
                          Review Submission
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="text-destructive hover:text-destructive gap-2">
                        <XCircle className="w-4 h-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherGrading;
