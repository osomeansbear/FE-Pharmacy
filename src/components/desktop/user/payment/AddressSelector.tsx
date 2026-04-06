import { MapPin } from "lucide-react";
import { Address } from "../../../../../types/addressTypes";

interface AddressSelectorProps {
  addresses: Address[];
  selectedId: number | null;
  onChange: (id: number) => void;
}

export default function AddressSelector({
  addresses,
  selectedId,
  onChange,
}: AddressSelectorProps) {
  return (
    <div className="border border-primary rounded-2xl bg-white px-6 py-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin size={18} className="text-success" />
        <span className="font-bold text-lg">Shipping Address</span>
      </div>

      {addresses.length === 0 ? (
        <p className="text-sm text-red-500">
          No saved addresses. Please add one in your profile.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {addresses.map((addr) => (
            <label
              key={addr.id}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                selectedId === addr.id
                  ? "border-success bg-success/5"
                  : "border-slate-200 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name="address"
                value={addr.id}
                checked={selectedId === addr.id}
                onChange={() => onChange(addr.id)}
                className="mt-1 accent-success"
              />
              <div className="text-sm">
                <p className="font-semibold">
                  {addr.detail}, {addr.ward}
                </p>
                <p className="text-slate-500">
                  {addr.district}, {addr.province}
                </p>
                {addr.isDefault && (
                  <span className="text-xs text-success font-medium">Default</span>
                )}
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
