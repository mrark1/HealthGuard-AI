
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Language, ActivityLog } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, rememberMe: boolean) => Promise<{ success: boolean; requires2FA?: boolean; error?: string }>;
  verify2FA: (email: string, code: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  verifyAccount: (email: string) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: any) => void;
  toggle2FA: (enabled: boolean) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('hg_user') || sessionStorage.getItem('hg_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const addActivity = (targetUser: User, action: string) => {
    const newLog: ActivityLog = {
      id: Math.random().toString(36).substr(2, 9),
      action,
      timestamp: new Date().toISOString(),
    };
    const updatedUser = {
      ...targetUser,
      activityLog: [newLog, ...(targetUser.activityLog || [])].slice(0, 20),
    };
    return updatedUser;
  };

  const syncUserStorage = (updatedUser: User) => {
    setUser(updatedUser);
    const isPersistent = !!localStorage.getItem('hg_user');
    if (isPersistent) {
      localStorage.setItem('hg_user', JSON.stringify(updatedUser));
    } else {
      sessionStorage.setItem('hg_user', JSON.stringify(updatedUser));
    }

    const users = JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
    const idx = users.findIndex((u: any) => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updatedUser };
      localStorage.setItem('hg_registered_users', JSON.stringify(users));
    }
  };

  const login = async (email: string, password: string, rememberMe: boolean): Promise<{ success: boolean; requires2FA?: boolean; error?: string }> => {
    const users = JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    
    if (found) {
      if (!found.isVerified) {
        return { success: false, error: 'Please verify your email address first.' };
      }
      if (found.twoFactorEnabled) {
        return { success: true, requires2FA: true };
      }

      let userSession: User = { ...found };
      userSession = addActivity(userSession, 'Logged in');
      
      setUser(userSession);
      const storage = rememberMe ? localStorage : sessionStorage;
      storage.setItem('hg_user', JSON.stringify(userSession));
      
      // Update global users list with new log
      const idx = users.findIndex((u: any) => u.id === found.id);
      users[idx] = userSession;
      localStorage.setItem('hg_registered_users', JSON.stringify(users));

      return { success: true };
    }
    return { success: false, error: 'Invalid email or password' };
  };

  const verify2FA = async (email: string, code: string): Promise<boolean> => {
    // Mock code check
    if (code === '123456') {
      const users = JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
      const found = users.find((u: any) => u.email === email);
      if (found) {
        let userSession: User = { ...found };
        userSession = addActivity(userSession, 'Logged in (2FA verified)');
        setUser(userSession);
        localStorage.setItem('hg_user', JSON.stringify(userSession));
        return true;
      }
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
    if (users.find((u: any) => u.email === email)) return false;

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      password,
      language: Language.ENGLISH,
      joinedAt: new Date().toISOString(),
      isVerified: false,
      twoFactorEnabled: false,
      activityLog: [],
      profile: {
        age: 25,
        gender: 'Other',
        bloodGroup: 'Unknown',
        weight: 60,
        height: 170,
        chronicConditions: []
      }
    };

    const userWithLog = addActivity(newUser as any, 'Account created');
    users.push(userWithLog);
    localStorage.setItem('hg_registered_users', JSON.stringify(users));
    return true;
  };

  const verifyAccount = async (email: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
    const idx = users.findIndex((u: any) => u.email === email);
    if (idx !== -1) {
      users[idx].isVerified = true;
      users[idx] = addActivity(users[idx], 'Email verified');
      localStorage.setItem('hg_registered_users', JSON.stringify(users));
      return true;
    }
    return false;
  };

  const resetPassword = async (email: string, newPassword: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
    const idx = users.findIndex((u: any) => u.email === email);
    if (idx !== -1) {
      users[idx].password = newPassword;
      users[idx] = addActivity(users[idx], 'Password reset');
      localStorage.setItem('hg_registered_users', JSON.stringify(users));
      return true;
    }
    return false;
  };

  const logout = () => {
    if (user) {
      const users = JSON.parse(localStorage.getItem('hg_registered_users') || '[]');
      const idx = users.findIndex((u: any) => u.id === user.id);
      if (idx !== -1) {
        users[idx] = addActivity(users[idx], 'Logged out');
        localStorage.setItem('hg_registered_users', JSON.stringify(users));
      }
    }
    setUser(null);
    localStorage.removeItem('hg_user');
    sessionStorage.removeItem('hg_user');
  };

  const updateProfile = (profile: any) => {
    if (!user) return;
    const updated = addActivity({ ...user, profile }, 'Profile updated');
    syncUserStorage(updated);
  };

  const toggle2FA = (enabled: boolean) => {
    if (!user) return;
    const action = enabled ? 'Enabled 2FA' : 'Disabled 2FA';
    const updated = addActivity({ ...user, twoFactorEnabled: enabled }, action);
    syncUserStorage(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, verify2FA, signup, verifyAccount, resetPassword, logout, updateProfile, toggle2FA, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
