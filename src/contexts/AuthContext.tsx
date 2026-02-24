import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'teacher' | 'student' | 'guest' | null;

interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (id: string) => boolean;
  loginAsGuest: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users data based on the project report
const mockUsers: Record<string, User> = {
  'T001': { id: 'T001', name: 'Dr. Ahmed Al-Mahmoud', role: 'teacher' },
  'T002': { id: 'T002', name: 'Dr. Sarah Johnson', role: 'teacher' },
  'S001': { id: 'S001', name: 'Ali Abdulaziz', role: 'student' },
  'S002': { id: 'S002', name: 'Mohammed Al-Ahmed', role: 'student' },
  'S003': { id: 'S003', name: 'Fatima Al-Ali', role: 'student' },
};

// Guest user
const guestUser: User = {
  id: 'GUEST',
  name: 'Guest',
  role: 'guest'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const login = (id: string): boolean => {
    const foundUser = mockUsers[id.toUpperCase()];
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const loginAsGuest = () => {
    setUser(guestUser);
    localStorage.setItem('auth_user', JSON.stringify(guestUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      loginAsGuest,
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
