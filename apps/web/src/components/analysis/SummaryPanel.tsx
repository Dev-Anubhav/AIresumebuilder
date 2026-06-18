'use client';

import React from 'react';
import { DocumentAnalysis } from '@ai-document-platform/types';
import { Icons } from '../ui/icons';

interface SummaryPanelProps {
  analysis?: DocumentAnalysis | null;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export default function SummaryPanel({ analysis, onRegenerate, isRegenerating = false }: SummaryPanelProps) {
  if (!analysis) {
    return (
      <div className="text-center py-12 px-6 flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mb-4 text-slate-400">
          <Icons.FileText size={24} />
        </div>
        <h4 className="text-sm font-semibold text-slate-300">No Analysis Available</h4>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">
          Document analysis details will register as soon as processing finishes.
        </p>
      </div>
    );
  }

  // Parse risk flags if stringified JSON
  const riskFlags: string[] = Array.isArray(analysis.riskFlags)
    ? analysis.riskFlags
    : (typeof analysis.riskFlags === 'string'
      ? JSON.parse(analysis.riskFlags)
      : []);

  return (
    <div className="p-4 space-y-6 overflow-y-auto h-full text-slate-200">
      {/* Category header */}
      <div className="flex flex-wrap gap-2">
        <span className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
          {analysis.documentType || 'Document'}
        </span>
        <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold">
          {analysis.language || 'English'}
        </span>
      </div>

      {/* Executive Summary */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <Icons.FileText size={16} className="text-primary" /> Executive Summary
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-[#0d1322] p-3 rounded-lg border border-slate-800">
          {analysis.summary}
        </p>
      </div>

      {/* Key Insights List */}
      <div className="space-y-2">
        <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-2">
          <Icons.Sparkles size={16} className="text-amber-400" /> Key Insights
        </h4>
        <ul className="space-y-2.5 text-xs text-slate-300">
          {(analysis.keyInsights as string[]).map((insight, index) => (
            <li key={index} className="flex items-start gap-2 bg-[#0d1322] p-2.5 rounded-lg border border-slate-800">
              <span className="text-amber-400 font-bold mt-0.5">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Warnings & Risk Flags card */}
      {riskFlags.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5 border-b border-slate-800 pb-2">
            <Icons.ShieldAlert size={16} className="text-rose-500" /> Detected Risks & Warning Clauses
          </h4>
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 space-y-3">
            {riskFlags.map((risk, index) => (
              <div key={index} className="flex gap-2 text-xs text-rose-300 leading-relaxed">
                <Icons.AlertTriangle size={14} className="text-rose-500 shrink-0 mt-0.5" />
                <span>{risk}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Controls */}
      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <button
          onClick={onRegenerate}
          disabled={isRegenerating}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50"
        >
          {isRegenerating ? <Icons.Loader2 size={12} className="animate-spin" /> : <Icons.Sparkles size={12} />}
          {isRegenerating ? 'Regenerating...' : 'Regenerate Analysis'}
        </button>
      </div>
    </div>
  );
}
