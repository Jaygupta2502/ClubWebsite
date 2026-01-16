import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../lib/axios';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'president' | 'venue_coordinator' | 'faculty' | 'hod' | 'dean' | 'director';
  club?: string;
  clubId?: string;
  clubName?: string;
  department?: string;
  profileImage?: string;
  token?: string; // <-- added
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('campusEventsUser');
    const savedToken = localStorage.getItem('token');

    if (savedUser) {
      const parsed = JSON.parse(savedUser);

      // If old data missing token → patch it
      if (savedToken && !parsed.token) {
        parsed.token = savedToken;
        localStorage.setItem('campusEventsUser', JSON.stringify(parsed));
      }

      setUser(parsed);
    }

    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });

      if (!data?.token || !data?.user) {
        throw new Error('Invalid response from server');
      }

      // Store token for axios interceptor
      localStorage.setItem('token', data.token);

      // Store user + token together (fix for dashboard)
      localStorage.setItem(
        'campusEventsUser',
        JSON.stringify({
          ...data.user,
          token: data.token,
        })
      );

      // Update context state
      setUser({
        ...data.user,
        token: data.token,
      });
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('campusEventsUser');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};
