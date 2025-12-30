"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Pill,
  UserCircle,
  Menu,
  LogOut,
  ShoppingBag,
} from "lucide-react"; // Import icons
import { cn } from "@/lib/utils";
import LogoutButton from "./logout_button";

export default function Header() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Pill },
    { name: "Users", href: "/admin/users", icon: UserCircle },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];
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
                <SheetTitle className="px-4">PharmaCore</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col px-4 mt-4 gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon; // Capitalize to use as a component

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 p-4 transition-all duration-200 hover:bg-gray-200 hover:rounded-xl active:bg-success group",
                        isActive
                          ? "bg-success text-white rounded-xl hover:bg-success"
                          : "text-black "
                      )}
                    >
                      <Icon
                        size={20}
                        className={cn(
                          "transition-colors",
                          isActive
                            ? "text-white"
                            : "text-black group-hover:text-slate-900"
                        )}
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="border-t-1 border-black h-16">
              <LogoutButton />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex items-center gap-4 border-l border-black w-48 justify-end">
        {/* The container below NEEDS min-w-0 for clamping to work */}
        <div className="min-w-0 flex-1 text-right ml-4">
          <p className="font-bold text-sm text-black line-clamp-1">
            Nassssssssssssssme Nassssssssssssssme
          </p>
          <p className="text-xs text-black truncate">role</p>
        </div>

        <div className="h-10 w-10 shrink-0 rounded-full bg-success flex items-center justify-center text-white font-bold">
          SC
        </div>
      </div>
    </div>
  );
}
