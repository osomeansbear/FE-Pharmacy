"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import axiosInstance from "../../../../config/axios";
import apiEndpoints from "../../../../api/apiEndpoints";

// --- MOCK DATA ---
// const categories = [
//   "All Products",
//   "Pain Relief",
//   "Cold & Flu",
//   "Vitamins",
//   "First Aid",
// ];

interface Category {
  id: number;
  name: string;
  description?: string;
  created_at?: string;
}

const products = [
  {
    id: "p1",
    brand: "HEALTHGUARD",
    name: "Acetaminophen Extra Strength",
    category: "Pain Relief",
    desc: "Effective pain reliever and fever reducer.",
    price: 12.99,
  },
  {
    id: "p2",
    brand: "RELIEFMAX",
    name: "Ibuprofen Liqui-Gels",
    category: "Pain Relief",
    desc: "Fast acting relief for muscle aches and headaches.",
    price: 15.49,
  },
  {
    id: "p3",
    brand: "COMFORTNIGHT",
    name: "Nighttime Flu Syrup",
    category: "Cold & Flu",
    desc: "Relieves coughing, runny nose, and sneezing.",
    price: 18.99,
  },
  {
    id: "p4",
    brand: "CLEARAIR",
    name: "Nasal Decongestant Spray",
    category: "Cold & Flu",
    desc: "Instant relief for blocked noses.",
    price: 9.99,
  },
  {
    id: "p5",
    brand: "DAILYVITAL",
    name: "Vitamin C 1000mg",
    category: "Vitamins",
    desc: "Supports immune system health.",
    price: 11.5,
  },
  {
    id: "p6",
    brand: "HEALFAST",
    name: "Antiseptic Cream",
    category: "First Aid",
    desc: "Prevents infection in minor cuts and burns.",
    price: 7.25,
  },
  {
    id: "p7",
    brand: "HEALTHGUARD",
    name: "Aspirin 81mg Low Dose",
    category: "Pain Relief",
    desc: "For temporary relief of minor aches and pains.",
    price: 8.99,
  },
  {
    id: "p8",
    brand: "NATUREBEST",
    name: "Multivitamin Gummies",
    category: "Vitamins",
    desc: "Essential daily vitamins in a tasty gummy.",
    price: 14.99,
  },
  {
    id: "p9",
    brand: "FIRSTAIDPRO",
    name: "Adhesive Bandages",
    category: "First Aid",
    desc: "Assorted sizes for minor cuts and scrapes.",
    price: 5.99,
  },
];

export default function ShopPage() {
  // --- STATE ---
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchAllCategories = async () => {
    try {
      const data = await axiosInstance.get<any, Category[]>(
        apiEndpoints.category.getAllCategories
      );

      setCategories(data);
    } catch (error) {
      console.error("Lỗi:", error);
    }
  };
  // --- FILTERING ---
  const filteredProducts = useMemo(() => {
    if (activeCategory === "All Products") return products;
    return products.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  // Reset to page 1 when category changes
  useEffect(() => {
    fetchAllCategories();
    setCurrentPage(1);
  }, [activeCategory]);

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* --- Sidebar: Categories --- */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl p-4 sticky top-24">
            <h2 className="font-bold text-lg mb-4 px-2">Categories</h2>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setActiveCategory(cat.name)}
                    className={cn(
                      "w-full text-left px-4 py-2.5 rounded-lg font-medium transition-colors"
                      // activeCategory === cat
                      //   ? "bg-green-800 text-white"
                      //   : "text-slate-600 hover:bg-slate-100"
                    )}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* --- Main Content: Product Grid & Pagination --- */}
        <section className="flex-1 flex flex-col">
          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 flex-1">
            {currentItems.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
              >
                {/* Product Image Placeholder */}
                <div className="relative h-56 w-full bg-slate-200 flex items-center justify-center text-slate-400 italic">
                  {/* Replace with <Image src={product.imgUrl} ... /> */}
                  <p className="text-center px-4">Image of {product.name}</p>
                </div>

                {/* Product Details */}
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-[11px] font-bold text-pink-700 uppercase tracking-wider">
                    {product.brand}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1 leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2 flex-1">
                    {product.desc}
                  </p>

                  {/* Footer: Price & Add Button */}
                  <div className="mt-6 flex justify-between items-end">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">
                        Price
                      </p>
                      <p className="text-xl font-bold text-slate-900">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                    <Button
                      size="icon"
                      className="bg-green-800 hover:bg-[#002b1f] text-white rounded-full h-10 w-10 shadow-sm"
                    >
                      <Plus size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* --- Pagination Controls --- */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 py-4 border-t border-slate-200">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "h-8 w-8 p-0 border-slate-200",
                        currentPage === page
                          ? "bg-green-800 text-white hover:bg-[#002b1f]"
                          : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      {page}
                    </Button>
                  )
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
