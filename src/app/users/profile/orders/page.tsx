"use client";

import OrderTable from "@/components/desktop/user/profile/OrderTable";
import { useEffect, useState } from "react";
import { cancelOrder, fetchMyOrders, payOrder } from "../../../../../api/orders.api";
import { OrderListType } from "../../../../../types/orderTypes";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch(() => setError("Unable to load orders."))
      .finally(() => setLoading(false));
  }, []);

  const updateOrder = (updated: OrderListType) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === updated.id ? updated : o)),
    );
  };

  const handleCancel = async (orderId: number) => {
    setBusyOrderId(orderId);
    try {
      const updated = await cancelOrder(orderId);
      updateOrder(updated);
    } catch {
      setError("Unable to cancel order.");
    } finally {
      setBusyOrderId(null);
    }
  };

  const handlePay = async (orderId: number) => {
    setBusyOrderId(orderId);
    try {
      const updated = await payOrder(orderId);
      updateOrder(updated);
    } catch {
      setError("Unable to process payment.");
    } finally {
      setBusyOrderId(null);
    }
  };

  if (loading) {
    return <div className="p-4 text-sm text-slate-500">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-600">{error}</div>;
  }

  return (
    <OrderTable
      orders={orders}
      onCancel={handleCancel}
      onPay={handlePay}
      busyOrderId={busyOrderId}
    />
  );
}
