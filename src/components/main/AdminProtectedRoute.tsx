"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../stores/authStore";

export function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Not logged in -> redirect to login
    if (!token) {
      router.replace("/login");
      return;
    }

    // PATIENT users cannot access admin pages
    if (user && user.role === "PATIENT") {
      router.replace("/shop");
      return;
    }
  }, [isHydrated, token, user, router, pathname]);

  if (!isHydrated || !token) {
    return null;
  }

  // Block PATIENT users from seeing admin content
  if (user && user.role === "PATIENT") {
    return null;
  }

  return <>{children}</>;
}
