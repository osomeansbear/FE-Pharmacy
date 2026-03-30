"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../../stores/authStore";

interface LogoutButtonProps {
  onLogout?: () => void;
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
      router.push("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="hover:cursor-pointer flex text-red-500 items-center gap-2 w-full h-full px-8"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
}
