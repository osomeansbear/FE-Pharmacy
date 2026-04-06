"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface PaymentSuccessProps {
  orderId: string | null;
}

export default function PaymentSuccess({ orderId }: PaymentSuccessProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-8 text-center">
      <CheckCircle2 size={72} className="text-success mb-6" />

      <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
      <p className="text-slate-500 mb-1">
        Thank you for your order. We&apos;ve received your request.
      </p>
      {orderId && (
        <p className="text-sm text-slate-400 mb-8">
          Order ID:{" "}
          <span className="font-semibold text-slate-600">#{orderId}</span>
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          onClick={() => router.push("/users/profile/orders")}
          className="flex-1 bg-success text-secondary font-bold rounded-full py-5"
        >
          View My Orders
        </Button>
        <Button
          variant="outline"
          onClick={() => router.push("/products")}
          className="flex-1 rounded-full py-5"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  );
}
