'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { WeeklyTimesheet } from '@/lib/mock-data';
import { formatDateRange, getStatusBadgeClass } from '@/lib/utils';

interface TimesheetTableProps {
  timesheets: WeeklyTimesheet[];
  onView: (timesheet: WeeklyTimesheet) => void;
  onUpdate: (timesheet: WeeklyTimesheet) => void;
  onCreate: (timesheet: WeeklyTimesheet) => void;
}

export function TimesheetTable({
  timesheets,
  onView,
  onUpdate,
  onCreate,
}: TimesheetTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>WEEK #</TableHead>
            <TableHead>DATE</TableHead>
            <TableHead>STATUS</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {timesheets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                No timesheets found
              </TableCell>
            </TableRow>
          ) : (
            timesheets.map((timesheet) => (
              <TableRow key={timesheet.id}>
                <TableCell className="font-medium">
                  {timesheet.weekNumber}
                </TableCell>
                <TableCell>
                  {formatDateRange(timesheet.startDate, timesheet.endDate)}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                      timesheet.status
                    )}`}
                  >
                    {timesheet.status}
                  </span>
                </TableCell>
                <TableCell>
                  {timesheet.status === 'COMPLETED' && (
                    <Button variant="link" onClick={() => onView(timesheet)}>
                      View
                    </Button>
                  )}
                  {timesheet.status === 'INCOMPLETE' && (
                    <Button variant="link" onClick={() => onUpdate(timesheet)}>
                      Update
                    </Button>
                  )}
                  {timesheet.status === 'MISSING' && (
                    <Button variant="link" onClick={() => onCreate(timesheet)}>
                      Create
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

