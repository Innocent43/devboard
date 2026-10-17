"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { API_URL } from "./api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "employer" | "job_seeker" | "admin";
}

const dashboardPaths: Record<AuthUser["role"], string> = {
  employer: "/dashboard/company",
  job_seeker: "/dashboard/seeker",
  admin: "/dashboard/admin",
};

export function dashboardPathFor(role: AuthUser["role"]): string {
  return dashboardPaths[role];
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<AuthUser | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async (): Promise<AuthUser | null> => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        localStorage.removeItem("access_token");
        setUser(null);
        return null;
      }

      const data: AuthUser = await response.json();
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
