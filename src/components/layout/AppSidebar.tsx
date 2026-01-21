import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import {
  GraduationCap,
  LayoutDashboard,
  Upload,
  FileText,
  ClipboardList,
  Users,
  Bell,
  BookOpen,
  MessageSquare,
  Award,
  Settings,
  LogOut,
  CheckCircle,
} from 'lucide-react';

const teacherMenuItems = [
  { title: 'Dashboard', url: '/teacher', icon: LayoutDashboard },
  { title: 'Upload Content', url: '/teacher/content', icon: Upload },
  { title: 'Weekly Lessons', url: '/teacher/lessons', icon: FileText },
  { title: 'Assignments', url: '/teacher/assignments', icon: ClipboardList },
  { title: 'Quizzes', url: '/teacher/quizzes', icon: CheckCircle },
  { title: 'Grade Approval', url: '/teacher/grading', icon: Award },
  { title: 'Students', url: '/teacher/students', icon: Users },
];

const studentMenuItems = [
  { title: 'Dashboard', url: '/student', icon: LayoutDashboard },
  { title: 'AI Tutor', url: '/student/chat', icon: MessageSquare },
  { title: 'Lessons', url: '/student/lessons', icon: BookOpen },
  { title: 'Assignments', url: '/student/assignments', icon: ClipboardList },
  { title: 'Quizzes', url: '/student/quizzes', icon: CheckCircle },
  { title: 'My Grades', url: '/student/grades', icon: Award },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = user?.role === 'teacher' ? teacherMenuItems : studentMenuItems;
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-sidebar-foreground">EduBot AI</h1>
            <p className="text-xs text-sidebar-foreground/70">
              {user?.role === 'teacher' ? 'Teacher Panel' : 'Student Panel'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/60 px-2 text-xs">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className="h-11"
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === '/teacher' || item.url === '/student'}
                      className="flex items-center gap-3 px-3"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground"
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {/* User info */}
        <div className="flex items-center gap-3 mb-3 p-2 rounded-lg bg-sidebar-accent/30">
          <div className="w-9 h-9 bg-sidebar-primary rounded-full flex items-center justify-center text-sm font-bold text-sidebar-primary-foreground">
            {user?.name?.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-sidebar-foreground/60">{user?.id}</p>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
