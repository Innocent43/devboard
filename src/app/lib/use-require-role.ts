"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, useAuth } from "./auth-context";
import { dashboardPathFor } from "./auth-context";

export function useRequireRole(role: AuthUser["role"]): { ready: boolean } {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
    } else if (user.role !== role) {
      router.replace(dashboardPathFor(user.role));
    }
  }, [user, loading, role, router]);
  return { ready: !loading && user?.role === role };
}
