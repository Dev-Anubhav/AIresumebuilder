'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Icons } from '../../components/ui/icons';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isSharedView = pathname?.startsWith('/shared/');
  const isResumeBuilder = pathname?.startsWith('/resume/');
  const hideSidebar = isResumeBuilder || isSharedView;

  const [user, setUser] = useState<{ name: string; avatarColor: string } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (hideSidebar) return;
    fetch('/api/auth/me')
      .then((r) => {
        if (r.status === 401 || r.status === 403) {
          fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
            window.location.href = '/login';
          });
          return null;
        }
        return r.ok ? r.json() : null;
      })
      .then((data) => {
        if (data?.user) {
          setUser({ name: data.user.name || data.user.email, avatarColor: data.user.avatarColor || '#6366f1' });
        }
      })
      .catch(() => null);
  }, [hideSidebar]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
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
    <div className="h-screen bg-background flex overflow-hidden relative">
      {/* ── LEFT NAVIGATION SIDEBAR ────────────────────────────────────────── */}
      {!hideSidebar && (
        <aside className="w-64 bg-card border-r border-border flex flex-col shrink-0 z-20">
          {/* Logo Brand */}
          <div className="p-5 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-sm">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
                <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
              </svg>
            </div>
            <span className="font-extrabold text-slate-900 text-base tracking-tight">
              ResuCraft <span className="text-primary">AI</span>
            </span>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => router.push('/dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition text-left cursor-pointer ${
                pathname === '/dashboard'
                  ? 'bg-secondary text-secondary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <Icons.Grid size={15} />
              Overview
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition text-left cursor-pointer"
            >
              <Icons.FileText size={15} />
              My Resumes
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition text-left cursor-pointer"
            >
              <Icons.FileSpreadsheet size={15} />
              Templates Library
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-muted-foreground hover:bg-muted hover:text-foreground transition text-left cursor-pointer"
            >
              <Icons.Sparkles size={15} />
              AI Insights
            </button>
          </nav>

          {/* Profile Card & Logout */}
          <div className="p-4 border-t border-border space-y-3 bg-card mt-auto">
            {user && (
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0"
                  style={{ backgroundColor: user.avatarColor }}
                >
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 truncate">{user.name}</div>
                  <div className="text-[10px] text-muted-foreground">Free Plan</div>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-border bg-muted/30 hover:bg-rose-50 text-muted-foreground hover:text-rose-600 text-[11px] font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoggingOut ? (
                <>
                  <Icons.Loader2 size={13} className="animate-spin" />
                  Logging out...
                </>
              ) : (
                <>
                  <Icons.LogOut size={13} />
                  Log Out
                </>
              )}
            </button>
          </div>
        </aside>
      )}

      {/* ── MAIN CONTENT WORKSPACE ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <main className="flex-1 overflow-y-auto">
          {isResumeBuilder ? (
            <div className="h-full flex flex-col overflow-hidden">{children}</div>
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
          )}
        </main>
      </div>
    </div>
  );
}
