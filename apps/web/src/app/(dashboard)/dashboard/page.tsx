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
    <div className="space-y-8">
      {/* Welcome & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-100">Workspace Dashboard</h1>
          <p className="text-xs text-slate-400">Manage and analyze your enterprise agreements and PDFs.</p>
        </div>

        {/* Searching bar */}
        <div className="relative w-full md:w-72">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full bg-[#131b2e] border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Upload area */}
      <UploadDropzone onUpload={handleUpload} isUploading={isUploading} />

      {/* ATS Resumes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
            <Icons.Sparkles size={16} className="text-primary" /> ATS Resume Workspace ({resumes.length})
          </h3>
          <button
            onClick={handleCreateResume}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary/95 text-white font-semibold text-xs transition"
          >
            <Icons.Plus size={12} /> Create Resume
          </button>
        </div>

        {loadingResumes ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="h-28 rounded-xl border border-slate-800 bg-[#131b2e] animate-pulse" />
          </div>
        ) : resumes.length === 0 ? (
          <div
            onClick={handleCreateResume}
            className="group cursor-pointer border border-dashed border-slate-800 hover:border-primary/50 rounded-xl bg-[#131b2e]/40 p-6 flex flex-col items-center justify-center text-center transition"
          >
            <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center mb-3 text-slate-400 group-hover:scale-105 transition">
              <Icons.Plus size={18} />
            </div>
            <h4 className="text-xs font-semibold text-slate-300">Create your first ATS-friendly resume</h4>
            <p className="text-[10px] text-slate-500 mt-0.5">Choose from 10 premium templates and correct errors live with AI.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                onClick={() => router.push(`/resume/${resume.id}`)}
                className="cursor-pointer group relative border border-slate-800 hover:border-primary/50 rounded-xl bg-[#131b2e] p-4 flex flex-col justify-between hover:shadow-lg transition h-28"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200 truncate group-hover:text-primary transition">
                    {resume.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-1 capitalize">// Template: {resume.templateId}</p>
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-500">
                  <span>Updated {new Date(resume.updatedAt).toLocaleDateString()}</span>
                  <button
                    onClick={(e) => handleDeleteResume(resume.id, e)}
                    className="p-1 hover:bg-slate-800 text-slate-500 hover:text-rose-500 rounded transition"
                  >
                    <Icons.Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Documents Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
          <Icons.FileText size={16} className="text-primary" /> Captured Documents ({filteredDocs.length})
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-44 rounded-xl border border-slate-800 bg-[#131b2e] animate-pulse" />
            ))}
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-16 border border-slate-800 rounded-xl bg-[#131b2e] flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-500">
              <Icons.FileText size={24} />
            </div>
            <h4 className="text-sm font-semibold text-slate-300">No Documents Found</h4>
            <p className="text-xs text-slate-500 mt-1">
              Upload your first PDF document to begin text extraction and semantic search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Share Modal Dialog overlay */}
      {activeShareToken && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-[#131b2e] border border-slate-800 rounded-xl p-6 shadow-2xl relative space-y-4">
            <button
              onClick={() => setActiveShareToken(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <Icons.X size={16} />
            </button>
            <h4 className="font-bold text-slate-200 flex items-center gap-2">
              <Icons.Share2 size={18} className="text-primary" /> Share Document Link
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Anyone with this link can view the PDF document and use the AI Chat Assistant without logging in.
            </p>
            <div className="flex gap-2">
              <input
                readOnly
                value={`${window.location.origin}/shared/${activeShareToken}`}
                className="flex-1 bg-slate-900 border border-slate-800 text-[11px] p-2.5 rounded-lg text-slate-300"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`${window.location.origin}/shared/${activeShareToken}`);
                  alert('Link copied to clipboard!');
                }}
                className="px-3.5 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/95 transition"
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
