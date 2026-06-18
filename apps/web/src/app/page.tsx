import Link from 'next/link';
import { Sparkles, FileText, Zap, Shield, Star, ArrowRight, CheckCircle, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'ResuCraft AI — Build ATS-Friendly Resumes with AI',
  description:
    'Create professional, ATS-optimized resumes with AI coaching, 8 premium templates, and intelligent suggestions. Land your dream job with ResuCraft AI.',
};

// ─── Static data ────────────────────────────────────────────────────────────
const features = [
  {
    icon: Sparkles,
    title: 'AI Resume Coach',
    desc: 'Get real-time suggestions powered by StepFun AI to rewrite summaries, improve bullet points, and add ATS keywords.',
    bg: '#f5f3ff',
    border: '#ddd6fe',
    text: '#7c5dfa',
  },
  {
    icon: FileText,
    title: '10 Premium Templates',
    desc: 'Choose from 10 professionally designed, ATS-tested templates — from minimalist to executive bold.',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    text: '#16a34a',
  },
  {
    icon: Zap,
    title: 'Instant ATS Preview',
    desc: 'See exactly how your resume looks to applicant tracking systems. Live A4 preview updates as you type.',
    bg: '#fffbeb',
    border: '#fde68a',
    text: '#d97706',
  },
  {
    icon: Shield,
    title: 'One-Click Export',
    desc: 'Export print-ready PDFs directly from your browser. No watermarks, no limits.',
    bg: '#fff1f2',
    border: '#fecdd3',
    text: '#e11d48',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Razorpay',
    quote: 'ResuCraft AI helped me rewrite my resume in under 10 minutes. I got 3 interview calls within a week.',
    initials: 'PS',
    bg: '#f5f3ff',
    color: '#7c5dfa',
  },
  {
    name: 'Rahul Mehta',
    role: 'Product Manager at Swiggy',
    quote: 'The ATS optimization feature is a game-changer. My response rate went from 5% to 40% after using ResuCraft.',
    initials: 'RM',
    bg: '#f0fdf4',
    color: '#16a34a',
  },
  {
    name: 'Ananya Singh',
    role: 'Data Scientist at Flipkart',
    quote: 'Clean, beautiful templates. The AI coach understood exactly what my industry needed. Highly recommend!',
    initials: 'AS',
    bg: '#fff1f2',
    color: '#e11d48',
  },
];

const steps = [
  { num: '01', title: 'Choose a Template', desc: 'Pick from 10 ATS-friendly designs that match your industry and style.' },
  { num: '02', title: 'Fill in Your Details', desc: 'Add your experience, education, skills, and projects with guided forms.' },
  { num: '03', title: 'Ask the AI Coach', desc: 'Get instant suggestions to optimize your content for any job description.' },
  { num: '04', title: 'Export & Apply', desc: 'Download a pixel-perfect PDF resume and start applying with confidence.' },
];

export default function LandingPage() {
  return (
    <div
      className="min-h-screen text-slate-800 bg-[#faf8f6]"
      style={{
        fontFamily: "'Inter', system-ui, sans-serif",
      }}
    >
      {/* ── Google Fonts ── */}
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* ── NAV ───────────────────────────────────────────────────────────── */}
      <nav
        className="border-b border-[#e2e8f0] bg-white/80 backdrop-blur-md sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#7c5dfa] flex items-center justify-center shadow-lg shadow-[#7c5dfa]/20">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
                <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
              </svg>
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900">
              ResuCraft <span className="text-[#7c5dfa]">AI</span>
            </span>
          </div>

          {/* Nav links */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#7c5dfa] hover:bg-[#6d4ae5] shadow-md shadow-[#7c5dfa]/15 transition"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 text-center relative overflow-hidden">
        {/* Subtle warm glow background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#ffdcd2]/20 blur-[120px] pointer-events-none rounded-full" />
        <div className="absolute bottom-0 left-[10%] w-[250px] h-[250px] bg-[#e0e7ff]/30 blur-[80px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#7c5dfa]/20 bg-[#7c5dfa]/5">
            <Star size={12} className="text-[#7c5dfa]" fill="#7c5dfa" />
            <span className="text-xs font-semibold text-[#7c5dfa]">
              AI-Powered Resume Builder — 100% Free to Start
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-[1.08]">
            Build Resumes That{' '}
            <span className="text-[#7c5dfa]">
              Actually Get Interviews
            </span>
          </h1>

          {/* Sub */}
          <p className="text-base md:text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
            AI coaching + 10 premium ATS-optimized templates. Create, correct, and perfect your
            resume in minutes — not hours.
          </p>

          {/* CTAs */}
          <div className="flex items-center justify-center gap-3 pt-4">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white bg-[#7c5dfa] hover:bg-[#6d4ae5] shadow-lg shadow-[#7c5dfa]/25 text-sm transition"
            >
              Create My Resume Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 text-sm transition"
            >
              Sign In
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-5 pt-8 flex-wrap">
            {[
              { label: '10,000+ resumes created' },
              { label: '10 premium templates' },
              { label: 'ATS score improvement' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <CheckCircle size={14} className="text-emerald-500" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold text-[#7c5dfa] tracking-wider uppercase">
            Features
          </p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Everything you need to land the job
          </h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Professional tools that used to cost hundreds — now free, AI-powered, and effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-7 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div
                    className="width-11 h-11 w-11 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: f.bg, border: `1px solid ${f.border}` }}
                  >
                    <Icon size={20} style={{ color: f.text }} />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-white border-y border-slate-200">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className="text-xs font-bold text-emerald-600 tracking-wider uppercase">
              How it Works
            </p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              From blank page to interview-ready in 4 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#7c5dfa]/10 border border-[#7c5dfa]/20 flex items-center justify-center mx-auto shadow-sm">
                  <span className="text-sm font-extrabold text-[#7c5dfa]">{step.num}</span>
                </div>
                <h3 className="font-bold text-sm text-slate-800">{step.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section className="py-16 px-6 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <p className="text-xs font-bold text-rose-500 tracking-wider uppercase">
            Social Proof
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Loved by job seekers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, si) => (
                    <Star key={si} size={12} className="text-amber-400" fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-600 text-xs italic leading-relaxed mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800">{t.name}</div>
                  <div className="text-[10px] text-slate-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-[#f5f3ff] border border-[#7c5dfa]/20 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[#ffdcd2]/25 blur-[50px] pointer-events-none rounded-full" />

          <div className="relative z-10 space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-[#7c5dfa] flex items-center justify-center mx-auto shadow-md shadow-[#7c5dfa]/20">
              <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
                <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
                <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
              </svg>
            </div>

            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Ready to craft your perfect resume?
            </h2>
            <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
              Join thousands of professionals who landed their dream jobs with ResuCraft AI.
              No credit card required.
            </p>

            <div className="flex gap-3 justify-center flex-wrap pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-xl font-bold text-white bg-[#7c5dfa] hover:bg-[#6d4ae5] shadow-md shadow-[#7c5dfa]/20 text-xs transition"
              >
                Start Building Now
                <ArrowRight size={14} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 text-xs transition"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 py-10 text-center bg-white space-y-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#7c5dfa] flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
              <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
            </svg>
          </div>
          <span className="font-extrabold text-sm text-slate-900">
            ResuCraft <span className="text-[#7c5dfa]">AI</span>
          </span>
        </div>
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} ResuCraft AI. Built with ♥ and StepFun AI.
        </p>
        <div className="flex gap-4 justify-center text-xs text-slate-400">
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
            <span key={item} className="hover:text-slate-600 cursor-pointer transition">
              {item}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
