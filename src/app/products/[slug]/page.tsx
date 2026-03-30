"use client";

import ProductDetail from "@/components/main/product/ProductDetail";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getProductBySlug } from "../../../../api/products.api";
import type { ProductDetail as ProductDetailType } from "../../../../types/productTypes";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!params?.slug) {
        router.replace("/products");
        return;
      }

      setLoading(true);
      setError("");
      try {
        const res = await getProductBySlug(params.slug);
        setProduct(res);
      } catch (err) {
        const status = (err as { response?: { status?: number } }).response
          ?.status;
        if (status === 404) {
          router.replace("/products");
          return;
        }
        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params?.slug, router]);

  if (loading) {
    return <div className="min-h-screen px-12 py-8">Loading product...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {error && <p className="px-12 pt-8 text-sm text-red-600">{error}</p>}
      <ProductDetail product={product} />
    </div>
  );
}
