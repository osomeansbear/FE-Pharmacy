"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { fetchAllBrands } from "../../../../../api/brands.api";
import { fetchAllCategories } from "../../../../../api/categories.api";
import {
  addProductUnit,
  assignProductCategory,
  createProduct,
  createProductDetail,
  deleteProduct,
  deleteProductUnit,
  fetchAllProducts,
  removeProductCategory,
  updateProduct,
  updateProductDetail,
  updateProductUnit,
} from "../../../../../api/products.api";
import { Brand } from "../../../../../types/brandTypes";
import { Category } from "../../../../../types/categoryTypes";
import { Product } from "../../../../../types/productTypes";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import TablePageHeader from "../shared/TablePageHeader";
import TablePagination from "../shared/TablePagination";
import TableSearchBar from "../shared/TableSearchBar";
import ProductFormModal, { ProductFormData, UnitFormData } from "./ProductFormModal";
import { slugify, toTitleCase } from "@/lib/utils";

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
  units: [],
  description: "",
  usage: "",
  ingredients: "",
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

  // track original state for edit-mode diff
  const [originalCategoryIds, setOriginalCategoryIds] = useState<number[]>([]);
  const [originalUnits, setOriginalUnits] = useState<UnitFormData[]>([]);

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
      // keep dropdowns empty if loading fails
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
    setOriginalCategoryIds([]);
    setOriginalUnits([]);
    setModalMode("create");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    const existingUnits: UnitFormData[] = (product.units ?? []).map((u) => ({
      id: u.id,
      unitType: u.unitType,
      price: u.price,
      conversionFactor: u.conversionFactor,
      isDefault: u.isDefault,
    }));
    const existingCategoryIds = product.categoryIds ?? [];

    setForm({
      name: product.name,
      slug: product.slug,
      shortDesc: product.shortDesc ?? "",
      requiresRx: product.requiresRx,
      isActive: product.isActive,
      images: product.image.length > 0 ? [...product.image] : [""],
      brandId: product.brandId ? String(product.brandId) : "",
      categoryIds: [...existingCategoryIds],
      stock: product.stock,
      units: existingUnits,
      description: "",
      usage: "",
      ingredients: "",
    });
    setOriginalCategoryIds(existingCategoryIds);
    setOriginalUnits(existingUnits);
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

  const handleAddUnit = () => {
    setForm((prev) => ({
      ...prev,
      units: [
        ...prev.units,
        {
          unitType: "TABLET",
          price: "",
          conversionFactor: "1",
          isDefault: prev.units.length === 0,
        },
      ],
    }));
  };

  const handleRemoveUnit = (index: number) => {
    setForm((prev) => {
      const newUnits = prev.units.filter((_, i) => i !== index);
      // ensure at least one default if any units remain
      if (newUnits.length > 0 && !newUnits.some((u) => u.isDefault)) {
        newUnits[0].isDefault = true;
      }
      return { ...prev, units: newUnits };
    });
  };

  const handleUnitChange = (
    index: number,
    field: keyof UnitFormData,
    value: string | boolean,
  ) => {
    setForm((prev) => {
      const newUnits = prev.units.map((u, i) => {
        if (i !== index) {
          // clear isDefault on all others when one is set
          return field === "isDefault" && value === true ? { ...u, isDefault: false } : u;
        }
        return { ...u, [field]: value };
      });
      return { ...prev, units: newUnits };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Product name is required.");
      return;
    }

    // Validate units
    for (const [idx, unit] of form.units.entries()) {
      if (!unit.price.trim() || !/^\d{1,12}(\.\d{1,2})?$/.test(unit.price.trim())) {
        setFormError(`Unit ${idx + 1}: price must be a positive number (e.g. 5000 or 5000.00).`);
        return;
      }
      if (!unit.conversionFactor.trim() || !/^\d{1,12}(\.\d{1,4})?$/.test(unit.conversionFactor.trim())) {
        setFormError(`Unit ${idx + 1}: conversion factor must be a positive number (e.g. 1 or 10.5).`);
        return;
      }
    }
    if (form.units.length > 0 && !form.units.some((u) => u.isDefault)) {
      setFormError("At least one unit must be marked as default.");
      return;
    }

    const slug = form.slug.trim() || slugify(form.name);
    const cleanImages = form.images.map((img) => img.trim()).filter(Boolean);

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

    const hasDetail =
      form.description.trim() || form.usage.trim() || form.ingredients.trim();

    try {
      setSubmitting(true);

      if (modalMode === "create") {
        const newProduct = await createProduct(payload);
        const productId = newProduct.id;

        // assign categories
        await Promise.all(
          form.categoryIds.map((catId) => assignProductCategory(productId, catId)),
        );

        // add units sequentially (BE enforces single-default via transaction)
        for (const unit of form.units) {
          await addProductUnit(productId, {
            unitType: unit.unitType,
            price: unit.price.trim(),
            conversionFactor: unit.conversionFactor.trim(),
            isDefault: unit.isDefault,
          });
        }

        // create detail if any field filled
        if (hasDetail) {
          await createProductDetail(productId, {
            description: form.description.trim() || null,
            usage: form.usage.trim() || null,
            ingredients: form.ingredients.trim() || null,
          });
        }
      } else if (editingProductId !== null) {
        await updateProduct(editingProductId, payload);

        // sync categories
        const addedCats = form.categoryIds.filter((id) => !originalCategoryIds.includes(id));
        const removedCats = originalCategoryIds.filter((id) => !form.categoryIds.includes(id));
        await Promise.all([
          ...addedCats.map((id) => assignProductCategory(editingProductId, id)),
          ...removedCats.map((id) => removeProductCategory(editingProductId, id)),
        ]);

        // sync units
        const removedUnits = originalUnits.filter(
          (ou) => ou.id !== undefined && !form.units.find((u) => u.id === ou.id),
        );
        const newUnits = form.units.filter((u) => u.id === undefined);
        const updatedUnits = form.units.filter((u) => u.id !== undefined);

        await Promise.all(
          removedUnits.map((u) => deleteProductUnit(editingProductId, u.id!)),
        );
        for (const unit of newUnits) {
          await addProductUnit(editingProductId, {
            unitType: unit.unitType,
            price: unit.price.trim(),
            conversionFactor: unit.conversionFactor.trim(),
            isDefault: unit.isDefault,
          });
        }
        await Promise.all(
          updatedUnits.map((u) =>
            updateProductUnit(editingProductId, u.id!, {
              price: u.price.trim(),
              conversionFactor: u.conversionFactor.trim(),
              isDefault: u.isDefault,
            }),
          ),
        );

        // update detail if any field filled
        if (hasDetail) {
          await updateProductDetail(editingProductId, {
            description: form.description.trim() || null,
            usage: form.usage.trim() || null,
            ingredients: form.ingredients.trim() || null,
          });
        }
      }

      closeModal();
      await loadProducts();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setFormError(
        modalMode === "create"
          ? `Failed to create product: ${msg}`
          : `Failed to update product: ${msg}`,
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
                      <div className="font-semibold text-foreground">{toTitleCase(product.name)}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {product.brandName || getBrandName(product.brandId)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{product.slug}</Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={product.stock < 50 ? "text-red-500 font-bold" : ""}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.requiresRx ? "destructive" : "secondary"}>
                        {product.requiresRx ? "Required" : "No"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div
                          className={`h-2 w-2 rounded-full ${
                            product.isActive ? "bg-success" : "bg-muted-foreground"
                          }`}
                        />
                        <span className={product.isActive ? "text-success" : "text-muted-foreground"}>
                          {product.isActive ? "Active" : "Inactive"}
                        </span>
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
        onAddUnit={handleAddUnit}
        onRemoveUnit={handleRemoveUnit}
        onUnitChange={handleUnitChange}
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
