"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
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
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import TablePageHeader from "../shared/TablePageHeader";
import TablePagination from "../shared/TablePagination";
import TableSearchBar from "../shared/TableSearchBar";
import BrandFormModal, { BrandFormData } from "./BrandFormModal";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");
}

const emptyForm: BrandFormData = {
  name: "",
  slug: "",
  description: "",
  logoUrl: "",
};

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
      <TablePageHeader
        title="Brands Management"
        description="Manage pharmaceutical brands and manufacturers."
        addLabel="Add Brand"
        onAdd={openCreateModal}
      />

      <TableSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search brands..."
      />

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
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
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
                  <tr key={brand.id} className="hover:bg-secondary/50 transition-colors">
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
                        <span className="font-semibold text-foreground">{brand.name}</span>
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
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  No brands found
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
          totalItems={filteredBrands.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      <BrandFormModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        submitting={submitting}
        formError={formError}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />

      <DeleteConfirmModal
        open={deleteConfirmOpen && !!deletingBrand}
        entityLabel="Brand"
        entityName={deletingBrand?.name ?? ""}
        deleting={deleting}
        onConfirm={handleDelete}
        onCancel={closeDeleteConfirm}
      />
    </div>
  );
}
