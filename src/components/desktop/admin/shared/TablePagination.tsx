import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (n: number) => void;
}

export default function TablePagination({
  currentPage,
  totalPages,
  startIndex,
  endIndex,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
}: TablePaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-secondary border-t gap-4">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div>
          Showing{" "}
          <span className="font-medium text-foreground">
            {totalItems > 0 ? startIndex + 1 : 0}
          </span>{" "}
          to{" "}
          <span className="font-medium text-foreground">
            {Math.min(endIndex, totalItems)}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">{totalItems}</span>{" "}
          results
        </div>

        <div className="flex items-center gap-2 border-l pl-4">
          <span className="whitespace-nowrap">Rows per page:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
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
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft size={16} />
        </Button>
        <div className="flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`h-8 w-8 p-0 ${currentPage === page ? "bg-success" : ""}`}
            >
              {page}
            </Button>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
