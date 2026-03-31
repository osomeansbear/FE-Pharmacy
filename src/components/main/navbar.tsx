"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  House,
  MessageSquare,
  Pill,
  PillBottle,
  ShoppingCart,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "../../../stores/authStore";

export default function Navbar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isLoggedIn = useAuthStore((s) => s.isAuthenticated);
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  const isAdmin = hasHydrated && user?.role === "ADMIN";

  // Hide navbar for admins
  if (isAdmin) {
    return null;
  }

  const navLinks = [
    { name: "Home", href: "/shop", icon: House },
    { name: "Products", href: "/products", icon: PillBottle },
    { name: "AI Assistant", href: "/ai-assistant", icon: MessageSquare },
  ];

  return (
    <nav className="w-full bg-white text-success flex justify-between items-center px-6 md:px-20 lg:px-32 py-4 border-b border-gray-500 sticky top-0 z-50">
      {/* Brand Logo */}
      <div className="flex-shrink-0">
        <Link
          href="/shop"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Pill className="size-7 fill-success/10" />
          <span className="text-2xl font-bold tracking-tight">PharmaCore</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-16">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "relative flex items-center gap-2 text-md font-medium transition-colors hover:text-success/70",
                isActive ? "text-success" : "text-slate-600",
              )}
            >
              <Icon className={cn("size-4", isActive && "stroke-[2.5px]")} />
              {link.name}
              {isActive && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-success rounded-full" />
              )}
            </Link>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <Link href="/users/cart">
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-success/5 text-success"
          >
            <ShoppingCart className="size-5" />
            <span className="absolute top-1 right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <div>
              <Link href="/users/profile">
                {hasHydrated && user ? user.fullName : "Account"}
              </Link>
            </div>
          ) : (
            <Link href="/register">
              <Button className="bg-success hover:bg-success/90 rounded-full text-white text-md gap-2">
                <UserPlus className="size-4" /> Register
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
