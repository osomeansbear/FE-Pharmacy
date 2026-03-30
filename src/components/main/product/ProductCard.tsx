"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent, useState } from "react";
import { addCartItem } from "../../../../api/cart.api";
import { useAuthStore } from "../../../../stores/authStore";
import { UnitType } from "../../../../types/orderTypes";
import { Product } from "../../../../types/productTypes";

interface ProductCardProps {
  item: Product;
}

export default function ProductCard({ item }: ProductCardProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const defaultUnit = item.units?.find((u) => u.isDefault) ?? item.units?.[0];
  const defaultUnitType: UnitType = (defaultUnit?.unitType as UnitType) ?? "BOX";
  const displayPrice = defaultUnit
    ? Number(defaultUnit.price).toLocaleString()
    : "N/A";

  const handleAddToCart = async (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setError("");

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    try {
      setAdding(true);
      await addCartItem({
        productId: item.id,
        unitType: defaultUnitType,
        quantity: "1",
      });
    } catch {
      setError("Unable to add this product to cart.");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden flex flex-col border hover:border-1 border-transparent hover:border-success hover:cursor-pointer"
      onClick={() => {
        router.push(`/products/${item.slug}`);
      }}
    >
      <img
        src={item.image?.[0] || "https://placehold.co/600x400?text=No+Image"}
        alt="img of"
        className="h-56 w-full bg-slate-200 object-cover"
      />

      <div className="p-5 flex flex-col flex-1">
        <div>
          <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider">
            {item.brandName ?? ""}
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1 leading-tight">
            {item.name}
          </h3>
          <p className="text-slate-500 text-sm mt-2 line-clamp-2 flex-1">
            {item.shortDesc}
          </p>
        </div>

        <div className="text-xs text-slate-400 mt-2">
          {defaultUnit ? defaultUnit.unitType : ""}
        </div>
        <div className="mt-4 flex justify-between items-end">
          <div>
            <p className="text-xs text-slate-400 font-medium">Price</p>
            <p className="text-xl font-bold text-slate-900">{displayPrice}</p>
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={adding}
            size="icon"
            className="bg-success hover:bg-success/80 text-white rounded-full h-10 w-10 justify-center"
          >
            <Plus size={20} />
          </Button>
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>
    </div>
  );
}
