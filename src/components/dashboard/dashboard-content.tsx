'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { WeeklyTimesheet } from '@/lib/mock-data';
import { updateSearchParams } from '@/lib/url-params';
import { DashboardFilters } from './dashboard-filters';
import { TimesheetTable } from './timesheet-table';
import { DashboardPagination } from './dashboard-pagination';

interface TimesheetResponse {
  timesheets: WeeklyTimesheet[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [timesheets, setTimesheets] = useState<WeeklyTimesheet[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '5';
  const status = searchParams.get('status');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

// console.log("page", page, "limit", limit, "status", status, "startDate", startDate, "endDate", endDate);
  // Fetch timesheets function
  const fetchTimesheets = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(status && status !== 'ALL' && { status }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const response = await fetch(`/api/timesheets?${params.toString()}`);
      if (response.ok) {
        const data: TimesheetResponse = await response.json();
        setTimesheets(data.timesheets);
        setPagination(data.pagination);
      } else {
        toast.error('Failed to fetch timesheets');
      }
    } catch (error) {
      console.error('Error fetching timesheets:', error);
      toast.error('An error occurred while fetching timesheets');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTimesheets();
  }, [
page,
limit,
status,
startDate,
endDate,
  ]);

  const statusFilter = status || 'ALL';
  const dateRange = {
    start: startDate || '',
    end: endDate || '',
  };

  const updateURL = (updates: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const params = updateSearchParams(searchParams, updates);
    // Use replace instead of push to update URL without adding to history
    router.replace(`/dashboard?${params.toString()}`, { scroll: false });
  };

  const handleView = (timesheet: WeeklyTimesheet) => {
    router.push(`/dashboard/timesheets/${timesheet.id}`);
  };

  const handleUpdate = (timesheet: WeeklyTimesheet) => {
    router.push(`/dashboard/timesheets/${timesheet.id}`);
  };

  const handleCreate = (timesheet: WeeklyTimesheet) => {
    router.push(`/dashboard/timesheets/${timesheet.id}`);
  };

  const handlePageChange = (page: number) => {
    updateURL({ page });
  };

  const handleLimitChange = (limit: number) => {
    updateURL({ limit });
  };

  const handleStatusChange = (status: string) => {
    updateURL({ status });
  };

  const handleDateRangeChange = (range: { start: string; end: string }) => {
    updateURL({ startDate: range.start, endDate: range.end });
  };

  const handleClearFilters = () => {
    updateURL({
      status: 'ALL',
      startDate: '',
      endDate: '',
      page: 1,
    });
  };

  if (loading && timesheets.length === 0) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-lg">Loading...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6">
      <h2 className="text-2xl font-bold mb-6">Your Timesheets</h2>

      <DashboardFilters
        statusFilter={statusFilter}
        onStatusChange={handleStatusChange}
        dateRange={dateRange}
        onDateRangeChange={handleDateRangeChange}
        onClearFilters={handleClearFilters}
      />

      <TimesheetTable
        timesheets={timesheets}
        onView={handleView}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
      />

      <DashboardPagination
        page={pagination.page}
        limit={pagination.limit}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
        onLimitChange={handleLimitChange}
      />

    </main>
  );
}

