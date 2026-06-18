import Link from 'next/link';
import { Sparkles, FileText, Zap, Shield, Star, ArrowRight, CheckCircle, ChevronRight, MessageSquare, Briefcase, HelpCircle } from 'lucide-react';

export const metadata = {
  title: 'ResuCraft AI — Build ATS-Friendly Resumes with AI',
  description:
    'Create professional, ATS-optimized resumes with AI coaching, 10 premium templates, and intelligent suggestions. Land your dream job with ResuCraft AI.',
};

const features = [
  {
    icon: Sparkles,
    title: 'AI Resume Coach',
    desc: 'Get real-time suggestions powered by StepFun AI to rewrite summaries, improve bullet points, and add ATS keywords.',
    bg: 'bg-blue-50/50',
    border: 'border-blue-100',
    text: 'text-[#0066ff]',
  },
  {
    icon: FileText,
    title: '10 Premium Templates',
    desc: 'Choose from 10 professionally designed, ATS-tested templates — from minimalist to executive bold.',
    bg: 'bg-indigo-50/50',
    border: 'border-indigo-100',
    text: 'text-indigo-600',
  },
  {
    icon: Zap,
    title: 'Instant ATS Preview',
    desc: 'See exactly how your resume looks to applicant tracking systems. Live A4 preview updates as you type.',
    bg: 'bg-sky-50/50',
    border: 'border-sky-100',
    text: 'text-sky-500',
  },
  {
    icon: Shield,
    title: 'One-Click Export',
    desc: 'Export print-ready PDFs directly from your browser. No watermarks, no limits.',
    bg: 'bg-slate-50/50',
    border: 'border-slate-100',
    text: 'text-slate-700',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Razorpay',
    quote: 'ResuCraft AI helped me rewrite my resume in under 10 minutes. I got 3 interview calls within a week.',
    initials: 'PS',
    bg: 'bg-blue-600',
  },
  {
    name: 'Rahul Mehta',
    role: 'Product Manager at Swiggy',
    quote: 'The ATS optimization feature is a game-changer. My response rate went from 5% to 40% after using ResuCraft.',
    initials: 'RM',
    bg: 'bg-slate-800',
  },
  {
    name: 'Ananya Singh',
    role: 'Data Scientist at Flipkart',
    quote: 'Clean, beautiful templates. The AI coach understood exactly what my industry needed. Highly recommend!',
    initials: 'AS',
    bg: 'bg-[#0066ff]',
  },
];

const steps = [
  { num: '01', title: 'Choose a Template', desc: 'Pick from 10 ATS-friendly designs that match your industry and style.' },
  { num: '02', title: 'Fill in Your Details', desc: 'Add your experience, education, skills, and projects with guided forms.' },
  { num: '03', title: 'Ask the AI Coach', desc: 'Get instant suggestions to optimize your content for any job description.' },
  { num: '04', title: 'Export & Apply', desc: 'Download a pixel-perfect PDF resume and start applying with confidence.' },
];

