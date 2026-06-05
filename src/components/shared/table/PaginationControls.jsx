import { Button } from "@/components/ui/button";

function PaginationControls({ page = 1, totalPages = 0, onPageChange, disabled }) {
  const lastPage = Math.max(totalPages, 1);

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="min-w-[96px] text-center text-sm text-muted-foreground">
        Page {page} / {lastPage}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || page >= lastPage}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

export default PaginationControls;
