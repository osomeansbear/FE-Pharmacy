"use client";

import { cn } from "@/lib/utils";
import { House, MessageSquare, PillBottle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrderListType } from "../../../../../types/orderTypes";
import OrderCard from "./OrderCard";

const Order: OrderListType[] = [
  {
    id: 1,
    status: "Success",
    items: [
      {
        id: 1,
        productName: "Face mask",
        quantity: 1,
        unitPrice: 40000,
      },
      {
        id: 2,
        productName: "Pill",
        quantity: 2,
        unitPrice: 5000,
      },
    ],
    totalAmount: 60000,
    createdAt: "25/07/2025",
  },
  {
    id: 3,
    status: "Shipping",
    items: [
      {
        id: 1,
        productName: "Face mask",
        quantity: 1,
        unitPrice: 40000,
      },
    ],
    totalAmount: 60000,
    createdAt: "25/07/2025",
  },
  {
    id: 2,
    status: "Shipping",
    items: [
      {
        id: 1,
        productName: "Face mask",
        quantity: 1,
        unitPrice: 40000,
      },
    ],
    totalAmount: 60000,
    createdAt: "25/07/2025",
  },
];

export default function OrderTable() {
  const navLinks = [
    { name: "All", href: "/users/profile/orders", icon: House },
    { name: "Processing", href: "/users/profile/4", icon: House },
    { name: "Shipping", href: "/users/profile/1", icon: PillBottle },
    { name: "Sucess", href: "/users/profile/2", icon: MessageSquare },
    { name: "Failed", href: "/users/profile/3", icon: MessageSquare },
  ];
  const pathname = usePathname();
  return (
    <div className="flex flex-col">
      <nav className=" p-4 bg-secondary border border-primary/20  rounded-b-2xl">
        {/* Navigation Links */}
        <div className="flex items-center gap-16 justify-between w-full">
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
      </nav>
      <div className="p-2 flex flex-col gap-2 ">
        {Order.map((order) => {
          return <OrderCard key={order.id} order={order}></OrderCard>;
        })}
      </div>
    </div>
  );
}
