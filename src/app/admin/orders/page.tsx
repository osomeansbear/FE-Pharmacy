"use client";

import OrdersTable from "@/components/desktop/admin/orders/OrdersTable";

export default function OrdersPage() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <OrdersTable />
      </div>
      {/* Mobile */}
      <div className="block md:hidden"></div>
    </>
  );
}
