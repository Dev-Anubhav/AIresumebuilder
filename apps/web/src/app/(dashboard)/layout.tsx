'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isResumeBuilder = pathname?.startsWith('/resume/');

  return (
    <div className="h-screen bg-[#0b0f19] flex flex-col overflow-hidden">
      {!isResumeBuilder && <DashboardHeader />}
      {isResumeBuilder ? (
        // Full-screen layout for resume builder — no padding, no max-width
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      ) : (
        // Standard padded container for dashboard & other pages
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
          {children}
        </main>
      )}
    </div>
  );
}
