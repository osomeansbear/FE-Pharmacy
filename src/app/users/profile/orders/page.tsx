"use client";

import OrderTable from "@/components/desktop/user/profile/OrderTable";
import { useEffect, useState } from "react";
import { fetchMyOrders } from "../../../../../api/orders.api";
import { OrderListType } from "../../../../../types/orderTypes";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderListType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await fetchMyOrders();
        setOrders(data);
      } catch {
        setError("Unable to load orders.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  if (loading) {
    return <div className="p-4 text-sm text-slate-500">Loading orders...</div>;
  }

  if (error) {
    return <div className="p-4 text-sm text-red-600">{error}</div>;
  }

  return <OrderTable orders={orders}></OrderTable>;
}
