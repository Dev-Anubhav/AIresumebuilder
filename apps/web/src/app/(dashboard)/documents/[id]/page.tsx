'use client';

import React, { useEffect, useState, use } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDocumentDetails, fetchChatHistory, fetchAnnotations, createAnnotation, deleteAnnotation, regenerateAnalysis } from '@/lib/api';
import { useDocumentStore } from '@/stores/documentStore';
import { useChatStore } from '@/stores/chatStore';
import { useUIStore } from '@/stores/uiStore';
import PDFViewer from '@/components/pdf/PDFViewer';
import ChatPanel from '@/components/chat/ChatPanel';
import SummaryPanel from '@/components/analysis/SummaryPanel';
import ExtractedDataTable from '@/components/analysis/ExtractedDataTable';
import Annotations from '@/components/analysis/Annotations';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';


export default function DocumentDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const { id } = resolvedParams;

  const { activeDocument, setActiveDocument, annotations, setAnnotations, addAnnotation, deleteAnnotation: storeDeleteAnnotation } = useDocumentStore();
  const { setMessages } = useChatStore();
  const { activeTab, setActiveTab, isAnnotating, setAnnotating } = useUIStore();

  // Load Document Details
  const { data: docData, isLoading: docLoading } = useQuery({
    queryKey: ['document', id],
    queryFn: () => fetchDocumentDetails(id),
  });

  // Load Chat History
  const { data: chatData } = useQuery({
    queryKey: ['chatHistory', id],
    queryFn: () => fetchChatHistory(id),
  });

  // Load Annotations
  const { data: annotData } = useQuery({
    queryKey: ['annotations', id],
    queryFn: () => fetchAnnotations(id),
  });

  useEffect(() => {
    if (docData?.document) {
      setActiveDocument(docData.document);
    }
    if (chatData?.messages) {
      setMessages(chatData.messages);
    }
    if (annotData?.annotations) {
      setAnnotations(annotData.annotations);
    }
  }, [docData, chatData, annotData, setActiveDocument, setMessages, setAnnotations]);

  // Mutations
  const annotMutation = useMutation({
    mutationFn: (newAnn: Parameters<typeof createAnnotation>[1]) => createAnnotation(id, newAnn),
    onSuccess: (data) => {
      addAnnotation(data.annotation);
      queryClient.invalidateQueries({ queryKey: ['annotations', id] });
    },
  });

  const deleteAnnotMutation = useMutation({
    mutationFn: (annId: string) => deleteAnnotation(annId),
    onSuccess: (_, annId) => {
      storeDeleteAnnotation(annId);
      queryClient.invalidateQueries({ queryKey: ['annotations', id] });
    },
  });

  const regenMutation = useMutation({
    mutationFn: () => regenerateAnalysis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document', id] });
    },
  });

  if (docLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center text-slate-400">
        <Icons.Loader2 className="animate-spin text-primary mr-2" size={24} />
        <span>Loading document details and vector mappings...</span>
      </div>
    );
  }

  if (!activeDocument) {
    return (
      <div className="text-center py-12">
        <h4 className="font-semibold text-slate-300">Document details not found</h4>
        <Link href="/dashboard" className="text-primary hover:underline text-xs mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="h-[82vh] flex flex-col gap-4">
      {/* Detail bar */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded bg-muted hover:bg-slate-200/50 text-muted-foreground border border-border transition"
          >
            <Icons.ChevronLeft size={16} />
          </Link>
          <div>
            <h2 className="font-bold text-foreground text-lg">{activeDocument.title}</h2>
            <p className="text-[10px] text-muted-foreground">Document ID: {activeDocument.id}</p>
          </div>
        </div>
      </div>

      {/* Main split panes container */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
        {/* Left Pane - PDF Canvas */}
        <div className="flex-1 min-h-0">
          <PDFViewer fileUrl={`/api/documents/${id}/file`} />
        </div>

        {/* Right Pane - AI Tabs Layout */}
        <div className="w-full lg:w-[450px] flex flex-col min-h-0">
          <div className="flex border-b border-border bg-card p-1 rounded-t-xl">
            {(['chat', 'summary', 'extracted', 'annotations'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 rounded text-xs font-semibold uppercase tracking-wider transition capitalize ${
                  activeTab === tab
                    ? 'bg-primary text-white shadow-sm shadow-primary/10'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex-1 bg-card border-x border-b border-border rounded-b-xl min-h-0 relative">
            {activeTab === 'chat' && <ChatPanel documentId={id} />}

            {activeTab === 'summary' && (
              <SummaryPanel
                analysis={activeDocument.analysis}
                onRegenerate={() => regenMutation.mutate()}
                isRegenerating={regenMutation.isPending}
              />
            )}

            {activeTab === 'extracted' && (
              <ExtractedDataTable
                documentId={id}
                extractedData={(activeDocument.analysis?.extractedData as any[]) || []}
              />
            )}

            {activeTab === 'annotations' && (
              <Annotations
                annotations={annotations}
                isAnnotating={isAnnotating}
                setAnnotating={setAnnotating}
                onDelete={(annId) => deleteAnnotMutation.mutate(annId)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
