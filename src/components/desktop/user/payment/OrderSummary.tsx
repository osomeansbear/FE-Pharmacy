import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import { Address } from "../../../../../types/addressTypes";
import { PaymentMethod } from "../../../../../types/orderTypes";
import { PAYMENT_LABELS } from "./PaymentMethodSelector";

interface OrderSummaryProps {
  itemCount: number;
  totalAmount: string;
  paymentMethod: PaymentMethod;
  selectedAddress: Address | undefined;
  placing: boolean;
  onPlaceOrder: () => void;
  onBack: () => void;
}

export default function OrderSummary({
  itemCount,
  totalAmount,
  paymentMethod,
  selectedAddress,
  placing,
  onPlaceOrder,
  onBack,
}: OrderSummaryProps) {
  return (
    <div className="border border-primary rounded-2xl bg-white px-6 py-6 flex flex-col gap-4 sticky top-8">
      <span className="text-xl font-bold text-primary">Summary</span>

      <div className="flex flex-col gap-3 text-sm font-medium">
        <div className="flex justify-between">
          <span className="text-muted/80">Items ({itemCount})</span>
          <span>{formatVND(totalAmount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted/80">Shipping</span>
          <span className="text-emerald-700/90">Free</span>
        </div>
        <div className="flex justify-between text-xs text-slate-500">
          <span>Payment</span>
          <span>{PAYMENT_LABELS[paymentMethod]}</span>
        </div>
        {selectedAddress && (
          <div className="flex justify-between text-xs text-slate-500">
            <span>Deliver to</span>
            <span className="text-right max-w-36">
              {selectedAddress.detail}, {selectedAddress.ward},{" "}
              {selectedAddress.district}
            </span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center text-2xl font-bold border-t-2 border-black pt-4">
        <span>Total</span>
        <span className="text-emerald-900">{formatVND(totalAmount)}</span>
      </div>

      <Button
        onClick={onPlaceOrder}
        disabled={placing || !selectedAddress}
        className="bg-success justify-center text-secondary text-lg font-bold rounded-full py-6"
      >
        {placing ? "Placing Order..." : "Place Order"}
      </Button>

      <Button variant="outline" onClick={onBack} className="rounded-full">
        Back to Cart
      </Button>
    </div>
  );
}
