"use client";

import { Button } from "@/components/ui/button";
import { MapPinHouse, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { createAddress, fetchMyAddresses } from "../../../../../api/users.api";
import { useAuthStore } from "../../../../../stores/authStore";
import { Address } from "../../../../../types/addressTypes";
import AddressCard from "./AddressCard"; // Nhớ import đúng tên file
import AddressFormModal from "./AdressFormModal";

export default function AddressTable() {
  const user = useAuthStore((state) => state.user);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // State quản lý Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    const loadAddresses = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const userAddresses = await fetchMyAddresses();
        setAddresses(userAddresses ?? []);
      } catch {
        setError("Unable to load your addresses.");
      } finally {
        setLoading(false);
      }
    };

    loadAddresses();
  }, [user?.id]);

  // Mở modal Thêm mới
  const handleOpenAddModal = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  // Mở modal Sửa
  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: number) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    );
  };

  // Xử lý khi Form Submit
  const handleFormSubmit = async (formData: Omit<Address, "id" | "userId">) => {
    setError("");

    if (editingAddress) {
      // Logic Cập nhật (Edit)
      setAddresses((prev) => {
        let updatedList = prev.map((addr) =>
          addr.id === editingAddress.id ? { ...addr, ...formData } : addr,
        );
        // Nếu user chọn isDefault = true, gỡ default các địa chỉ khác
        if (formData.isDefault) {
          updatedList = updatedList.map((addr) => ({
            ...addr,
            isDefault: addr.id === editingAddress.id,
          }));
        }
        return updatedList;
      });
    } else {
      try {
        const created = await createAddress({
          province: formData.province,
          district: formData.district,
          ward: formData.ward,
          detail: formData.detail,
        });

        setAddresses((prev) => {
          let newList = [
            ...prev,
            { ...created, isDefault: formData.isDefault },
          ];
          if (formData.isDefault) {
            newList = newList.map((addr) => ({
              ...addr,
              isDefault: addr.id === created.id,
            }));
          }
          return newList;
        });
      } catch {
        setError("Unable to create address.");
        return;
      }
    }

    // Đóng modal sau khi xong
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-1">
      {loading && (
        <p className="text-sm text-slate-500">Loading addresses...</p>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Header */}
      <div className="flex items-center justify-between p-2 bg-secondary border border-primary/20 rounded-b-2xl">
        <div className="flex items-center gap-2 font-semibold text-emerald-800">
          <MapPinHouse className="size-5" />
          <span>My Addresses</span>
        </div>
        <Button
          onClick={handleOpenAddModal}
          className="bg-success hover:bg-success/90 text-white rounded-full flex gap-2"
        >
          <Plus className="size-4" />
          Add New Address
        </Button>
      </div>

      {/* Address Grid/List */}
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.length > 0 ? (
          addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onSetDefault={handleSetDefault}
            />
          ))
        ) : (
          <div className="col-span-full py-10 text-center text-muted-foreground bg-secondary/50 rounded-xl border border-dashed border-primary/20">
            No addresses found. Add one to get started!
          </div>
        )}
      </div>
      <AddressFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingAddress}
      />
    </div>
  );
}
