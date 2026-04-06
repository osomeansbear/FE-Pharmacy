"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Package,
  Search,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchAllOrders } from "../../../../../api/orders.api";
import {
  ALL_STATUSES,
  AdminOrderStatus,
  getDisplayStatus,
  getStatusStyle,
  statusMap,
} from "../../../../../types/orderConstants";
import { OrderListType } from "../../../../../types/orderTypes";
import NewOrderModal from "./NewOrderModal";
import OrderDetailModal from "./OrderDetailModal";

export default function OrdersTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | "">("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orders, setOrders] = useState<OrderListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrderListType | null>(
    null,
  );
  const [showNewOrder, setShowNewOrder] = useState(false);

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

  const handleOrderUpdated = useCallback((updated: OrderListType) => {
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setSelectedOrder(updated);
  }, []);

  const handleOrderCreated = useCallback((created: OrderListType) => {
    setOrders((prev) => [created, ...prev]);
  }, []);

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
          onClick={() => setShowNewOrder(true)}
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
                      {formatVND(order.totalAmount || 0)}
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
                          onClick={() => setSelectedOrder(order)}
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

      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onOrderUpdated={handleOrderUpdated}
        />
      )}

      {showNewOrder && (
        <NewOrderModal
          onClose={() => setShowNewOrder(false)}
          onOrderCreated={handleOrderCreated}
        />
      )}
    </div>
  );
}
