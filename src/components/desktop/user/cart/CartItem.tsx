"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

// import { users } from "@/constants/userMockData";

export interface CartItemData {
  id: number;
  imgUrl: string;
  brand: string;
  name: string;
  price: number;
  quantity: number;
}
export interface CartItemProps {
  item: CartItemData;
}

export default function CartItem({ item }: CartItemProps) {
  return (
    <div className="flex justify-between items-center w-full  px-4 py-2 border border-black rounded-xl bg-white">
      <div className="flex items-center gap-2">
        {/* Details */}
        <div className="w-24 h-24 ">
          <img src={item.imgUrl} alt="" className="rounded-xl" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-info">{item.brand}</span>
          <span className="font-bold">{item.name}</span>
          <span className="text-emerald-700/90 font-bold">{item.price}VND</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Button */}
        <div className="flex items-center gap-4 bg-gray-200/50 border border-primary rounded-xl p-2">
          <Button className="bg-white text-primary border border-primary rounded-lg hover:bg-white hover:text-primary ">
            <Minus></Minus>
          </Button>
          <div className="font-bold">{item.quantity}</div>
          <Button className="bg-white text-primary border border-primary rounded-lg hover:bg-white hover:text-primary ">
            <Plus></Plus>
          </Button>
        </div>
        <div>
          <Button
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
