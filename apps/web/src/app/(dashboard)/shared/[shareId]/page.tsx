'use client';

import React, { useEffect, useState, use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchSharedDocument } from '@/lib/api';
import { useDocumentStore } from '@/stores/documentStore';
import { useUIStore } from '@/stores/uiStore';
import PDFViewer from '@/components/pdf/PDFViewer';
import ChatPanel from '@/components/chat/ChatPanel';
import SummaryPanel from '@/components/analysis/SummaryPanel';
import ExtractedDataTable from '@/components/analysis/ExtractedDataTable';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';


export default function SharedDocumentPage({ params }: { params: Promise<{ shareId: string }> }) {
  const resolvedParams = use(params);
  const { shareId } = resolvedParams;

  const { activeDocument, setActiveDocument } = useDocumentStore();
  const { activeTab, setActiveTab } = useUIStore();

  const { data: shareData, isLoading } = useQuery({
    queryKey: ['sharedDocument', shareId],
    queryFn: () => fetchSharedDocument(shareId),
  });

  useEffect(() => {
    if (shareData?.document) {
      setActiveDocument(shareData.document);
    }
  }, [shareData, setActiveDocument]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex items-center justify-center text-slate-400">
        <Icons.Loader2 className="animate-spin text-primary mr-2" size={24} />
        <span>Loading shared document analysis...</span>
      </div>
    );
  }

  if (!activeDocument) {
    return (
      <div className="min-h-screen bg-[#0b0f19] flex flex-col items-center justify-center p-4">
        <h4 className="font-semibold text-slate-300">Shared link invalid or expired</h4>
        <Link href="/login" className="text-primary hover:underline text-xs mt-2">
          Sign up to create your own documents workspace
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col">
      {/* Banner warning */}
      <div className="bg-primary/20 text-primary border-b border-primary/20 p-2.5 text-center text-xs font-semibold flex items-center justify-center gap-2">
        <Icons.Sparkles size={14} /> Shared document preview mode. Sign up to build your own dashboard.
        <Link href="/signup" className="underline font-bold hover:text-white transition ml-2">
          Create Free Account
        </Link>
      </div>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-4 min-h-0">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="font-bold text-slate-100 text-lg">{activeDocument.title}</h2>
          <span className="px-2 py-0.5 rounded bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 text-[10px] font-semibold">
            Public View
          </span>
        </div>

        {/* Split panes */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          <div className="flex-1 min-h-0">
            <PDFViewer fileUrl={`/api/documents/${activeDocument.id}/file`} isReadOnly={true} />
          </div>

          <div className="w-full lg:w-[450px] flex flex-col min-h-0">
            <div className="flex border-b border-slate-800 bg-[#131b2e] p-1 rounded-t-xl">
              {(['chat', 'summary', 'extracted'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider transition capitalize ${
                    activeTab === tab
                      ? 'bg-primary text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 bg-[#131b2e] border-x border-b border-slate-800 rounded-b-xl min-h-0 relative">
              {activeTab === 'chat' && (
                <ChatPanel documentId={activeDocument.id} isShared={true} shareId={shareId} />
              )}

              {activeTab === 'summary' && (
                <SummaryPanel analysis={activeDocument.analysis} />
              )}

              {activeTab === 'extracted' && (
                <ExtractedDataTable
                  documentId={activeDocument.id}
                  extractedData={(activeDocument.analysis?.extractedData as any[]) || []}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
