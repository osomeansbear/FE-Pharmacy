"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchAllBrands } from "../../../../../api/brands.api";
import { fetchAllCategories } from "../../../../../api/categories.api";
import {
  createProduct,
  deleteProduct,
  fetchAllProducts,
  updateProduct,
} from "../../../../../api/products.api";
import { Brand } from "../../../../../types/brandTypes";
import { Category } from "../../../../../types/categoryTypes";
import { Product } from "../../../../../types/productTypes";

interface ProductFormData {
  name: string;
  slug: string;
  shortDesc: string;
  requiresRx: boolean;
  isActive: boolean;
  images: string[];
  brandId: string;
  categoryIds: number[];
  stock: number;
}

const emptyForm: ProductFormData = {
  name: "",
  slug: "",
  shortDesc: "",
  requiresRx: false,
  isActive: true,
  images: [""],
  brandId: "",
  categoryIds: [],
  stock: 0,
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export default function ProductsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllProducts();
      setProducts(data);
    } catch {
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadDropdownData = useCallback(async () => {
    try {
      const [brandsData, categoriesData] = await Promise.all([
        fetchAllBrands(),
        fetchAllCategories(),
      ]);
      setBrands(brandsData);
      setCategories(categoriesData);
    } catch {
      // Keep dropdowns empty if loading fails.
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadDropdownData();
  }, [loadProducts, loadDropdownData]);

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, endIndex);

  const getBrandName = (brandId: number | null): string => {
    if (!brandId) return "N/A";
    const brand = brands.find((b) => b.id === brandId);
    return brand ? brand.name : "N/A";
  };

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditingProductId(null);
    setModalMode("create");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setForm({
      name: product.name,
      slug: product.slug,
      shortDesc: product.shortDesc ?? "",
      requiresRx: product.requiresRx,
      isActive: product.isActive,
      images: product.image.length > 0 ? [...product.image] : [""],
      brandId: product.brandId ? String(product.brandId) : "",
      categoryIds: [],
      stock: product.stock,
    });
    setEditingProductId(product.id);
    setModalMode("edit");
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError("");
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (index: number, value: string) => {
    setForm((prev) => {
      const newImages = [...prev.images];
      newImages[index] = value;
      return { ...prev, images: newImages };
    });
  };

  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const removeImageField = (index: number) => {
    setForm((prev) => {
      const newImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: newImages.length > 0 ? newImages : [""] };
    });
  };

  const toggleCategory = (categoryId: number) => {
    setForm((prev) => {
      const exists = prev.categoryIds.includes(categoryId);
      return {
        ...prev,
        categoryIds: exists
          ? prev.categoryIds.filter((id) => id !== categoryId)
          : [...prev.categoryIds, categoryId],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Product name is required.");
      return;
    }

    const slug = form.slug.trim() || slugify(form.name);
    const cleanImages = form.images
      .map((img) => img.trim())
      .filter((img) => img.length > 0);

    const payload: Partial<Product> & { stock?: number } = {
      name: form.name.trim(),
      slug,
      shortDesc: form.shortDesc.trim() || null,
      requiresRx: form.requiresRx,
      isActive: form.isActive,
      image: cleanImages,
      brandId: form.brandId ? Number(form.brandId) : null,
      stock: form.stock,
    };

    try {
      setSubmitting(true);
      if (modalMode === "create") {
        await createProduct(payload);
      } else if (editingProductId !== null) {
        await updateProduct(editingProductId, payload);
      }
      closeModal();
      await loadProducts();
    } catch {
      setFormError(
        modalMode === "create"
          ? "Failed to create product. Please try again."
          : "Failed to update product. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirm = (product: Product) => {
    setDeletingProduct(product);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setDeletingProduct(null);
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;
    try {
      setDeleting(true);
      await deleteProduct(deletingProduct.id);
      closeDeleteConfirm();
      await loadProducts();
    } catch {
      setFormError("Failed to delete product.");
      closeDeleteConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Products Inventory
          </h1>
          <p className="text-muted-foreground">
            Monitor stock levels and manage medication details.
          </p>
        </div>
        <Button
          className="bg-success hover:bg-success/90 text-white gap-2 rounded-lg"
          onClick={openCreateModal}
        >
          <Plus size={18} /> Add Product
        </Button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary border-b text-muted-foreground font-medium">
            <tr>
              <th className="px-6 py-4">Product Name</th>
              <th className="px-6 py-4">Brand</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4 text-center">Stock</th>
              <th className="px-6 py-4">Rx</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Loading products...
                </td>
              </tr>
            )}

            {!!error && !loading && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && currentItems.length > 0
              ? currentItems.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">
                        {product.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.brandName || getBrandName(product.brandId)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{product.slug}</Badge>
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
                      <Badge
                        variant={
                          product.requiresRx ? "destructive" : "secondary"
                        }
                      >
                        {product.requiresRx ? "Required" : "No"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-success">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            product.isActive
                              ? "bg-success"
                              : "bg-muted-foreground"
                          }`}
                        />
                        {product.isActive ? "Active" : "Inactive"}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => openEditModal(product)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={() => openDeleteConfirm(product)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              : null}

            {!loading && !error && currentItems.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-secondary border-t gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              Showing{" "}
              <span className="font-medium text-foreground">
                {filteredProducts.length > 0 ? startIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(endIndex, filteredProducts.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredProducts.length}
              </span>{" "}
              results
            </div>

            <div className="flex items-center gap-2 border-l pl-4">
              <span className="whitespace-nowrap">Rows per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-transparent font-medium text-foreground focus:outline-none"
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
                    className={`h-8 w-8 p-0 ${currentPage === page ? "bg-success" : ""}`}
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />

          <div className="relative bg-white rounded-xl border border-border w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">
                {modalMode === "create" ? "Add New Product" : "Edit Product"}
              </h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-muted-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {formError && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className="text-sm font-medium text-foreground"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Amoxicillin 500mg"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="slug"
                    className="text-sm font-medium text-foreground"
                  >
                    Slug{" "}
                    <span className="text-muted-foreground font-normal">
                      (auto if empty)
                    </span>
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={form.slug}
                    onChange={handleFormChange}
                    placeholder={slugify(form.name) || "auto-generated-slug"}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="brandId"
                    className="text-sm font-medium text-foreground"
                  >
                    Brand
                  </label>
                  <select
                    id="brandId"
                    name="brandId"
                    value={form.brandId}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
                  >
                    <option value="">No brand selected</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="stock"
                    className="text-sm font-medium text-foreground"
                  >
                    Stock (units)
                  </label>
                  <input
                    id="stock"
                    name="stock"
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        stock: parseInt(e.target.value, 10) || 0,
                      }))
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="shortDesc"
                  className="text-sm font-medium text-foreground"
                >
                  Short Description
                </label>
                <textarea
                  id="shortDesc"
                  name="shortDesc"
                  rows={2}
                  value={form.shortDesc}
                  onChange={handleFormChange}
                  placeholder="Brief product description..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Categories
                </label>
                <div className="border rounded-lg p-3 max-h-40 overflow-y-auto space-y-2">
                  {categories.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No categories available. Create categories first.
                    </p>
                  ) : (
                    categories.map((cat) => (
                      <label
                        key={cat.id}
                        className="flex items-center gap-2 cursor-pointer hover:bg-secondary/50 rounded px-2 py-1"
                      >
                        <input
                          type="checkbox"
                          checked={form.categoryIds.includes(cat.id)}
                          onChange={() => toggleCategory(cat.id)}
                          className="h-4 w-4 rounded border-border text-success focus:ring-success"
                        />
                        <span className="text-sm text-foreground">
                          {cat.parentId && (
                            <span className="text-muted-foreground mr-1">
                              -
                            </span>
                          )}
                          {cat.name}
                        </span>
                      </label>
                    ))
                  )}
                </div>
                {form.categoryIds.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {form.categoryIds.length} category(ies) selected
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Product Images
                </label>
                <div className="space-y-2">
                  {form.images.map((img, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={img}
                        onChange={(e) =>
                          handleImageChange(index, e.target.value)
                        }
                        placeholder={`Image URL ${index + 1}`}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-9 w-9 p-0 text-red-500 shrink-0"
                        onClick={() => removeImageField(index)}
                        disabled={form.images.length === 1 && !img}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-muted-foreground"
                    onClick={addImageField}
                  >
                    <ImagePlus size={14} /> Add Another Image
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="requiresRx"
                    checked={form.requiresRx}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded border-border text-success focus:ring-success"
                  />
                  <span className="text-sm text-foreground">
                    Requires Prescription
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleFormChange}
                    className="h-4 w-4 rounded border-border text-success focus:ring-success"
                  />
                  <span className="text-sm text-foreground">Active</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-success hover:bg-success/90 text-white"
                  disabled={submitting}
                >
                  {submitting && (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  )}
                  {modalMode === "create" ? "Create Product" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmOpen && deletingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeDeleteConfirm}
          />

          <div className="relative bg-white rounded-xl border border-border w-full max-w-md mx-4">
            <div className="px-6 py-5 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <Trash2 size={18} className="text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Delete Product
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-foreground">
                      {deletingProduct.name}
                    </span>
                    ? This action cannot be undone.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDeleteConfirm}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting && (
                    <Loader2 size={16} className="mr-2 animate-spin" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
