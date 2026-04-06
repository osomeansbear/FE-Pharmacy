import { formatVND } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";
import { CartItem } from "../../../../../types/cartItemTypes";

interface OrderItemsPanelProps {
  items: CartItem[];
}

export default function OrderItemsPanel({ items }: OrderItemsPanelProps) {
  return (
    <div className="border border-primary rounded-2xl bg-white px-6 py-6">
      <div className="flex items-center gap-2 mb-4">
        <ShoppingBag size={18} className="text-success" />
        <span className="font-bold text-lg">Order Items</span>
      </div>

      <div className="flex flex-col">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
          >
            <div className="flex flex-col">
              <span className="font-semibold text-sm">{item.productName}</span>
              <span className="text-xs text-slate-500">{item.unitType}</span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <span className="text-slate-500">x{item.quantity}</span>
              <span className="font-bold text-emerald-700">
                {formatVND(item.unitPrice)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
