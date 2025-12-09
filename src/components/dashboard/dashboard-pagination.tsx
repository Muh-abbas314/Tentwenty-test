'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface DashboardPaginationProps {
  page: number;
  limit: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

export function DashboardPagination({
  page,
  limit,
  totalPages,
  onPageChange,
  onLimitChange,
}: DashboardPaginationProps) {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <Select
          value={limit.toString()}
          onValueChange={(value) => onLimitChange(parseInt(value))}
        >
          <SelectTrigger className="w-[80px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          Previous
        </Button>
        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              (p) =>
                p === 1 ||
                p === totalPages ||
                (p >= page - 2 && p <= page + 2)
            )
            .map((p, index, array) => (
              <div key={p} className="flex items-center gap-1">
                {index > 0 && array[index - 1] !== p - 1 && (
                  <span className="px-2">...</span>
                )}
                <Button
                  variant={p === page ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(p)}
                >
                  {p}
                </Button>
              </div>
            ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

