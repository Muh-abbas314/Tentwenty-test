import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export const entrySchema = Yup.object().shape({
  project: Yup.string().required('Project is required'),
  typeOfWork: Yup.string().required('Type of work is required'),
  taskDescription: Yup.string().required('Task description is required'),
  hours: Yup.number()
    .min(0.5, 'Hours must be at least 0.5')
    .max(24, 'Hours cannot exceed 24')
    .required('Hours is required'),
  date: Yup.string().required('Date is required'),
});
