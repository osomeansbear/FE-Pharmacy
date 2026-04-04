"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Package,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { registerUser } from "../../../../../api/auth.api";
import {
  adminCreateOrder,
  fetchAllOrders,
  updateOrderStatus,
} from "../../../../../api/orders.api";
import { fetchAllProducts } from "../../../../../api/products.api";
import { fetchAllUsers } from "../../../../../api/users.api";
import {
  AdminCreateOrderPayload,
  OrderListType,
  PaymentMethod,
} from "../../../../../types/orderTypes";
import { Product } from "../../../../../types/productTypes";
import { User } from "../../../../../types/userTypes";

type AdminOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled"
  | "Returned";

const ALL_STATUSES: AdminOrderStatus[] = [
  "Pending",
  "Confirmed",
  "Processing",
  "Delivered",
  "Cancelled",
  "Returned",
];

const statusMap: Record<string, AdminOrderStatus> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  PROCESSING: "Processing",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

const statusToApi: Record<AdminOrderStatus, string> = {
  Pending: "PENDING",
  Confirmed: "CONFIRMED",
  Processing: "PROCESSING",
  Delivered: "DELIVERED",
  Cancelled: "CANCELLED",
  Returned: "RETURNED",
};

const validTransitions: Record<string, AdminOrderStatus[]> = {
  PENDING: ["Confirmed", "Cancelled"],
  CONFIRMED: ["Processing", "Cancelled"],
  PROCESSING: ["Delivered"],
  DELIVERED: ["Returned"],
  CANCELLED: [],
  RETURNED: [],
};

// New Order modal types

type NewOrderStep = "user" | "products" | "details";

interface OrderItem {
  productId: number;
  productName: string;
  unitType: string;
  quantity: string;
  unitPrice: string;
  availableUnits: { unitType: string; price: string; isDefault: boolean }[];
}

// Component

