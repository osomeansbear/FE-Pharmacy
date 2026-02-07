"use client";

import CategoryList from "@/components/main/product/CategoryList";
import ProductCard from "@/components/main/product/ProductCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../../api/products.api";
import { Product } from "../../../types/productTypes";

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const toProductDetail = (slug: string) => {
    router.push(`/products/${slug}`);
  };
  const loadData = async () => {
    try {
      const res = await fetchAllProducts();
      setProducts(res);
    } catch (error) {
      console.log("Fetch error", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div>Waiting for Products</div>;

  return (
    <div className="flex items-start gap-8 px-4 py-4">
      <div className="min-w-2xs sticky top-20">
        <CategoryList></CategoryList>
      </div>
      <div className="grid grid-cols-3 w-full gap-4">
        {products.map((prod) => {
          return <ProductCard key={prod.id} item={prod}></ProductCard>;
        })}
      </div>
    </div>
  );
}
