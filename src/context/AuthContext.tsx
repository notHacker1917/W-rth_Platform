import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { MOCK_USERS } from '../data/mockData';
import { loginUser } from '../services/api';

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (userIdOrEmail: string, password?: string) => Promise<void>;
  logout: () => void;
  switchAccount: (userId: string) => void;
  availableAccounts: User[];
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage if available, otherwise default to first user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('currentUserId');
      if (savedUserId) {
        const user = MOCK_USERS.find(u => u.id === savedUserId);
        if (user) return user;
      }
    }
    return MOCK_USERS[0];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (userIdOrEmail: string, password?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // If password is provided, use backend login
      if (password) {
        const response = await loginUser({
          email: userIdOrEmail,
          password,
        });

        // Find user by email or role, fallback to mock user for demo
        let user = MOCK_USERS.find(u => u.email === userIdOrEmail);
        if (!user) {
          // Create a user object from response for demo purposes
          user = {
            id: `user_${Date.now()}`,
            name: userIdOrEmail.split('@')[0],
            email: userIdOrEmail,
            role: response.role as 'student' | 'faculty' | 'admin' | 'wurth_employee',
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userIdOrEmail}`,
            bio: 'Backend authenticated user',
            achievements: 0,
            reputation: 0,
            joinDate: new Date(),
          };
        }

        setCurrentUser(user);
        localStorage.setItem('currentUserId', user.id);
        localStorage.setItem('userEmail', userIdOrEmail);
      } else {
        // Fallback to mock user for demo
        const user = MOCK_USERS.find(u => u.id === userIdOrEmail) ?? null;
        setCurrentUser(user);
        if (user) {
          localStorage.setItem('currentUserId', user.id);
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('userEmail');
    setError(null);
  };

  const switchAccount = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId) ?? null;
    setCurrentUser(user);
    if (user) {
      localStorage.setItem('currentUserId', user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: currentUser !== null,
        login,
        logout,
        switchAccount,
        availableAccounts: MOCK_USERS,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
