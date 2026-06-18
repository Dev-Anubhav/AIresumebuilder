'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icons } from '../../../components/ui/icons';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Signup failed');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Subtle warm glow background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[#ffdcd2]/20 blur-[100px] pointer-events-none rounded-full" />

      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-lg relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <Icons.Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Create Account</h2>
          <p className="text-xs text-muted-foreground">Get started with ResuCraft AI resume workspace.</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs flex items-center gap-2">
            <Icons.AlertTriangle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-muted border border-border text-xs px-3.5 py-2.5 rounded-lg text-foreground placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition"
              placeholder="Alex Johnson"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-muted border border-border text-xs px-3.5 py-2.5 rounded-lg text-foreground placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-muted border border-border text-xs px-3.5 py-2.5 rounded-lg text-foreground placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold shadow-md shadow-primary/15 transition flex items-center justify-center gap-2"
          >
            {isLoading && <Icons.Loader2 size={12} className="animate-spin" />}
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
