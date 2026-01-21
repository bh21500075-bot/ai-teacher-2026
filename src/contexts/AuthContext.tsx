import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'teacher' | 'student' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (id: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data based on the project report
const mockUsers: Record<string, User> = {
  'T001': { id: 'T001', name: 'د. أحمد المحمود', role: 'teacher' },
  'T002': { id: 'T002', name: 'Dr. Sarah Johnson', role: 'teacher' },
  'S001': { id: 'S001', name: 'علي عبدالعزيز', role: 'student' },
  'S002': { id: 'S002', name: 'محمد الأحمد', role: 'student' },
  'S003': { id: 'S003', name: 'فاطمة العلي', role: 'student' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (id: string) => {
    const foundUser = mockUsers[id.toUpperCase()];
    if (foundUser) {
      setUser(foundUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
