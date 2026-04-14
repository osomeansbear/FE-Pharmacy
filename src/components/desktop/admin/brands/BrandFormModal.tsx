"use client";

import { Button } from "@/components/ui/button";
import { slugify } from "@/lib/utils";
import { AlertCircle, Loader2, X } from "lucide-react";

export interface BrandFormData {
  name: string;
  slug: string;
  description: string;
  logoUrl: string;
}

interface BrandFormModalProps {
  open: boolean;
  mode: "create" | "edit";
  form: BrandFormData;
  submitting: boolean;
  formError: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function BrandFormModal({
  open,
  mode,
  form,
  submitting,
  formError,
  onChange,
  onSubmit,
  onClose,
}: BrandFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-xl border border-border w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-foreground">
            {mode === "create" ? "Add New Brand" : "Edit Brand"}
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
              onChange={onChange}
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
              onChange={onChange}
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
              onChange={onChange}
              placeholder="https://example.com/logo.png"
              className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all"
            />
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
              {mode === "create" ? "Create Brand" : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
