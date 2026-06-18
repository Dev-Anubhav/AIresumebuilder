'use client';

import React, { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/components/ui/icons';
import { ResumePreview, ResumeData } from '@/components/resume/ResumeTemplates';

// ─── Template catalog with color swatches & descriptions ───────────────────
const TEMPLATES = [
  {
    id: 'minimalist',
    name: 'Classic Minimalist',
    accent: '#1a1a1a',
    secondary: '#555',
    bg: '#fff',
    description: 'Clean, timeless layout. Perfect for traditional industries.',
    category: 'Professional',
    preview: 'minimalist',
  },
  {
    id: 'modern',
    name: 'Modern Professional',
    accent: '#4f46e5',
    secondary: '#818cf8',
    bg: '#f8f9ff',
    description: 'Bold indigo accents with sidebar layout. Great for corporate roles.',
    category: 'Corporate',
    preview: 'modern',
  },
  {
    id: 'tech',
    name: 'Tech / Developer',
    accent: '#059669',
    secondary: '#064e3b',
    bg: '#f2faf6',
    description: 'Light developer aesthetic. Clean monospace structure.',
    category: 'Tech',
    preview: 'tech',
  },
  {
    id: 'executive',
    name: 'Executive Bold',
    accent: '#0f172a',
    secondary: '#475569',
    bg: '#f1f5f9',
    description: 'Strong header, dual column. Ideal for C-level and VP roles.',
    category: 'Executive',
    preview: 'executive',
  },
  {
    id: 'creative',
    name: 'Creative / Design',
    accent: '#e11d48',
    secondary: '#fb7185',
    bg: '#fff1f2',
    description: 'Vibrant accents for designers, marketers, and creatives.',
    category: 'Creative',
    preview: 'creative',
  },
  {
    id: 'academic',
    name: 'Academic / CV',
    accent: '#1e3a5f',
    secondary: '#3b82f6',
    bg: '#f0f4ff',
    description: 'Publication-ready. Suitable for researchers and academics.',
    category: 'Academic',
    preview: 'academic',
  },
  {
    id: 'elegant',
    name: 'Elegant Serif',
    accent: '#78350f',
    secondary: '#d97706',
    bg: '#fffbeb',
    description: 'Warm serif typography. Premium look for finance and law.',
    category: 'Premium',
    preview: 'elegant',
  },
  {
    id: 'startup',
    name: 'Startup Sans',
    accent: '#2563eb',
    secondary: '#60a5fa',
    bg: '#eff6ff',
    description: 'Modern sans-serif for startups, product, and growth roles.',
    category: 'Startup',
    preview: 'startup',
  },
];

// ─── Visual mini-preview thumbnail for the template picker ──────────────────
function TemplateThumbnail({ template }: { template: typeof TEMPLATES[0] }) {
  const isDark = template.bg === '#030712';
  return (
    <div
      className="w-full aspect-[3/4] rounded-lg overflow-hidden shadow-md border-2 border-transparent group-hover:border-blue-500 transition-all duration-200"
      style={{ background: template.bg }}
    >
      {/* Header strip */}
      <div
        className="w-full px-3 pt-3 pb-2"
        style={{ background: isDark ? '#111827' : template.accent + '15' }}
      >
        <div
          className="h-2.5 rounded w-3/4 mb-1"
          style={{ background: template.accent, opacity: 0.9 }}
        />
        <div
          className="h-1.5 rounded w-1/2"
          style={{ background: template.secondary, opacity: 0.6 }}
        />
        <div className="flex gap-1.5 mt-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-1 rounded flex-1"
              style={{ background: isDark ? '#374151' : template.secondary + '50' }}
            />
          ))}
        </div>
      </div>

      {/* Body lines */}
      <div className="px-3 pt-2.5 space-y-2">
        {/* Section header */}
        <div className="flex items-center gap-1.5">
          <div className="h-0.5 w-3" style={{ background: template.accent }} />
          <div className="h-1 rounded w-16" style={{ background: isDark ? '#4b5563' : template.accent + '70' }} />
        </div>
        {/* Content lines */}
        {[80, 60, 90, 50, 70].map((w, i) => (
          <div
            key={i}
            className="h-1 rounded"
            style={{
              width: `${w}%`,
              background: isDark ? '#374151' : '#94a3b8',
              opacity: 0.5,
            }}
          />
        ))}

        {/* Section header 2 */}
        <div className="flex items-center gap-1.5 pt-1">
          <div className="h-0.5 w-3" style={{ background: template.accent }} />
          <div className="h-1 rounded w-20" style={{ background: isDark ? '#4b5563' : template.accent + '70' }} />
        </div>
        {[75, 55, 85].map((w, i) => (
          <div
            key={i}
            className="h-1 rounded"
            style={{
              width: `${w}%`,
              background: isDark ? '#374151' : '#94a3b8',
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Template Picker Modal ───────────────────────────────────────────────────
function TemplatePickerModal({
  currentId,
  onSelect,
  onClose,
}: {
  currentId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
}) {
  const [selected, setSelected] = useState(currentId);
  const categories = ['All', ...Array.from(new Set(TEMPLATES.map((t) => t.category)))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = activeCategory === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="w-full max-w-4xl bg-card border border-border rounded-2xl overflow-hidden shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-base font-bold text-foreground">Choose a Template</h2>
            <p className="text-xs text-muted-foreground mt-0.5">All templates are ATS-optimized and print-ready</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground transition">
            <Icons.X size={18} />
          </button>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 px-6 py-3 border-b border-border overflow-x-auto scrollbar-none bg-[#fbfaf8]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-sm shadow-primary/10'
                  : 'bg-muted text-muted-foreground hover:text-foreground border border-border'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-4 overflow-y-auto max-h-[60vh]">
          {filtered.map((tmpl) => (
            <button
              key={tmpl.id}
              onClick={() => setSelected(tmpl.id)}
              className={`group text-left rounded-xl p-2 border border-transparent transition ${
                selected === tmpl.id
                  ? 'ring-2 ring-primary bg-muted/60'
                  : 'hover:bg-muted/40'
              }`}
            >
              <TemplateThumbnail template={tmpl} />
              <div className="mt-2 px-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-foreground">{tmpl.name}</span>
                  {selected === tmpl.id && (
                    <span className="text-[9px] bg-primary text-white px-1.5 py-0.5 rounded font-bold">Active</span>
                  )}
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5 block leading-snug">{tmpl.description}</span>
                <span
                  className="text-[9px] font-bold mt-1.5 inline-block px-1.5 py-0.5 rounded"
                  style={{ background: tmpl.accent + '25', color: tmpl.accent === '#030712' ? '#16a34a' : tmpl.accent }}
                >
                  {tmpl.category}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-[#fbfaf8]">
          <button onClick={onClose} className="px-4 py-2 text-xs text-muted-foreground hover:text-foreground transition">
            Cancel
          </button>
          <button
            onClick={() => {
              onSelect(selected);
              onClose();
            }}
            className="px-5 py-2 bg-primary hover:bg-primary/95 text-white font-semibold text-xs rounded-lg shadow-sm shadow-primary/10 transition"
          >
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Resume Builder Page ────────────────────────────────────────────────
export default function ResumeBuilderPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'education' | 'skills' | 'projects'>('info');
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(0.65);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);

  const [title, setTitle] = useState('My Resume');
  const [templateId, setTemplateId] = useState('minimalist');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: { name: '', email: '', phone: '', website: '', location: '', title: '', summary: '' },
    experience: [],
    education: [],
    skills: [],
    projects: [],
  });

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; suggestion?: any }>>([
    {
      role: 'assistant',
      content: "Hello! I'm your AI Resume Coach 🎯 Ask me to rewrite your summary, improve bullet points, suggest skills, or restructure any section to be more ATS-friendly!",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isAiResponding, setIsAiResponding] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchResume(); }, [id]);
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const fetchResume = async () => {
    try {
      const res = await fetch(`/api/resumes/${id}`);
      if (!res.ok) throw new Error('Failed to load resume');
      const data = await res.json();
      setTitle(data.resume.title);
      setTemplateId(data.resume.templateId);
      setResumeData({
        personalInfo: (data.resume.personalInfo as any) || { name: '', email: '', phone: '', website: '', location: '', title: '', summary: '' },
        experience: (data.resume.experience as any) || [],
        education: (data.resume.education as any) || [],
        skills: (data.resume.skills as any) || [],
        projects: (data.resume.projects as any) || [],
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (updatedData = resumeData, updatedTemplate = templateId, updatedTitle = title) => {
    setSaving(true);
    try {
      await fetch(`/api/resumes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: updatedTitle, templateId: updatedTemplate, ...updatedData }),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const updatePersonalInfo = (field: keyof ResumeData['personalInfo'], value: string) => {
    const newData = { ...resumeData, personalInfo: { ...resumeData.personalInfo, [field]: value } };
    setResumeData(newData);
    handleSave(newData);
  };

  const addExperience = () => {
    const newData = { ...resumeData, experience: [...resumeData.experience, { company: '', role: '', location: '', startDate: '', endDate: '', current: false, description: '' }] };
    setResumeData(newData); handleSave(newData);
  };
  const updateExperience = (idx: number, field: string, value: any) => {
    const list = [...resumeData.experience]; list[idx] = { ...list[idx], [field]: value };
    const newData = { ...resumeData, experience: list }; setResumeData(newData); handleSave(newData);
  };
  const removeExperience = (idx: number) => {
    const newData = { ...resumeData, experience: resumeData.experience.filter((_, i) => i !== idx) };
    setResumeData(newData); handleSave(newData);
  };

  const addEducation = () => {
    const newData = { ...resumeData, education: [...resumeData.education, { institution: '', degree: '', fieldOfStudy: '', location: '', startDate: '', endDate: '', gpa: '' }] };
    setResumeData(newData); handleSave(newData);
  };
  const updateEducation = (idx: number, field: string, value: string) => {
    const list = [...resumeData.education]; list[idx] = { ...list[idx], [field]: value };
    const newData = { ...resumeData, education: list }; setResumeData(newData); handleSave(newData);
  };
  const removeEducation = (idx: number) => {
    const newData = { ...resumeData, education: resumeData.education.filter((_, i) => i !== idx) };
    setResumeData(newData); handleSave(newData);
  };

  const addSkill = (skill: string) => {
    if (!skill.trim() || resumeData.skills.includes(skill.trim())) return;
    const newData = { ...resumeData, skills: [...resumeData.skills, skill.trim()] };
    setResumeData(newData); handleSave(newData);
  };
  const removeSkill = (skill: string) => {
    const newData = { ...resumeData, skills: resumeData.skills.filter((s) => s !== skill) };
    setResumeData(newData); handleSave(newData);
  };

  const addProject = () => {
    const newData = { ...resumeData, projects: [...resumeData.projects, { name: '', description: '', technologies: '', link: '' }] };
    setResumeData(newData); handleSave(newData);
  };
  const updateProject = (idx: number, field: string, value: string) => {
    const list = [...resumeData.projects]; list[idx] = { ...list[idx], [field]: value };
    const newData = { ...resumeData, projects: list }; setResumeData(newData); handleSave(newData);
  };
  const removeProject = (idx: number) => {
    const newData = { ...resumeData, projects: resumeData.projects.filter((_, i) => i !== idx) };
    setResumeData(newData); handleSave(newData);
  };

  const applySuggestion = (suggestion: any) => {
    let newData = { ...resumeData };
    if (suggestion.type === 'summary') newData.personalInfo = { ...newData.personalInfo, summary: suggestion.value };
    else if (suggestion.type === 'skills') newData.skills = [...new Set([...newData.skills, ...suggestion.value])];
    setResumeData(newData); handleSave(newData);
    setMessages((prev) => [...prev, { role: 'assistant', content: '✅ Applied! Your resume has been updated.' }]);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;
    const userMsg = inputMessage;
    setInputMessage('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setIsAiResponding(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `${userMsg}\n\n[Resume data: ${JSON.stringify(resumeData)}. Act as expert ATS coach. Give concise improvements. If suggesting changes, end with a JSON block: \`\`\`json { "type": "summary"|"skills", "value": string|string[] } \`\`\`]`,
        }),
      });
      if (!response.ok) throw new Error('Response error');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = '';
      if (reader) {
        setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantMsg += decoder.decode(value);
          setMessages((prev) => { const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: assistantMsg }; return c; });
        }
      }
      const match = assistantMsg.match(/```json\s*([\s\S]*?)\s*```/);
      if (match?.[1]) {
        try {
          const parsed = JSON.parse(match[1].trim());
          setMessages((prev) => { const c = [...prev]; c[c.length - 1] = { role: 'assistant', content: assistantMsg.replace(/```json[\s\S]*?```/, '').trim(), suggestion: parsed }; return c; });
        } catch (e) { /* ignore */ }
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, connection error. Please try again.' }]);
    } finally {
      setIsAiResponding(false);
    }
  };

  const currentTemplate = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] flex-col gap-3">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-slate-400">Loading Resume Builder...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden bg-background">

      {/* ── TOP HEADER BAR ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 border-b border-border bg-card shrink-0 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground border border-border transition shrink-0"
          >
            <Icons.ChevronLeft size={16} />
          </button>
          <div className="min-w-0">
            <input
              value={title}
              onChange={(e) => { setTitle(e.target.value); handleSave(resumeData, templateId, e.target.value); }}
              className="bg-transparent text-base font-bold text-foreground focus:outline-none w-52 sm:w-72 truncate"
            />
            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
              {saving ? (
                <><Icons.Loader2 className="animate-spin text-primary" size={10} /> Saving...</>
              ) : (
                <><span className="text-emerald-500 font-bold">✓</span> Saved</>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Panel toggles */}
          <div className="flex items-center gap-1 bg-muted border border-border rounded-lg p-0.5">
            <button
              onClick={() => setIsLeftPanelOpen((o) => !o)}
              title="Toggle Form Editor"
              className={`p-1.5 rounded transition-all duration-200 ${
                isLeftPanelOpen ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-slate-200/50 hover:text-foreground'
              }`}
            >
              <Icons.List size={13} />
            </button>
            <button
              onClick={() => setIsRightPanelOpen((o) => !o)}
              title="Toggle AI Coach"
              className={`p-1.5 rounded transition-all duration-200 ${
                isRightPanelOpen ? 'bg-primary text-white shadow-sm' : 'text-muted-foreground hover:bg-slate-200/50 hover:text-foreground'
              }`}
            >
              <Icons.MessageSquare size={13} />
            </button>
          </div>

          {/* Template button */}
          <button
            onClick={() => setShowTemplatePicker(true)}
            className="flex items-center gap-2 px-3 py-2 bg-muted hover:bg-slate-200/50 border border-border rounded-lg text-xs text-foreground transition"
          >
            <div
              className="w-3 h-3 rounded-sm"
              style={{ background: currentTemplate.accent }}
            />
            <span className="hidden sm:inline">{currentTemplate.name}</span>
            <Icons.ChevronRight size={12} className="rotate-95 text-muted-foreground" />
          </button>

          {/* Zoom controls */}
          <div className="hidden sm:flex items-center gap-1 bg-muted border border-border rounded-lg px-2 py-1">
            <button onClick={() => setPreviewZoom((z) => Math.max(0.4, z - 0.1))} className="p-1 text-muted-foreground hover:text-foreground transition">
              <Icons.ZoomOut size={13} />
            </button>
            <span className="text-[10px] text-muted-foreground w-9 text-center">{Math.round(previewZoom * 100)}%</span>
            <button onClick={() => setPreviewZoom((z) => Math.min(1.2, z + 0.1))} className="p-1 text-muted-foreground hover:text-foreground transition">
              <Icons.ZoomIn size={13} />
            </button>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/95 text-white font-semibold text-xs transition shadow-md shadow-primary/10"
          >
            <Icons.Download size={13} /> Export PDF
          </button>
        </div>
      </div>

      {/* ── MAIN THREE-COLUMN LAYOUT ────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden animate-fade-in">

        {/* LEFT — Form editor */}
        <div className={`transition-all duration-300 ease-in-out border-r border-border bg-card flex flex-col overflow-hidden ${
          isLeftPanelOpen ? 'w-80 opacity-100 shrink-0' : 'w-0 opacity-0 pointer-events-none border-r-0'
        }`}>
          {/* Tabs */}
          <div className="flex border-b border-border shrink-0 overflow-x-auto scrollbar-none bg-[#fbfaf8]">
            {(['info', 'experience', 'education', 'skills', 'projects'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 shrink-0 whitespace-nowrap px-3 text-center py-3 text-[10px] font-bold uppercase tracking-wider transition border-b-2 ${
                  activeTab === tab
                    ? 'border-primary text-primary bg-muted/30'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {/* ── INFO ── */}
            {activeTab === 'info' && (
              <div className="space-y-3 text-xs">
                <p className="text-muted-foreground text-[10px] pb-1">Fill in your personal details. These appear at the top of your resume.</p>
                {[
                  { label: 'Full Name', field: 'name' as const, placeholder: 'Jane Doe' },
                  { label: 'Job Title', field: 'title' as const, placeholder: 'Senior Product Manager' },
                  { label: 'Email', field: 'email' as const, placeholder: 'jane@example.com' },
                  { label: 'Phone', field: 'phone' as const, placeholder: '+1 555 0199' },
                  { label: 'Location', field: 'location' as const, placeholder: 'New York, NY' },
                  { label: 'Website / LinkedIn', field: 'website' as const, placeholder: 'linkedin.com/in/jane' },
                ].map(({ label, field, placeholder }) => (
                  <div key={field} className="space-y-1">
                    <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</label>
                    <input
                      value={resumeData.personalInfo[field]}
                      onChange={(e) => updatePersonalInfo(field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition"
                    />
                  </div>
                ))}
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Professional Summary</label>
                  <textarea
                    rows={4}
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                    placeholder="Results-driven professional with 5+ years of experience..."
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition resize-none"
                  />
                </div>
              </div>
            )}

            {/* ── EXPERIENCE ── */}
            {activeTab === 'experience' && (
              <div className="space-y-3">
                <button
                  onClick={addExperience}
                  className="w-full py-2.5 border border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 bg-card flex items-center justify-center gap-1.5 text-xs transition"
                >
                  <Icons.Plus size={13} /> Add Work Experience
                </button>
                {resumeData.experience.map((exp, idx) => (
                  <div key={idx} className="bg-muted/40 border border-border rounded-lg p-3 space-y-2.5 relative text-xs">
                    <button onClick={() => removeExperience(idx)} className="absolute top-3 right-3 text-muted-foreground hover:text-rose-600 transition">
                      <Icons.Trash2 size={13} />
                    </button>
                    <div className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wide">Position {idx + 1}</div>
                    {[
                      { label: 'Company', field: 'company', placeholder: 'Stripe' },
                      { label: 'Role', field: 'role', placeholder: 'Senior Engineer' },
                      { label: 'Location', field: 'location', placeholder: 'San Francisco, CA' },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <label className="text-[9px] text-muted-foreground font-semibold uppercase">{label}</label>
                        <input
                          value={(exp as any)[field]}
                          onChange={(e) => updateExperience(idx, field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full bg-muted border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-muted-foreground font-semibold uppercase">Start</label>
                        <input
                          value={exp.startDate}
                          onChange={(e) => updateExperience(idx, 'startDate', e.target.value)}
                          placeholder="Jan 2022"
                          className="w-full bg-muted border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-muted-foreground font-semibold uppercase">End</label>
                        <input
                          disabled={exp.current}
                          value={exp.endDate}
                          onChange={(e) => updateExperience(idx, 'endDate', e.target.value)}
                          placeholder="Present"
                          className="w-full bg-muted border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white disabled:opacity-30"
                        />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-[10px] text-muted-foreground cursor-pointer">
                      <input type="checkbox" checked={exp.current} onChange={(e) => updateExperience(idx, 'current', e.target.checked)} className="rounded" />
                      Currently working here
                    </label>
                    <div>
                      <label className="text-[9px] text-muted-foreground font-semibold uppercase">Achievements (one per line, start with –)</label>
                      <textarea
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateExperience(idx, 'description', e.target.value)}
                        placeholder="– Led team of 8 engineers to ship product ahead of schedule&#10;– Reduced API latency by 40%"
                        className="w-full bg-muted border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── EDUCATION ── */}
            {activeTab === 'education' && (
              <div className="space-y-3">
                <button
                  onClick={addEducation}
                  className="w-full py-2.5 border border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 bg-card flex items-center justify-center gap-1.5 text-xs transition"
                >
                  <Icons.Plus size={13} /> Add Education
                </button>
                {resumeData.education.map((edu, idx) => (
                  <div key={idx} className="bg-muted/40 border border-border rounded-lg p-3 space-y-2.5 relative text-xs">
                    <button onClick={() => removeEducation(idx)} className="absolute top-3 right-3 text-muted-foreground hover:text-rose-600 transition">
                      <Icons.Trash2 size={13} />
                    </button>
                    <div className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wide">Entry {idx + 1}</div>
                    {[
                      { label: 'Institution', field: 'institution', placeholder: 'MIT' },
                      { label: 'Degree', field: 'degree', placeholder: 'Bachelor of Science' },
                      { label: 'Field of Study', field: 'fieldOfStudy', placeholder: 'Computer Science' },
                      { label: 'Location', field: 'location', placeholder: 'Cambridge, MA' },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <label className="text-[9px] text-muted-foreground font-semibold uppercase">{label}</label>
                        <input
                          value={(edu as any)[field]}
                          onChange={(e) => updateEducation(idx, field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full bg-muted border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                        />
                      </div>
                    ))}
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Start', field: 'startDate', placeholder: '2019' },
                        { label: 'End', field: 'endDate', placeholder: '2023' },
                        { label: 'GPA', field: 'gpa', placeholder: '3.9' },
                      ].map(({ label, field, placeholder }) => (
                        <div key={field}>
                          <label className="text-[9px] text-muted-foreground font-semibold uppercase">{label}</label>
                          <input
                            value={(edu as any)[field]}
                            onChange={(e) => updateEducation(idx, field, e.target.value)}
                            placeholder={placeholder}
                            className="w-full bg-muted border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── SKILLS ── */}
            {activeTab === 'skills' && (
              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Add a Skill</label>
                  <input
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        addSkill((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                    placeholder="Type and press Enter (e.g. React, Python, SQL)"
                    className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-xs text-foreground placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  />
                  <p className="text-[9px] text-muted-foreground/85">Press Enter to add each skill separately</p>
                </div>
                {resumeData.skills.length > 0 && (
                  <div>
                    <div className="text-[10px] text-muted-foreground mb-2 font-semibold uppercase">Your Skills ({resumeData.skills.length})</div>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, i) => (
                        <span key={i} className="flex items-center gap-1 pl-3 pr-1.5 py-1 bg-primary/10 border border-primary/20 text-primary rounded-full text-[10px] font-semibold">
                          {skill}
                          <button onClick={() => removeSkill(skill)} className="ml-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-primary/20 hover:bg-rose-100 hover:text-rose-600 transition">
                            <Icons.X size={8} />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── PROJECTS ── */}
            {activeTab === 'projects' && (
              <div className="space-y-3">
                <button
                  onClick={addProject}
                  className="w-full py-2.5 border border-dashed border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 bg-card flex items-center justify-center gap-1.5 text-xs transition"
                >
                  <Icons.Plus size={13} /> Add Project
                </button>
                {resumeData.projects.map((proj, idx) => (
                  <div key={idx} className="bg-muted/40 border border-border rounded-lg p-3 space-y-2.5 relative text-xs">
                    <button onClick={() => removeProject(idx)} className="absolute top-3 right-3 text-muted-foreground hover:text-rose-600 transition">
                      <Icons.Trash2 size={13} />
                    </button>
                    <div className="font-semibold text-muted-foreground text-[10px] uppercase tracking-wide">Project {idx + 1}</div>
                    {[
                      { label: 'Project Name', field: 'name', placeholder: 'AI Document Platform' },
                      { label: 'Link / URL', field: 'link', placeholder: 'github.com/yourname/project' },
                      { label: 'Technologies', field: 'technologies', placeholder: 'React, Node.js, Prisma, PostgreSQL' },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field}>
                        <label className="text-[9px] text-muted-foreground font-semibold uppercase">{label}</label>
                        <input
                          value={(proj as any)[field]}
                          onChange={(e) => updateProject(idx, field, e.target.value)}
                          placeholder={placeholder}
                          className="w-full bg-muted border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="text-[9px] text-muted-foreground font-semibold uppercase">Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={(e) => updateProject(idx, 'description', e.target.value)}
                        placeholder="Built a full-stack AI resume platform serving 500+ users..."
                        className="w-full bg-muted border border-border rounded-md px-2.5 py-1.5 text-xs text-foreground mt-0.5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* CENTER — Full A4 Preview */}
        <div className="flex-1 bg-[#f5f3f0] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 bg-[#fbfaf8] border-b border-border shrink-0">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Icons.FileText size={12} className="text-primary" />
              Live Preview — {currentTemplate.name}
            </span>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <span>A4 Page</span>
              <span className="mx-1.5">·</span>
              <span>ATS Safe</span>
              <span className="mx-1.5">·</span>
              <span>Print Ready</span>
            </div>
          </div>

          {/* Scrollable preview area */}
          <div ref={previewRef} className="flex-1 overflow-auto py-8 px-4 flex justify-center">
            <div
              style={{
                transform: `scale(${previewZoom})`,
                transformOrigin: 'top center',
                width: '210mm',
                minHeight: '297mm',
                marginBottom: `calc((${previewZoom} - 1) * 297mm)`,
              }}
            >
              <div id="resume-preview" className="shadow-lg border border-slate-200">
                <ResumePreview data={resumeData} templateId={templateId} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — AI Coach */}
        <div className={`transition-all duration-300 ease-in-out border-l border-border bg-card flex flex-col overflow-hidden ${
          isRightPanelOpen ? 'w-72 opacity-100 shrink-0' : 'w-0 opacity-0 pointer-events-none border-l-0'
        }`}>
          <div className="px-4 py-3 border-b border-border shrink-0 bg-[#fbfaf8]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icons.Sparkles className="text-primary" size={14} />
              </div>
              <div>
                <div className="text-xs font-bold text-foreground">AI Resume Coach</div>
                <div className="text-[9px] text-emerald-600 font-semibold">● Online · StepFun AI</div>
              </div>
            </div>
          </div>

          <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-3 bg-card">
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mb-1 text-primary">
                    <Icons.Sparkles size={10} />
                  </div>
                )}
                <div
                  className={`max-w-[92%] rounded-xl px-3 py-2.5 text-[11px] leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-br-sm shadow-sm shadow-primary/10'
                      : 'bg-muted border border-border text-foreground rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>

                {msg.suggestion && (
                  <div className="mt-2 w-full max-w-[92%] bg-[#f5f3ff] border border-indigo-200 rounded-xl p-3 space-y-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded bg-primary/10 flex items-center justify-center">
                        <Icons.Sparkles size={9} className="text-primary" />
                      </div>
                      <span className="text-[10px] font-bold text-primary">AI Suggestion</span>
                    </div>
                    <p className="text-[10px] text-slate-600 leading-snug">
                      {msg.suggestion.type === 'summary'
                        ? 'Rewrite professional summary with ATS keywords'
                        : `Add ${msg.suggestion.value?.length} skills to your profile`}
                    </p>
                    <button
                      onClick={() => applySuggestion(msg.suggestion)}
                      className="w-full py-1.5 bg-primary hover:bg-primary/95 text-white font-semibold rounded-lg text-[10px] shadow-sm transition flex items-center justify-center gap-1"
                    >
                      <Icons.ArrowRight size={10} /> Apply to Resume
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isAiResponding && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex items-start gap-2">
                <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                  <Icons.Sparkles size={10} />
                </div>
                <div className="bg-muted border border-border rounded-xl rounded-bl-sm px-3 py-2.5">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-border shrink-0 bg-[#fbfaf8]">
            <div className="flex gap-2">
              <input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask coach anything..."
                className="flex-1 bg-muted border border-border rounded-xl px-3 py-2 text-[11px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white placeholder-slate-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isAiResponding}
                className="w-8 h-8 rounded-xl bg-primary hover:bg-primary/95 disabled:opacity-40 text-white flex items-center justify-center transition shrink-0"
              >
                <Icons.Send size={13} />
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-1">
              {['Improve my summary', 'Suggest skills', 'Fix bullet points'].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => { setInputMessage(prompt); }}
                  className="text-[9px] px-2 py-1 rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/45 transition"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Template Picker Modal */}
      {showTemplatePicker && (
        <TemplatePickerModal
          currentId={templateId}
          onSelect={(newId) => {
            setTemplateId(newId);
            handleSave(resumeData, newId);
          }}
          onClose={() => setShowTemplatePicker(false)}
        />
      )}

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          body > * { visibility: hidden !important; }
          #resume-preview, #resume-preview * { visibility: visible !important; }
          #resume-preview {
            position: fixed !important;
            top: 0; left: 0;
            width: 100vw;
            transform: none !important;
          }
        }
      `}</style>
    </div>
  );
}
