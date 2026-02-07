"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <button className="hover:cursor-pointer flex text-red-500 items-center gap-2 w-full h-full px-8">
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  );
}
