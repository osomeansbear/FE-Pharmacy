"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
  createCategory,
  deleteCategory,
  fetchAllCategories,
  updateCategory,
} from "../../../../../api/categories.api";
import { Category } from "../../../../../types/categoryTypes";
import DeleteConfirmModal from "../shared/DeleteConfirmModal";
import TablePageHeader from "../shared/TablePageHeader";
import TablePagination from "../shared/TablePagination";
import TableSearchBar from "../shared/TableSearchBar";
import CategoryFormModal, { CategoryFormData } from "./CategoryFormModal";
import { slugify } from "@/lib/utils";

const emptyForm: CategoryFormData = {
  name: "",
  slug: "",
  parentId: "",
};

export default function CategoriesTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [form, setForm] = useState<CategoryFormData>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchAllCategories();
      setCategories(data);
    } catch {
      setError("Unable to load categories.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const getParentName = (parentId: number | null): string => {
    if (!parentId) return "N/A";
    const parent = categories.find((c) => c.id === parentId);
    return parent ? parent.name : "Unknown";
  };

  const filteredCategories = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredCategories.slice(startIndex, endIndex);

  const openCreateModal = () => {
    setForm(emptyForm);
    setEditingCategoryId(null);
    setModalMode("create");
    setFormError("");
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setForm({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId ? String(category.parentId) : "",
    });
    setEditingCategoryId(category.id);
    setModalMode("edit");
    setFormError("");
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setFormError("");
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim()) {
      setFormError("Category name is required.");
      return;
    }

    const slug = form.slug.trim() || slugify(form.name);
    const parentId = form.parentId ? Number(form.parentId) : null;

    const payload = { name: form.name.trim(), slug, parentId };

    try {
      setSubmitting(true);
      if (modalMode === "create") {
        await createCategory(payload);
      } else if (editingCategoryId !== null) {
        await updateCategory(editingCategoryId, payload);
      }
      closeModal();
      await loadCategories();
    } catch {
      setFormError(
        modalMode === "create"
          ? "Failed to create category. Please try again."
          : "Failed to update category. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const openDeleteConfirm = (category: Category) => {
    setDeletingCategory(category);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setDeletingCategory(null);
  };

  const handleDelete = async () => {
    if (!deletingCategory) return;
    try {
      setDeleting(true);
      await deleteCategory(deletingCategory.id);
      closeDeleteConfirm();
      await loadCategories();
    } catch {
      setFormError("Failed to delete category.");
      closeDeleteConfirm();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <TablePageHeader
        title="Categories Management"
        description="Organize products into categories and subcategories."
        addLabel="Add Category"
        onAdd={openCreateModal}
      />

      <TableSearchBar
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder="Search categories..."
      />

      <div className="rounded-xl border bg-white overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary border-b text-muted-foreground font-medium">
            <tr>
              <th className="px-6 py-4">Category Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Parent Category</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                  Loading categories...
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
              ? currentItems.map((category) => (
                  <tr key={category.id} className="hover:bg-secondary/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">
                        {category.parentId && (
                          <span className="text-muted-foreground font-normal mr-1">-</span>
                        )}
                        {category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{category.slug}</Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {getParentName(category.parentId)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-blue-600"
                          onClick={() => openEditModal(category)}
                        >
                          <Pencil size={14} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-600"
                          onClick={() => openDeleteConfirm(category)}
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
                  No categories found
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
          totalItems={filteredCategories.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={setItemsPerPage}
        />
      </div>

      <CategoryFormModal
        open={modalOpen}
        mode={modalMode}
        form={form}
        categories={categories}
        editingCategoryId={editingCategoryId}
        submitting={submitting}
        formError={formError}
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        onClose={closeModal}
      />

      <DeleteConfirmModal
        open={deleteConfirmOpen && !!deletingCategory}
        entityLabel="Category"
        entityName={deletingCategory?.name ?? ""}
        deleting={deleting}
        onConfirm={handleDelete}
        onCancel={closeDeleteConfirm}
      />
    </div>
  );
}
