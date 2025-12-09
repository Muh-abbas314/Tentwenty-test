import type { Metadata } from "next";
import "./globals.css";
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/session-provider';
import { Toaster } from 'sonner';
 
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
 

export const metadata: Metadata = {
  title: "ticktock - Timesheet Management",
  description: "Timesheet Management Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <Providers>
          {children}
          <Toaster position="top-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
