import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Eye, Edit, Calendar, Plus, Sparkles } from 'lucide-react';
import { CourseSelector, useCourses } from '@/components/CourseSelector';

const TeacherLessons = () => {
  const { courses, selectedCourseId, setSelectedCourseId, selectedCourse, isLoading, COURSE_DISPLAY_NAMES } = useCourses();

  const weeks = [
    { 
      week: 1, 
      title: 'Introduction to Networking', 
      slides: 25, 
      status: 'published',
      date: 'January 15, 2024'
    },
    { 
      week: 2, 
      title: 'OSI Model Layers', 
      slides: 30, 
      status: 'published',
      date: 'January 22, 2024'
    },
    { 
      week: 3, 
      title: 'IP Addressing', 
      slides: 28, 
      status: 'published',
      date: 'January 29, 2024'
    },
    { 
      week: 4, 
      title: 'Subnetting Basics', 
      slides: 32, 
      status: 'draft',
      date: 'February 5, 2024'
    },
    { 
      week: 5, 
      title: 'Network Protocols', 
      slides: 0, 
      status: 'empty',
      date: 'February 12, 2024'
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">Published</Badge>;
      case 'draft':
        return <Badge variant="secondary">Draft</Badge>;
      case 'empty':
        return <Badge variant="outline">Empty</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Weekly Lessons">
      <div className="space-y-6">
        {/* Course Selector */}
        <CourseSelector
          value={selectedCourseId}
          onChange={setSelectedCourseId}
          courses={courses}
          label="Select Course"
          description="Choose which course to manage lessons for"
        />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground">
              {selectedCourse 
                ? `Manage weekly lessons for ${COURSE_DISPLAY_NAMES[selectedCourse.code] || selectedCourse.code}`
                : 'Select a course to manage lessons'}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" disabled={!selectedCourseId}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate with AI
            </Button>
            <Button disabled={!selectedCourseId}>
              <Plus className="w-4 h-4 mr-2" />
              Add New Lesson
            </Button>
          </div>
        </div>

        {/* Weeks Grid */}
        {selectedCourseId && (
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
                      {week.slides > 0 ? `${week.slides} slides` : 'No content'}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {week.status !== 'empty' ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="w-full">
                        <Play className="w-4 h-4 mr-1" />
                        Add Content
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TeacherLessons;
