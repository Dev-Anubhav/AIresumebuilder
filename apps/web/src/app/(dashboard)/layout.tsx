'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import DashboardHeader from '../../components/dashboard/DashboardHeader';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isResumeBuilder = pathname?.startsWith('/resume/');

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden relative">
      {/* Floating pastel blur nodes for premium organic depth */}
      {!isResumeBuilder && (
        <>
          <div className="absolute top-10 left-[15%] w-[400px] h-[400px] bg-[#ffdcd2]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-20 right-[15%] w-[450px] h-[450px] bg-[#e8e4f5]/40 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-[40%] right-[30%] w-[300px] h-[300px] bg-emerald-100/20 rounded-full blur-[90px] pointer-events-none" />
        </>
      )}
      {!isResumeBuilder && <DashboardHeader />}
      {isResumeBuilder ? (
        // Full-screen layout for resume builder — no padding, no max-width
        <main className="flex-1 flex flex-col overflow-hidden z-10">
          {children}
        </main>
      ) : (
        // Standard padded container for dashboard & other pages
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto z-10">
          {children}
        </main>
      )}
    </div>
  );
}
