'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface DashboardFiltersProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
  dateRange: { start: string; end: string };
  onDateRangeChange: (range: { start: string; end: string }) => void;
  onClearFilters: () => void;
}

export function DashboardFilters({
  statusFilter,
  onStatusChange,
  dateRange,
  onDateRangeChange,
  onClearFilters,
}: DashboardFiltersProps) {
  const hasActiveFilters =
    statusFilter !== 'ALL' || dateRange.start || dateRange.end;

  return (
    <div className="flex gap-4 mb-6 items-end">
      <div>
        <label className="text-sm font-medium mb-2 block">Date Range</label>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, start: e.target.value })
            }
            className="border rounded-md px-3 py-2 text-sm"
          />
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              onDateRangeChange({ ...dateRange, end: e.target.value })
            }
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block">Status</label>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="INCOMPLETE">Incomplete</SelectItem>
            <SelectItem value="MISSING">Missing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="h-9"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );
}

