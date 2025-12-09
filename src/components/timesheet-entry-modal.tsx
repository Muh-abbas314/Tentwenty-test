'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import dayjs from 'dayjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Plus, MoreVertical, Edit, Copy, Trash2 } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { WeeklyTimesheet, TimesheetEntry, mockProjects, mockTypesOfWork } from '@/lib/mock-data';

interface TimesheetEntryModalProps {
  timesheet: WeeklyTimesheet;
  mode: 'view' | 'create' | 'update';
  open: boolean;
  onClose: () => void;
}

const entrySchema = Yup.object().shape({
  project: Yup.string().required('Project is required'),
  typeOfWork: Yup.string().required('Type of work is required'),
  taskDescription: Yup.string().required('Task description is required'),
  hours: Yup.number()
    .min(0.5, 'Hours must be at least 0.5')
    .max(24, 'Hours cannot exceed 24')
    .required('Hours is required'),
  date: Yup.string().required('Date is required'),
});

export function TimesheetEntryModal({
  timesheet,
  mode,
  open,
  onClose,
}: TimesheetEntryModalProps) {
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');

  useEffect(() => {
    if (open) {
      fetchEntries();
    }
  }, [open, timesheet.id]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/timesheets/${timesheet.id}/entries`);
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

  const formik = useFormik({
    initialValues: {
      project: '',
      typeOfWork: '',
      taskDescription: '',
      hours: 4,
      date: selectedDate || dayjs(timesheet.startDate).format('YYYY-MM-DD'),
    },
    validationSchema: entrySchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (editingEntry) {
          // Update entry
          const response = await fetch(
            `/api/timesheets/${timesheet.id}/entries/${editingEntry.id}`,
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
            formik.resetForm();
            toast.success('Entry updated successfully');
          } else {
            const errorData = await response.json().catch(() => ({}));
            toast.error(errorData.error || 'Failed to update entry');
          }
        } else {
          // Create entry
          const response = await fetch(
            `/api/timesheets/${timesheet.id}/entries`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(values),
            }
          );
          if (response.ok) {
            await fetchEntries();
            setIsEntryModalOpen(false);
            formik.resetForm();
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
    },
  });

  const handleAddNewTask = (date: string) => {
    setSelectedDate(date);
    formik.setFieldValue('date', date);
    setEditingEntry(null);
    setIsEntryModalOpen(true);
  };

  const handleEdit = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    formik.setValues({
      project: entry.project,
      typeOfWork: entry.typeOfWork,
      taskDescription: entry.taskDescription,
      hours: entry.hours,
      date: entry.date,
    });
    setIsEntryModalOpen(true);
  };

  const handleDelete = async (entryId: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      try {
        const response = await fetch(
          `/api/timesheets/${timesheet.id}/entries/${entryId}`,
          {
            method: 'DELETE',
          }
        );
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

  const handleCopy = (entry: TimesheetEntry) => {
    formik.setValues({
      project: entry.project,
      typeOfWork: entry.typeOfWork,
      taskDescription: entry.taskDescription,
      hours: entry.hours,
      date: entry.date,
    });
    setEditingEntry(null);
    setIsEntryModalOpen(true);
  };

  const getEntriesByDate = (date: string) => {
    return entries.filter((entry) => entry.date === date);
  };

  const getTotalHours = () => {
    return entries.reduce((sum, entry) => sum + entry.hours, 0);
  };

  const getWeekDays = () => {
    const days = [];
    let currentDate = dayjs(timesheet.startDate);
    const endDate = dayjs(timesheet.endDate);

    while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
      days.push(currentDate.format('YYYY-MM-DD'));
      currentDate = currentDate.add(1, 'day');
    }

    return days;
  };

  const weekDays = getWeekDays();
  const totalHours = getTotalHours();
  const progressPercentage = (totalHours / 40) * 100;

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>List View</DialogTitle>
          </DialogHeader>

          {/* Progress Bar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">
                  {totalHours}/40 hrs
                </span>
                <span className="text-sm text-gray-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Week Title */}
          <div className="mb-6">
            <h2 className="text-xl font-bold">This week&apos;s timesheet</h2>
            <p className="text-sm text-gray-500">
              {dayjs(timesheet.startDate).format('D')} -{' '}
              {dayjs(timesheet.endDate).format('D MMMM, YYYY')}
            </p>
          </div>

          {/* Daily Entries */}
          <div className="space-y-6">
            {weekDays.map((date) => {
              const dateEntries = getEntriesByDate(date);
              const dayTotal = dateEntries.reduce(
                (sum, entry) => sum + entry.hours,
                0
              );

              return (
                <div key={date} className="border-b pb-4">
                  <div className="flex gap-6">
                    <div className="w-24 flex-shrink-0">
                      <p className="font-medium">
                        {dayjs(date).format('MMM D')}
                      </p>
                    </div>
                    <div className="flex-1 space-y-3">
                      {dateEntries.map((entry) => (
                        <div
                          key={entry.id}
                          className="flex items-center gap-4 p-3 bg-gray-50 rounded-md"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {entry.taskDescription}
                            </p>
                          </div>
                          <div className="text-sm text-gray-600">
                            {entry.hours} hrs
                          </div>
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
                              <DropdownMenuItem onClick={() => handleEdit(entry)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopy(entry)}>
                                <Copy className="w-4 h-4 mr-2" />
                                Copy
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(entry.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full border-dashed border-gray-300 text-gray-600 hover:bg-gray-50"
                        onClick={() => handleAddNewTask(date)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add new task
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            © 2024 tentwenty. All rights reserved.
          </p>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Entry Modal */}
      <Dialog open={isEntryModalOpen} onOpenChange={setIsEntryModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEntry ? 'Update Entry' : 'Add New Entry'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">
                Select Project <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.project}
                onValueChange={(value) => formik.setFieldValue('project', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Project Name" />
                </SelectTrigger>
                <SelectContent>
                  {mockProjects.map((project) => (
                    <SelectItem key={project} value={project}>
                      {project}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.project && formik.errors.project && (
                <p className="text-sm text-red-600">{formik.errors.project}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="typeOfWork">
                Type of Work <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formik.values.typeOfWork}
                onValueChange={(value) =>
                  formik.setFieldValue('typeOfWork', value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {mockTypesOfWork.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formik.touched.typeOfWork && formik.errors.typeOfWork && (
                <p className="text-sm text-red-600">
                  {formik.errors.typeOfWork}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="taskDescription">
                Task description <span className="text-red-500">*</span>
              </Label>
              <textarea
                id="taskDescription"
                name="taskDescription"
                rows={4}
                className="w-full border rounded-md px-3 py-2 text-sm"
                placeholder="Write text here..."
                value={formik.values.taskDescription}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.taskDescription &&
                formik.errors.taskDescription && (
                  <p className="text-sm text-red-600">
                    {formik.errors.taskDescription}
                  </p>
                )}
              <p className="text-xs text-gray-500">
                A note for extra info
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hours">
                Hours <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    formik.setFieldValue(
                      'hours',
                      Math.max(0.5, formik.values.hours - 0.5)
                    )
                  }
                >
                  -
                </Button>
                <Input
                  id="hours"
                  name="hours"
                  type="number"
                  min="0.5"
                  max="24"
                  step="0.5"
                  className="text-center"
                  value={formik.values.hours}
                  onChange={(e) =>
                    formik.setFieldValue('hours', parseFloat(e.target.value) || 0)
                  }
                  onBlur={formik.handleBlur}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    formik.setFieldValue(
                      'hours',
                      Math.min(24, formik.values.hours + 0.5)
                    )
                  }
                >
                  +
                </Button>
              </div>
              {formik.touched.hours && formik.errors.hours && (
                <p className="text-sm text-red-600">{formik.errors.hours}</p>
              )}
            </div>

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                {editingEntry ? 'Update entry' : 'Add entry'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEntryModalOpen(false);
                  setEditingEntry(null);
                  formik.resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

