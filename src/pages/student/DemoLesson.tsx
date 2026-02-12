import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const slides = [
  {
    title: 'Introduction to Networking',
    content: `## What is a Computer Network?\n\nA computer network is a collection of interconnected devices that can communicate and share resources with each other.\n\n### Key Concepts:\n- **Nodes**: Any device connected to the network (computers, printers, servers)\n- **Links**: The communication pathways between nodes\n- **Protocols**: Rules that govern data communication\n- **Topology**: The physical or logical arrangement of the network`,
  },
  {
    title: 'Types of Networks',
    content: `## Network Classifications\n\n### By Geographic Scope:\n- **LAN (Local Area Network)**: Covers a small area like an office or building\n- **MAN (Metropolitan Area Network)**: Spans a city or campus\n- **WAN (Wide Area Network)**: Covers large geographic areas\n- **PAN (Personal Area Network)**: Very short range, personal devices\n\n### By Architecture:\n- **Client-Server**: Centralized server provides resources\n- **Peer-to-Peer**: All devices share resources equally`,
  },
  {
    title: 'Network Topologies',
    content: `## Common Network Topologies\n\n### Star Topology\nAll devices connect to a central hub or switch. Most common in modern LANs.\n\n### Bus Topology\nAll devices share a single communication line. Simple but collision-prone.\n\n### Ring Topology\nDevices form a closed loop. Data travels in one direction.\n\n### Mesh Topology\nEvery device connects to every other device. Highly redundant and reliable.`,
  },
  {
    title: 'The OSI Model Overview',
    content: `## OSI Reference Model\n\nThe OSI (Open Systems Interconnection) model has 7 layers:\n\n1. **Physical Layer** - Bit transmission\n2. **Data Link Layer** - Frame delivery\n3. **Network Layer** - Packet routing\n4. **Transport Layer** - End-to-end delivery\n5. **Session Layer** - Session management\n6. **Presentation Layer** - Data formatting\n7. **Application Layer** - User interface\n\n*Remember: "Please Do Not Throw Sausage Pizza Away"*`,
  },
  {
    title: 'Summary & Key Takeaways',
    content: `## Week 1 Summary\n\n### What You Learned:\n✅ Definition and purpose of computer networks\n✅ Types of networks (LAN, MAN, WAN, PAN)\n✅ Network topologies (Star, Bus, Ring, Mesh)\n✅ Introduction to the OSI Model\n\n### Next Week:\nWe will dive deeper into the **OSI Model Layers** and understand how data flows through each layer.\n\n### Practice:\nTry identifying the network type and topology used in your home or office network.`,
  },
];

const DemoLesson = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <DashboardLayout title="Lesson View">
      <div className="space-y-4">
        {/* Demo Banner */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-center gap-3">
          <Badge className="bg-amber-500 text-white">DEMO</Badge>
          <span className="text-sm text-amber-700 dark:text-amber-300">This is a demo lesson view. Content is for demonstration purposes.</span>
        </div>

        <Link to="/student/lessons">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Lessons
          </Button>
        </Link>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold">Week 1: Introduction to Networking</h2>
                <p className="text-muted-foreground">Network 1 • Slide {currentSlide + 1} of {slides.length}</p>
              </div>
              <Badge variant="secondary">{currentSlide + 1} / {slides.length}</Badge>
            </div>

            <div className="bg-muted/30 rounded-xl p-8 min-h-[400px]">
              <h3 className="text-2xl font-bold mb-6">{slides[currentSlide].title}</h3>
              <div className="prose prose-sm max-w-none dark:prose-invert whitespace-pre-line text-foreground">
                {slides[currentSlide].content.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-4 mb-2">{line.replace('## ', '')}</h2>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-semibold mt-3 mb-1">{line.replace('### ', '')}</h3>;
                  if (line.startsWith('- **')) {
                    const parts = line.replace('- **', '').split('**');
                    return <p key={i} className="ml-4 mb-1">• <strong>{parts[0]}</strong>{parts[1]}</p>;
                  }
                  if (line.startsWith('✅')) return <p key={i} className="mb-1">{line}</p>;
                  if (line.startsWith('*')) return <p key={i} className="italic text-muted-foreground mt-2">{line.replace(/\*/g, '')}</p>;
                  if (line.match(/^\d\./)) {
                    const parts = line.split('**');
                    if (parts.length >= 3) return <p key={i} className="ml-4 mb-1">{parts[0]}<strong>{parts[1]}</strong>{parts[2]}</p>;
                    return <p key={i} className="ml-4 mb-1">{line}</p>;
                  }
                  if (line.trim() === '') return <br key={i} />;
                  return <p key={i} className="mb-1">{line}</p>;
                })}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
                disabled={currentSlide === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex gap-1">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`w-3 h-3 rounded-full transition-colors ${i === currentSlide ? 'bg-primary' : 'bg-muted-foreground/30'}`}
                  />
                ))}
              </div>
              <Button
                onClick={() => setCurrentSlide(Math.min(slides.length - 1, currentSlide + 1))}
                disabled={currentSlide === slides.length - 1}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default DemoLesson;