const faqs = [
  { q: 'Is ResuCraft AI really free to use?', a: 'Yes! You can build, edit, and export your resume in PDF format completely free of charge. No hidden fees or subscription locks on standard layouts.' },
  { q: 'What makes a resume "ATS-Friendly"?', a: 'ATS-Friendly resumes use clean layouts, standard headings (e.g., Work Experience, Education), and keyword optimization. Our builder enforces layouts that ATS scanners can parse easily.' },
  { q: 'How does the AI Resume Coach work?', a: 'Our coach analyzes your resume bullet points and job description using StepFun AI. It suggests actionable improvements, strong verbs, and missing technical keywords.' },
  { q: 'Can I upload my existing resume?', a: 'Yes! You can upload your existing resume in PDF format to our Document Analysis Platform. The AI will extract the data and analyze it against potential job descriptions.' }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-800 bg-[#ffffff] relative overflow-hidden font-sans selection:bg-blue-500/10 selection:text-[#0066ff]">
      {/* ─── Google Fonts ─── */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ─── Modern Grid Background (CVCRAFT Style) ─── */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#f1f5f9_1px,transparent_1px),linear-gradient(to_bottom,#f1f5f9_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-80" />
      
      {/* Radial fade to soften grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,transparent_10%,#ffffff_85%)] pointer-events-none" />

      {/* Scattered Abstract Decorative Blue Blocks */}
      <div className="absolute top-48 left-[5%] w-16 h-16 border border-blue-500/10 bg-[#0066ff]/[0.02] rounded-md pointer-events-none hidden md:block" />
      <div className="absolute top-96 right-[8%] w-24 h-24 border border-blue-500/10 bg-[#0066ff]/[0.01] rounded-lg pointer-events-none hidden md:block" />
      <div className="absolute top-[600px] left-[15%] w-12 h-12 border border-indigo-500/10 bg-indigo-500/[0.02] rounded pointer-events-none hidden md:block" />
      <div className="absolute top-[800px] right-[25%] w-20 h-20 border border-slate-500/10 bg-slate-500/[0.01] rounded-xl pointer-events-none hidden md:block" />

      {/* ─── STICKY HEADER NAVIGATION ─── */}
      <nav className="border-b border-slate-100 bg-[#ffffff]/70 backdrop-blur-md sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8.5 h-8.5 rounded-lg bg-[#0066ff] flex items-center justify-center shadow-md shadow-blue-500/20">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
                <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
              </svg>
            </div>
            <span className="font-extrabold text-base tracking-tight text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
              ResuCraft <span className="text-[#0066ff]">AI</span>
            </span>
          </div>

          {/* Navigation Menu in Center */}
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#0066ff] transition">Features</a>
            <a href="#workflow" className="hover:text-[#0066ff] transition">How it Works</a>
            <a href="#testimonials" className="hover:text-[#0066ff] transition">Success Stories</a>
            <a href="#faq" className="hover:text-[#0066ff] transition">FAQ</a>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-600 hover:text-slate-900 transition"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-[#0066ff] hover:bg-[#0052cc] shadow-md shadow-blue-500/10 transition duration-200"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── HERO SECTION (CVCRAFT inspired) ─── */}
      <section className="relative pt-20 pb-24 px-6 text-center max-w-5xl mx-auto z-10">
        <div className="flex flex-col items-center space-y-6">
          
          {/* Central Logo Box */}
          <div className="w-16 h-16 rounded-2xl bg-[#0066ff] flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all duration-300">
            <svg width="34" height="34" viewBox="0 0 20 20" fill="none">
              <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
              <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
            </svg>
          </div>

          {/* Badge indicator */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-500/15 bg-blue-500/[0.03] text-[#0066ff] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={11} className="animate-pulse" />
            AI resume builder — 100% free to start
          </div>

          {/* Big Header Title */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] max-w-3xl" style={{ fontFamily: 'Outfit, sans-serif' }}>
            Build a Job-Winning <br className="hidden md:inline" />
            Resume in Minutes with <span className="text-[#0066ff]">AI</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm md:text-base text-slate-500 max-w-xl leading-relaxed">
            Our AI helps you craft professional, ATS-friendly resumes effortlessly. Optimize keywords, write strong descriptions, and choose from modern premium layouts.
          </p>

          {/* Call-to-actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 w-full sm:w-auto">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-white bg-[#0066ff] hover:bg-[#0052cc] shadow-lg shadow-blue-500/20 text-sm transition duration-200 w-full sm:w-auto text-center"
            >
              Get Started for Free
              <ArrowRight size={15} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 text-sm transition duration-200 w-full sm:w-auto text-center"
            >
              Learn More
            </a>
          </div>

          {/* Checked metrics */}
          <div className="flex items-center justify-center gap-6 pt-8 flex-wrap">
            {[
              { label: '10,000+ Resumes Created' },
              { label: '10 Premium Templates' },
              { label: 'ATS Score Optimizations' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <CheckCircle size={14} className="text-blue-500" />
                {item.label}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section id="features" className="py-20 border-t border-slate-100 bg-slate-50/30 relative z-10">
        <div className="max-w-7xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-[#0066ff] tracking-wider uppercase">Features</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Everything you need to land the job
            </h2>
            <p className="text-slate-500 text-xs max-w-sm mx-auto leading-relaxed">
              Professional tools that used to cost hundreds — now free, AI-powered, and built for speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl border border-slate-100 bg-[#ffffff] shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.bg} border ${f.border} ${f.text} group-hover:scale-105 transition duration-300`}>
                      <Icon size={18} />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">{f.title}</h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ─── WORKFLOW SECTION ─── */}
      <section id="workflow" className="py-20 border-t border-slate-100 relative z-10">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-indigo-600 tracking-wider uppercase">How it Works</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              From blank page to interview-ready in 4 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center space-y-3 relative group">
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto shadow-sm group-hover:scale-105 transition duration-300">
                  <span className="text-xs font-extrabold text-[#0066ff]">{step.num}</span>
                </div>
                <h3 className="font-bold text-xs text-slate-800">{step.title}</h3>
                <p className="text-slate-500 text-[11px] leading-relaxed max-w-[200px] mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section id="testimonials" className="py-20 border-t border-slate-100 bg-slate-50/20 relative z-10">
        <div className="max-w-5xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-emerald-600 tracking-wider uppercase">Success Stories</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Loved by modern job seekers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} size={11} className="text-amber-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-600 text-xs italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-6 border-t border-slate-50 mt-6">
                  <div className={`w-8 h-8 rounded-full ${t.bg} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.name}</div>
                    <div className="text-[9px] text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section id="faq" className="py-20 border-t border-slate-100 relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <p className="text-[10px] font-bold text-[#0066ff] tracking-wider uppercase font-semibold">Support</p>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-2">
                <h3 className="font-bold text-xs text-slate-900 flex items-center gap-2">
                  <HelpCircle size={14} className="text-blue-500 shrink-0" />
                  {faq.q}
                </h3>
                <p className="text-slate-500 text-[11px] leading-relaxed pl-5">{faq.a}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── CALL TO ACTION BANNER ─── */}
      <section className="py-16 px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center p-12 rounded-3xl bg-slate-50/50 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#0066ff/[0.02],transparent_65%)] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center space-y-6">
            
            <div className="w-12 h-12 rounded-2xl bg-[#0066ff] flex items-center justify-center shadow-md shadow-blue-500/15">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
                <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
              </svg>
            </div>

            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
              Ready to craft your perfect resume?
            </h2>
            <p className="text-slate-500 text-xs max-w-sm leading-relaxed">
              Join thousands of professionals who landed interviews at leading tech companies. Zero friction, zero card required.
            </p>

            <div className="flex gap-3 justify-center w-full sm:w-auto pt-2">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white bg-[#0066ff] hover:bg-[#0052cc] shadow-md shadow-blue-500/15 text-xs transition duration-200 w-full sm:w-auto"
              >
                Start Building Now
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 text-xs transition duration-200 w-full sm:w-auto"
              >
                Sign In
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-slate-100 py-12 text-center bg-white space-y-4 relative z-10">
        <div className="flex items-center justify-center gap-2">
          <div className="w-6.5 h-6.5 rounded-md bg-[#0066ff] flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
              <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
            </svg>
          </div>
          <span className="font-extrabold text-xs text-slate-900" style={{ fontFamily: 'Outfit, sans-serif' }}>
            ResuCraft <span className="text-[#0066ff]">AI</span>
          </span>
        </div>
        <p className="text-[10px] text-slate-400">
          © {new Date().getFullYear()} ResuCraft AI. Built with ♥ and StepFun AI.
        </p>
        <div className="flex gap-5 justify-center text-[10px] text-slate-400 font-semibold">
          {['Privacy Policy', 'Terms of Service', 'Support'].map((item) => (
            <span key={item} className="hover:text-slate-600 cursor-pointer transition">
              {item}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
