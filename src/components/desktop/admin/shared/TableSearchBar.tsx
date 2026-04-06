import { Search, X } from "lucide-react";

interface TableSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TableSearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: TableSearchBarProps) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-success/20 focus:border-success outline-none transition-all text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}