export default function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | "">("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orders, setOrders] = useState<OrderListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Order detail modal
  const [selectedOrder, setSelectedOrder] = useState<OrderListType | null>(
    null,
  );
  const [newStatus, setNewStatus] = useState<AdminOrderStatus | "">("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  // New Order modal
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [step, setStep] = useState<NewOrderStep>("user");

  // Step 1 — user selection
  const [users, setUsers] = useState<User[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);
  const [newUserForm, setNewUserForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    dob: "",
  });
  const [newUserError, setNewUserError] = useState("");
  const [creatingUser, setCreatingUser] = useState(false);
  const [createdPassword, setCreatedPassword] = useState("");

  // Step 2 — products
  const [products, setProducts] = useState<Product[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // Step 3 — details
  const [shippingAddress, setShippingAddress] = useState({
    province: "",
    district: "",
    ward: "",
    detail: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    fetchAllOrders()
      .then(setOrders)
      .catch(() => setError("Unable to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        o.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `ORD-${o.id}`.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus =
        statusFilter === "" || statusMap[o.status] === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchTerm, statusFilter, orders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, itemsPerPage]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  const getStatusStyle = (status: AdminOrderStatus) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Confirmed":
        return "bg-indigo-100 text-indigo-700 border-indigo-200";
      case "Processing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Delivered":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Cancelled":
        return "bg-muted text-foreground border-slate-200";
      case "Returned":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-muted text-foreground";
    }
  };

  const getDisplayStatus = (apiStatus: string): AdminOrderStatus =>
    statusMap[apiStatus] || "Pending";

  // Order detail

  const openOrderDetail = useCallback((order: OrderListType) => {
    setSelectedOrder(order);
    setNewStatus("");
    setUpdateError("");
    setUpdating(false);
  }, []);

  const closeOrderDetail = useCallback(() => {
    setSelectedOrder(null);
    setNewStatus("");
    setUpdateError("");
    setUpdating(false);
  }, []);

  const handleUpdateStatus = useCallback(async () => {
    if (!selectedOrder || !newStatus) return;
    setUpdating(true);
    setUpdateError("");
    try {
      const updated = await updateOrderStatus(
        selectedOrder.id,
        statusToApi[newStatus],
      );
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setSelectedOrder(updated);
      setNewStatus("");
    } catch {
      setUpdateError("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  }, [selectedOrder, newStatus]);

  // New Order modal

  const openNewOrder = useCallback(async () => {
    setShowNewOrder(true);
    setStep("user");
    setSelectedUser(null);
    setIsNewUser(false);
    setNewUserForm({ fullName: "", email: "", phone: "", dob: "" });
    setNewUserError("");
    setUserSearch("");
    setOrderItems([]);
    setProductSearch("");
    setShippingAddress({ province: "", district: "", ward: "", detail: "" });
    setPaymentMethod("CASH");
    setSubmitError("");
    setCreatedPassword("");

    const [u, p] = await Promise.all([fetchAllUsers(), fetchAllProducts()]);
    setUsers(u.filter((user) => user.role === "PATIENT" && user.isActive));
    setProducts(p);
  }, []);

  const closeNewOrder = useCallback(() => {
    setShowNewOrder(false);
  }, []);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (u) =>
          u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
          u.email.toLowerCase().includes(userSearch.toLowerCase()),
      ),
    [users, userSearch],
  );

  const filteredProducts = useMemo(
    () =>
      products.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase()),
      ),
    [products, productSearch],
  );

  const handleCreateNewUser = async () => {
    const { fullName, email, phone, dob } = newUserForm;
    if (!fullName || !email || !phone || !dob) {
      setNewUserError("All fields are required.");
      return;
    }
    setCreatingUser(true);
    setNewUserError("");
    try {
      const password = "123456";
      const res = await registerUser({
        fullName,
        email,
        phone,
        dob,
        password,
        role: "PATIENT",
      });
      const created: User = {
        id: res.user.id,
        email: res.user.email,
        fullName: res.user.fullName,
        phone: res.user.phone,
        role: "PATIENT",
        isActive: res.user.isActive,
        createdAt: res.user.createdAt ?? "",
        updatedAt: res.user.updatedAt ?? "",
      };
      setUsers((prev) => [created, ...prev]);
      setSelectedUser(created);
      setCreatedPassword(password);
      setIsNewUser(false);
      setStep("products");
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setNewUserError(typeof msg === "string" ? msg : "Failed to create user.");
    } finally {
      setCreatingUser(false);
    }
  };

  const addProductToOrder = (product: Product) => {
    if (!product.units?.length) return;
    const defaultUnit =
      product.units.find((u) => u.isDefault) ?? product.units[0];
    setOrderItems((prev) => {
      const exists = prev.find((i) => i.productId === product.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          productId: product.id,
          productName: product.name,
          unitType: defaultUnit.unitType,
          quantity: "1",
          unitPrice: defaultUnit.price,
          availableUnits: product.units!.map((u) => ({
            unitType: u.unitType,
            price: u.price,
            isDefault: u.isDefault,
          })),
        },
      ];
    });
  };

  const updateOrderItemUnit = (idx: number, unitType: string) => {
    setOrderItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const unit = item.availableUnits.find((u) => u.unitType === unitType);
        return { ...item, unitType, unitPrice: unit?.price ?? item.unitPrice };
      }),
    );
  };

  const updateOrderItemQty = (idx: number, qty: string) => {
    setOrderItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, quantity: qty } : item)),
    );
  };

  const removeOrderItem = (idx: number) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const orderTotal = orderItems.reduce(
    (sum, item) => sum + Number(item.quantity) * Number(item.unitPrice),
    0,
  );

  const handleSubmitOrder = async () => {
    if (!selectedUser) return;
    const { province, district, ward, detail } = shippingAddress;
    if (!province || !district || !ward || !detail) {
      setSubmitError("All address fields are required.");
      return;
    }
    if (orderItems.length === 0) {
      setSubmitError("Add at least one product.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const payload: AdminCreateOrderPayload = {
        userId: selectedUser.id,
        shippingAddress,
        paymentMethod,
        items: orderItems.map((i) => ({
          productId: i.productId,
          unitType: i.unitType as "TABLET" | "BOX",
          quantity: i.quantity,
        })),
      };
      const created = await adminCreateOrder(payload);
      setOrders((prev) => [created, ...prev]);
      closeNewOrder();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } } })
        ?.response?.data?.message;
      setSubmitError(typeof msg === "string" ? msg : "Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  };

  // Render

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Order Management
          </h1>
          <p className="text-muted-foreground">
            Track prescriptions and medication sales.
          </p>
        </div>
        <Button
          className="bg-success hover:bg-success/90 rounded-lg text-white gap-2"
          onClick={openNewOrder}
        >
          <Package size={18} /> New Order
        </Button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search Order ID or Patient..."
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

        {/* Filter Status */}
        <div className="relative">
          <Button
            variant="outline"
            className="gap-2 text-muted-foreground whitespace-nowrap"
            onClick={() => setShowStatusDropdown((v) => !v)}
          >
            <Filter size={16} />
            {statusFilter || "Filter Status"}
            {statusFilter && (
              <span
                className="ml-1 text-muted-foreground hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  setStatusFilter("");
                }}
              >
                <X size={12} />
              </span>
            )}
          </Button>
          {showStatusDropdown && (
            <div
              className="absolute right-0 top-full mt-1 z-20 bg-white border rounded-lg shadow-lg py-1 w-44"
              onMouseLeave={() => setShowStatusDropdown(false)}
            >
              {ALL_STATUSES.map((s) => (
                <button
                  key={s}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${statusFilter === s ? "font-semibold text-success" : "text-foreground"}`}
                  onClick={() => {
                    setStatusFilter(s);
                    setShowStatusDropdown(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary border-b text-muted-foreground font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Patient</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Loading orders...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-red-600">
                  {error}
                </td>
              </tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((order) => {
                const displayStatus = getDisplayStatus(order.status);
                return (
                  <tr
                    key={order.id}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono font-medium text-muted-foreground">
                      ORD-{order.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {order.userEmail}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{order.items.length} meds</td>
                    <td className="px-6 py-4 font-bold text-foreground">
                      ${Number(order.totalAmount || 0).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={`font-medium py-0.5 ${getStatusStyle(displayStatus)}`}
                      >
                        {displayStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 px-3 gap-1.5 text-muted-foreground hover:text-success border-slate-200"
                          onClick={() => openOrderDetail(order)}
                        >
                          <Eye size={14} /> View
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No orders found
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
                {filteredOrders.length > 0 ? startIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(endIndex, filteredOrders.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredOrders.length}
              </span>{" "}
              orders
            </div>
            <div className="flex items-center gap-2 border-l pl-4">
              <span>Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-transparent font-medium text-foreground outline-none cursor-pointer"
              >
                {[5, 10, 20, 50].map((v) => (
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 p-0 ${currentPage === page ? "bg-success" : ""}`}
                  >
                    {page}
                  </Button>
                ),
              )}
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

      {/* ── Order Detail Modal ───────────────────────────────────────────────── */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closeOrderDetail}
        >
          <div
            className="bg-white rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Order ORD-{selectedOrder.id}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {selectedOrder.userEmail}
                </p>
              </div>
              <button
                onClick={closeOrderDetail}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className={`font-medium py-0.5 ${getStatusStyle(getDisplayStatus(selectedOrder.status))}`}
                >
                  {getDisplayStatus(selectedOrder.status)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Created:{" "}
                  {new Date(selectedOrder.createdAt).toLocaleDateString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  Updated:{" "}
                  {new Date(selectedOrder.updatedAt).toLocaleDateString()}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Shipping Address
                </h3>
                <div className="bg-secondary rounded-lg p-3 text-sm text-muted-foreground">
                  <p>{selectedOrder.shippingAddress.detail}</p>
                  <p>
                    {selectedOrder.shippingAddress.ward},{" "}
                    {selectedOrder.shippingAddress.district}
                  </p>
                  <p>{selectedOrder.shippingAddress.province}</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Order Items ({selectedOrder.items.length})
                </h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-secondary border-b text-muted-foreground">
                      <tr>
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-left">Unit</th>
                        <th className="px-4 py-2 text-right">Qty</th>
                        <th className="px-4 py-2 text-right">Base Qty</th>
                        <th className="px-4 py-2 text-right">Unit Price</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {selectedOrder.items.map((item) => (
                        <tr key={item.id}>
                          <td className="px-4 py-2 font-medium text-foreground">
                            {item.productName}
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">
                            {item.unitType || "-"}
                          </td>
                          <td className="px-4 py-2 text-right text-muted-foreground">
                            {item.quantity ?? "-"}
                          </td>
                          <td className="px-4 py-2 text-right text-muted-foreground">
                            {item.baseQty ?? "-"}
                          </td>
                          <td className="px-4 py-2 text-right text-muted-foreground">
                            {item.unitPrice
                              ? `$${Number(item.unitPrice).toFixed(2)}`
                              : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-between items-center mt-3 px-1">
                  <span className="text-sm text-muted-foreground">
                    Payment: {selectedOrder.paymentMethod}
                  </span>
                  <span className="text-base font-bold text-foreground">
                    Total: ${Number(selectedOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {(validTransitions[selectedOrder.status]?.length ?? 0) > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">
                    Update Status
                  </h3>
                  <div className="flex items-center gap-3">
                    <select
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(e.target.value as AdminOrderStatus | "")
                      }
                      className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                    >
                      <option value="">Select new status...</option>
                      {validTransitions[selectedOrder.status]?.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <Button
                      className="bg-success hover:bg-success/90 text-white rounded-lg"
                      disabled={!newStatus || updating}
                      onClick={handleUpdateStatus}
                    >
                      {updating ? "Updating..." : "Update Status"}
                    </Button>
                  </div>
                  {updateError && (
                    <p className="text-sm text-red-600 mt-2">{updateError}</p>
                  )}
                </div>
              )}
            </div>

            <div className="flex justify-end px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={closeOrderDetail}
                className="rounded-lg"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── New Order Modal ──────────────────────────────────────────────────── */}
      {showNewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  New Walk-in Order
                </h2>
                <div className="flex items-center gap-2 mt-1">
                  {(["user", "products", "details"] as NewOrderStep[]).map(
                    (s, i) => (
                      <span key={s} className="flex items-center gap-2">
                        <span
                          className={`text-xs font-medium px-2 py-0.5 rounded-full ${step === s ? "bg-success text-white" : "bg-secondary text-muted-foreground"}`}
                        >
                          {i + 1}.{" "}
                          {s === "user"
                            ? "Patient"
                            : s === "products"
                              ? "Products"
                              : "Details"}
                        </span>
                        {i < 2 && (
                          <span className="text-muted-foreground text-xs">
                            ›
                          </span>
                        )}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <button
                onClick={closeNewOrder}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* ── Step 1: Patient ─────────────────────────────────────────── */}
              {step === "user" && (
                <div className="space-y-4">
                  {!isNewUser ? (
                    <>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                          className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                          placeholder="Search patient by name or email..."
                          value={userSearch}
                          onChange={(e) => setUserSearch(e.target.value)}
                        />
                      </div>

                      <div className="border rounded-lg divide-y max-h-52 overflow-y-auto">
                        {filteredUsers.length === 0 ? (
                          <p className="px-4 py-3 text-sm text-muted-foreground">
                            No patients found.
                          </p>
                        ) : (
                          filteredUsers.map((u) => (
                            <button
                              key={u.id}
                              onClick={() => setSelectedUser(u)}
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-secondary transition-colors ${selectedUser?.id === u.id ? "bg-success/10 font-semibold" : ""}`}
                            >
                              <span className="font-medium">{u.fullName}</span>
                              <span className="text-muted-foreground ml-2">
                                {u.email}
                              </span>
                            </button>
                          ))
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setIsNewUser(true);
                          setSelectedUser(null);
                        }}
                        className="text-sm text-success hover:underline flex items-center gap-1"
                      >
                        <Plus size={14} /> Register new patient
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-foreground">
                        New Patient Info
                      </p>
                      {(["fullName", "email", "phone", "dob"] as const).map(
                        (field) => (
                          <div key={field}>
                            <label className="block text-xs text-muted-foreground mb-1 capitalize">
                              {field === "dob"
                                ? "Date of Birth"
                                : field === "fullName"
                                  ? "Full Name"
                                  : field}
                            </label>
                            <input
                              type={
                                field === "dob"
                                  ? "date"
                                  : field === "email"
                                    ? "email"
                                    : "text"
                              }
                              className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                              value={newUserForm[field]}
                              onChange={(e) =>
                                setNewUserForm((f) => ({
                                  ...f,
                                  [field]: e.target.value,
                                }))
                              }
                            />
                          </div>
                        ),
                      )}
                      {newUserError && (
                        <p className="text-sm text-red-600">{newUserError}</p>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsNewUser(false)}
                        >
                          Back
                        </Button>
                        <Button
                          className="bg-success hover:bg-success/90 text-white"
                          disabled={creatingUser}
                          onClick={handleCreateNewUser}
                        >
                          {creatingUser ? "Creating..." : "Create & Continue"}
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ── Step 2: Products ────────────────────────────────────────── */}
              {step === "products" && (
                <div className="space-y-4">
                  {createdPassword && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg px-3 py-2 text-sm">
                      <p className="font-semibold text-yellow-800">
                        New patient created — save this password:
                      </p>
                      <p className="font-mono text-yellow-900 mt-1 select-all">
                        {createdPassword}
                      </p>
                      <p className="text-xs text-yellow-700 mt-1">
                        This will not be shown again.
                      </p>
                    </div>
                  )}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <input
                      className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                      placeholder="Search product..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                    />
                  </div>

                  <div className="border rounded-lg divide-y max-h-40 overflow-y-auto">
                    {filteredProducts.length === 0 ? (
                      <p className="px-4 py-3 text-sm text-muted-foreground">
                        No products found.
                      </p>
                    ) : (
                      filteredProducts.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => addProductToOrder(p)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-secondary transition-colors flex justify-between items-center"
                        >
                          <span className="font-medium">{p.name}</span>
                          <span className="text-success text-xs">
                            <Plus size={14} />
                          </span>
                        </button>
                      ))
                    )}
                  </div>

                  {orderItems.length > 0 && (
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary text-muted-foreground">
                          <tr>
                            <th className="px-3 py-2 text-left">Product</th>
                            <th className="px-3 py-2 text-left">Unit</th>
                            <th className="px-3 py-2 text-right">Price</th>
                            <th className="px-3 py-2 text-center">Qty</th>
                            <th className="px-3 py-2" />
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {orderItems.map((item, idx) => (
                            <tr key={idx}>
                              <td className="px-3 py-2 font-medium">
                                {item.productName}
                              </td>
                              <td className="px-3 py-2">
                                {item.availableUnits.length > 1 ? (
                                  <select
                                    value={item.unitType}
                                    onChange={(e) =>
                                      updateOrderItemUnit(idx, e.target.value)
                                    }
                                    className="border rounded px-1.5 py-1 text-sm outline-none focus:ring-1 focus:ring-success/20"
                                  >
                                    {item.availableUnits.map((u) => (
                                      <option
                                        key={u.unitType}
                                        value={u.unitType}
                                      >
                                        {u.unitType}
                                      </option>
                                    ))}
                                  </select>
                                ) : (
                                  <span className="text-muted-foreground">
                                    {item.unitType}
                                  </span>
                                )}
                              </td>
                              <td className="px-3 py-2 text-right text-muted-foreground">
                                ${Number(item.unitPrice).toFixed(2)}
                              </td>
                              <td className="px-3 py-2">
                                <input
                                  type="number"
                                  min="1"
                                  className="w-16 border rounded px-2 py-1 text-sm text-center outline-none focus:ring-1 focus:ring-success/20"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateOrderItemQty(idx, e.target.value)
                                  }
                                />
                              </td>
                              <td className="px-3 py-2 text-center">
                                <button
                                  onClick={() => removeOrderItem(idx)}
                                  className="text-red-400 hover:text-red-600"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="px-4 py-2 bg-secondary text-right text-sm font-bold">
                        Total: ${orderTotal.toFixed(2)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── Step 3: Details ──────────────────────────────────────────── */}
              {step === "details" && (
                <div className="space-y-4">
                  <p className="text-sm font-semibold text-foreground">
                    Shipping Address
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {(["province", "district", "ward", "detail"] as const).map(
                      (field) => (
                        <div
                          key={field}
                          className={field === "detail" ? "col-span-2" : ""}
                        >
                          <label className="block text-xs text-muted-foreground mb-1 capitalize">
                            {field}
                          </label>
                          <input
                            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                            value={shippingAddress[field]}
                            onChange={(e) =>
                              setShippingAddress((a) => ({
                                ...a,
                                [field]: e.target.value,
                              }))
                            }
                          />
                        </div>
                      ),
                    )}
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">
                      Payment Method
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-success/20 focus:border-success"
                      value={paymentMethod}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                    >
                      {(
                        [
                          "CASH",
                          "CARD",
                          "ONLINE",
                          "INSURANCE",
                        ] as PaymentMethod[]
                      ).map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Summary */}
                  <div className="bg-secondary rounded-lg p-3 text-sm space-y-1">
                    <p>
                      <span className="text-muted-foreground">Patient:</span>{" "}
                      <span className="font-medium">
                        {selectedUser?.fullName} ({selectedUser?.email})
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Items:</span>{" "}
                      <span className="font-medium">
                        {orderItems.length} product(s)
                      </span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Total:</span>{" "}
                      <span className="font-bold text-success">
                        ${orderTotal.toFixed(2)}
                      </span>
                    </p>
                  </div>

                  {submitError && (
                    <p className="text-sm text-red-600">{submitError}</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal footer nav */}
            <div className="flex justify-between px-6 py-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  if (step === "user") closeNewOrder();
                  else if (step === "products") setStep("user");
                  else setStep("products");
                }}
              >
                {step === "user" ? "Cancel" : "Back"}
              </Button>
              <Button
                className="bg-success hover:bg-success/90 text-white"
                disabled={
                  (step === "user" && !selectedUser) ||
                  (step === "products" && orderItems.length === 0) ||
                  submitting
                }
                onClick={() => {
                  if (step === "user") setStep("products");
                  else if (step === "products") setStep("details");
                  else handleSubmitOrder();
                }}
              >
                {step === "details"
                  ? submitting
                    ? "Creating..."
                    : "Create Order"
                  : "Next"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
