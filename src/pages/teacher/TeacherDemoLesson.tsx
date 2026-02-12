import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const slides = [
  { title: 'Introduction to Networking', content: 'Overview of computer networks, types, and applications in modern computing.' },
  { title: 'Types of Networks', content: 'LAN, MAN, WAN, PAN — classification by geographic scope and architecture.' },
  { title: 'Network Topologies', content: 'Star, Bus, Ring, Mesh — advantages and disadvantages of each.' },
  { title: 'The OSI Model Overview', content: '7-layer reference model for understanding network communication.' },
  { title: 'Summary & Key Takeaways', content: 'Review of all concepts covered in Week 1 with practice exercises.' },
];

const TeacherDemoLesson = () => {
  return (
    <DashboardLayout title="Lesson Review">
      <div className="space-y-4">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <Badge className="bg-amber-500 text-white">DEMO</Badge>
          <span className="text-sm text-amber-700 dark:text-amber-300">This is a demo lesson review page.</span>
        </div>

        <Link to="/teacher/lessons">
          <Button variant="ghost" size="sm"><ChevronLeft className="w-4 h-4 mr-1" />Back to Lessons</Button>
        </Link>

        <div>
          <h2 className="text-xl font-bold">Week 1: Introduction to Networking</h2>
          <p className="text-muted-foreground">Network 1 • 5 slides • Published</p>
        </div>

        <div className="space-y-3">
          {slides.map((slide, i) => (
            <Card key={i} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Slide {i + 1}</p>
                    <h3 className="font-semibold">{slide.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{slide.content}</p>
                  </div>
                  <Badge className="bg-success/20 text-success"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast({ title: 'Edit mode would open here' })}>Edit Lesson</Button>
          <Button onClick={() => toast({ title: 'Lesson published successfully!' })}>Publish Changes</Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDemoLesson;
