"use client";

import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import { useState } from "react";
import { OrderListType } from "../../../../../types/orderTypes";
import OrderCard from "./OrderCard";

interface OrderTableProps {
  orders: OrderListType[];
  onCancel: (orderId: number) => void;
  onPay: (orderId: number) => void;
  busyOrderId: number | null;
}

export default function OrderTable({
  orders,
  onCancel,
  onPay,
  busyOrderId,
}: OrderTableProps) {
  const [activeStatus, setActiveStatus] = useState("ALL");

  const navLinks = [
    { name: "All", value: "ALL" },
    { name: "Pending", value: "PENDING" },
    { name: "Confirmed", value: "CONFIRMED" },
    { name: "Delivered", value: "DELIVERED" },
    { name: "Cancelled", value: "CANCELLED" },
  ];

  const filteredOrders =
    activeStatus === "ALL"
      ? orders
      : orders.filter((order) => order.status === activeStatus);

  return (
    <div className="flex flex-col">
      <nav className="p-4 bg-secondary border border-primary/20 rounded-b-2xl">
        <div className="flex items-center gap-16 justify-between w-full">
          {navLinks.map((link) => {
            const isActive = activeStatus === link.value;
            return (
              <button
                key={link.value}
                onClick={() => setActiveStatus(link.value)}
                className={cn(
                  "relative flex items-center gap-2 text-md font-medium transition-colors hover:text-success/70",
                  isActive ? "text-success" : "text-slate-600",
                )}
              >
                <Package className={cn("size-4", isActive && "stroke-[2.5px]")} />
                {link.name}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-success rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      <div className="p-2 flex flex-col gap-2">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            onCancel={onCancel}
            onPay={onPay}
            busy={busyOrderId === order.id}
          />
        ))}

        {!filteredOrders.length && (
          <div className="rounded-lg border border-dashed border-slate-300 p-6 text-sm text-slate-500">
            No orders found for this status.
          </div>
        )}
      </div>
    </div>
  );
}
