import { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, BookOpen, ClipboardList, CheckCircle, AlertCircle, Trash2, Loader2, Network, Route, Layers, Globe } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MaterialType = Database['public']['Enums']['material_type'];

interface UploadedFile {
  id: string;
  name: string;
  type: MaterialType;
  size: string;
  status: 'processing' | 'processed' | 'error';
  file_url: string;
}

interface Course {
  id: string;
  code: string;
  title: string;
}

const materialTypes: { type: MaterialType; label: string; description: string; icon: React.ReactNode }[] = [
  { type: 'textbook', label: 'Textbook & References', description: 'Course materials & books', icon: <BookOpen className="w-6 h-6 text-primary" /> },
  { type: 'manual', label: 'Course Manual', description: 'Guides & specifications', icon: <FileText className="w-6 h-6 text-accent" /> },
  { type: 'rubric', label: 'Grading Rubrics', description: 'Assessment criteria', icon: <ClipboardList className="w-6 h-6 text-success" /> },
  { type: 'other', label: 'Other Materials', description: 'Additional resources', icon: <FileText className="w-6 h-6 text-muted-foreground" /> },
];

const LEVEL_ICONS: Record<string, React.ReactNode> = {
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

const TeacherContent = () => {
  const { user: authUser } = useAuth();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<MaterialType>('textbook');
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Fetch courses and materials on mount
  useEffect(() => {
    fetchCoursesAndMaterials();
  }, [authUser]);

  // Fetch materials when selected course changes
  useEffect(() => {
    if (selectedCourseId) {
      fetchMaterialsForCourse(selectedCourseId);
    }
  }, [selectedCourseId]);

  const fetchCoursesAndMaterials = async () => {
    try {
      setIsLoading(true);
      
      if (!authUser) {
        toast({
          title: 'Not Logged In',
          description: 'Please log in to access this page.',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      if (authUser.role !== 'teacher') {
        toast({
          title: 'Access Denied',
          description: 'You must be a teacher to upload course materials.',
          variant: 'destructive'
        });
        setIsLoading(false);
        return;
      }

      // Fetch all CCNA courses
      const { data: coursesData, error: courseError } = await supabase
        .from('courses')
        .select('id, code, title')
        .like('code', 'CCNA%')
        .eq('is_active', true)
        .order('code');

      if (courseError) {
        console.error('Error fetching courses:', courseError);
        setIsLoading(false);
        return;
      }

      if (coursesData && coursesData.length > 0) {
        setCourses(coursesData);
        setSelectedCourseId(coursesData[0].id);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterialsForCourse = async (courseId: string) => {
    try {
      const { data: materials, error: materialsError } = await supabase
        .from('course_materials')
        .select('id, title, material_type, file_url, is_processed')
        .eq('course_id', courseId)
        .order('uploaded_at', { ascending: false });

      if (materialsError) {
        console.error('Error fetching materials:', materialsError);
        return;
      }

      if (materials) {
        setUploadedFiles(materials.map(m => ({
          id: m.id,
          name: m.title,
          type: (m.material_type as MaterialType) || 'other',
          size: '-',
          status: m.is_processed ? 'processed' : 'processing',
          file_url: m.file_url || ''
        })));
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (!selectedCourseId) {
      toast({
        title: 'No Course Selected',
        description: 'Please select a course level first before uploading materials.',
        variant: 'destructive'
      });
      return;
    }

    setIsUploading(true);

    for (const file of Array.from(files)) {
      try {
        // Validate file type
        const allowedTypes = ['text/plain', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.type) && !file.name.endsWith('.txt') && !file.name.endsWith('.docx') && !file.name.endsWith('.pdf')) {
          toast({
            title: 'Invalid File Type',
            description: `${file.name} is not supported. Use TXT, DOCX, or PDF files.`,
            variant: 'destructive'
          });
          continue;
        }

        // Upload to storage
        const fileName = `${selectedCourseId}/${Date.now()}_${file.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('course-materials')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: 'Upload Failed',
            description: `Failed to upload ${file.name}: ${uploadError.message}`,
            variant: 'destructive'
          });
          continue;
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('course-materials')
          .getPublicUrl(fileName);

        // Create database record
        const { data: material, error: dbError } = await supabase
          .from('course_materials')
          .insert({
            course_id: selectedCourseId,
            title: file.name,
            material_type: selectedType,
            file_url: urlData.publicUrl,
            is_processed: false
          })
          .select()
          .single();

        if (dbError) {
          console.error('Database error:', dbError);
          toast({
            title: 'Database Error',
            description: `Failed to save ${file.name} record.`,
            variant: 'destructive'
          });
          continue;
        }

        // Add to UI immediately
        const newFile: UploadedFile = {
          id: material.id,
          name: file.name,
          type: selectedType,
          size: formatFileSize(file.size),
          status: 'processing',
          file_url: urlData.publicUrl
        };
        setUploadedFiles(prev => [newFile, ...prev]);

        // Process document in background
        processDocument(material.id, urlData.publicUrl, file.name);

        toast({
          title: 'Upload Successful',
          description: `${file.name} uploaded and being processed.`
        });

      } catch (error) {
        console.error('Error uploading file:', error);
        toast({
          title: 'Error',
          description: `An error occurred while uploading ${file.name}`,
          variant: 'destructive'
        });
      }
    }

    setIsUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processDocument = async (materialId: string, fileUrl: string, fileName: string) => {
    try {
      const { error } = await supabase.functions.invoke('process-document', {
        body: { materialId, fileUrl, fileName }
      });

      if (error) {
        console.error('Processing error:', error);
        setUploadedFiles(prev => prev.map(f => 
          f.id === materialId ? { ...f, status: 'error' as const } : f
        ));
        return;
      }

      // Update status to processed
      setUploadedFiles(prev => prev.map(f => 
        f.id === materialId ? { ...f, status: 'processed' as const } : f
      ));
    } catch (error) {
      console.error('Process error:', error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === materialId ? { ...f, status: 'error' as const } : f
      ));
    }
  };

  const handleDelete = async (fileId: string, fileUrl: string) => {
    try {
      // Delete from storage
      const filePath = fileUrl.split('/course-materials/')[1];
      if (filePath) {
        await supabase.storage.from('course-materials').remove([filePath]);
      }

      // Delete from database
      const { error } = await supabase
        .from('course_materials')
        .delete()
        .eq('id', fileId);

      if (error) {
        console.error('Delete error:', error);
        toast({
          title: 'Delete Failed',
          description: 'Could not delete the file.',
          variant: 'destructive'
        });
        return;
      }

      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      toast({
        title: 'File Deleted',
        description: 'The file has been removed.'
      });
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getMaterialIcon = (type: MaterialType) => {
    const found = materialTypes.find(m => m.type === type);
    return found?.icon || <FileText className="w-5 h-5 text-primary" />;
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <DashboardLayout title="Upload Content">
      <div className="space-y-6">
        {/* Course Level Selection */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Select Course</CardTitle>
            <CardDescription>
              Choose which course to upload materials for
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedCourseId || ''} onValueChange={setSelectedCourseId}>
              <SelectTrigger className="w-full md:w-[400px]">
                <SelectValue placeholder="Select a course level" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    <div className="flex items-center gap-2">
                      {LEVEL_ICONS[course.code] || <BookOpen className="w-4 h-4" />}
                      <span>{COURSE_DISPLAY_NAMES[course.code] || course.code}: {course.title.split(': ')[1] || course.title}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedCourse && (
              <p className="text-sm text-muted-foreground mt-2">
                Currently managing: <strong>{COURSE_DISPLAY_NAMES[selectedCourse.code] || selectedCourse.code}</strong>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Upload Area */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Upload New Files</CardTitle>
            <CardDescription>
              Upload course materials for the AI tutor to learn from and answer student questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".txt,.docx,.pdf"
              multiple
              className="hidden"
            />
            <div 
              className={`border-2 border-dashed border-border rounded-xl p-8 text-center transition-colors cursor-pointer ${
                selectedCourseId ? 'hover:border-primary/50' : 'opacity-50 cursor-not-allowed'
              }`}
              onClick={() => selectedCourseId && fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                {isUploading ? (
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-primary" />
                )}
              </div>
              <p className="text-lg font-medium mb-2">
                {isUploading ? 'Uploading...' : 'Drag files here or click to upload'}
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports: TXT, DOCX, PDF (Max 20MB)
              </p>
              <Button disabled={isUploading || !selectedCourseId}>
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Material Type Selection */}
        <div>
          <h3 className="text-sm font-medium mb-3">Select Material Type Before Upload:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {materialTypes.map((material) => (
              <Card 
                key={material.type}
                className={`border-0 shadow-sm cursor-pointer transition-all ${
                  selectedType === material.type 
                    ? 'ring-2 ring-primary bg-primary/5' 
                    : 'hover:ring-2 ring-muted'
                }`}
                onClick={() => setSelectedType(material.type)}
              >
                <CardContent className="p-3 text-center">
                  <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center mx-auto mb-2">
                    {material.icon}
                  </div>
                  <h4 className="font-medium text-xs">{material.label}</h4>
                  <p className="text-[10px] text-muted-foreground mt-1">{material.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Uploaded Files List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Uploaded Files {selectedCourse && `- ${selectedCourse.code}`}</CardTitle>
            <CardDescription>
              Materials uploaded for this level's AI tutor training
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                <p className="text-sm text-muted-foreground">Loading materials...</p>
              </div>
            ) : uploadedFiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No files uploaded yet for this level</p>
                <p className="text-sm">Upload course materials to train the AI tutor</p>
              </div>
            ) : (
              <div className="space-y-3">
                {uploadedFiles.map((file) => (
                  <div 
                    key={file.id}
                    className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center">
                        {getMaterialIcon(file.type)}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {file.type.replace('_', ' ')} • {file.size}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      {file.status === 'processed' ? (
                        <span className="flex items-center gap-1 text-sm text-success">
                          <CheckCircle className="w-4 h-4" />
                          Processed
                        </span>
                      ) : file.status === 'error' ? (
                        <span className="flex items-center gap-1 text-sm text-destructive">
                          <AlertCircle className="w-4 h-4" />
                          Error
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-sm text-warning">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing
                        </span>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDelete(file.id, file.file_url)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherContent;