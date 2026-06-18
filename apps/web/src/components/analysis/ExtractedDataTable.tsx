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
    <div className="p-4 space-y-4 text-slate-200 h-full flex flex-col">
      {/* Category Tabs & Export Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex gap-1 overflow-x-auto bg-[#0d1322] p-1 rounded-lg border border-slate-800">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs transition capitalize ${
                activeCategory === cat
                  ? 'bg-primary text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex gap-1.5">
          <button
            onClick={() => handleExport('csv')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
            title="Export CSV"
          >
            <Icons.Download size={12} /> <span className="hidden sm:inline">CSV</span>
          </button>
          <button
            onClick={() => handleExport('json')}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 transition"
            title="Export JSON"
          >
            <Icons.Download size={12} /> <span className="hidden sm:inline">JSON</span>
          </button>
        </div>
      </div>

      {/* Table view */}
      <div className="flex-1 overflow-y-auto border border-slate-800 rounded-lg bg-[#0d1322]">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#131b2e] text-slate-400 font-semibold uppercase tracking-wider">
              <th className="p-3">Field</th>
              <th className="p-3">Value</th>
              <th className="p-3 text-center">Page</th>
              <th className="p-3 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500">
                  No entities extracted in this category.
                </td>
              </tr>
            ) : (
              filteredData.map((row, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-medium text-slate-300">{row.field}</td>
                  <td className="p-3 text-slate-200 max-w-[150px] truncate" title={row.value}>
                    {row.value}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handlePageJump(row.pageReference)}
                      className="px-2 py-0.5 rounded bg-sky-950 hover:bg-sky-900 border border-sky-500/20 text-sky-400 font-semibold text-[10px] transition"
                    >
                      P. {row.pageReference}
                    </button>
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`font-semibold ${
                        row.confidence > 0.9
                          ? 'text-emerald-400'
                          : row.confidence > 0.7
                          ? 'text-amber-400'
                          : 'text-rose-400'
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
