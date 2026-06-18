'use client';

import React, { useEffect, useState } from 'react';
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

  const filteredDocs = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-1">
      {/* ── TOP HERO BANNER ────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-md border border-white/95 p-6 shadow-sm">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#ffdcd2]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold tracking-wider uppercase">
              <Icons.Sparkles size={10} />
              AI Resume Assistant Active
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
              Create and Optimize Your Career Assets
            </h2>
            <p className="text-xs text-muted-foreground max-w-xl leading-relaxed">
              Build ATS-friendly resumes or extract key metrics from reference letters, job specs, and contract files. Add AI insights to double your callback rates.
            </p>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={handleCreateResume}
              className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/95 text-white font-bold text-xs shadow-md shadow-primary/10 transition flex items-center justify-center gap-1.5"
            >
              <Icons.Plus size={13} /> Create ATS Resume
            </button>
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD GRID ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Main Content (col-span-2) */}
        <div className="lg:col-span-2 space-y-6">
          {/* ATS Resumes Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Icons.Sparkles size={15} className="text-primary animate-pulse" />
                Your Resume Builders ({resumes.length})
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
                <div className="h-24 rounded-xl border border-white/80 bg-white/70 animate-pulse" />
                <div className="h-24 rounded-xl border border-white/80 bg-white/70 animate-pulse" />
              </div>
            ) : resumes.length === 0 ? (
              <div
                onClick={handleCreateResume}
                className="group cursor-pointer border-2 border-dashed border-white/80 hover:border-primary/50 rounded-xl bg-white/60 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center transition duration-300"
              >
                <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary group-hover:scale-105 transition duration-300">
                  <Icons.Plus size={20} />
                </div>
                <h4 className="text-xs font-bold text-foreground">Build your first ATS-friendly resume</h4>
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
                    className="cursor-pointer group relative border border-white/80 hover:border-primary/30 rounded-xl bg-white/85 backdrop-blur-md p-4 flex flex-col justify-between shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 h-24 overflow-hidden"
                  >
                    <div className="flex gap-4">
                      {/* Visual Resume Sheet Mockup */}
                      <div className="w-10 h-14 rounded bg-background border border-border/80 flex flex-col p-1.5 shrink-0 select-none group-hover:border-primary/30 transition duration-300">
                        <div className="h-1.5 w-3/4 bg-primary/30 rounded mb-1" />
                        <div className="h-1 w-1/2 bg-slate-400/20 rounded mb-1.5" />
                        <div className="space-y-0.5">
                          <div className="h-0.5 w-full bg-slate-300/40 rounded" />
                          <div className="h-0.5 w-5/6 bg-slate-300/40 rounded" />
                          <div className="h-0.5 w-2/3 bg-slate-300/40 rounded" />
                        </div>
                      </div>

                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-foreground truncate group-hover:text-primary transition duration-200">
                            {resume.title}
                          </h4>
                          <p className="text-[10px] text-muted-foreground mt-0.5 capitalize">// {resume.templateId} template</p>
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-muted-foreground">
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

          {/* Captured Documents Section */}
          <div className="space-y-3 pt-2">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
              <Icons.FileText size={15} className="text-primary" />
              Document Analysis Platform ({filteredDocs.length})
            </h3>

            {/* Upload Area */}
            <UploadDropzone onUpload={handleUpload} isUploading={isUploading} />

            {/* Documents List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-32 rounded-xl border border-border bg-card animate-pulse" />
                <div className="h-32 rounded-xl border border-border bg-card animate-pulse" />
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="text-center py-10 border border-border rounded-xl bg-card/40 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground">
                  <Icons.FileText size={18} />
                </div>
                <h4 className="text-xs font-bold text-foreground">No analysis documents</h4>
                <p className="text-[10px] text-muted-foreground mt-1 max-w-xs">
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

        {/* Right: Sidebar Insights (col-span-1) */}
        <div className="space-y-6">
          {/* Quick Search */}
          <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-4 shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Quick Finder</h4>
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={13} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find resumes or PDFs..."
                className="w-full bg-muted border border-border rounded-xl pl-9 pr-4 py-2 text-[11px] text-foreground placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition"
              />
            </div>
          </div>

          {/* AI Coach Insights */}
          <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-5 shadow-sm space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none" />
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
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
                  <div className="font-bold text-foreground text-[11px]">{tip.title}</div>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 text-[10px] text-primary font-semibold flex items-center gap-2">
              <Icons.Sparkles size={12} className="shrink-0" />
              <span>ProTip: Ask the AI Coach directly inside your workspace to suggest template changes.</span>
            </div>
          </div>

          {/* Workspace Stats */}
          <div className="bg-white/80 backdrop-blur-md border border-white/90 rounded-2xl p-5 shadow-sm space-y-3">
            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">Workspace Health</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/60 rounded-xl p-3 border border-white/50">
                <div className="text-xs text-muted-foreground">Resumes</div>
                <div className="text-xl font-extrabold text-foreground mt-1">{resumes.length}</div>
              </div>
              <div className="bg-white/60 rounded-xl p-3 border border-white/50">
                <div className="text-xs text-muted-foreground">PDF Docs</div>
                <div className="text-xl font-extrabold text-foreground mt-1">{documents.length}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal Dialog overlay */}
      {activeShareToken && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-white/90 rounded-xl p-6 shadow-xl relative space-y-4">
            <button
              onClick={() => setActiveShareToken(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <Icons.X size={16} />
            </button>
            <h4 className="font-bold text-foreground flex items-center gap-2">
              <Icons.Share2 size={18} className="text-primary" /> Share Document Link
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Anyone with this link can view the PDF document and use the AI Chat Assistant without logging in.
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={`${window.location.origin}/shared/${activeShareToken}`}
                className="flex-1 bg-muted border border-border text-[11px] p-2.5 rounded-lg text-foreground focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/shared/${activeShareToken}`);
                  alert('Link copied to clipboard!');
                }}
                className="px-3.5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-[#483a93] transition"
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
