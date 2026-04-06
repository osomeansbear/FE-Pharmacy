"use client";

import CheckoutView from "@/components/desktop/user/payment/CheckoutView";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMyCart } from "../../../../api/cart.api";
import { fetchMyAddresses } from "../../../../api/users.api";
import { useAuthStore } from "../../../../stores/authStore";
import { Address } from "../../../../types/addressTypes";
import { Cart } from "../../../../types/cartItemTypes";

export default function PaymentPage() {
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  const [cart, setCart] = useState<Cart | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [cartData, userAddresses] = await Promise.all([
          fetchMyCart(),
          fetchMyAddresses(),
        ]);
        if (!cartData.items.length) {
          router.replace("/users/cart");
          return;
        }
        setCart(cartData);
        setAddresses(userAddresses ?? []);
      } catch {
        setError("Unable to load checkout data.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user?.id]);

  if (loading) return <div className="px-16 py-8">Loading checkout...</div>;
  if (error) return <div className="px-16 py-8 text-sm text-red-600">{error}</div>;
  if (!cart) return null;

  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];

  return (
    <CheckoutView
      cart={cart}
      addresses={addresses}
      defaultAddressId={defaultAddress?.id ?? null}
    />
  );
}
