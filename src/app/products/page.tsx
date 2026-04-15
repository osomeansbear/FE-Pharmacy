"use client";

import { Suspense } from "react";
import CategoryList from "@/components/main/product/CategoryList";
import ProductCard from "@/components/main/product/ProductCard";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../../api/products.api";
import { Product } from "../../../types/productTypes";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 12;

function ShopPageContent() {
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1);
  }, [selectedCategory]);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          {currentItems.map((prod) => (
            <ProductCard key={prod.id} item={prod} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-800">
                {startIndex + 1}–{Math.min(startIndex + ITEMS_PER_PAGE, products.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-800">{products.length}</span>{" "}
              products
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft size={16} />
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 p-0 ${currentPage === page ? "bg-success hover:bg-success/90" : ""}`}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}
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
