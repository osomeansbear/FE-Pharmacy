"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const categories = [
  { name: "OTC Medicines", slug: "otc-medicines", desc: "Over-the-counter medicines, no prescription needed" },
  { name: "Prescription", slug: "prescription-drugs", desc: "Prescription-only drugs prescribed by a doctor" },
  { name: "Acne", slug: "acne-treatment", desc: "Treatments for acne and skin blemishes" },
  { name: "General Health", slug: "general-health", desc: "Everyday health and wellness products" },
];

export default function HomePage() {
  const router = useRouter();

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
            <Button
              onClick={() => router.push("/products")}
              className="bg-white/90 text-success hover:bg-white rounded-full px-8 py-6 text-md font-bold "
            >
              Shop Medicines
            </Button>
            <Button
              onClick={() => router.push("/ai-assistant")}
              className="bg-red-900/80 hover:bg-red-900 text-white rounded-full px-8 py-6 text-md font-bold"
            >
              Check Symptoms
            </Button>
          </div>
        </div>
      </div>

      {/* --- Browse Categories --- */}
      <section className="py-16 px-6 md:px-20 lg:px-32 pb-20">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Browse Categories
          </h2>
        </div>
        <div className="grid grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="bg-white p-6 rounded-2xl border cursor-pointer group flex flex-col gap-1"
            >
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-success transition-colors">
                {cat.name}
              </h3>
              <p className="text-slate-500 text-sm">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
