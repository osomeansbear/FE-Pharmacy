import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TablePageHeaderProps {
  title: string;
  description: string;
  addLabel: string;
  onAdd: () => void;
}

export default function TablePageHeader({
  title,
  description,
  addLabel,
  onAdd,
}: TablePageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button
        className="bg-success hover:bg-success/90 text-white gap-2 rounded-lg"
        onClick={onAdd}
      >
        <Plus size={18} /> {addLabel}
      </Button>
    </div>
  );
}
