"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";
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
  const [expandedParentId, setExpandedParentId] = useState<number | null>(null);
  const router = useRouter();

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

  // Auto-expand parent when a child is selected
  useEffect(() => {
    if (!selectedCategory || !categories.length) return;
    const selected = categories.find((c) => c.slug === selectedCategory);
    if (selected?.parentId !== null && selected?.parentId !== undefined) {
      setExpandedParentId(selected.parentId);
    }
  }, [selectedCategory, categories]);

  if (loading) return <div>Loading...</div>;

  const parents = categories.filter((c) => c.parentId === null);
  const childrenOf = (parentId: number) =>
    categories.filter((c) => c.parentId === parentId);

  const handleParentClick = (parent: Category) => {
    const children = childrenOf(parent.id);
    if (children.length === 0) {
      // No children — navigate directly
      router.push(`/products?category=${parent.slug}`);
    } else {
      // Toggle expand/collapse
      setExpandedParentId((prev) => (prev === parent.id ? null : parent.id));
    }
  };

  const handleChildClick = (slug: string) => {
    router.push(`/products?category=${slug}`);
  };

  return (
    <div className="bg-white w-full flex flex-col rounded-xl gap-1 p-2">
      <span className="font-bold text-2xl text-success px-2 py-1">Category</span>
      {error && <p className="text-sm text-red-600 px-2">{error}</p>}

      {parents.map((parent) => {
        const children = childrenOf(parent.id);
        const isExpanded = expandedParentId === parent.id;
        const isParentActive =
          selectedCategory === parent.slug ||
          children.some((c) => c.slug === selectedCategory);

        return (
          <div key={parent.id}>
            <Button
              className={`w-full rounded-lg flex items-center justify-between px-3 hover:bg-secondary hover:font-semibold ${
                isParentActive
                  ? "bg-secondary text-success font-semibold"
                  : "bg-transparent text-foreground"
              }`}
              onClick={() => handleParentClick(parent)}
            >
              <span>{parent.name}</span>
              {children.length > 0 &&
                (isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </Button>

            {isExpanded && children.length > 0 && (
              <div className="flex flex-col gap-1 ml-3 mt-1">
                {children.map((child) => {
                  const isChildActive = selectedCategory === child.slug;
                  return (
                    <Button
                      key={child.id}
                      className={`w-full rounded-lg hover:bg-secondary hover:font-semibold text-sm ${
                        isChildActive
                          ? "bg-secondary text-success font-semibold"
                          : "bg-transparent text-foreground"
                      }`}
                      onClick={() => handleChildClick(child.slug)}
                    >
                      {child.name}
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
