"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllCategories } from "../../../../api/categories.api";
import { Category } from "../../../../types/categoryTypes";

interface CategoryListProps {
  selectedCategory?: string;
}

export default function CategoryList({
  selectedCategory = "",
}: CategoryListProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  const categoryNavigation = (slug: string) => {
    router.push(`/products?category=${slug}`);
  };
  const loadData = async () => {
    setError("");
    try {
      const res = await fetchAllCategories();

      setCategories(res);
    } catch {
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white w-full flex flex-col rounded-xl gap-2 p-2">
      <span className="font-bold text-2xl text-success">Category</span>
      {error && <p className="text-sm text-red-600">{error}</p>}

      {categories.map((cat) => {
        const isSelected = selectedCategory === cat.slug;
        return (
          <div key={cat.id}>
            <Button
              className={`w-full rounded-lg hover:bg-secondary hover:font-semibold ${
                isSelected
                  ? "bg-secondary text-success font-semibold"
                  : "bg-transparent"
              }`}
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
