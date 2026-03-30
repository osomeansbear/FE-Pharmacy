"use client";

import { cn } from "@/lib/utils";
import {
  ChevronDown,
  HeartPulse,
  MapPinHouse,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ProfileMenu() {
  const pathname = usePathname();

  const menuItems = [
    { name: "My Orders", href: "/users/profile/orders", icon: ShoppingBag },
    {
      name: "My Addresses",
      href: "/users/profile/addresses",
      icon: MapPinHouse,
    },
    {
      name: "Health Profile",
      href: "/users/profile/health",
      icon: HeartPulse,
    },
  ];

  return (
    <div className="bg-secondary w-full border border-primary/20">
      <div className="grid grid-cols-3 divide-solid divide-x-2 divide-success">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={index} className="w-full">
              <div
                className={cn(
                  "flex w-full items-start justify-between hover:cursor-pointer p-2",
                  isActive
                    ? "bg-success text-secondary"
                    : "hover:bg-muted/5 hover:text-success",
                )}
              >
                <div className="flex gap-2 items-center">
                  <Icon size={20} />
                  <span className="text-sm">{item.name}</span>
                </div>
                <ChevronDown />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
