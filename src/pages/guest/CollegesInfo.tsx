import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Cpu, Briefcase, Cog } from 'lucide-react';

const colleges = [
  {
    name: 'College of Computer Studies',
    icon: Cpu,
    description: 'Preparing students for careers in computing, information technology, and software development through hands-on learning and industry-aligned curriculum.',
    programs: ['BSCS - Computer Science', 'BSIT - Information Technology'],
    accreditation: 'ABET Accredited',
    color: 'bg-blue-500'
  },
  {
    name: 'College of Engineering & Technology',
    icon: Cog,
    description: 'Developing future engineers with strong theoretical foundations and practical skills in industrial, mechanical, and energy engineering.',
    programs: ['BSIE - Industrial Engineering', 'BSME - Mechanical Engineering', 'BSEnE - Energy Engineering'],
    accreditation: 'ABET Accredited',
    color: 'bg-orange-500'
  },
  {
    name: 'College of Administrative & Financial Sciences',
    icon: Briefcase,
    description: 'Equipping students with business acumen, leadership skills, and financial expertise for success in the global marketplace.',
    programs: ['BSBI - Business Informatics', 'BSIB - International Business', 'BSAF - Accounting & Finance', 'MBA - Master of Business Administration'],
    accreditation: 'ECBE Accredited',
    color: 'bg-green-500'
  }
];

export function CollegesInfo() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Our Colleges</h1>
        <p className="text-muted-foreground">
          UTB offers internationally accredited programs through three distinguished colleges
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colleges.map((college) => {
          const Icon = college.icon;
          return (
            <Card key={college.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 ${college.color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-lg">{college.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {college.accreditation}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {college.description}
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Programs Offered:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {college.programs.map((program) => (
                      <li key={program} className="flex items-center gap-2">
                        <GraduationCap className="w-3 h-3" />
                        {program}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
