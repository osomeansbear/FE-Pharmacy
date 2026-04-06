"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder } from "../../../../../api/orders.api";
import { Address } from "../../../../../types/addressTypes";
import { Cart } from "../../../../../types/cartItemTypes";
import { PaymentMethod } from "../../../../../types/orderTypes";
import AddressSelector from "./AddressSelector";
import OrderItemsPanel from "./OrderItemsPanel";
import OrderSummary from "./OrderSummary";
import PaymentMethodSelector from "./PaymentMethodSelector";

interface CheckoutViewProps {
  cart: Cart;
  addresses: Address[];
  defaultAddressId: number | null;
}

export default function CheckoutView({
  cart,
  addresses,
  defaultAddressId,
}: CheckoutViewProps) {
  const router = useRouter();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(defaultAddressId);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handlePlaceOrder = async () => {
    setError("");
    if (!selectedAddressId) {
      setError("Please select a shipping address.");
      return;
    }
    setPlacing(true);
    try {
      const order = await createOrder({
        addressId: selectedAddressId,
        paymentMethod,
        items: cart.items.map((item) => ({
          productId: item.productId,
          unitType: item.unitType,
          quantity: item.quantity,
        })),
      });
      router.push(`/users/payment/success?orderId=${order.id}`);
    } catch {
      setError("Unable to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="px-16 py-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex flex-col gap-4 flex-1">
          <OrderItemsPanel items={cart.items} />
          <AddressSelector
            addresses={addresses}
            selectedId={selectedAddressId}
            onChange={setSelectedAddressId}
          />
          <PaymentMethodSelector
            selected={paymentMethod}
            onChange={setPaymentMethod}
          />
        </div>

        <div className="lg:w-80">
          <OrderSummary
            itemCount={cart.items.length}
            totalAmount={cart.totalAmount}
            paymentMethod={paymentMethod}
            selectedAddress={selectedAddress}
            placing={placing}
            onPlaceOrder={handlePlaceOrder}
            onBack={() => router.push("/users/cart")}
          />
        </div>
      </div>
    </div>
  );
}
