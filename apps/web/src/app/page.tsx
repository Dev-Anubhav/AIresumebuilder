import Link from 'next/link';
import { Sparkles, FileText, Zap, Shield, Star, ArrowRight, CheckCircle, ChevronRight, Users, Award } from 'lucide-react';

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
    accent: '#6366f1',
  },
  {
    icon: FileText,
    title: '8 Premium Templates',
    desc: 'Choose from 8 professionally designed, ATS-tested templates — from minimalist to executive bold.',
    accent: '#10b981',
  },
  {
    icon: Zap,
    title: 'Instant ATS Preview',
    desc: 'See exactly how your resume looks to applicant tracking systems. Live A4 preview updates as you type.',
    accent: '#f59e0b',
  },
  {
    icon: Shield,
    title: 'One-Click Export',
    desc: 'Export print-ready PDFs directly from your browser. No watermarks, no limits.',
    accent: '#ec4899',
  },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Software Engineer at Razorpay',
    quote: 'ResuCraft AI helped me rewrite my resume in under 10 minutes. I got 3 interview calls within a week.',
    initials: 'PS',
    color: '#6366f1',
  },
  {
    name: 'Rahul Mehta',
    role: 'Product Manager at Swiggy',
    quote: 'The ATS optimization feature is a game-changer. My response rate went from 5% to 40% after using ResuCraft.',
    initials: 'RM',
    color: '#10b981',
  },
  {
    name: 'Ananya Singh',
    role: 'Data Scientist at Flipkart',
    quote: 'Clean, beautiful templates. The AI coach understood exactly what my industry needed. Highly recommend!',
    initials: 'AS',
    color: '#ec4899',
  },
];

const steps = [
  { num: '01', title: 'Choose a Template', desc: 'Pick from 8 ATS-friendly designs that match your industry and style.' },
  { num: '02', title: 'Fill in Your Details', desc: 'Add your experience, education, skills, and projects with guided forms.' },
  { num: '03', title: 'Ask the AI Coach', desc: 'Get instant suggestions to optimize your content for any job description.' },
  { num: '04', title: 'Export & Apply', desc: 'Download a pixel-perfect PDF resume and start applying with confidence.' },
];

