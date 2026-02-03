import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, AlertCircle, Bot, ArrowRight } from 'lucide-react';
import logo from '@/assets/logo.png';

const Login = () => {
  const [userId, setUserId] = useState('');
  const [error, setError] = useState('');
  const { login, loginAsGuest, user } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!userId.trim()) {
      setError('Please enter your User ID');
      return;
    }

    login(userId);
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    navigate('/guest');
  };

  // Redirect after successful login
  if (user) {
    if (user.role === 'teacher') {
      navigate('/teacher');
    } else if (user.role === 'student') {
      navigate('/student/chat');
    } else if (user.role === 'guest') {
      navigate('/guest');
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/30 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        {/* Header with logo */}
        <div className="text-center mb-8">
          <img src={logo} alt="University of Technology Bahrain" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-xl font-bold text-primary leading-tight">
            AI-Powered Educational Robot for the Next Generation of Smart Learning with IoT and Cloud Intelligence
          </h1>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Guest Mode Card */}
          <Card 
            className="shadow-xl border-2 border-transparent hover:border-primary/50 transition-all cursor-pointer group"
            onClick={handleGuestLogin}
          >
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <Bot className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-lg">Guest Mode</CardTitle>
              <CardDescription>
                Explore university information without logging in
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <img src={logo} alt="UTB" className="h-10 w-auto opacity-60" />
              </div>
              <p className="text-sm text-muted-foreground">
                Ask about colleges, programs, admissions, and campus facilities
              </p>
              <Button className="w-full group-hover:bg-primary/90" variant="default">
                <span>Learn More</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Teacher/Student Login Card */}
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-2">
              <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-foreground" />
              </div>
              <CardTitle className="text-lg">Teacher / Student</CardTitle>
              <CardDescription>
                Sign in with your User ID to access courses
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    User ID
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="T001 or S001"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="pl-10 h-12 text-lg"
                      dir="ltr"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full h-12 text-lg font-semibold">
                  Sign In
                </Button>
              </form>

              {/* Demo accounts hint */}
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-muted-foreground text-center">
                  Demo accounts for testing:
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-background rounded-md p-2 text-center">
                    <span className="font-mono font-bold text-primary">T001</span>
                    <span className="text-muted-foreground block">Teacher</span>
                  </div>
                  <div className="bg-background rounded-md p-2 text-center">
                    <span className="font-mono font-bold text-primary">S001</span>
                    <span className="text-muted-foreground block">Student</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
