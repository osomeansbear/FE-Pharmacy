"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CircleUserRound, KeyRound, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { changePassword, updateMyProfile } from "../../../../api/users.api";
import { useAuthStore } from "../../../../stores/authStore";

export default function ProfileCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
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

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState("");

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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    if (passwordForm.newPassword.length < 5) {
      setPasswordError("New password must be at least 5 characters.");
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordSuccess("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setPasswordError("Failed to change password. Check your current password.");
    } finally {
      setPasswordSaving(false);
    }
  };

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

    if (formData.phone) {
      if (!/^[0-9]+$/.test(formData.phone)) {
        setSubmitError("Phone number must contain digits only.");
        return;
      }
      if (formData.phone.length < 10) {
        setSubmitError("Phone number must be at least 10 digits.");
        return;
      }
    }

    setSaving(true);

    try {
      const updatedUser = await updateMyProfile({
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

        <div className="flex gap-2 mt-2 flex-wrap justify-center">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="border border-success bg-secondary font-semibold text-success hover:text-white rounded-full hover:bg-success transition-colors"
          >
            Edit Profile
          </Button>
          <Button
            onClick={() => { setPasswordError(""); setPasswordSuccess(""); setIsPasswordModalOpen(true); }}
            variant="outline"
            className="border border-primary/40 text-foreground hover:bg-muted/10 rounded-full transition-colors"
          >
            <KeyRound size={16} />
            Change Password
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

      {/* Modal Change Password */}
      <Dialog open={isPasswordModalOpen} onOpenChange={setIsPasswordModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-secondary border-primary/20">
          <DialogHeader>
            <DialogTitle className="text-success text-xl font-bold text-center">
              Change Password
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-5 py-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="currentPassword" className="text-sm font-semibold text-foreground">
                Current Password
              </label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="newPassword" className="text-sm font-semibold text-foreground">
                New Password
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="text-sm font-semibold text-foreground">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success"
              />
            </div>

            {passwordError && (
              <p className="text-sm text-red-600" role="alert">{passwordError}</p>
            )}
            {passwordSuccess && (
              <p className="text-sm text-green-600" role="status">{passwordSuccess}</p>
            )}

            <DialogFooter className="mt-4 flex gap-2 sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsPasswordModalOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={passwordSaving}
                className="bg-success hover:bg-success/90 text-white rounded-full"
              >
                {passwordSaving ? "Saving..." : "Change Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
