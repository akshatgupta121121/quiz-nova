import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { StorageService } from '../services/storageService';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsDemoStudent: () => void;
  loginAsDemoAdmin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_KEY = 'quiznova_session_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [user, setUser] = useState<User | null>(() => {
    StorageService.initialize();
    const saved = localStorage.getItem(CURRENT_USER_KEY);
    if (!saved) return null;
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const existing = StorageService.getUserByEmail(email.trim());
    if (!existing) {
      return { success: false, error: 'No user found with this email address.' };
    }

    if (existing.password && existing.password !== password) {
      return { success: false, error: 'Incorrect password entered.' };
    }

    setUser(existing);
    showToast(`Welcome back, ${existing.name}!`, 'success');
    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'student'
  ): Promise<{ success: boolean; error?: string }> => {
    const res = StorageService.createUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      role,
    });

    if (!res.success || !res.user) {
      return { success: false, error: res.error || 'Failed to create user account' };
    }

    setUser(res.user);
    showToast(`Account created successfully! Welcome, ${res.user.name}.`, 'success');
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    showToast('You have been signed out.', 'info');
  };

  const loginAsDemoStudent = () => {
    const student = StorageService.getUserByEmail('alex@example.com') || StorageService.getUsers().find(u => u.role === 'student');
    if (student) {
      setUser(student);
      showToast(`Logged in as Student: ${student.name}`, 'success');
    }
  };

  const loginAsDemoAdmin = () => {
    const admin = StorageService.getUserByEmail('admin@quiznova.com') || StorageService.getUsers().find(u => u.role === 'admin');
    if (admin) {
      setUser(admin);
      showToast('Logged in as Instructor / Admin', 'success');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        logout,
        loginAsDemoStudent,
        loginAsDemoAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
