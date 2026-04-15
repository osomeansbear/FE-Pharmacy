"use client";

import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { AlertCircle, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react";
import { Brand } from "../../../../../types/brandTypes";
import { Category } from "../../../../../types/categoryTypes";

export interface UnitFormData {
  id?: number;
  unitType: "TABLET" | "BOX";
  price: string;
  conversionFactor: string;
  isDefault: boolean;
}

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
  units: UnitFormData[];
  description: string;
  usage: string;
  ingredients: string;
}

interface ProductFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  form: ProductFormData;
  brands: Brand[];
  categories: Category[];
  submitting: boolean;
  formError: string;
  onChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  onStockChange: (value: number) => void;
  onImageChange: (index: number, value: string) => void;
  onAddImage: () => void;
  onRemoveImage: (index: number) => void;
  onToggleCategory: (categoryId: number) => void;
  onAddUnit: () => void;
  onRemoveUnit: (index: number) => void;
  onUnitChange: (
    index: number,
    field: keyof UnitFormData,
    value: string | boolean,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

const inputCls =
  "w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all";

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
  onAddUnit,
  onRemoveUnit,
  onUnitChange,
  onSubmit,
  onClose,
}: ProductFormModalProps) {
  if (!open) return null;

  const sectionLabel = (text: string) => (
    <div className="pt-2 pb-1 border-t">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {text}
      </p>
    </div>
  );

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
            className="text-muted-foreground hover:text-foreground transition-colors"
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
                onChange={onChange}
                placeholder="e.g. Amoxicillin 500mg"
                className={inputCls}
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
                onChange={onChange}
                placeholder={slugify(form.name) || "auto-generated-slug"}
                className={inputCls}
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
                onChange={onChange}
                className={inputCls}
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
                  onStockChange(parseInt(e.target.value, 10) || 0)
                }
                placeholder="0"
                className={inputCls}
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
              onChange={onChange}
              placeholder="Brief product description..."
              className={`${inputCls} resize-none`}
            />
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
              <span className="text-sm text-foreground">
                Requires Prescription
              </span>
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

          {sectionLabel("Categories")}
          <div className="space-y-1.5">
            <div className="border rounded-lg p-3 max-h-36 overflow-y-auto space-y-2">
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
                        <span className="text-muted-foreground mr-1">—</span>
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

          {sectionLabel("Pricing Units")}
          <div className="space-y-2">
            {form.units.length === 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
                At least one unit is required for the product to be purchasable.
              </p>
            )}

            {form.units.map((unit, idx) => (
              <div
                key={idx}
                className="grid grid-cols-[120px_1fr_1fr_auto_auto] items-center gap-2 bg-secondary/30 rounded-lg px-3 py-2"
              >
                <select
                  value={unit.unitType}
                  onChange={(e) =>
                    onUnitChange(idx, "unitType", e.target.value)
                  }
                  className="px-2 py-1.5 border rounded text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none"
                >
                  <option value="TABLET">Tablet</option>
                  <option value="BOX">Box</option>
                </select>

                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Price (VND)</p>
                  <input
                    type="text"
                    value={unit.price}
                    onChange={(e) => onUnitChange(idx, "price", e.target.value)}
                    placeholder="e.g. 5000"
                    className="w-full px-2 py-1.5 border rounded text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none"
                  />
                </div>

                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground">Conv. factor</p>
                  <input
                    type="text"
                    value={unit.conversionFactor}
                    onChange={(e) =>
                      onUnitChange(idx, "conversionFactor", e.target.value)
                    }
                    placeholder="e.g. 1"
                    className="w-full px-2 py-1.5 border rounded text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none"
                  />
                </div>

                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={unit.isDefault}
                    onChange={(e) =>
                      onUnitChange(idx, "isDefault", e.target.checked)
                    }
                    className="h-4 w-4 rounded border-border text-success focus:ring-success"
                  />
                  <span className="text-xs text-foreground">Default</span>
                </label>

                <button
                  type="button"
                  onClick={() => onRemoveUnit(idx)}
                  className="text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5 text-muted-foreground"
              onClick={onAddUnit}
            >
              <Plus size={14} /> Add Unit
            </Button>
          </div>

          {sectionLabel("Product Detail")}

          <div className="space-y-3">
            <div className="space-y-1.5">
              <label
                htmlFor="description"
                className="text-sm font-medium text-foreground"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={onChange}
                placeholder="Full product description..."
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="usage"
                className="text-sm font-medium text-foreground"
              >
                Usage / Dosage
              </label>
              <textarea
                id="usage"
                name="usage"
                rows={2}
                value={form.usage}
                onChange={onChange}
                placeholder="How to use this medication..."
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="ingredients"
                className="text-sm font-medium text-foreground"
              >
                Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                rows={2}
                value={form.ingredients}
                onChange={onChange}
                placeholder="Active and inactive ingredients..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          {sectionLabel("Images")}
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

          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
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
              {mode === "create" ? "Create Product" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
