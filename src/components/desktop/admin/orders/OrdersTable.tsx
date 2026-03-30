"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Package,
  Printer,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../../../../api/orders.api";
import { OrderListType } from "../../../../../types/orderTypes";

type AdminOrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled"
  | "Returned";

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

export default function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orders, setOrders] = useState<OrderListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [selectedOrder, setSelectedOrder] = useState<OrderListType | null>(
    null,
  );
  const [newStatus, setNewStatus] = useState<AdminOrderStatus | "">("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      setError("");
      try {
        const data = await fetchAllOrders();
        setOrders(data);
      } catch {
        setError("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `ORD-${o.id}`.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, orders]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

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

  const getDisplayStatus = (apiStatus: string): AdminOrderStatus => {
    return statusMap[apiStatus] || "Pending";
  };

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
      const apiStatus = statusToApi[newStatus];
      const updated = await updateOrderStatus(selectedOrder.id, apiStatus);

      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o)),
      );
      setSelectedOrder(updated);
      setNewStatus("");
    } catch {
      setUpdateError("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  }, [selectedOrder, newStatus]);

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
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-lg">
            <Printer size={18} /> Export List
          </Button>
          <Button className="bg-success hover:bg-success/90 rounded-lg text-white gap-2">
            <Package size={18} /> New Order
          </Button>
        </div>
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
        <Button variant="outline" className="gap-2 text-muted-foreground">
          <Filter size={16} /> Filter Status
        </Button>
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary border-b text-muted-foreground font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Patient Name</th>
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
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">
                        {order.userEmail}
                      </span>
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
                        className={`font-medium py-0.5 ${getStatusStyle(
                          displayStatus,
                        )}`}
                      >
                        {displayStatus}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
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
                    className={`h-8 w-8 p-0 ${
                      currentPage === page ? "bg-success" : ""
                    }`}
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

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={closeOrderDetail}
        >
          <div
            className="bg-white rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
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
                className="text-muted-foreground hover:text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-6">
              {/* Status & Date */}
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className={`font-medium py-0.5 ${getStatusStyle(
                    getDisplayStatus(selectedOrder.status),
                  )}`}
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

              {/* Shipping Address */}
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

              {/* Order Items */}
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
                    Total: $
                    {Number(selectedOrder.totalAmount || 0).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Status Update */}
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

            {/* Modal Footer */}
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
    </div>
  );
}
