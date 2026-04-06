"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import TablePageHeader from "../shared/TablePageHeader";
import TablePagination from "../shared/TablePagination";
import TableSearchBar from "../shared/TableSearchBar";
import ProductFormModal, { ProductFormData } from "./ProductFormModal";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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
      <TablePageHeader
        title="Products Inventory"
        description="Monitor stock levels and manage medication details."
        addLabel="Add Product"
        onAdd={openCreateModal}
      />

      <TableSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search medication..."
      />

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
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
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
                  <tr key={product.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.brandName || getBrandName(product.brandId)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{product.slug}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={product.stock < 50 ? "text-red-500 font-bold" : ""}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.requiresRx ? "destructive" : "secondary"}>
                        {product.requiresRx ? "Required" : "No"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-success">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            product.isActive ? "bg-success" : "bg-muted-foreground"
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
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  No results found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      <ProductFormModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        brands={brands}
        categories={categories}
        submitting={submitting}
        formError={formError}
        onChange={handleFormChange}
        onStockChange={(value) => setForm((prev) => ({ ...prev, stock: value }))}
        onImageChange={handleImageChange}
        onAddImage={addImageField}
        onRemoveImage={removeImageField}
        onToggleCategory={toggleCategory}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />

      <DeleteConfirmModal
        open={deleteConfirmOpen && !!deletingProduct}
        entityLabel="Product"
        entityName={deletingProduct?.name ?? ""}
        deleting={deleting}
        onConfirm={handleDelete}
        onCancel={closeDeleteConfirm}
      />
    </div>
  );
}
