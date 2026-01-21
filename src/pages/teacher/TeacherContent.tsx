import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, File, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';

const TeacherContent = () => {
  const uploadedFiles = [
    { name: 'Course_Specifications.pdf', type: 'specs', size: '2.4 MB', status: 'processed' },
    { name: 'Week1_Slides.pptx', type: 'slides', size: '5.1 MB', status: 'processed' },
    { name: 'Week2_Slides.pptx', type: 'slides', size: '4.8 MB', status: 'processed' },
    { name: 'Programming_Basics.pdf', type: 'material', size: '1.2 MB', status: 'processing' },
  ];

  return (
    <DashboardLayout title="Upload Content">
      <div className="space-y-6">
        {/* Upload Area */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Upload New Files</CardTitle>
            <CardDescription>
              Upload course specifications and learning materials for the AI tutor to learn from
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-medium mb-2">Drag files here or click to upload</p>
              <p className="text-sm text-muted-foreground mb-4">
                Supports: PDF, PPTX, DOCX (Max 50MB)
              </p>
              <Button>
                <Upload className="w-4 h-4 mr-2" />
                Choose Files
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* File Type Selection */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm cursor-pointer hover:ring-2 ring-primary transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold">Course Specifications</h3>
              <p className="text-sm text-muted-foreground">Course Specs</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm cursor-pointer hover:ring-2 ring-primary transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <File className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold">Lecture Slides</h3>
              <p className="text-sm text-muted-foreground">Weekly Slides</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm cursor-pointer hover:ring-2 ring-primary transition-all">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-success" />
              </div>
              <h3 className="font-semibold">Additional Materials</h3>
              <p className="text-sm text-muted-foreground">Extra Resources</p>
            </CardContent>
          </Card>
        </div>

        {/* Uploaded Files List */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
            <CardDescription>
              All files uploaded for this course
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {uploadedFiles.map((file, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{file.size}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {file.status === 'processed' ? (
                      <span className="flex items-center gap-1 text-sm text-success">
                        <CheckCircle className="w-4 h-4" />
                        Processed
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-sm text-warning">
                        <AlertCircle className="w-4 h-4" />
                        Processing
                      </span>
                    )}
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default TeacherContent;
