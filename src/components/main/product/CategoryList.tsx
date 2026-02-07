"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllCategories } from "../../../../api/categories.api";
import { Category } from "../../../../types/categoryTypes";

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const categoryNavigation = (slug: string) => {
    router.push(`/products?category=${slug}`);
  };
  const loadData = async () => {
    try {
      const res = await fetchAllCategories();

      setCategories(res);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div>Đang tải...</div>;

  return (
    <div className="bg-white w-full flex flex-col rounded-xl gap-2 p-2">
      <span className="font-bold text-2xl text-success">Category</span>

      {categories.map((cat) => {
        return (
          <div key={cat.id}>
            <Button
              className="bg-transparent w-full rounded-lg hover:bg-secondary hover:font-semibold"
              onClick={() => categoryNavigation(cat.slug)}
            >
              {cat.name}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
