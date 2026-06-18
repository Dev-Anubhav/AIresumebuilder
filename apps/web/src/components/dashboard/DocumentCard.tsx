'use client';

import React, { useState } from 'react';
import { Document } from '@/lib/types';
import { Icons } from '../ui/icons';
import { formatBytes } from '../../lib/utils';
import Link from 'next/link';

interface DocumentCardProps {
  document: Document;
  onRename: (id: string, newTitle: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}

export default function DocumentCard({ document, onRename, onDelete, onShare }: DocumentCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(document.title);

  const handleRenameSubmit = () => {
    if (titleInput.trim() && titleInput !== document.title) {
      onRename(document.id, titleInput);
    }
    setIsEditing(false);
  };

  const getStatusBadge = () => {
    switch (document.status) {
      case 'PROCESSING':
        return (
          <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-semibold flex items-center gap-1">
            <Icons.Loader2 size={10} className="animate-spin" /> Processing
          </span>
        );
      case 'FAILED':
        return (
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-semibold flex items-center gap-1">
            <Icons.AlertTriangle size={10} /> Failed
          </span>
        );
      case 'READY':
        return (
          <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[10px] font-semibold flex items-center gap-1">
            Ready
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-semibold">
            {document.status}
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-white/80 bg-white/85 backdrop-blur-md p-4 flex flex-col justify-between hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group relative overflow-hidden">
      {/* Background card accent */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition" />

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-primary group-hover:scale-105 transition">
            <Icons.FileText size={20} />
          </div>
          {getStatusBadge()}
        </div>

        {/* Title editing */}
        <div>
          {isEditing ? (
            <input
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleRenameSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleRenameSubmit()}
              className="w-full bg-muted border border-border text-xs px-2 py-1 rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white"
              autoFocus
            />
          ) : (
            <h4
              onClick={() => setIsEditing(true)}
              className="font-semibold text-foreground text-sm hover:text-primary transition cursor-pointer truncate"
              title="Click to rename"
            >
              {document.title}
            </h4>
          )}
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{document.originalName}</p>
        </div>

        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>{formatBytes(document.fileSize)}</span>
          <span>{document.pageCount} pages</span>
        </div>
      </div>

      {/* Buttons block */}
      <div className="pt-4 mt-4 border-t border-border flex items-center justify-between">
        <Link
          href={`/documents/${document.id}`}
          className={`px-3 py-1.5 rounded bg-primary hover:bg-primary/95 text-white text-xs font-semibold flex items-center gap-1 transition shadow-sm shadow-primary/10 ${
            document.status !== 'READY' && 'opacity-50 pointer-events-none'
          }`}
        >
          Open <Icons.ArrowRight size={10} />
        </Link>

        <div className="flex gap-1">
          <button
            onClick={() => onShare(document.id)}
            disabled={document.status !== 'READY'}
            className="p-1.5 rounded bg-muted hover:bg-slate-200/50 text-muted-foreground hover:text-foreground border border-border transition disabled:opacity-50"
            title="Share document link"
          >
            <Icons.Share2 size={12} />
          </button>
          <button
            onClick={() => onDelete(document.id)}
            className="p-1.5 rounded bg-muted hover:bg-rose-50 text-muted-foreground hover:text-rose-600 border border-border hover:border-rose-200 transition"
            title="Delete document"
          >
            <Icons.Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
