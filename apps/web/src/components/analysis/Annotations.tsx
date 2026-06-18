'use client';

import React from 'react';
import { Annotation } from '@ai-document-platform/types';
import { useUIStore } from '../../stores/uiStore';
import { Icons } from '../ui/icons';

interface AnnotationsProps {
  annotations: Annotation[];
  isAnnotating: boolean;
  setAnnotating: (ann: boolean) => void;
  onDelete: (id: string) => void;
  isReadOnly?: boolean;
}

export default function Annotations({
  annotations,
  isAnnotating,
  setAnnotating,
  onDelete,
  isReadOnly = false,
}: AnnotationsProps) {
  const { setCurrentPage } = useUIStore();

  return (
    <div className="p-4 space-y-4 text-foreground h-full flex flex-col">
      {/* Annotating Mode Selector */}
      {!isReadOnly && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted border border-border">
          <div className="space-y-0.5">
            <h5 className="text-xs font-semibold text-foreground">Annotation Brush Mode</h5>
            <p className="text-[10px] text-muted-foreground">Click a point on the PDF to attach notes.</p>
          </div>
          <button
            onClick={() => setAnnotating(!isAnnotating)}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              isAnnotating
                ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-sm'
                : 'bg-card hover:bg-slate-50 text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <Icons.PenTool size={12} />
            {isAnnotating ? 'Active' : 'Enable'}
          </button>
        </div>
      )}

      {/* Annotations List */}
      <div className="flex-1 overflow-y-auto space-y-2.5">
        {annotations.length === 0 ? (
          <div className="text-center py-12 px-6 flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 text-muted-foreground border border-border">
              <Icons.PenTool size={24} />
            </div>
            <h4 className="text-sm font-semibold text-muted-foreground">No Annotations Yet</h4>
            <p className="text-xs text-muted-foreground/80 mt-1">
              Toggle annotation brush and click on the PDF to save location specific notes.
            </p>
          </div>
        ) : (
          annotations.map((ann) => (
            <div
              key={ann.id}
              onClick={() => setCurrentPage(ann.pageNumber)}
              className="p-3 rounded-lg bg-muted/40 border border-border hover:border-primary/45 cursor-pointer flex items-start justify-between gap-3 transition"
            >
              <div className="space-y-1.5">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 border border-amber-500/20 text-[10px] font-semibold">
                  Page {ann.pageNumber}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed">{ann.text}</p>
              </div>

              {!isReadOnly && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(ann.id);
                  }}
                  className="p-1 rounded bg-card hover:bg-rose-50 text-muted-foreground hover:text-rose-600 border border-border hover:border-rose-200 transition"
                  title="Delete Annotation"
                >
                  <Icons.Trash2 size={12} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
