"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatVND } from "@/lib/utils";
import { X } from "lucide-react";
import { useState } from "react";
import { updateOrderStatus } from "../../../../../api/orders.api";
import {
  AdminOrderStatus,
  getDisplayStatus,
  getStatusStyle,
  statusToApi,
  validTransitions,
} from "../../../../../types/orderConstants";
import { OrderListType } from "../../../../../types/orderTypes";

interface Props {
  order: OrderListType;
  onClose: () => void;
  onOrderUpdated: (order: OrderListType) => void;
}

export default function OrderDetailModal({
  order,
  onClose,
  onOrderUpdated,
}: Props) {
  const [newStatus, setNewStatus] = useState<AdminOrderStatus | "">("");
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const handleUpdateStatus = async () => {
    if (!newStatus) return;
    setUpdating(true);
    setUpdateError("");
    try {
      const updated = await updateOrderStatus(order.id, statusToApi[newStatus]);
      onOrderUpdated(updated);
      setNewStatus("");
    } catch {
      setUpdateError("Failed to update order status.");
    } finally {
      setUpdating(false);
    }
  };

  const displayStatus = getDisplayStatus(order.status);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              Order ORD-{order.id}
            </h2>
            <p className="text-sm text-muted-foreground">{order.userEmail}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div className="flex items-center gap-4">
            <Badge
              variant="outline"
              className={`font-medium py-0.5 ${getStatusStyle(displayStatus)}`}
            >
              {displayStatus}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Created: {new Date(order.createdAt).toLocaleDateString()}
            </span>
            <span className="text-sm text-muted-foreground">
              Updated: {new Date(order.updatedAt).toLocaleDateString()}
            </span>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Shipping Address
            </h3>
            <div className="bg-secondary rounded-lg p-3 text-sm text-muted-foreground">
              <p>{order.shippingAddress.detail}</p>
              <p>
                {order.shippingAddress.ward}, {order.shippingAddress.district}
              </p>
              <p>{order.shippingAddress.province}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Order Items ({order.items.length})
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
                  {order.items.map((item) => (
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
                          ? formatVND(item.unitPrice)
                          : "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-3 px-1">
              <span className="text-sm text-muted-foreground">
                Payment: {order.paymentMethod}
              </span>
              <span className="text-base font-bold text-foreground">
                Total: {formatVND(order.totalAmount || 0)}
              </span>
            </div>
          </div>

          {(validTransitions[order.status]?.length ?? 0) > 0 && (
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
                  {validTransitions[order.status]?.map((s) => (
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
          <Button variant="outline" onClick={onClose} className="rounded-lg">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}
