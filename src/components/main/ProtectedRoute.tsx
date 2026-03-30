"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../../stores/authStore";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user } = useAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    // Chỉ chạy logic khi đã hydrate xong
    if (!isHydrated) return;

    // 1. Nếu chưa đăng nhập (không có token)
    if (!token) {
      router.replace("/login"); // Redirect về trang login (hoặc trang public của bạn)
      return;
    }

    // 2. Logic phân quyền dựa trên Role
    if (user) {
      // PATIENT users should stay in patient/public flows.
      if (user.role === "PATIENT" && !pathname.startsWith("/users")) {
        router.replace("/shop");
      }
      // Trường hợp: User là ADMIN nhưng đang cố vào trang không phải /admin
      else if (user.role === "ADMIN" && !pathname.startsWith("/admin")) {
        router.replace("/admin");
      }
    }
  }, [isHydrated, token, user, router, pathname]);

  // Trong lúc đang hydrate hoặc chưa có token, không render gì cả (hoặc hiện Loading Spinner)
  if (!isHydrated || !token) {
    return null;
  }

  return <>{children}</>;
}
