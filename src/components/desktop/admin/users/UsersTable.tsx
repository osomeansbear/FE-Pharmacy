"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, Mail, Pencil, Search, UserPlus, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchAllUsers,
  updateUserRole,
  updateUserStatus,
} from "../../../../../api/users.api";
import { AppRole, User } from "../../../../../types/userTypes";

export default function UsersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [users, setUsers] = useState<User[]>([]);

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<AppRole>("PATIENT");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editLoading, setEditLoading] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const filteredUsers = users.filter(
    (u) =>
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredUsers.slice(startIndex, endIndex);

  // Edit handlers
  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditRole(user.role);
    setEditIsActive(user.isActive);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    if (!editingUser) return;
    setEditLoading(true);
    try {
      if (editRole !== editingUser.role) {
        await updateUserRole(editingUser.id, editRole);
      }
      if (editIsActive !== editingUser.isActive) {
        await updateUserStatus(editingUser.id, editIsActive);
      }
      setEditOpen(false);
      setEditingUser(null);
      await loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff roles, permissions, and customer accounts.
          </p>
        </div>
        <Button className="bg-success hover:bg-success/90 text-white gap-2 rounded-lg">
          <UserPlus size={18} /> Add User
        </Button>
      </div>

      {/* Toolbar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search by name or email..."
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary border-b text-muted-foreground font-medium">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentItems.length > 0 ? (
              currentItems.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-secondary/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground border border-border">
                        {user.fullName
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground">
                          {user.fullName}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail size={12} /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={
                        user.role === "ADMIN"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : "border-border bg-secondary text-foreground"
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-1.5 font-medium ${
                        user.isActive ? "text-success" : "text-red-500"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.isActive ? "bg-success" : "bg-red-500"
                        }`}
                      />
                      {user.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 border-blue-100 "
                        onClick={() => handleEditClick(user)}
                      >
                        <Pencil size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-secondary border-t gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredUsers.length > 0 ? startIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(endIndex, filteredUsers.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredUsers.length}
              </span>{" "}
              users
            </div>
            <div className="flex items-center gap-2 border-l pl-4">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-transparent font-medium text-foreground outline-none"
              >
                {[5, 10, 20].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || totalPages === 0}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 p-0 ${currentPage === page ? "bg-success" : ""}`}
                >
                  {page}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-white border border-primary/20">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update role and status for{" "}
              <span className="font-medium text-foreground">
                {editingUser?.fullName}
              </span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Role select */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                Role
              </label>
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as AppRole)}
                className="h-9 w-full rounded-md border border-border bg-white px-3 py-1 text-sm shadow-xs outline-none focus:border-success focus:ring-2 focus:ring-success/20 cursor-pointer"
              >
                <option value="PATIENT">PATIENT</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {/* Active toggle */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <label className="text-sm font-medium text-foreground">
                  Active Status
                </label>
                <span className="text-xs text-muted-foreground">
                  {editIsActive
                    ? "User can log in and use the system"
                    : "User is blocked from accessing the system"}
                </span>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={editIsActive}
                onClick={() => setEditIsActive(!editIsActive)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-success/20 focus:ring-offset-2 ${
                  editIsActive ? "bg-success" : "bg-muted"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    editIsActive ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={editLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-success hover:bg-success/90 text-white"
              onClick={handleEditSave}
              disabled={editLoading}
            >
              {editLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
