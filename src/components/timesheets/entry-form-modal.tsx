'use client';

import { useFormik } from 'formik';
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
import { entrySchema } from '@/lib/schemas';
import { TimesheetEntry, mockProjects, mockTypesOfWork } from '@/lib/mock-data';
import dayjs from 'dayjs';

interface EntryFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingEntry: TimesheetEntry | null;
  defaultDate: string;
  currentTotalHours: number;
  onSubmit: (values: {
    project: string;
    typeOfWork: string;
    taskDescription: string;
    hours: number;
    date: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function EntryFormModal({
  open,
  onOpenChange,
  editingEntry,
  defaultDate,
  currentTotalHours,
  onSubmit,
  onCancel,
}: EntryFormModalProps) {
  const formik = useFormik({
    initialValues: {
      project: editingEntry?.project || '',
      typeOfWork: editingEntry?.typeOfWork || '',
      taskDescription: editingEntry?.taskDescription || '',
      hours: editingEntry?.hours || 4,
      date: editingEntry?.date || defaultDate,
    },
    validationSchema: entrySchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await onSubmit(values);
      formik.resetForm();
    },
  });

  // Calculate available hours
  const editingEntryHours = editingEntry?.hours || 0;
  const availableHours = 40 - (currentTotalHours - editingEntryHours);
  const isAtLimit = currentTotalHours >= 40 && !editingEntry;
  const wouldExceedLimit = !editingEntry && currentTotalHours + formik.values.hours > 40;
  
  // For editing: check if new hours would exceed 40
  const wouldExceedOnUpdate = editingEntry !== null 
    ? (currentTotalHours - editingEntryHours + formik.values.hours) > 40
    : false;

  const handleCancel = () => {
    formik.resetForm();
    onCancel();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              onValueChange={(value) => formik.setFieldValue('typeOfWork', value)}
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
              <p className="text-sm text-red-600">{formik.errors.typeOfWork}</p>
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
            {formik.touched.taskDescription && formik.errors.taskDescription && (
              <p className="text-sm text-red-600">{formik.errors.taskDescription}</p>
            )}
            <p className="text-xs text-gray-500">A note for extra info</p>
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
                disabled={isAtLimit || formik.values.hours <= 0.5}
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
                max={editingEntry ? Math.min(24, availableHours + editingEntryHours) : Math.min(24, availableHours)}
                step="0.5"
                className="text-center"
                value={formik.values.hours}
                disabled={isAtLimit}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  const maxHours = editingEntry 
                    ? Math.min(24, availableHours + editingEntryHours)
                    : Math.min(24, availableHours);
                  formik.setFieldValue('hours', Math.min(maxHours, value));
                }}
                onBlur={formik.handleBlur}
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                disabled={
                  isAtLimit ||
                  formik.values.hours >= 24 ||
                  (!editingEntry && formik.values.hours >= availableHours) ||
                  (editingEntry !== null && formik.values.hours >= (availableHours + editingEntryHours))
                }
                onClick={() => {
                  const maxHours = editingEntry 
                    ? Math.min(24, availableHours + editingEntryHours)
                    : Math.min(24, availableHours);
                  formik.setFieldValue(
                    'hours',
                    Math.min(maxHours, formik.values.hours + 0.5)
                  );
                }}
              >
                +
              </Button>
            </div>
            {isAtLimit && (
              <p className="text-sm text-amber-600">
                Timesheet is complete (40/40 hrs). Cannot add new entries.
              </p>
            )}
            {wouldExceedLimit && !isAtLimit && (
              <p className="text-sm text-amber-600">
                Maximum available hours: {availableHours.toFixed(1)} hrs
              </p>
            )}
            {wouldExceedOnUpdate && (
              <p className="text-sm text-amber-600">
                Cannot exceed 40 hours. Maximum allowed: {(availableHours + editingEntryHours).toFixed(1)} hrs
              </p>
            )}
            {formik.touched.hours && formik.errors.hours && (
              <p className="text-sm text-red-600">{formik.errors.hours}</p>
            )}
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={isAtLimit || wouldExceedLimit || wouldExceedOnUpdate}
            >
              {editingEntry ? 'Update entry' : 'Add entry'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

