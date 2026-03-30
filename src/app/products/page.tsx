"use client";

import { Suspense } from "react";
import CategoryList from "@/components/main/product/CategoryList";
import ProductCard from "@/components/main/product/ProductCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../../api/products.api";
import { Product } from "../../../types/productTypes";

function ShopPageContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const filters = selectedCategory ? { category: selectedCategory } : {};
      const res = await fetchAllProducts(filters);
      setProducts(res);
    } catch {
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCategory]);

  if (loading) return <div>Waiting for Products</div>;

  return (
    <div className="flex items-start gap-8 px-4 py-4">
      <div className="min-w-2xs sticky top-20">
        <CategoryList selectedCategory={selectedCategory}></CategoryList>
      </div>
      <div className="w-full">
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {!error && !products.length && (
          <p className="text-sm text-slate-500">
            No products available right now.
          </p>
        )}

        <div className="grid grid-cols-3 w-full gap-4">
          {products.map((prod) => {
            return <ProductCard key={prod.id} item={prod}></ProductCard>;
          })}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div>Loading products...</div>}>
      <ShopPageContent />
    </Suspense>
  );
}
