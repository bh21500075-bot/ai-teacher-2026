import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Network, Route, Layers, Globe, BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  code: string;
  title: string;
  description?: string | null;
}

const COURSE_ICONS: Record<string, React.ReactNode> = {
  'CCNA1': <Network className="w-4 h-4" />,
  'CCNA2': <Route className="w-4 h-4" />,
  'CCNA3': <Layers className="w-4 h-4" />,
  'CCNA4': <Globe className="w-4 h-4" />,
};

const COURSE_DISPLAY_NAMES: Record<string, string> = {
  'CCNA1': 'Network 1',
  'CCNA2': 'Network 2',
  'CCNA3': 'Network 3',
  'CCNA4': 'Network 4',
};

interface CourseSelectorProps {
  value: string | null;
  onChange: (courseId: string) => void;
  courses?: Course[];
  showCard?: boolean;
  label?: string;
  description?: string;
  className?: string;
}

export function CourseSelector({
  value,
  onChange,
  courses: propCourses,
  showCard = true,
  label = "Select Course",
  description = "Choose which course to manage",
  className = "",
}: CourseSelectorProps) {
  const [courses, setCourses] = useState<Course[]>(propCourses || []);
  const [isLoading, setIsLoading] = useState(!propCourses);
  const { toast } = useToast();

  useEffect(() => {
    if (!propCourses) {
      fetchCourses();
    }
  }, [propCourses]);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('id, code, title, description')
        .like('code', 'CCNA%')
        .eq('is_active', true)
        .order('code');

      if (error) {
        toast({
          title: 'Error',
          description: 'Could not load courses. Please try again.',
          variant: 'destructive',
        });
        return;
      }

      if (data) {
        setCourses(data);
        // Auto-select first course if none selected
        if (!value && data.length > 0) {
          onChange(data[0].id);
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Could not load courses. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = (code: string) => {
    return COURSE_DISPLAY_NAMES[code] || code;
  };

  const selectedCourse = courses.find(c => c.id === value);

  const selectorContent = (
    <>
      <Select value={value || ''} onValueChange={onChange} disabled={isLoading}>
        <SelectTrigger className="w-full md:w-[400px]">
          <SelectValue placeholder={isLoading ? "Loading courses..." : "Select a course"} />
        </SelectTrigger>
        <SelectContent>
          {courses.map(course => (
            <SelectItem key={course.id} value={course.id}>
              <div className="flex items-center gap-2">
                {COURSE_ICONS[course.code] || <BookOpen className="w-4 h-4" />}
                <span>{getDisplayName(course.code)}: {course.title.split(': ')[1] || course.title}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedCourse && (
        <p className="text-sm text-muted-foreground mt-2">
          Currently managing: <strong>{getDisplayName(selectedCourse.code)}</strong>
        </p>
      )}
    </>
  );

  if (!showCard) {
    return <div className={className}>{selectorContent}</div>;
  }

  return (
    <Card className={`border-0 shadow-sm ${className}`}>
      <CardHeader>
        <CardTitle>{label}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            Loading courses...
          </div>
        ) : (
          selectorContent
        )}
      </CardContent>
    </Card>
  );
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select('id, code, title, description')
        .like('code', 'CCNA%')
        .eq('is_active', true)
        .order('code');

      if (error) {
        return;
      }

      if (data) {
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(data[0].id);
        }
      }
    } catch (error) {
      // Course loading failed silently in hook context
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return {
    courses,
    selectedCourseId,
    setSelectedCourseId,
    selectedCourse,
    isLoading,
    COURSE_DISPLAY_NAMES,
    COURSE_ICONS,
  };
}
