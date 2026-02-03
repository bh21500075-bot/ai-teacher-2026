import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { GraduationCap, Award } from 'lucide-react';

const bachelorPrograms = [
  { name: 'Computer Science', abbr: 'BSCS', college: 'Computer Studies', credits: 132, duration: '4 years', accreditation: 'ABET' },
  { name: 'Information Technology', abbr: 'BSIT', college: 'Computer Studies', credits: 132, duration: '4 years', accreditation: 'ABET' },
  { name: 'Industrial Engineering', abbr: 'BSIE', college: 'Engineering', credits: 135, duration: '4 years', accreditation: 'ABET' },
  { name: 'Mechanical Engineering', abbr: 'BSME', college: 'Engineering', credits: 135, duration: '4 years', accreditation: 'ABET' },
  { name: 'Energy Engineering', abbr: 'BSEnE', college: 'Engineering', credits: 135, duration: '4 years', accreditation: 'ABET' },
  { name: 'Business Informatics', abbr: 'BSBI', college: 'Business', credits: 126, duration: '4 years', accreditation: 'ECBE' },
  { name: 'International Business', abbr: 'BSIB', college: 'Business', credits: 126, duration: '4 years', accreditation: 'ECBE' },
  { name: 'Accounting & Finance', abbr: 'BSAF', college: 'Business', credits: 126, duration: '4 years', accreditation: 'ECBE' },
];

const masterPrograms = [
  { name: 'Master of Business Administration', abbr: 'MBA', college: 'Business', credits: 36, duration: '2 years', accreditation: 'ECBE' },
];

export function ProgramsInfo() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Academic Programs</h1>
        <p className="text-muted-foreground">
          Internationally accredited programs designed for tomorrow's leaders
        </p>
      </div>

      {/* Bachelor Programs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Bachelor's Degree Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Abbreviation</TableHead>
                <TableHead className="hidden md:table-cell">Credits</TableHead>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
                <TableHead>Accreditation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bachelorPrograms.map((program) => (
                <TableRow key={program.abbr}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{program.abbr}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{program.credits}</TableCell>
                  <TableCell className="hidden md:table-cell">{program.duration}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      <Award className="w-3 h-3" />
                      {program.accreditation}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Master Programs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Graduate Programs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Abbreviation</TableHead>
                <TableHead className="hidden md:table-cell">Credits</TableHead>
                <TableHead className="hidden md:table-cell">Duration</TableHead>
                <TableHead>Accreditation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {masterPrograms.map((program) => (
                <TableRow key={program.abbr}>
                  <TableCell className="font-medium">{program.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{program.abbr}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{program.credits}</TableCell>
                  <TableCell className="hidden md:table-cell">{program.duration}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      <Award className="w-3 h-3" />
                      {program.accreditation}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Admission Info */}
      <Card className="mt-6 bg-muted/30">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-2">Admission Requirements</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Minimum 60% in Secondary School Certificate (Thanawya)</li>
            <li>• English proficiency: IELTS 5.0+ or TOEFL 450+ (or equivalent)</li>
            <li>• Mathematics: 70% for Engineering, 60% for Business programs</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
