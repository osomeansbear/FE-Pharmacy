"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Plus,
  AlertCircle,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/constants/mockData";

export default function ProductsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5); // Now a state variable

  // --- Search Logic ---
  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm]);

  // Reset to page 1 when search or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  return (
    <div className="p-8 space-y-6">
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Products Inventory
          </h1>
          <p className="text-muted-foreground">
            Monitor stock levels and manage medication details.
          </p>
        </div>
        <Button className="bg-success hover:bg-success/90 text-white gap-2  rounded-lg shadow-sm">
          <Plus size={18} /> Add Product
        </Button>
      </div>

      {/* Toolbar Section */}
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Search medication..."
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Table Section */}
      <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b text-slate-500 font-medium">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {currentItems.length > 0 ? (
              currentItems.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="font-semibold text-slate-900">
                      {product.name}
                    </div>
                    {product.rxRequired && (
                      <div className="flex items-center gap-1 text-[10px] text-amber-600 font-bold uppercase mt-1">
                        <AlertCircle size={10} /> Rx Required
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary">{product.category}</Badge>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={
                        product.stock < 50 ? "text-red-500 font-bold" : ""
                      }
                    >
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-success">
                      <div className="h-2 w-2 rounded-full bg-success" />{" "}
                      {product.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-blue-600 "
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 "
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* --- Updated Pagination Footer --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50 border-t gap-4">
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {/* Results shown text */}
            <div>
              Showing{" "}
              <span className="font-medium text-slate-900">
                {filteredProducts.length > 0 ? startIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium text-slate-900">
                {Math.min(endIndex, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-slate-900">
                {filteredProducts.length}
              </span>{" "}
              results
            </div>

            {/* Rows selection dropdown */}
            <div className="flex items-center gap-2 border-l pl-4">
              <span className="whitespace-nowrap">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-transparent font-medium text-slate-900 focus:outline-none "
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={`h-8 w-8 p-0 ${
                      currentPage === page ? "bg-success" : ""
                    }`}
                  >
                    {page}
                  </Button>
                ),
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
