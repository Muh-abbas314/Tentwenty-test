'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormikProvider, useFormik } from 'formik';
import { toast } from 'sonner';
import { loginSchema } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '@/components/forms/form-field';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await signIn('credentials', {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          setError('Invalid email or password');
          toast.error('Invalid email or password');
        } else {
          toast.success('Successfully signed in!');
          router.push('/dashboard');
        }
      } catch (err) {
        setError('An error occurred. Please try again.');
        toast.error('An error occurred. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-[40%] bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Welcome back
          </h1>

          <FormikProvider value={formik}>
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <FormField
                name="email"
                label="Email"
                type="email"
                placeholder="name@example.com"
                required
              />

              <FormField
                name="password"
                label="Password"
                type="password"
                placeholder="••••••••••"
                required
              />

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formik.values.rememberMe}
                  onCheckedChange={(checked) =>
                    formik.setFieldValue('rememberMe', checked)
                  }
                />
                <Label
                  htmlFor="rememberMe"
                  className="text-sm font-normal cursor-pointer"
                >
                  Remember me
                </Label>
              </div>

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </FormikProvider>
        </div>
      </div>

      {/* Right Panel - Product Info */}
      <div className="hidden lg:flex lg:w-[60%] bg-blue-600 items-center justify-center p-12">
        <div className="max-w-lg text-white">
          <h2 className="text-5xl font-bold mb-6">ticktock</h2>
          <p className="text-lg leading-relaxed">
            Introducing ticktock, our cutting-edge timesheet web application
            designed to revolutionize how you manage employee work hours. With
            ticktock, you can effortlessly track and monitor employee attendance
            and productivity from anywhere, anytime, using any internet-connected
            device.
          </p>
        </div>
      </div>
    </div>
  );
}

