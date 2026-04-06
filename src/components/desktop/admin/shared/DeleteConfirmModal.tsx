import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";

interface DeleteConfirmModalProps {
  open: boolean;
  entityLabel: string;
  entityName: string;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteConfirmModal({
  open,
  entityLabel,
  entityName,
  deleting,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />

      <div className="relative bg-white rounded-xl border border-border w-full max-w-md mx-4">
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 size={18} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Delete {entityLabel}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Are you sure you want to delete{" "}
                <span className="font-medium text-foreground">{entityName}</span>
                ? This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={onConfirm}
              disabled={deleting}
            >
              {deleting && <Loader2 size={16} className="mr-2 animate-spin" />}
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
