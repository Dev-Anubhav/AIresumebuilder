'use client';

import React, { useState } from 'react';
import { ExtractedField } from '@ai-document-platform/types';
import { useUIStore } from '../../stores/uiStore';
import { Icons } from '../ui/icons';

interface ExtractedDataTableProps {
  documentId: string;
  extractedData: ExtractedField[];
}

export default function ExtractedDataTable({ documentId, extractedData }: ExtractedDataTableProps) {
  const { setCurrentPage, setHighlightedPage } = useUIStore();
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Filter categories
  const categories = ['All', ...Array.from(new Set(extractedData.map((d) => d.category)))];

  const filteredData = activeCategory === 'All'
    ? extractedData
    : extractedData.filter((d) => d.category === activeCategory);

  const handlePageJump = (pageRef: string) => {
    const pageNum = parseInt(pageRef, 10);
    if (!isNaN(pageNum)) {
      setCurrentPage(pageNum);
      setHighlightedPage(pageNum);
      setTimeout(() => setHighlightedPage(null), 3000);
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    // Navigate direct to the endpoint to trigger download attachment
    window.open(`/api/analysis/${documentId}/export?format=${format}`, '_blank');
  };

  return (
    <div className="p-4 space-y-4 text-foreground h-full flex flex-col">
      {/* Category Tabs & Export Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1 overflow-x-auto bg-muted p-1 rounded-lg border border-border">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs transition capitalize ${
                activeCategory === cat
                  ? 'bg-primary text-white font-medium shadow-sm shadow-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => handleExport('csv')}
            className="p-1.5 rounded bg-muted hover:bg-slate-200/50 text-foreground border border-border text-xs flex items-center gap-1.5 transition"
            title="Export CSV"
          >
            <Icons.Download size={12} /> <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={() => handleExport('json')}
            className="p-1.5 rounded bg-muted hover:bg-slate-200/50 text-foreground border border-border text-xs flex items-center gap-1.5 transition"
            title="Export JSON"
          >
            <Icons.Download size={12} /> <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="flex-1 overflow-y-auto border border-border rounded-lg bg-card shadow-sm">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border bg-muted/30 text-muted-foreground font-semibold uppercase tracking-wider">
              <th className="p-3">Field</th>
              <th className="p-3">Value</th>
              <th className="p-3 text-center">Page</th>
              <th className="p-3 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-muted-foreground">
                  No entities extracted in this category.
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-muted/40 transition">
                  <td className="p-3 font-medium text-foreground">{row.field}</td>
                  <td className="p-3 text-muted-foreground max-w-[150px] truncate" title={row.value}>
                    {row.value}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handlePageJump(row.pageReference)}
                      className="px-2 py-0.5 rounded bg-sky-50 hover:bg-sky-100/70 border border-sky-200 text-sky-600 font-semibold text-[10px] transition"
                    >
                      P. {row.pageReference}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`font-semibold ${
                        row.confidence > 0.9
                          ? 'text-emerald-600'
                          : row.confidence > 0.7
                          ? 'text-amber-600'
                          : 'text-rose-600'
                      }`}
                    >
                      {Math.round(row.confidence * 100)}%
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
