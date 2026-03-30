"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  FolderTree,
  LayoutDashboard,
  Menu,
  Pill,
  ShoppingBag,
  Tag,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "../../../stores/authStore";
import LogoutButton from "./LogoutButton";

export default function Header() {
  const pathname = usePathname();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Pill },
    { name: "Brands", href: "/admin/brands", icon: Tag },
    { name: "Categories", href: "/admin/categories", icon: FolderTree },
    { name: "Users", href: "/admin/users", icon: UserCircle },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="w-full flex bg-white justify-between items-center px-4 py-2 border-b-1 border-black">
      <div>
        <Sheet>
          <SheetTrigger asChild>
            <Menu className="text-black hover:cursor-pointer hover:text-green-600 transition-all duration-200" />
          </SheetTrigger>
          <SheetContent
            side="left"
            className="bg-white w-[300px] flex flex-col justify-between"
          >
            <div className="flex flex-col">
              <SheetHeader className="border-b-1 border-black">
                <SheetTitle className="px-4 flex items-center gap-2 text-success">
                  <Pill className="size-6" />
                  <p className="text-xl">PharmaCore</p>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-4 mt-4 gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 p-4 transition-all duration-200 hover:bg-gray-200 hover:rounded-xl active:bg-success group",
                        isActive
                          ? "bg-success text-white rounded-xl hover:bg-success"
                          : "text-black ",
                      )}
                    >
                      <Icon
                        size={20}
                        className={cn(
                          "transition-colors",
                          isActive
                            ? "text-white"
                            : "text-black group-hover:text-slate-900",
                        )}
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="border-t-1 border-black h-16">
              <LogoutButton onLogout={handleLogout} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4 border-l border-black w-48 justify-end">
        <div className="min-w-0 flex-1 text-right ml-4">
          <p className="font-bold text-sm text-black line-clamp-1">
            {user?.fullName ?? "Admin"}
          </p>
          <p className="text-xs text-black truncate">{user?.role ?? ""}</p>
        </div>

        <div className="h-10 w-10 shrink-0 rounded-full bg-success flex items-center justify-center text-white font-bold">
          {initials}
        </div>
      </div>
    </div>
  );
}
