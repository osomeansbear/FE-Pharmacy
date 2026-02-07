"use client";

import ProductsTable from "@/components/desktop/admin/products/ProductsTable";

export default function ProductsPage() {
  return (
    <>
      {/* Desktop */}
      <div className="hidden md:block">
        <ProductsTable />
      </div>
      {/* Mobile */}
      <div className="block md:hidden"></div>
    </>
  );
}
