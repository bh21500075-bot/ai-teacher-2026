import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Award, TrendingUp, Trophy, Target, BookOpen } from 'lucide-react';
import { useCourses } from '@/components/CourseSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentGrades = () => {
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse, COURSE_DISPLAY_NAMES, isLoading } = useCourses();

  // Mock grades data per course
  const courseGrades: Record<string, {
    overallGrade: number;
    assignments: number;
    quizzes: number;
    finalExam: number | null;
    grades: Array<{ type: string; title: string; grade: number; maxGrade: number; weight: number; date: string }>;
  }> = {
    'CCNA1': {
      overallGrade: 88,
      assignments: 92,
      quizzes: 86,
      finalExam: null,
      grades: [
        { type: 'assignment', title: 'Assignment 1: Networking Basics', grade: 95, maxGrade: 100, weight: 10, date: 'January 20' },
        { type: 'quiz', title: 'Week 1 Quiz', grade: 90, maxGrade: 100, weight: 5, date: 'January 18' },
        { type: 'assignment', title: 'Assignment 2: OSI Model', grade: 88, maxGrade: 100, weight: 10, date: 'January 27' },
        { type: 'quiz', title: 'Week 2 Quiz', grade: 82, maxGrade: 100, weight: 5, date: 'January 25' },
      ]
    },
    'CCNA2': {
      overallGrade: 75,
      assignments: 78,
      quizzes: 72,
      finalExam: null,
      grades: [
        { type: 'assignment', title: 'Assignment 1: Static Routing', grade: 80, maxGrade: 100, weight: 10, date: 'February 1' },
        { type: 'quiz', title: 'Week 1 Quiz', grade: 72, maxGrade: 100, weight: 5, date: 'February 3' },
      ]
    },
    'CCNA3': {
      overallGrade: 0,
      assignments: 0,
      quizzes: 0,
      finalExam: null,
      grades: []
    },
    'CCNA4': {
      overallGrade: 0,
      assignments: 0,
      quizzes: 0,
      finalExam: null,
      grades: []
    },
  };

  const currentGrades = selectedCourse ? courseGrades[selectedCourse.code] || courseGrades['CCNA1'] : courseGrades['CCNA1'];

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return 'text-success';
    if (grade >= 70) return 'text-primary';
    if (grade >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getGradeLabel = (grade: number) => {
    if (grade >= 90) return 'Excellent';
    if (grade >= 80) return 'Very Good';
    if (grade >= 70) return 'Good';
    if (grade >= 60) return 'Satisfactory';
    if (grade === 0) return 'Not Started';
    return 'Needs Improvement';
  };

  return (
    <DashboardLayout title="My Grades">
      <div className="space-y-6">
        {/* Course Tabs */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Course Grades
            </CardTitle>
            <CardDescription>View your performance across all courses</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedCourseId || courses[0]?.id} onValueChange={setSelectedCourseId}>
              <TabsList className="grid w-full grid-cols-4">
                {courses.map(course => (
                  <TabsTrigger key={course.id} value={course.id}>
                    {COURSE_DISPLAY_NAMES[course.code] || course.code}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </CardContent>
        </Card>

        {/* Overall Grade */}
        <Card className="border-0 shadow-sm bg-gradient-to-r from-primary/5 to-accent/5">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground mb-1">
                  {COURSE_DISPLAY_NAMES[selectedCourse?.code || ''] || 'Course'} Average
                </p>
                <div className="flex items-baseline gap-2">
                  <p className={`text-5xl font-bold ${getGradeColor(currentGrades.overallGrade)}`}>
                    {currentGrades.overallGrade > 0 ? `${currentGrades.overallGrade}%` : 'N/A'}
                  </p>
                  <span className={`text-lg ${getGradeColor(currentGrades.overallGrade)}`}>
                    {getGradeLabel(currentGrades.overallGrade)}
                  </span>
                </div>
              </div>
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                <Trophy className="w-10 h-10 text-primary" />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Target</span>
                </div>
                <p className="text-2xl font-bold">90%</p>
              </div>
              <div className="bg-white/50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  <span className="text-sm text-muted-foreground">Progress</span>
                </div>
                <p className="text-2xl font-bold text-success">
                  {currentGrades.overallGrade > 0 ? '+5%' : 'N/A'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grade Breakdown */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Grade Breakdown</CardTitle>
            <CardDescription>
              Percentage of each component for {COURSE_DISPLAY_NAMES[selectedCourse?.code || ''] || 'this course'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Assignments (40%)</span>
                <span className="font-medium">
                  {currentGrades.assignments > 0 ? `${currentGrades.assignments}%` : 'N/A'}
                </span>
              </div>
              <Progress value={currentGrades.assignments} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Quizzes (20%)</span>
                <span className="font-medium">
                  {currentGrades.quizzes > 0 ? `${currentGrades.quizzes}%` : 'N/A'}
                </span>
              </div>
              <Progress value={currentGrades.quizzes} className="h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Final Exam (40%)</span>
                <span className="font-medium text-muted-foreground">
                  {currentGrades.finalExam ? `${currentGrades.finalExam}%` : 'Not yet taken'}
                </span>
              </div>
              <Progress value={currentGrades.finalExam || 0} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Detailed Grades */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Grade Details</CardTitle>
            <CardDescription>
              Individual grades for {COURSE_DISPLAY_NAMES[selectedCourse?.code || ''] || 'this course'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {currentGrades.grades.length > 0 ? (
              <div className="space-y-3">
                {currentGrades.grades.map((grade, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        grade.type === 'quiz' ? 'bg-primary/10' : 'bg-accent/10'
                      }`}>
                        <Award className={`w-5 h-5 ${
                          grade.type === 'quiz' ? 'text-primary' : 'text-accent'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{grade.title}</p>
                        <p className="text-sm text-muted-foreground">{grade.date} • Weight {grade.weight}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getGradeColor(grade.grade)}`}>
                        {grade.grade}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No grades available yet for this course</p>
                <p className="text-sm">Complete assignments and quizzes to see your grades</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
