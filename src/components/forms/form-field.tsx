'use client';

import { useFormikContext } from 'formik';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}

export function FormField({
  name,
  label,
  type = 'text',
  placeholder,
  required = false,
}: FormFieldProps) {
  const formik = useFormikContext<any>();

  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        aria-invalid={
          formik.touched[name] && formik.errors[name] ? 'true' : 'false'
        }
      />
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-sm text-red-600">
          {formik.errors[name] as string}
        </p>
      )}
    </div>
  );
}

