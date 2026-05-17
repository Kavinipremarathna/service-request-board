"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import api from "@/lib/api";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  roles: ("homeowner" | "worker")[];
  activeRole: "homeowner" | "worker";
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
    roles: ("homeowner" | "worker")[],
  ) => Promise<void>;
  updateProfile?: (user: AuthUser) => void;
  logout: () => void;
  switchRole: (role: "homeowner" | "worker") => Promise<void>;
  hasBothRoles: boolean;
  isHomeowner: boolean;
  isWorker: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

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
    try {
      const { data } = await api.post("/auth/login", {
        email,
        password,
      });
      persist(data.token, data.user);
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line no-console
        console.error("Auth login failed", err);
      }
      throw err;
    }
  }, []);

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      roles: ("homeowner" | "worker")[],
    ) => {
      const { data } = await api.post("/auth/register", {
        name,
        email,
        password,
        roles,
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

  const switchRole = useCallback(async (role: "homeowner" | "worker") => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const { data } = await api.patch(
      "/auth/switch-role",
      { role },
      { headers: { Authorization: `Bearer ${storedToken}` } },
    );
    const updated = {
      ...JSON.parse(localStorage.getItem(USER_KEY) || "{}"),
      activeRole: role,
    };
    localStorage.setItem(USER_KEY, JSON.stringify(updated));
    setUser(data.user);
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
        switchRole,
        isHomeowner: user?.activeRole === "homeowner",
        isWorker: user?.activeRole === "worker",
        hasBothRoles: (user?.roles?.length ?? 0) > 1,
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