// ─── Page Component ──────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div
      className="min-h-screen text-slate-100"
      style={{
        background: 'linear-gradient(135deg, #060b18 0%, #0b0f1e 50%, #0d1226 100%)',
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
        style={{
          borderBottom: '1px solid rgba(99,102,241,0.12)',
          background: 'rgba(10,14,28,0.7)',
          backdropFilter: 'blur(16px)',
          position: 'sticky',
          top: 0,
          zIndex: 50,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 24px',
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(99,102,241,0.4)',
              }}
            >
              {/* Brand mark — stylised R */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
                <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
              </svg>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 18,
                letterSpacing: '-0.5px',
                color: '#f1f5f9',
              }}
            >
              ResuCraft <span style={{ color: '#818cf8' }}>AI</span>
            </span>
          </div>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link
              href="/login"
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                color: '#94a3b8',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              style={{
                padding: '9px 20px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                boxShadow: '0 2px 12px rgba(99,102,241,0.35)',
                transition: 'opacity 0.2s',
              }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '100px 24px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow orbs */}
        <div
          style={{
            position: 'absolute',
            top: -120,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(99,102,241,0.14) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '15%',
            width: 300,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: '10%',
            width: 300,
            height: 300,
            background: 'radial-gradient(ellipse, rgba(236,72,153,0.08) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 760, margin: '0 auto' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              borderRadius: 100,
              border: '1px solid rgba(99,102,241,0.3)',
              background: 'rgba(99,102,241,0.08)',
              marginBottom: 32,
            }}
          >
            <Star size={12} color="#818cf8" />
            <span style={{ fontSize: 12, fontWeight: 600, color: '#818cf8' }}>
              AI-Powered Resume Builder — 100% Free to Start
            </span>
          </div>

          {/* Headline */}
          <h1
            style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              color: '#f8fafc',
              marginBottom: 24,
            }}
          >
            Build Resumes That{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Actually Get Interviews
            </span>
          </h1>

          {/* Sub */}
          <p
            style={{
              fontSize: 18,
              color: '#94a3b8',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto 40px',
              fontWeight: 400,
            }}
          >
            AI coaching + 8 premium ATS-optimized templates. Create, correct, and perfect your
            resume in minutes — not hours.
          </p>

          {/* CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 12,
              flexWrap: 'wrap',
            }}
          >
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 28px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 700,
                color: '#fff',
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                boxShadow: '0 4px 24px rgba(99,102,241,0.45)',
                letterSpacing: '-0.2px',
              }}
            >
              Create My Resume Free
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '14px 24px',
                borderRadius: 12,
                fontSize: 15,
                fontWeight: 600,
                color: '#94a3b8',
                textDecoration: 'none',
                border: '1px solid rgba(148,163,184,0.2)',
                background: 'rgba(255,255,255,0.03)',
              }}
            >
              Sign In
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Social proof */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 20,
              marginTop: 48,
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: '10,000+ resumes created' },
              { label: '8 premium templates' },
              { label: 'ATS score improvement' },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  color: '#64748b',
                  fontWeight: 500,
                }}
              >
                <CheckCircle size={13} color="#10b981" />
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#6366f1', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            Features
          </p>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-1px',
              marginBottom: 14,
            }}
          >
            Everything you need to land the job
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
            Professional tools that used to cost hundreds — now free, AI-powered, and effortless.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
          }}
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                style={{
                  padding: '28px 24px',
                  borderRadius: 16,
                  border: '1px solid rgba(148,163,184,0.08)',
                  background: 'rgba(19,27,46,0.7)',
                  backdropFilter: 'blur(8px)',
                  transition: 'border-color 0.2s, transform 0.2s',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${f.accent}18`,
                    border: `1px solid ${f.accent}30`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Icon size={20} color={f.accent} />
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 16, color: '#f1f5f9', marginBottom: 8 }}>
                  {f.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section
        style={{
          padding: '80px 24px',
          background: 'rgba(15,20,35,0.6)',
          borderTop: '1px solid rgba(99,102,241,0.08)',
          borderBottom: '1px solid rgba(99,102,241,0.08)',
        }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#10b981', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
              How it Works
            </p>
            <h2
              style={{
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 800,
                color: '#f1f5f9',
                letterSpacing: '-1px',
              }}
            >
              From blank page to interview-ready in 4 steps
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 28 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    background: 'rgba(99,102,241,0.12)',
                    border: '1.5px solid rgba(99,102,241,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#818cf8' }}>{step.num}</span>
                </div>
                <h3 style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0', marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ──────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#ec4899', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            Social Proof
          </p>
          <h2
            style={{
              fontSize: 'clamp(24px, 3.5vw, 38px)',
              fontWeight: 800,
              color: '#f1f5f9',
              letterSpacing: '-1px',
            }}
          >
            Loved by job seekers
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                padding: '24px',
                borderRadius: 16,
                border: '1px solid rgba(148,163,184,0.08)',
                background: 'rgba(19,27,46,0.6)',
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {[...Array(5)].map((_, si) => (
                  <Star key={si} size={13} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p style={{ color: '#94a3b8', fontSize: 14, lineHeight: 1.65, marginBottom: 20, fontStyle: 'italic' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: t.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#fff',
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#64748b' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px' }}>
        <div
          style={{
            maxWidth: 800,
            margin: '0 auto',
            textAlign: 'center',
            padding: '64px 40px',
            borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.10) 100%)',
            border: '1px solid rgba(99,102,241,0.25)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: 'absolute',
              top: -60,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 400,
              height: 200,
              background: 'radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 6px 24px rgba(99,102,241,0.4)',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 20 20" fill="none">
                <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
                <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
              </svg>
            </div>

            <h2
              style={{
                fontSize: 'clamp(26px, 4vw, 40px)',
                fontWeight: 800,
                color: '#f8fafc',
                letterSpacing: '-1px',
                marginBottom: 14,
              }}
            >
              Ready to craft your perfect resume?
            </h2>
            <p style={{ color: '#94a3b8', fontSize: 15, marginBottom: 36, lineHeight: 1.6 }}>
              Join thousands of professionals who landed their dream jobs with ResuCraft AI.
              No credit card required.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                href="/signup"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 32px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #6366f1, #818cf8)',
                  boxShadow: '0 4px 20px rgba(99,102,241,0.45)',
                }}
              >
                Start Building Now
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '14px 24px',
                  borderRadius: 12,
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#94a3b8',
                  textDecoration: 'none',
                  border: '1px solid rgba(148,163,184,0.2)',
                  background: 'rgba(255,255,255,0.04)',
                }}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: '1px solid rgba(148,163,184,0.08)',
          padding: '32px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #818cf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
              <path d="M4 3h7a4 4 0 0 1 0 8H4V3Z" fill="white" opacity="0.9" />
              <path d="M4 11h5.5l4.5 6H11L7 11.2V17H4v-6Z" fill="white" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, color: '#94a3b8' }}>
            ResuCraft <span style={{ color: '#6366f1' }}>AI</span>
          </span>
        </div>
        <p style={{ fontSize: 12, color: '#475569' }}>
          © {new Date().getFullYear()} ResuCraft AI. Built with ♥ and StepFun AI.
        </p>
        <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 12 }}>
          {['Privacy Policy', 'Terms of Service', 'Contact'].map((item) => (
            <span key={item} style={{ fontSize: 12, color: '#475569', cursor: 'pointer' }}>
              {item}
            </span>
          ))}
        </div>
      </footer>
    </div>
  );
}
