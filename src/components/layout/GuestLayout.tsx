import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogIn, MessageCircle } from 'lucide-react';
import logo from '@/assets/logo.png';
import { useAuth } from '@/contexts/AuthContext';

export type GuestTab = 'chat' | 'colleges' | 'programs' | 'contact';

interface GuestLayoutProps {
  children: ReactNode;
  activeTab: GuestTab;
  onTabChange: (tab: GuestTab) => void;
}

export function GuestLayout({ children, activeTab, onTabChange }: GuestLayoutProps) {
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
        <Button 
          variant={activeTab === 'colleges' ? 'default' : 'ghost'} 
          onClick={() => onTabChange('colleges')}
        >
          Colleges
        </Button>
        <Button 
          variant={activeTab === 'programs' ? 'default' : 'ghost'} 
          onClick={() => onTabChange('programs')}
        >
          Programs
        </Button>
        <Button 
          variant={activeTab === 'contact' ? 'default' : 'ghost'} 
          onClick={() => onTabChange('contact')}
        >
          Contact Us
        </Button>
        <Button 
          variant={activeTab === 'chat' ? 'default' : 'ghost'} 
          onClick={() => onTabChange('chat')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Chat
        </Button>
      </nav>

      {/* Content */}
      <main className="flex-1 p-4">
        {children}
      </main>
    </div>
  );
}
