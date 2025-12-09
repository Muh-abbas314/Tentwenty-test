import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = dayjs(startDate);
  const end = dayjs(endDate);
  return `${start.format('D')} - ${end.format('D MMMM, YYYY')}`;
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800';
    case 'INCOMPLETE':
      return 'bg-yellow-100 text-yellow-800';
    case 'MISSING':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
