"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import axios from "axios";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: "homeowner" | "worker";
}

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "homeowner" | "worker",
  ) => Promise<void>;
  updateProfile?: (user: AuthUser) => void;
  logout: () => void;
  isHomeowner: boolean;
  isWorker: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN_KEY = "srb_token";
const USER_KEY = "srb_user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // ignore parse errors
    } finally {
      setLoading(false);
    }
  }, []);

  const persist = (t: string, u: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, t);
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setToken(t);
    setUser(u);
  };

  const updateProfileLocal = (u: AuthUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await axios.post(`${API}/auth/login`, { email, password });
    persist(data.token, data.user);
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      role: "homeowner" | "worker",
    ) => {
      const { data } = await axios.post(`${API}/auth/register`, {
        name,
        email,
        password,
        role,
      });
      persist(data.token, data.user);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        updateProfile: updateProfileLocal,
        logout,
        isHomeowner: user?.role === "homeowner",
        isWorker: user?.role === "worker",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
