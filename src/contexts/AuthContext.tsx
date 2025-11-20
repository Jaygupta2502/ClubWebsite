import { createContext, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'president' | 'venue_coordinator' | 'faculty' | 'hod' | 'dean' | 'director';
  club?: string;
  clubId?: string;
  clubName?: string;
  profileImage?: string;
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

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('campusEventsUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(
  `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  }
);


      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      const fullUser = { ...data.user, token: data.token };

localStorage.setItem("campusEventsUser", JSON.stringify(fullUser)); // ✅ reuse already-declared fullUser
setUser(fullUser);
    } catch (err) {
      throw err;
    }
  };
  

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("campusEventsUser");
    setUser(null);
  };

useEffect(() => {
  const savedUser = localStorage.getItem("campusEventsUser");

  if (import.meta.env.DEV) {
    const cleared = localStorage.getItem("devAutoLogoutDone");
    if (!cleared) {
      localStorage.removeItem("token");
      localStorage.removeItem("campusEventsUser");
      localStorage.setItem("devAutoLogoutDone", "true");
      setUser(null);
      setLoading(false);
      return;
    }
  }

  if (savedUser) {
    setUser(JSON.parse(savedUser));
  }
  setLoading(false);
}, []);




  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
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