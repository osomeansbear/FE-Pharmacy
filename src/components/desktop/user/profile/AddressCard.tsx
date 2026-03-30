"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Edit2, MapPin, Trash2 } from "lucide-react";
import { Address } from "../../../../../types/addressTypes";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (id: number) => void;
  onSetDefault: (id: number) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
}: AddressCardProps) {
  // Nối các trường lại thành một địa chỉ hoàn chỉnh
  const fullAddress = `${address.detail}, ${address.ward}, ${address.district}, ${address.province}`;

  return (
    <div
      className={cn(
        "flex flex-col bg-secondary border rounded-xl p-4 transition-all",
        address.isDefault
          ? "border-success/50 ring-1 ring-success/20"
          : "border-primary/20",
      )}
    >
      {/* Phần Header: Tiêu đề và Nút hành động */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-lg text-foreground">
            Saved Address
          </span>
          {address.isDefault && (
            <span className="bg-success/10 text-success text-[10px] px-2 py-0.5 rounded-full border border-success/20 font-medium">
              Default
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
            onClick={() => onEdit(address)}
          >
            <Edit2 className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive/70 hover:text-destructive"
            onClick={() => onDelete(address.id)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>

      {/* Phần Body: Hiển thị địa chỉ chi tiết */}
      <div className="space-y-2 text-sm text-slate-600 mb-4">
        <div className="flex items-start gap-2">
          {/* Dùng shrink-0 để icon không bị bóp méo khi text quá dài */}
          <MapPin className="size-4 mt-0.5 text-muted-foreground shrink-0" />
          <span className="flex-1 leading-relaxed">{fullAddress}</span>
        </div>
      </div>

      {/* Phần Footer: Nút Set Default (chỉ hiện khi chưa phải mặc định) */}
      {!address.isDefault && (
        <div className="mt-auto pt-3 border-t border-primary/10 flex justify-end items-center">
          <Button
            variant="outline"
            size="sm"
            className="text-xs border-success text-success hover:bg-success hover:text-white"
            onClick={() => onSetDefault(address.id)}
          >
            Set as Default
          </Button>
        </div>
      )}
    </div>
  );
}
