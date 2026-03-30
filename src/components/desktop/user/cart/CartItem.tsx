"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { CartItem as CartItemType } from "../../../../../types/cartItemTypes";

export interface CartItemProps {
  item: CartItemType;
  onIncrease: (itemId: number, nextQty: string) => void;
  onDecrease: (itemId: number, nextQty: string) => void;
  onRemove: (itemId: number) => void;
  busy?: boolean;
}

export default function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  busy = false,
}: CartItemProps) {
  const quantity = Number(item.quantity);
  const price = Number(item.unitPrice);

  return (
    <div className="flex justify-between items-center w-full  px-4 py-2 border border-black rounded-xl bg-white">
      <div className="flex items-center gap-2">
        {/* Details */}
        <div className="w-24 h-24 ">
          <img
            src="https://cdn.nhathuoclongchau.com.vn/unsafe/640x0/filters:quality(90):format(webp)/DSC_04874_6c29236c37.jpg"
            alt={item.productName}
            className="rounded-xl"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-info">{item.unitType}</span>
          <span className="font-bold">{item.productName}</span>
          <span className="text-emerald-700/90 font-bold">{price} VND</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Button */}
        <div className="flex items-center gap-4 bg-gray-200/50 border border-primary rounded-xl p-2">
          <Button
            disabled={busy}
            onClick={() =>
              onDecrease(item.id, String(Math.max(1, quantity - 1)))
            }
            className="bg-white text-primary border border-primary rounded-lg hover:bg-white hover:text-primary "
          >
            <Minus></Minus>
          </Button>
          <div className="font-bold">{quantity}</div>
          <Button
            disabled={busy}
            onClick={() => onIncrease(item.id, String(quantity + 1))}
            className="bg-white text-primary border border-primary rounded-lg hover:bg-white hover:text-primary "
          >
            <Plus></Plus>
          </Button>
        </div>
        <div>
          <Button
            disabled={busy}
            onClick={() => onRemove(item.id)}
            className="bg-white text-danger hover:bg-white hover:text-primary"
            size={"icon-lg"}
          >
            <Trash2 className="size-5"></Trash2>
          </Button>
        </div>
      </div>
    </div>
  );
}
