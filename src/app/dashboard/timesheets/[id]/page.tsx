'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { WeeklyTimesheet, TimesheetEntry } from '@/lib/mock-data';
import { EntryFormModal } from '@/components/timesheets/entry-form-modal';
import { DailyEntries } from '@/components/timesheets/daily-entries';
import { formatDateRange } from '@/lib/utils';

export default function TimesheetEntriesPage() {
  const router = useRouter();
  const params = useParams();
  const timesheetId = params.id as string;

  const [timesheet, setTimesheet] = useState<WeeklyTimesheet | null>(null);
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    fetchTimesheet();
    fetchEntries();
  }, [timesheetId]);

  const fetchTimesheet = async () => {
    try {
      const response = await fetch(`/api/timesheets/${timesheetId}`);
      if (response.ok) {
        const data = await response.json();
        setTimesheet(data);
      } else {
        toast.error('Failed to fetch timesheet');
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Error fetching timesheet:', error);
      toast.error('An error occurred while fetching timesheet');
      router.push('/dashboard');
    }
  };

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/timesheets/${timesheetId}/entries`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries);
      } else {
        toast.error('Failed to fetch entries');
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast.error('An error occurred while fetching entries');
    } finally {
      setLoading(false);
    }
  };

  const handleEntrySubmit = async (values: {
    project: string;
    typeOfWork: string;
    taskDescription: string;
    hours: number;
    date: string;
  }) => {
    try {
      if (editingEntry) {
        // Update entry
        const response = await fetch(
          `/api/timesheets/${timesheetId}/entries/${editingEntry.id}`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          }
        );
        if (response.ok) {
          await fetchEntries();
          setIsEntryModalOpen(false);
          setEditingEntry(null);
          toast.success('Entry updated successfully');
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || 'Failed to update entry');
        }
      } else {
        // Create entry
        const response = await fetch(`/api/timesheets/${timesheetId}/entries`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        });
        if (response.ok) {
          await fetchEntries();
          setIsEntryModalOpen(false);
          toast.success('Entry created successfully');
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || 'Failed to create entry');
        }
      }
    } catch (error) {
      console.error('Error saving entry:', error);
      toast.error('An error occurred while saving the entry');
    }
  };

  const handleEntryCancel = () => {
    setIsEntryModalOpen(false);
    setEditingEntry(null);
  };

  const handleAddNewTask = (date: string) => {
    setSelectedDate(date);
    setEditingEntry(null);
    setIsEntryModalOpen(true);
  };

  const handleEdit = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    setIsEntryModalOpen(true);
  };

  const handleDelete = async (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(`/api/timesheets/${timesheetId}/entries/${entryId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          await fetchEntries();
          toast.success('Entry deleted successfully');
        } else {
          const errorData = await response.json().catch(() => ({}));
          toast.error(errorData.error || 'Failed to delete entry');
        }
      } catch (error) {
        console.error('Error deleting entry:', error);
        toast.error('An error occurred while deleting the entry');
      }
    }
  };

 

  const getEntriesByDate = (date: string) => {
    return entries.filter((entry) => entry.date === date);
  };

  const getTotalHours = () => {
    return entries.reduce((sum, entry) => sum + entry.hours, 0);
  };

  const getWeekDays = () => {
    if (!timesheet) return [];
    const days = [];
    let currentDate = dayjs(timesheet.startDate);
    const endDate = dayjs(timesheet.endDate);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      days.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }

    return days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const weekDays = getWeekDays();
  const totalHours = getTotalHours();
  const progressPercentage = (totalHours / 40) * 100;

  return (
    <>
      <main className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <h1 className="text-2xl font-bold mb-6">List View</h1>

          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{totalHours}/40 hrs</span>
                <span className="text-sm text-gray-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={Math.min(progressPercentage, 100)} className="h-2" />
            </div>
          </div>

          {/* Week Title */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">This week&apos;s timesheet</h2>
            <p className="text-sm text-gray-500">
              {formatDateRange(timesheet?.startDate || '', timesheet?.endDate || '')}
            </p>
          </div>

          {/* Daily Entries */}
          <div className="space-y-6">
            {weekDays.map((date) => {
              const dateEntries = getEntriesByDate(date);
              return (
                <DailyEntries
                  key={date}
                  date={date}
                  entries={dateEntries}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onAddTask={handleAddNewTask}
                  canAddTask={totalHours < 40}
                />
              );
            })}
          </div>

        </div>
      </main>

     
      <EntryFormModal
        open={isEntryModalOpen}
        onOpenChange={setIsEntryModalOpen}
        editingEntry={editingEntry}
        defaultDate={
          selectedDate || (timesheet ? dayjs(timesheet.startDate).format('YYYY-MM-DD') : '')
        }
        currentTotalHours={totalHours}
        onSubmit={handleEntrySubmit}
        onCancel={handleEntryCancel}
      />
    </>
  );
}

