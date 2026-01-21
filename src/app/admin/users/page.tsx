"use client";

import { useState, useMemo, useEffect } from "react";
import {
  UserPlus,
  Mail,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { users } from "@/constants/userMockData";
import axiosInstance from "../../../../config/axios";
import apiEndpoints from "../../../../api/apiEndpoints";
import { log } from "console";

// interface User = {
//   id: string;
//   name: string;
//   email: string;
//   role: UserRole;
//   status: UserStatus;
//   lastActive: string;
// };
export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const [users, setUsers] = useState<any[]>([]);
  const fetchAllUsers = async () => {
    try {
      const data = await axiosInstance.get<any>(apiEndpoints.user.getAllUsers);

      setUsers(data.Users);
      console.log(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };

  // const filteredUsers = useMemo(() => {
  //   return users.filter(
  //     (u) =>
  //       u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //       u.email.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }, [searchTerm]);

  useEffect(() => {
    fetchAllUsers();
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // const currentItems = filteredUsers.slice(startIndex, endIndex);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            User Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff roles, permissions, and customer accounts.
          </p>
        </div>
        <Button className="bg-success hover:bg-success/90 text-white gap-2 rounded-lg shadow-sm ">
          <UserPlus size={18} /> Add User
        </Button>
      </div>

      {/* Toolbar */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
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
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Last Active</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200">
                        {user.name
                          .split(" ")
                          .map((n: any) => n[0])
                          .join("")}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <Mail size={12} /> {user.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant="outline"
                      className={
                        user.role === "Admin"
                          ? "border-blue-200 bg-blue-50 text-blue-700"
                          : user.role === "Pharmacist"
                          ? "border-purple-200 bg-purple-50 text-purple-700"
                          : "border-slate-200 bg-slate-50 text-slate-700"
                      }
                    >
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className={`flex items-center gap-1.5 font-medium ${
                        user.status === "Active"
                          ? "text-success"
                          : "text-red-500"
                      }`}
                    >
                      <div
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.status === "Active" ? "bg-success" : "bg-red-500"
                        }`}
                      />
                      {user.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">
                    {new Date(user.lastActive).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 border-blue-100 "
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 border-red-100 "
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50 border-t gap-4">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <div>
              Showing{" "}
              <span className="font-medium text-slate-900">
                {users.length > 0 ? startIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-900">
                {Math.min(endIndex, users.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">{users.length}</span>{" "}
              users
            </div>
            <div className="flex items-center gap-2 border-l pl-4">
              <span>Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-transparent font-medium text-slate-900 outline-none"
              >
                {[5, 10, 20].map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || totalPages === 0}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 p-0 ${
                      currentPage === page ? "bg-success" : ""
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight size={16} />
            </Button> */}
        </div>
      </div>
    </div>
  );
}
