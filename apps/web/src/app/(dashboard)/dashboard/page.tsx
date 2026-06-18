'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDocuments, renameDocument, deleteDocument, createShareToken } from '@/lib/api';
import { useDocumentStore } from '@/stores/documentStore';
import UploadDropzone from '@/components/dashboard/UploadDropzone';
import DocumentCard from '@/components/dashboard/DocumentCard';
import { Icons } from '@/components/ui/icons';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { documents, setDocuments } = useDocumentStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeShareToken, setActiveShareToken] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [resumes, setResumes] = useState<any[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  
  // Profile name state
  const [userName, setUserName] = useState('User');

  // Interactive Cover Letter modal states
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [clJobTitle, setClJobTitle] = useState('');
  const [clCompany, setClCompany] = useState('');
  const [clGenerated, setClGenerated] = useState('');
  const [clGenerating, setClGenerating] = useState(false);

  // Document Section Ref for scroll matching
  const docSectionRef = useRef<HTMLDivElement>(null);

  // Fetch user profile info
  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) {
          setUserName(data.user.name || data.user.email.split('@')[0] || 'User');
        }
      })
      .catch(() => null);
  }, []);

  // Tanstack Query documents hook
  const { data, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: fetchDocuments,
  });

  useEffect(() => {
    if (data?.documents) {
      setDocuments(data.documents);
    }
  }, [data, setDocuments]);

  // Rename Mutation
  const renameMutation = useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => renameDocument(id, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  // Share Token Mutation
  const shareMutation = useMutation({
    mutationFn: (id: string) => createShareToken(id),
    onSuccess: (data) => {
      setActiveShareToken(data.token);
    },
  });

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name.replace('.pdf', ''));

    try {
      const res = await fetch('/api/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Upload failed');
      }

      queryClient.invalidateQueries({ queryKey: ['documents'] });
    } catch (err: any) {
      alert(err.message || 'Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  // Poll processing files every 5s if active
  const hasProcessing = documents.some((doc) => doc.status === 'PROCESSING' || doc.status === 'UPLOADING');
  useEffect(() => {
    if (!hasProcessing) return;
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    }, 5000);
    return () => clearInterval(interval);
  }, [hasProcessing, queryClient]);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await fetch('/api/resumes');
      if (res.ok) {
        const data = await res.json();
        setResumes(data.resumes || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingResumes(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      const res = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'My New Resume' }),
      });
      if (res.ok) {
        const data = await res.json();
        router.push(`/resume/${data.resume.id}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to create resume');
    }
  };

  const handleDeleteResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this resume?')) return;
    try {
      const res = await fetch(`/api/resumes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setResumes((prev) => prev.filter((r) => r.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateCoverLetter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clJobTitle || !clCompany) return;
    setClGenerating(true);
    setClGenerated('');

    // Mock generation typewriter effect
    setTimeout(() => {
      const generatedText = `Dear Hiring Team,

I am writing to express my enthusiastic interest in the ${clJobTitle} position at ${clCompany}. With a proven track record of designing high-impact technical assets and building performant workflows, I am confident that my background matches the qualifications you are seeking.

Throughout my career, I have dedicated myself to optimizing systems and driving collaborative projects. I look forward to bringing my passion and technical expertise to ${clCompany} and contributing directly to your team's success.

Thank you for your time and consideration.

Sincerely,
${userName}`;
      setClGenerated(generatedText);
      setClGenerating(false);
    }, 1200);
  };

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">

      {/* ── TOP GREETING HEADER (Forma Design) ───────────────────────────────── */}
      <div className="space-y-1 py-1">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
          Good Morning, {userName}!
        </h2>
        <p className="text-xs text-muted-foreground font-medium">
          A new day, a new opportunity! Let's create something amazing together.
        </p>
      </div>

      {/* ── THREE HORIZONTAL FEATURE ACTION CARDS (Forma Design) ─────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Build Resume */}
        <div 
          onClick={handleCreateResume}
          className="bg-[#ffffff] border border-[#e2e8f0] p-6 rounded-2xl flex flex-col justify-between h-40 cursor-pointer shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0066ff] group-hover:scale-105 transition duration-300">
              <Icons.FileText size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-2">Help me build my resume</h3>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px]">
              Start fresh or let AI guide your layout and keywords.
            </p>
          </div>
          <div className="absolute right-4 bottom-4 w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#0066ff] group-hover:text-white group-hover:border-transparent transition-all duration-300">
            <Icons.ArrowRight size={12} />
          </div>
        </div>

        {/* Card 2: Cover Letter */}
        <div 
          onClick={() => setShowCoverLetterModal(true)}
          className="bg-[#ffffff] border border-[#e2e8f0] p-6 rounded-2xl flex flex-col justify-between h-40 cursor-pointer shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#ffdcd2]/20 border border-[#ffdcd2]/40 flex items-center justify-center text-[#832b13] group-hover:scale-105 transition duration-300">
              <Icons.Sparkles size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-2">Help me craft a cover letter</h3>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px]">
              AI will generate a personalized cover letter instantly.
            </p>
          </div>
          <div className="absolute right-4 bottom-4 w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#0066ff] group-hover:text-white group-hover:border-transparent transition-all duration-300">
            <Icons.ArrowRight size={12} />
          </div>
        </div>

        {/* Card 3: Job Match */}
        <div 
          onClick={() => docSectionRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#ffffff] border border-[#e2e8f0] p-6 rounded-2xl flex flex-col justify-between h-40 cursor-pointer shadow-sm hover:shadow-md hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden group"
        >
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition duration-300">
              <Icons.Search size={18} />
            </div>
            <h3 className="font-bold text-slate-900 text-sm mt-2">Help me find the right job match</h3>
            <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px]">
              See how well your resume fits a target job description.
            </p>
          </div>
          <div className="absolute right-4 bottom-4 w-7 h-7 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#0066ff] group-hover:text-white group-hover:border-transparent transition-all duration-300">
            <Icons.ArrowRight size={12} />
          </div>
        </div>

      </div>

      {/* ── TWO-COLUMN MAIN GRID (Forma Layout) ───────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* Left main area (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recently Opened Resumes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Icons.Grid size={13} className="text-primary" />
                Recently Opened ({resumes.length})
              </h3>
              {resumes.length > 0 && (
                <button
                  onClick={handleCreateResume}
                  className="text-xs text-primary hover:underline font-bold"
                >
                  + Create another
                </button>
              )}
            </div>

            {loadingResumes ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-24 rounded-2xl border border-slate-100 bg-white animate-pulse" />
                <div className="h-24 rounded-2xl border border-slate-100 bg-white animate-pulse" />
              </div>
            ) : resumes.length === 0 ? (
              <div
                onClick={handleCreateResume}
                className="group cursor-pointer border-2 border-dashed border-slate-200 hover:border-primary/50 rounded-2xl bg-[#ffffff] p-8 flex flex-col items-center justify-center text-center transition duration-300"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary group-hover:scale-105 transition duration-300">
                  <Icons.Plus size={20} />
                </div>
                <h4 className="text-xs font-bold text-slate-800">Build your first ATS-friendly resume</h4>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-sm">
                  Select from 10 premium layouts, track real-time ATS keyword matching, and get tailored coaching.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {resumes.map((resume) => (
                  <div
                    key={resume.id}
                    onClick={() => router.push(`/resume/${resume.id}`)}
                    className="cursor-pointer group relative border border-slate-100 hover:border-primary/30 rounded-2xl bg-[#ffffff] p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-24 overflow-hidden"
                  >
                    <div className="flex gap-4">
                      {/* Visual Resume Sheet Mockup */}
                      <div className="w-10 h-14 rounded bg-slate-50 border border-slate-200 flex flex-col p-1.5 shrink-0 select-none group-hover:border-primary/30 transition duration-300">
                        <div className="h-1.5 w-3/4 bg-primary/20 rounded mb-1" />
                        <div className="h-1 w-1/2 bg-slate-400/20 rounded mb-1.5" />
                        <div className="space-y-0.5">
                          <div className="h-0.5 w-full bg-slate-300/30 rounded" />
                          <div className="h-0.5 w-5/6 bg-slate-300/30 rounded" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-primary transition duration-200">
                            {resume.title}
                          </h4>
                          <p className="text-[9px] text-muted-foreground mt-0.5 capitalize font-medium">// {resume.templateId} template</p>
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-muted-foreground font-medium">
                          <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                          <button
                            onClick={(e) => handleDeleteResume(resume.id, e)}
                            className="p-1 hover:bg-rose-50 text-muted-foreground hover:text-rose-500 rounded transition"
                            title="Delete resume"
                          >
                            <Icons.Trash2 size={11} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Document Analysis Platform Section */}
          <div ref={docSectionRef} className="space-y-3 pt-2">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Icons.FileText size={13} className="text-primary" />
              Document Analysis Platform ({filteredDocs.length})
            </h3>

            {/* Upload Area */}
            <UploadDropzone onUpload={handleUpload} isUploading={isUploading} />

            {/* Documents List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-32 rounded-2xl border border-slate-100 bg-white animate-pulse" />
                <div className="h-32 rounded-2xl border border-slate-100 bg-white animate-pulse" />
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-10 border border-slate-200 border-dashed rounded-2xl bg-white/40 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3 text-muted-foreground">
                  <Icons.FileText size={18} />
                </div>
                <h4 className="text-xs font-bold text-slate-800">No analysis documents</h4>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-xs leading-relaxed">
                  Upload job descriptions or professional materials to analyze keywords and ask questions.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredDocs.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onRename={(id, title) => renameMutation.mutate({ id, title })}
                    onDelete={(id) => {
                      if (confirm('Are you sure you want to delete this document?')) {
                        deleteMutation.mutate(id);
                      }
                    }}
                    onShare={(id) => shareMutation.mutate(id)}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right sidebar insights area */}
        <div className="space-y-6">
          
          {/* Quick Finder */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-4 shadow-sm space-y-3">
            <h4 className="font-extrabold text-[10px] text-slate-900 uppercase tracking-wider">Quick Finder</h4>
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find resumes or PDFs..."
                className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl pl-9 pr-4 py-2 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition"
              />
            </div>
          </div>

          {/* AI Coach Insights */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
            <h4 className="font-extrabold text-[10px] text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Icons.Sparkles size={12} className="text-primary" />
              Coach Insights
            </h4>

            <div className="space-y-3">
              {[
                { title: 'Action-Oriented Verbs', desc: 'Start bullet points with strong verbs (e.g., Led, Developed, Optimized).' },
                { title: 'Quantifiable Metrics', desc: 'Describe results with solid numbers (e.g., Increased sales by 15%, Cut API latency).' },
                { title: 'Tailored Formatting', desc: 'Map your resume layout specifically to match target job industry requirements.' },
              ].map((tip, i) => (
                <div key={i} className="text-xs border-l-2 border-primary/20 pl-3 py-0.5">
                  <div className="font-bold text-slate-800 text-[11px]">{tip.title}</div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-primary/[0.03] border border-primary/10 rounded-xl p-3 text-[10px] text-primary font-semibold flex items-center gap-2">
              <Icons.Sparkles size={12} className="shrink-0" />
              <span>ProTip: Ask the AI Coach directly inside your workspace to suggest template changes.</span>
            </div>
          </div>

          {/* Workspace Stats */}
          <div className="bg-[#ffffff] border border-[#e2e8f0] rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-extrabold text-[10px] text-slate-900 uppercase tracking-wider">Workspace Health</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#f8fafc] rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-medium text-slate-400">Resumes</div>
                <div className="text-xl font-black text-slate-800 mt-1">{resumes.length}</div>
              </div>
              <div className="bg-[#f8fafc] rounded-xl p-3 border border-slate-100">
                <div className="text-[10px] font-medium text-slate-400">PDF Docs</div>
                <div className="text-xl font-black text-slate-800 mt-1">{documents.length}</div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ── GENERATE COVER LETTER MODAL DIALOG ─────────────────────────────────── */}
      {showCoverLetterModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-lg bg-[#ffffff] border border-slate-200 rounded-2xl p-6 shadow-xl relative space-y-4">
            <button
              onClick={() => {
                setShowCoverLetterModal(false);
                setClJobTitle('');
                setClCompany('');
                setClGenerated('');
              }}
              className="absolute top-4 right-4 text-muted-foreground hover:text-slate-800 transition p-1 rounded-lg hover:bg-slate-50"
            >
              <Icons.X size={15} />
            </button>
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#0066ff] flex items-center justify-center shadow-sm">
                <Icons.Sparkles size={16} />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">AI Cover Letter Assistant</h4>
            </div>

            <p className="text-[10.5px] text-muted-foreground leading-relaxed">
              Create a personalized, high-performance cover letter tailored to your dream job instantly.
            </p>

            <form onSubmit={handleGenerateCoverLetter} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Target Job Title</label>
                  <input
                    required
                    value={clJobTitle}
                    onChange={(e) => setClJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] text-xs p-2.5 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Target Company</label>
                  <input
                    required
                    value={clCompany}
                    onChange={(e) => setClCompany(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] text-xs p-2.5 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
                  />
                </div>
              </div>

              {!clGenerated && (
                <button
                  type="submit"
                  disabled={clGenerating}
                  className="w-full py-2 px-4 rounded-lg bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5"
                >
                  {clGenerating ? (
                    <>
                      <Icons.Loader2 size={12} className="animate-spin" /> Generating...
                    </>
                  ) : (
                    <>
                      <Icons.Sparkles size={12} /> Generate Cover Letter
                    </>
                  )}
                </button>
              )}
            </form>

            {clGenerated && (
              <div className="space-y-3 animate-fade-in">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Generated Letter Draft</label>
                  <textarea
                    readOnly
                    value={clGenerated}
                    rows={8}
                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] text-[10px] p-3 rounded-lg text-slate-800 leading-relaxed font-mono focus:outline-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(clGenerated);
                      alert('Cover letter copied to clipboard!');
                    }}
                    className="flex-1 py-2 rounded-lg bg-[#0066ff] hover:bg-[#0052cc] text-white text-xs font-bold transition"
                  >
                    Copy to Clipboard
                  </button>
                  <button
                    onClick={() => {
                      setClGenerated('');
                      setClJobTitle('');
                      setClCompany('');
                    }}
                    className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Share Modal Dialog overlay */}
      {activeShareToken && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-6 shadow-xl relative space-y-4">
            <button
              onClick={() => setActiveShareToken(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-slate-800 transition"
            >
              <Icons.X size={16} />
            </button>
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Icons.Share2 size={18} className="text-primary" /> Share Document Link
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Anyone with this link can view the PDF document and use the AI Chat Assistant without logging in.
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={`${window.location.origin}/shared/${activeShareToken}`}
                className="flex-1 bg-[#f8fafc] border border-slate-200 text-[11px] p-2.5 rounded-lg text-slate-800 focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/shared/${activeShareToken}`);
                  alert('Link copied to clipboard!');
                }}
                className="px-3.5 py-2 rounded-lg bg-[#0066ff] text-white text-xs font-semibold hover:bg-[#0052cc] transition"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
