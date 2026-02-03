import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, MessageCircle, QrCode, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import logo from '@/assets/logo.png';
import { useAuth } from '@/contexts/AuthContext';

export type GuestTab = 'chat' | 'colleges' | 'programs' | 'contact';

const APP_URL = 'https://ai-teacher-2026.lovable.app';

interface GuestLayoutProps {
  children: ReactNode;
  activeTab: GuestTab;
  onTabChange: (tab: GuestTab) => void;
}

export function GuestLayout({ children, activeTab, onTabChange }: GuestLayoutProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showQR, setShowQR] = useState(false);

  const goToHome = () => {
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
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setShowQR(!showQR)} title="Show QR Code">
            <QrCode className="w-5 h-5" />
          </Button>
          <Button variant="outline" onClick={goToHome}>
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
        </div>
      </header>

      {/* QR Code Popup */}
      {showQR && (
        <div className="absolute top-20 right-6 z-50 bg-card rounded-xl shadow-xl border p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Mobile Access</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowQR(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="bg-white p-3 rounded-lg">
            <QRCodeSVG value={APP_URL} size={100} />
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Scan to access on mobile
          </p>
        </div>
      )}

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
