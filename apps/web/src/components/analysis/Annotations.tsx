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
    <div className="p-4 space-y-4 text-slate-200 h-full flex flex-col">
      {/* Annotating Mode Selector */}
      {!isReadOnly && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d1322] border border-slate-800">
          <div className="space-y-0.5">
            <h5 className="text-xs font-semibold text-slate-200">Annotation Brush Mode</h5>
            <p className="text-[10px] text-slate-400">Click a point on the PDF to attach notes.</p>
          </div>
          <button
            onClick={() => setAnnotating(!isAnnotating)}
            className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition ${
              isAnnotating
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
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
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-500">
              <Icons.PenTool size={24} />
            </div>
            <h4 className="text-sm font-semibold text-slate-400">No Annotations Yet</h4>
            <p className="text-xs text-slate-500 mt-1">
              Toggle annotation brush and click on the PDF to save location specific notes.
            </p>
          </div>
        ) : (
          annotations.map((ann) => (
            <div
              key={ann.id}
              onClick={() => setCurrentPage(ann.pageNumber)}
              className="p-3 rounded-lg bg-[#0d1322] border border-slate-800/80 hover:border-slate-700 cursor-pointer flex items-start justify-between gap-3 transition"
            >
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20 text-[10px] font-semibold">
                  Page {ann.pageNumber}
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">{ann.text}</p>
              </div>

              {!isReadOnly && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(ann.id);
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 transition"
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
