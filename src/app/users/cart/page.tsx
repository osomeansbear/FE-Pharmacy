"use client";

import CartItem from "@/components/desktop/user/cart/CartItem";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  fetchMyCart,
  removeCartItem,
  updateCartItem,
} from "../../../../api/cart.api";
import { useAuthStore } from "../../../../stores/authStore";
import { Cart } from "../../../../types/cartItemTypes";

export default function CartPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();
  const [cart, setCart] = useState<Cart>({ items: [], totalAmount: "0" });
  const [loading, setLoading] = useState(true);
  const [busyItemId, setBusyItemId] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const cartData = await fetchMyCart();
      setCart(cartData);
    } catch {
      setError("Unable to load cart data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const handleIncrease = async (itemId: number, nextQty: string) => {
    setBusyItemId(itemId);
    setError("");
    try {
      const nextCart = await updateCartItem(itemId, { quantity: nextQty });
      setCart(nextCart);
    } catch {
      setError("Unable to update quantity.");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleDecrease = async (itemId: number, nextQty: string) => {
    setBusyItemId(itemId);
    setError("");
    try {
      if (Number(nextQty) <= 1) {
        const nextCart = await removeCartItem(itemId);
        setCart(nextCart);
      } else {
        const nextCart = await updateCartItem(itemId, { quantity: nextQty });
        setCart(nextCart);
      }
    } catch {
      setError("Unable to update quantity.");
    } finally {
      setBusyItemId(null);
    }
  };

  const handleRemove = async (itemId: number) => {
    setBusyItemId(itemId);
    setError("");
    try {
      const nextCart = await removeCartItem(itemId);
      setCart(nextCart);
    } catch {
      setError("Unable to remove item.");
    } finally {
      setBusyItemId(null);
    }
  };

  if (loading) {
    return <div className="px-16 py-8">Loading cart...</div>;
  }

  return (
    <div className="px-16 py-8">
      <h1 className="text-2xl font-bold mb-4">My Cart</h1>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      <div className="flex flex-col gap-2">
        {cart.items.length ? (
          cart.items.map((singleItem) => (
            <CartItem
              key={singleItem.id}
              item={singleItem}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              onRemove={handleRemove}
              busy={busyItemId === singleItem.id}
            />
          ))
        ) : (
          <p className="text-sm text-slate-500">No items in your cart.</p>
        )}
      </div>

      <div className="flex flex-col border border-primary rounded-2xl mt-4 gap-6 px-8 py-8 bg-white">
        <span className="text-xl font-bold text-primary">Bag Total</span>

        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-muted/80">Subtotal</span>
            <div>{formatVND(cart.totalAmount)}</div>
          </div>
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-muted/80">Shipping</span>
            <div className="text-emerald-700/90">Free</div>
          </div>
        </div>

        <div className="flex justify-between items-center text-2xl font-bold border-t-2 border-black py-4">
          <span>Total</span>
          <div className="text-emerald-900">{formatVND(cart.totalAmount)}</div>
        </div>

        <Button
          onClick={() => router.push("/users/payment")}
          disabled={!cart.items.length}
          className="bg-success justify-center text-secondary text-2xl font-bold rounded-full py-8"
        >
          Proceed to Checkout
        </Button>
      </div>
    </div>
  );
}
