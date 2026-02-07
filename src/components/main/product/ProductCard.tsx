"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "../../../../types/productTypes";

interface ProductCardProps {
  item: Product;
}

export default function ProductCard({ item }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden flex flex-col">
      <img
        // add img url for Product
        alt="img of"
        className=" h-56 w-full bg-slate-200 flex items-center justify-center text-slate-400"
      />

      <div className="p-5 flex flex-col flex-1">
        <div>
          <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider">
            {item.brandId}
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1 leading-tight">
            {item.name}
          </h3>
          <p className="text-slate-500 text-sm mt-2 line-clamp-2 flex-1">
            {item.shortDesc}
          </p>
        </div>

        <div>Unit</div>
        <div className="mt-6 flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-400 font-medium">Price</p>

            <p className="text-xl font-bold text-slate-900">
              {/* Add price from unit */}
              20000
            </p>
          </div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
            }}
            size="icon"
            className="bg-success hover:bg-emerald-950 text-white rounded-full h-10 w-10 justify-center shadow-sm"
          >
            <Plus size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}
