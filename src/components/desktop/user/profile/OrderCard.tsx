"use client";

import { Button } from "@/components/ui/button";
import { formatVND, toTitleCase } from "@/lib/utils";
import { useState } from "react";
import { addCartItem } from "../../../../../api/cart.api";
import {
  getDisplayStatus,
  getStatusStyle,
} from "../../../../../types/orderConstants";
import { OrderListType } from "../../../../../types/orderTypes";
import { UnitType } from "../../../../../types/orderTypes";
import { useCartStore } from "../../../../../stores/cartStore";

interface OrderCardProps {
  order: OrderListType;
  onCancel: (orderId: number) => void;
  onPay: (orderId: number) => void;
  busy?: boolean;
}

export default function OrderCard({
  order,
  onCancel,
  onPay,
  busy = false,
}: OrderCardProps) {
  const formatDate = new Date(order.createdAt).toLocaleString();
  const displayStatus = getDisplayStatus(order.status);
  const isPending = order.status === "PENDING";
  const isOnline = order.paymentMethod === "ONLINE";
  const [buyingAgain, setBuyingAgain] = useState(false);
  const setCartCount = useCartStore((s) => s.setCount);

  const handleBuyAgain = async () => {
    setBuyingAgain(true);
    try {
      let lastCart = null;
      for (const item of order.items) {
        lastCart = await addCartItem({
          productId: item.productId,
          unitType: item.unitType as UnitType,
          quantity: item.quantity ?? "1",
        });
      }
      if (lastCart) {
        const total = lastCart.items.reduce((sum, i) => sum + Number(i.quantity), 0);
        setCartCount(total);
      }
    } finally {
      setBuyingAgain(false);
    }
  };

  return (
    <div className="flex flex-col bg-secondary border border-primary/20 rounded-xl">
      {/* Order info */}
      <div className="flex items-center justify-between px-4 py-2 h-16">
        <div className="font-bold text-lg">ORD-{order.id}</div>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${getStatusStyle(displayStatus)}`}
        >
          {displayStatus}
        </span>
      </div>

      {/* Order item info */}
      <div className="flex flex-col border-y-1 border-muted/20 px-4 py-6">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={item.productImage ?? "https://placehold.co/64x64?text=No+Image"}
                alt={item.productName}
                className="rounded-lg h-16 w-16 object-cover"
              />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">{toTitleCase(item.productName)}</span>
                <span className="text-xs text-muted-foreground">{item.unitType}</span>
              </div>
            </div>
            <div className="flex gap-6">
              <span className="text-lg font-semibold">
                {formatVND(item.unitPrice ?? "0")}
              </span>
              <span className="text-muted text-lg">x{item.quantity ?? "0"}</span>
            </div>
          </div>
        ))}

        {/* Total */}
        <div className="flex justify-end gap-2 mt-2">
          <span>Total:</span>
          <span className="text-success font-semibold">
            {formatVND(order.totalAmount)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2 h-16">
        <span className="text-muted text-sm">{formatDate}</span>
        <div className="flex gap-2">
          {isPending && isOnline && (
            <Button
              disabled={busy}
              onClick={() => onPay(order.id)}
              className="rounded-full border border-indigo-500 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800"
            >
              Pay Now
            </Button>
          )}
          {isPending && (
            <Button
              disabled={busy}
              onClick={() => onCancel(order.id)}
              className="rounded-full border border-red-300 bg-white text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              Cancel Order
            </Button>
          )}
          {!isPending && (
            <Button
              disabled={buyingAgain}
              onClick={handleBuyAgain}
              className="bg-secondary text-success hover:bg-success hover:text-secondary rounded-full border border-success"
            >
              {buyingAgain ? "Adding..." : "Buy Again"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
