'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icons } from '@/components/ui/icons';

interface DashboardHeaderProps {}

export default function DashboardHeader(_: DashboardHeaderProps) {
  const [user, setUser] = useState<{ name: string; avatarColor: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser({ name: data.user.name || data.user.email, avatarColor: data.user.avatarColor || '#6366f1' });
        }
      })
      .catch(() => null);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Hard navigation clears all React state and cache — prevents stale auth
      window.location.href = '/login';
    }
  };

  const initials = user
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '...';

  return (
    <header className="border-b border-border bg-card shrink-0 z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/dashboard" className="flex items-center gap-2.5 group">
          {/* Custom R logo mark */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/10 group-hover:scale-105 transition"
            style={{ backgroundColor: '#7c5dfa' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
              <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
            </svg>
          </div>
          <span className="font-bold text-foreground tracking-tight hidden sm:inline-block">
            ResuCraft <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* User Info & Controls */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0"
                style={{ backgroundColor: user.avatarColor }}
              >
                {initials}
              </div>
              <span className="text-xs font-semibold text-muted-foreground hidden md:inline-block truncate max-w-[120px]">
                {user.name}
              </span>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg bg-muted hover:bg-rose-50 text-muted-foreground hover:text-rose-600 text-xs flex items-center gap-1.5 transition border border-border hover:border-rose-200"
            title="Log Out"
          >
            <Icons.LogOut size={14} />
            <span className="hidden sm:inline">Log Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
