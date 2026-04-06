import { Wallet } from "lucide-react";
import { PaymentMethod } from "../../../../../types/orderTypes";

export const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  CASH: "Cash on Delivery",
  CARD: "Credit / Debit Card",
  ONLINE: "Online Transfer",
  INSURANCE: "Health Insurance",
};

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

export default function PaymentMethodSelector({
  selected,
  onChange,
}: PaymentMethodSelectorProps) {
  return (
    <div className="border border-primary rounded-2xl bg-white px-6 py-6">
      <div className="flex items-center gap-2 mb-4">
        <Wallet size={18} className="text-success" />
        <span className="font-bold text-lg">Payment Method</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {(Object.keys(PAYMENT_LABELS) as PaymentMethod[]).map((method) => (
          <label
            key={method}
            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
              selected === method
                ? "border-success bg-success/5"
                : "border-slate-200 hover:border-slate-400"
            }`}
          >
            <input
              type="radio"
              name="payment"
              value={method}
              checked={selected === method}
              onChange={() => onChange(method)}
              className="accent-success"
            />
            <span className="text-sm font-medium">{PAYMENT_LABELS[method]}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
