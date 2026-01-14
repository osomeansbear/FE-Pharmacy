"use client";

import Image from "next/image";
import Link from "next/link";
import { Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products } from "@/constants/mockData"; // Using the 30 mock data we created

export default function HomePage() {
  // Taking the first 4 products for the "Trending" section
  const trendingProducts = products.slice(0, 4);

  const categories = [
    { title: "Pain Relief", desc: "Analgesics and anti-inflammatories" },
    { title: "Cold & Flu", desc: "Cough syrups, decongestants" },
    { title: "Vitamins", desc: "Daily supplements" },
    { title: "First Aid", desc: "Bandages, antiseptics" },
  ];

  return (
    <main className="min-h-screen bg-slate-50">
      {/* --- Hero Section --- */}
      <section className="relative w-full bg-green-800 py-20 px-6 md:px-20 lg:px-32 text-center text-white overflow-hidden rounded-b-[40px] shadow-lg">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Healthcare Reimagined
          </h1>
          <p className="text-lg text-emerald-100/80 leading-relaxed">
            Expert pharmaceutical care combined with advanced AI diagnostics,
            delivered to your door.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Button className="bg-white text-green-800 hover:bg-slate-100 rounded-full px-8 py-6 text-md font-bold shadow-md">
              Shop Medicines
            </Button>
            <Button className="bg-[#7a2e3b] hover:bg-[#63242f] text-white rounded-full px-8 py-6 text-md font-bold shadow-md">
              Check Symptoms
            </Button>
          </div>
        </div>
        {/* Background Decorative Element (Optional) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/pills.png')]" />
      </section>

      {/* --- Browse Categories --- */}
      <section className="py-16 px-6 md:px-20 lg:px-32">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Browse Categories
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
            >
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-success transition-colors">
                {cat.title}
              </h3>
              <p className="text-slate-500 text-sm mt-1">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- Trending Products --- */}
      <section className="py-8 pb-20 px-6 md:px-20 lg:px-32">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Trending Products
          </h2>
          <Link
            href="/shop"
            className="text-success font-semibold flex items-center gap-1 hover:underline"
          >
            View All <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {trendingProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
            >
              {/* Product Image Placeholder */}
              <div className="relative h-60 w-full bg-slate-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400 italic">
                  Image of {product.name}
                </div>
                {/* Use real images here: <Image src={product.img} fill className="object-cover" alt={product.name} /> */}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <span className="text-[10px] font-bold text-pink-700 uppercase tracking-widest">
                  {product.manufacturer}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2 leading-tight">
                  {product.name}
                </h3>
                <p className="text-slate-500 text-xs mt-2 line-clamp-2">
                  Effective relief and recovery. Always consult with our AI
                  assistant or a pharmacist.
                </p>

                <div className="mt-auto pt-6 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium uppercase">
                      Price
                    </p>
                    <p className="text-xl font-bold text-slate-900">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    size="icon"
                    className="bg-green-800 hover:bg-success text-white rounded-full h-12 w-12"
                  >
                    <Plus size={24} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
