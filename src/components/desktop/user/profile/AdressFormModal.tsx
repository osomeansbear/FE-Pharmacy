"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Address } from "../../../../../types/addressTypes";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Address, "id" | "userId">) => void;
  initialData?: Address | null; // Nếu có data truyền vào thì là chế độ Edit, không có là Create
}

export default function AddressFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: AddressFormModalProps) {
  // State quản lý dữ liệu form
  const [formData, setFormData] = useState({
    province: "",
    district: "",
    ward: "",
    detail: "",
    isDefault: false,
  });

  // Reset form hoặc điền dữ liệu cũ khi mở Modal
  useEffect(() => {
    if (initialData) {
      setFormData({
        province: initialData.province,
        district: initialData.district,
        ward: initialData.ward,
        detail: initialData.detail,
        isDefault: initialData.isDefault,
      });
    } else {
      setFormData({
        province: "",
        district: "",
        ward: "",
        detail: "",
        isDefault: false,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate cơ bản
    if (
      !formData.province ||
      !formData.district ||
      !formData.ward ||
      !formData.detail
    ) {
      alert("Please fill in all address fields.");
      return;
    }
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-secondary border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-emerald-800 text-xl font-bold">
            {initialData ? "Edit Address" : "Add New Address"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          {/* Detail Address */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="detail"
              className="text-sm font-semibold text-slate-700"
            >
              Street, Building, House Number
            </label>
            <input
              id="detail"
              name="detail"
              value={formData.detail}
              onChange={handleChange}
              placeholder="e.g. 123 ABC Street"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Ward */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="ward"
                className="text-sm font-semibold text-slate-700"
              >
                Ward
              </label>
              <input
                id="ward"
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                placeholder="e.g. Ward 5"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              />
            </div>

            {/* District */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="district"
                className="text-sm font-semibold text-slate-700"
              >
                District
              </label>
              <input
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                placeholder="e.g. District 1"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              />
            </div>
          </div>

          {/* Province */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="province"
              className="text-sm font-semibold text-slate-700"
            >
              Province / City
            </label>
            <input
              id="province"
              name="province"
              value={formData.province}
              onChange={handleChange}
              placeholder="e.g. Ho Chi Minh City"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
            />
          </div>

          {/* Set as Default Checkbox */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-success focus:ring-success"
            />
            <label
              htmlFor="isDefault"
              className="text-sm font-medium text-slate-700 cursor-pointer"
            >
              Set as default address
            </label>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-success hover:bg-success/90 text-white rounded-full"
            >
              {initialData ? "Save Changes" : "Add Address"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
