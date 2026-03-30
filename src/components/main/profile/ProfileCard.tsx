"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleUserRound, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateUserById } from "../../../../api/users.api";
import { useAuthStore } from "../../../../stores/authStore";

export default function ProfileCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);

  // Local state cho form edit
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    // Thường email không cho đổi trực tiếp ở đây, nhưng bạn có thể thêm nếu cần
  });

  // Cập nhật dữ liệu form khi user load xong hoặc mở modal
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        phone: user.phone || "",
      });
    }
  }, [user, isModalOpen]);

  if (!user) {
    return <div className="p-4 text-center text-muted">Loading...</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) return;

    setSubmitError("");

    if (!formData.fullName.trim()) {
      setSubmitError("Full name is required.");
      return;
    }

    if (formData.phone && formData.phone.length < 10) {
      setSubmitError("Phone number must be at least 10 digits.");
      return;
    }

    setSaving(true);

    try {
      const updatedUser = await updateUserById(user.id, {
        fullName: formData.fullName.trim(),
        phone: formData.phone.trim(),
      });
      setUser({
        ...user,
        ...updatedUser,
      });
      setIsModalOpen(false);
    } catch {
      setSubmitError("Unable to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Thẻ hiển thị Profile (giữ nguyên, bỏ logic isEdit ? <></> : ...) */}
      <div className="w-full flex flex-col justify-center gap-4 items-center border border-primary/20 bg-secondary px-8 py-4 rounded-b-xl">
        <div className="bg-success rounded-full p-2">
          <CircleUserRound strokeWidth={1.5} size={52} className="text-white" />
        </div>

        <div className="w-full">
          <div className="flex justify-between w-full border-b border-muted/20 py-3">
            <span className="text-muted text-sm">Full name:</span>
            <span className="font-semibold">{user.fullName}</span>
          </div>
          <div className="flex justify-between w-full border-b border-muted/20 py-3">
            <span className="text-muted text-sm">Email:</span>
            <span className="font-semibold">{user.email}</span>
          </div>
          <div className="flex justify-between w-full border-b border-muted/20 py-3">
            <span className="text-muted text-sm">Phone:</span>
            <span className="font-semibold">{user.phone || "Not updated"}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="border border-success bg-secondary font-semibold text-success hover:text-white rounded-full hover:bg-success transition-colors"
          >
            Edit Profile
          </Button>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border border-red-300 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-full transition-colors"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </div>

      {/* Modal Edit Profile */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-secondary border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-success text-xl font-bold text-center">
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5 py-4">
            {/* Full Name */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="fullName"
                className="text-sm font-semibold text-foreground"
              >
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="flex h-10 w-full rounded-md border border-input bg-muted text-muted-foreground px-3 py-2 text-sm cursor-not-allowed"
                title="Email cannot be changed"
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="phone"
                className="text-sm font-semibold text-foreground"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              />
            </div>

            {submitError && (
              <p className="text-sm text-red-600" role="alert">
                {submitError}
              </p>
            )}

            <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving}
                className="bg-success hover:bg-success/90 text-white rounded-full"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
