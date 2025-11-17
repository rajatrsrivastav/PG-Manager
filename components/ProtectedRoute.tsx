"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRole: "ADMIN" | "STUDENT";
}

export function ProtectedRoute({ children, allowedRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/signin");
        return;
      }

      if (user.role !== allowedRole) {
        if (user.role === "STUDENT") {
          router.push("/dashboard");
        } else if (user.role === "ADMIN") {
          router.push("/admin/dashboard");
        }
      }
    }
  }, [user, loading, allowedRole, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user || user.role !== allowedRole) {
    return null;
  }

  return <>{children}</>;
}
