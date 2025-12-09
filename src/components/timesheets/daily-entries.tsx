'use client';

import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Edit, Copy, Trash2 } from 'lucide-react';
import { TimesheetEntry } from '@/lib/mock-data';

interface DailyEntriesProps {
  date: string;
  entries: TimesheetEntry[];
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (entryId: string) => void;
  onAddTask: (date: string) => void;
  canAddTask?: boolean;
}

export function DailyEntries({
  date,
  entries,
  onEdit,
  onDelete,
  onAddTask,
  canAddTask = true,
}: DailyEntriesProps) {
  return (
    <div className="border-b pb-4">
      <div className="flex gap-6">
        <div className="w-24 flex-shrink-0">
          <p className="font-medium">{dayjs(date).format('MMM D')}</p>
        </div>
        <div className="flex-1 space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
            >
              <div className="flex-1">
                <p className="font-medium">{entry.taskDescription}</p>
              </div>
              <div className="text-sm text-gray-600">{entry.hours} hrs</div>
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
              >
                {entry.project}
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(entry)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                 
                  <DropdownMenuItem
                    onClick={() => onDelete(entry.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
          {canAddTask && (
            <Button
              variant="outline"
              className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
              onClick={() => onAddTask(date)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add new task
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

