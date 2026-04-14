"use client";

import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { AlertCircle, ImagePlus, Loader2, X } from "lucide-react";
import { Brand } from "../../../../../types/brandTypes";
import { Category } from "../../../../../types/categoryTypes";

export interface ProductFormData {
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

interface ProductFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  form: ProductFormData;
  brands: Brand[];
  categories: Category[];
  submitting: boolean;
  formError: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onStockChange: (value: number) => void;
  onImageChange: (index: number, value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onToggleCategory: (categoryId: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function ProductFormModal({
  open,
  mode,
  form,
  brands,
  categories,
  submitting,
  formError,
  onChange,
  onStockChange,
  onImageChange,
  onAddImage,
  onRemoveImage,
  onToggleCategory,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl border border-border w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-foreground">
            {mode === "create" ? "Add New Product" : "Edit Product"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 py-4 space-y-4">
          {formError && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              <AlertCircle size={14} />
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={onChange}
                placeholder="e.g. Amoxicillin 500mg"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="slug" className="text-sm font-medium text-foreground">
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
                onChange={onChange}
                placeholder={slugify(form.name) || "auto-generated-slug"}
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="brandId" className="text-sm font-medium text-foreground">
                Brand
              </label>
              <select
                id="brandId"
                name="brandId"
                value={form.brandId}
                onChange={onChange}
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
              <label htmlFor="stock" className="text-sm font-medium text-foreground">
                Stock (units)
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                min={0}
                value={form.stock}
                onChange={(e) => onStockChange(parseInt(e.target.value, 10) || 0)}
                placeholder="0"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="shortDesc" className="text-sm font-medium text-foreground">
              Short Description
            </label>
            <textarea
              id="shortDesc"
              name="shortDesc"
              rows={2}
              value={form.shortDesc}
              onChange={onChange}
              placeholder="Brief product description..."
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Categories</label>
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
                      onChange={() => onToggleCategory(cat.id)}
                      className="h-4 w-4 rounded border-border text-success focus:ring-success"
                    />
                    <span className="text-sm text-foreground">
                      {cat.parentId && (
                        <span className="text-muted-foreground mr-1">-</span>
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
                    onChange={(e) => onImageChange(index, e.target.value)}
                    placeholder={`Image URL ${index + 1}`}
                    className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 w-9 p-0 text-red-500 shrink-0"
                    onClick={() => onRemoveImage(index)}
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
                onClick={onAddImage}
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
                onChange={onChange}
                className="h-4 w-4 rounded border-border text-success focus:ring-success"
              />
              <span className="text-sm text-foreground">Requires Prescription</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={onChange}
                className="h-4 w-4 rounded border-border text-success focus:ring-success"
              />
              <span className="text-sm text-foreground">Active</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-success hover:bg-success/90 text-white"
              disabled={submitting}
            >
              {submitting && <Loader2 size={16} className="mr-2 animate-spin" />}
              {mode === "create" ? "Create Product" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
