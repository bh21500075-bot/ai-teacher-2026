import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Clock, Upload, CheckCircle, AlertCircle } from 'lucide-react';

const StudentAssignments = () => {
  const assignments = [
    { 
      id: 1,
      title: 'Assignment 1: Programming Basics', 
      week: 1,
      dueDate: 'January 20, 2024',
      status: 'graded',
      grade: 95,
      submittedAt: 'January 19, 2024'
    },
    { 
      id: 2,
      title: 'Assignment 2: Variables and Types', 
      week: 2,
      dueDate: 'January 27, 2024',
      status: 'graded',
      grade: 88,
      submittedAt: 'January 26, 2024'
    },
    { 
      id: 3,
      title: 'Assignment 3: Conditional Statements', 
      week: 3,
      dueDate: 'February 3, 2024',
      status: 'pending',
      grade: null,
      submittedAt: null
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <Badge className="bg-success/20 text-success hover:bg-success/30">Graded</Badge>;
      case 'submitted':
        return <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Submitted</Badge>;
      case 'pending':
        return <Badge className="bg-warning/20 text-warning hover:bg-warning/30">Pending</Badge>;
      case 'late':
        return <Badge className="bg-destructive/20 text-destructive hover:bg-destructive/30">Late</Badge>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout title="Assignments">
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-primary">3</p>
              <p className="text-sm text-muted-foreground">Total Assignments</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-success">2</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4 text-center">
              <p className="text-3xl font-bold text-warning">1</p>
              <p className="text-sm text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <Card 
              key={assignment.id} 
              className={`border-0 shadow-sm ${
                assignment.status === 'pending' ? 'ring-2 ring-warning/30' : ''
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      assignment.status === 'graded' ? 'bg-success/10' :
                      assignment.status === 'pending' ? 'bg-warning/10' :
                      'bg-primary/10'
                    }`}>
                      {assignment.status === 'graded' ? (
                        <CheckCircle className="w-6 h-6 text-success" />
                      ) : assignment.status === 'pending' ? (
                        <AlertCircle className="w-6 h-6 text-warning" />
                      ) : (
                        <ClipboardList className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{assignment.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Week {assignment.week}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {assignment.dueDate}
                        </span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(assignment.status)}
                </div>

                {assignment.status === 'graded' && (
                  <div className="bg-success/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Grade</p>
                        <p className="text-3xl font-bold text-success">{assignment.grade}%</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Submitted</p>
                        <p className="font-medium">{assignment.submittedAt}</p>
                      </div>
                    </div>
                  </div>
                )}

                {assignment.status === 'pending' && (
                  <div className="bg-warning/10 rounded-xl p-4 mb-4">
                    <div className="flex items-center gap-2 text-warning">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Not submitted yet - Due: {assignment.dueDate}</span>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  {assignment.status === 'pending' ? (
                    <Button className="flex-1">
                      <Upload className="w-4 h-4 mr-1" />
                      Submit Assignment
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentAssignments;
