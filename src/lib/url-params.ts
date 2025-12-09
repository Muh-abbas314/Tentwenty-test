
export function updateSearchParams(
  currentParams: URLSearchParams,
  updates: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }
): URLSearchParams {
  const params = new URLSearchParams(currentParams.toString());

  if (updates.page !== undefined) {
    params.set('page', updates.page.toString());
  }

  if (updates.limit !== undefined) {
    params.set('limit', updates.limit.toString());
    // Reset to page 1 when limit changes
    params.set('page', '1');
  }

  if (updates.status !== undefined) {
    if (updates.status === 'ALL') {
      params.delete('status');
    } else {
      params.set('status', updates.status);
    }
    // Reset to page 1 when status changes
    params.set('page', '1');
  }

  // Handle date range changes together
  if (updates.startDate !== undefined || updates.endDate !== undefined) {
    if (updates.startDate !== undefined) {
      if (updates.startDate) {
        params.set('startDate', updates.startDate);
      } else {
        params.delete('startDate');
      }
    }
    if (updates.endDate !== undefined) {
      if (updates.endDate) {
        params.set('endDate', updates.endDate);
      } else {
        params.delete('endDate');
      }
    }
    // Reset to page 1 when date range changes
    params.set('page', '1');
  }

  return params;
}

