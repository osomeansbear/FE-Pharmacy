"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  fetchAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "../../../../../api/brands.api";
import { Brand } from "../../../../../types/brandTypes";

interface BrandFormData {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
}

const emptyForm: BrandFormData = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

export default function BrandsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingBrandId, setEditingBrandId] = useState<number | null>(null);
  const [form, setForm] = useState<BrandFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState<Brand | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadBrands = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllBrands();
      setBrands(data);
    } catch {
      setError("Unable to load brands.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  const filteredBrands = brands.filter(
    (b) =>
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredBrands.slice(startIndex, endIndex);

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditingBrandId(null);
    setModalMode("create");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (brand: Brand) => {
    setForm({
      name: brand.name,
      slug: brand.slug,
      description: brand.description ?? "",
      logoUrl: brand.logoUrl ?? "",
    });
    setEditingBrandId(brand.id);
    setModalMode("edit");
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError("");
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Brand name is required.");
      return;
    }

    const slug = form.slug.trim() || slugify(form.name);

    try {
      setSubmitting(true);
      if (modalMode === "create") {
        const payload: CreateBrandPayload = {
          name: form.name.trim(),
          slug,
          description: form.description.trim() || null,
          logoUrl: form.logoUrl.trim() || null,
        };
        await createBrand(payload);
      } else if (editingBrandId !== null) {
        const payload: UpdateBrandPayload = {
          name: form.name.trim(),
          slug,
          description: form.description.trim() || null,
          logoUrl: form.logoUrl.trim() || null,
        };
        await updateBrand(editingBrandId, payload);
      }
      closeModal();
      await loadBrands();
    } catch {
      setFormError(
        modalMode === "create"
          ? "Failed to create brand. Please try again."
          : "Failed to update brand. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirm = (brand: Brand) => {
    setDeletingBrand(brand);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setDeletingBrand(null);
  };

  const handleDelete = async () => {
    if (!deletingBrand) return;
    try {
      setDeleting(true);
      await deleteBrand(deletingBrand.id);
      closeDeleteConfirm();
      await loadBrands();
    } catch {
      setFormError("Failed to delete brand.");
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
            Brands Management
          </h1>
          <p className="text-muted-foreground">
            Manage pharmaceutical brands and manufacturers.
          </p>
        </div>
        <Button
          className="bg-success hover:bg-success/90 text-white gap-2 rounded-lg"
          onClick={openCreateModal}
        >
          <Plus size={18} /> Add Brand
        </Button>
      </div>

      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <input
          type="text"
          placeholder="Search brands..."
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
              <th className="px-6 py-4">Brand Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Description</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Loading brands...
                </td>
              </tr>
            )}

            {!!error && !loading && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-red-600">
                  {error}
                </td>
              </tr>
            )}

            {!loading && !error && currentItems.length > 0
              ? currentItems.map((brand) => (
                  <tr
                    key={brand.id}
                    className="hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {brand.logoUrl ? (
                          <img
                            src={brand.logoUrl}
                            alt={brand.name}
                            className="h-8 w-8 rounded object-contain border"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground">
                            {brand.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-foreground">
                          {brand.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{brand.slug}</Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                      {brand.description || "N/A"}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => openEditModal(brand)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={() => openDeleteConfirm(brand)}
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
                  colSpan={4}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  No brands found
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
                {filteredBrands.length > 0 ? startIndex + 1 : 0}
              </span>{" "}
              to{" "}
              <span className="font-medium text-foreground">
                {Math.min(endIndex, filteredBrands.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {filteredBrands.length}
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
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeModal}
          />

          <div className="relative bg-white rounded-xl border border-border w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-foreground">
                {modalMode === "create" ? "Add New Brand" : "Edit Brand"}
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
                  onChange={handleFormChange}
                  placeholder="e.g. Pfizer"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="slug" className="text-sm font-medium text-foreground">
                  Slug{" "}
                  <span className="text-muted-foreground font-normal">
                    (auto-generated if empty)
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

              <div className="space-y-1.5">
                <label htmlFor="description" className="text-sm font-medium text-foreground">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleFormChange}
                  placeholder="Brief brand description..."
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="logoUrl" className="text-sm font-medium text-foreground">
                  Logo URL
                </label>
                <input
                  id="logoUrl"
                  name="logoUrl"
                  type="text"
                  value={form.logoUrl}
                  onChange={handleFormChange}
                  placeholder="https://example.com/logo.png"
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
                />
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
                  {modalMode === "create" ? "Create Brand" : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirmOpen && deletingBrand && (
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
                    Delete Brand
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-foreground">
                      {deletingBrand.name}
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
