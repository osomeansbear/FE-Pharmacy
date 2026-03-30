"use client";

import ProductCard from "@/components/main/product/ProductCard";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchAllProducts } from "../../../api/products.api";
import { Product } from "../../../types/productTypes";

export default function HomePage() {
  // Taking the first 4 products for the "Trending" section
  const [products, setProducts] = useState<Product[]>([]);
  const trendingProducts = products.slice(0, 4);
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

  const categories = [
    { title: "Pain Relief", desc: "Analgesics and anti-inflammatories" },
    { title: "Cold & Flu", desc: "Cough syrups, decongestants" },
    { title: "Vitamins", desc: "Daily supplements" },
    { title: "First Aid", desc: "Bandages, antiseptics" },
  ];

  return (
    <main className="min-h-screen">
      {/* --- Hero Section --- */}
      <div className="w-full bg-success py-20 px-32 text-center text-white overflow-hidden rounded-b-[40px] ">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-6xl font-bold">PharmaCore</h1>
          <p className="text-lg text-white">
            Expert pharmaceutical care combined with advanced AI assistant,
            delivered to your door.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button className="bg-white/90 text-success hover:bg-white rounded-full px-8 py-6 text-md font-bold ">
              Shop Medicines
            </Button>
            <Button className="bg-red-900/80 hover:bg-red-900 text-white rounded-full px-8 py-6 text-md font-bold">
              Check Symptoms
            </Button>
          </div>
        </div>
      </div>

      {/* --- Browse Categories --- */}
      <section className="py-16 px-6 md:px-20 lg:px-32">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Browse Categories
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-white p-6 rounded-2xl border cursor-pointer group flex flex-col gap-1"
            >
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-success transition-colors">
                {cat.title}
              </h3>
              <p className="text-slate-500 text-sm ">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Trending Products --- */}
      <div className="py-8 pb-20 px-32 flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">
            Trending Products
          </h2>
          <Link
            href="/products"
            className="text-primary font-semibold flex items-center gap-1 hover:underline"
          >
            View All <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-4 w-full gap-4">
          {products.map((prod) => {
            return <ProductCard key={prod.id} item={prod}></ProductCard>;
          })}
        </div>
      </div>
    </main>
  );
}
