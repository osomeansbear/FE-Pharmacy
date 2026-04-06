"use client";

import PaymentSuccess from "@/components/desktop/user/payment/PaymentSuccess";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  return <PaymentSuccess orderId={orderId} />;
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="px-16 py-8">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
