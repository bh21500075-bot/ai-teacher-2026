import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe, Clock, Building2 } from 'lucide-react';

export function ContactInfo() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground">
          Get in touch with the University of Technology Bahrain
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Main Contact Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              University of Technology Bahrain
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Address</p>
                  <p className="text-sm text-muted-foreground">
                    P.O. Box 18041, Building 829<br />
                    Road 1213, Salmabad 712<br />
                    Kingdom of Bahrain
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">+973 1700 5577</p>
                  <p className="text-sm text-muted-foreground">Fax: +973 1702 2233</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:info@utb.edu.bh" className="text-sm text-primary hover:underline">
                    info@utb.edu.bh
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium">Website</p>
                  <a href="https://www.utb.edu.bh" target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    www.utb.edu.bh
                  </a>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Office Hours */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="w-5 h-5" />
              Office Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday - Thursday</span>
                <span className="font-medium">8:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Friday - Saturday</span>
                <span className="font-medium">Closed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Departments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Key Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between">
                <span className="text-muted-foreground">Admissions Office</span>
                <span>Ext. 101</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Registration</span>
                <span>Ext. 102</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Student Affairs</span>
                <span>Ext. 103</span>
              </li>
              <li className="flex justify-between">
                <span className="text-muted-foreground">Finance Office</span>
                <span>Ext. 104</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* CTA */}
      <Card className="mt-6 bg-primary/5 border-primary/20">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">Ready to Join UTB?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start your application today and become part of our growing community.
          </p>
          <Button asChild>
            <a href="https://www.utb.edu.bh/admissions" target="_blank" rel="noopener noreferrer">
              Apply Now
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
