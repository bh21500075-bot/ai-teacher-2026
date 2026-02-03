import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAuth } from '@/contexts/AuthContext';

interface GuestLayoutProps {
  children: ReactNode;
}

export function GuestLayout({ children }: GuestLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const goToLogin = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center gap-4">
          <img src={logo} alt="UTB" className="h-10" />
          <span className="text-lg font-semibold text-foreground hidden md:block">
            University of Technology Bahrain
          </span>
        </div>
        <Button variant="outline" onClick={goToLogin}>
          <LogIn className="w-4 h-4 mr-2" />
          Log In
        </Button>
      </header>

      {/* Navigation Tabs */}
      <nav className="flex justify-center gap-2 p-4 border-b bg-muted/30">
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          Colleges
        </Button>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          Programs
        </Button>
        <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
          Contact Us
        </Button>
      </nav>

      {/* Content */}
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
