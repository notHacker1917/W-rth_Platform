import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';
import { MOCK_USERS } from '../data/mockData';

interface AuthContextValue {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (userId: string) => void;
  logout: () => void;
  switchAccount: (userId: string) => void;
  availableAccounts: User[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Default to the first student account for easy dev testing
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]);

  const login = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId) ?? null;
    setCurrentUser(user);
  };

  const logout = () => setCurrentUser(null);

  const switchAccount = (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId) ?? null;
    setCurrentUser(user);
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
