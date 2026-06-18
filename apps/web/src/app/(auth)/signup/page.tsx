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
    <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center p-4">
      {/* Visual background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_50%)]" />

      <div className="w-full max-w-md bg-[#131b2e] border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
            <Icons.Sparkles size={24} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Create Account</h2>
          <p className="text-xs text-slate-400">Get started with our enterprise document analyst tool.</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs flex items-center gap-2">
            <Icons.AlertTriangle size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs px-3.5 py-2.5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Alex Johnson"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs px-3.5 py-2.5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-xs px-3.5 py-2.5 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-lg bg-primary hover:bg-primary/95 text-white text-xs font-semibold transition flex items-center justify-center gap-2"
          >
            {isLoading && <Icons.Loader2 size={12} className="animate-spin" />}
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
