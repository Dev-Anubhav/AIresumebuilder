'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useUIStore } from '../../stores/uiStore';
import { useDocumentStore } from '../../stores/documentStore';
import { Annotation } from '@ai-document-platform/types';
import { cn } from '../../lib/utils';
import { Icons } from '../ui/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Set up pdfjs-dist worker URL path config
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  fileUrl: string;
  isReadOnly?: boolean;
}

export default function PDFViewer({ fileUrl, isReadOnly = false }: PDFViewerProps) {
  const {
    zoomScale,
    currentPage,
    totalPages,
    isAnnotating,
    highlightedPage,
    setCurrentPage,
    setTotalPages,
    setHighlightedPage,
  } = useUIStore();

  const { annotations, addAnnotation, deleteAnnotation } = useDocumentStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [clickAnnotationPos, setClickAnnotationPos] = useState<{ x: number; y: number } | null>(null);
  const [noteText, setNoteText] = useState('');

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setTotalPages(numPages);
  };

  const handlePageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isAnnotating || isReadOnly) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setClickAnnotationPos({ x, y });
  };

  const submitAnnotation = () => {
    if (!clickAnnotationPos || !noteText.trim()) return;

    const newAnnot: Annotation = {
      id: Math.random().toString(36).substring(2),
      documentId: 'active-doc',
      userId: 'user-id',
      pageNumber: currentPage,
      x: clickAnnotationPos.x,
      y: clickAnnotationPos.y,
      width: 15,
      height: 6,
      text: noteText,
      color: '#fbbf24',
      createdAt: new Date().toISOString(),
    };

    addAnnotation(newAnnot);
    setClickAnnotationPos(null);
    setNoteText('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0d1322] border border-slate-800 rounded-xl overflow-hidden relative">
      {/* Viewer Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-[#131b2e] sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <Icons.ChevronLeft size={16} />
          </button>
          <span className="text-sm text-slate-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <Icons.ChevronRight size={16} />
          </button>
        </div>

        {/* Pulse highlight alert banner */}
        {highlightedPage === currentPage && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs animate-pulse">
            <Icons.Sparkles size={12} /> Jumped to citation
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => useUIStore.getState().setZoomScale(Math.max(0.5, zoomScale - 0.1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <Icons.ZoomOut size={16} />
          </button>
          <span className="text-xs text-slate-400">{Math.round(zoomScale * 100)}%</span>
          <button
            onClick={() => useUIStore.getState().setZoomScale(Math.min(2, zoomScale + 0.1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
          >
            <Icons.ZoomIn size={16} />
          </button>
        </div>
      </div>

      {/* PDF Pages container */}
      <div
        ref={containerRef}
        className={cn(
          "flex-1 overflow-y-auto p-8 flex justify-center items-start",
          isAnnotating && !isReadOnly && "cursor-crosshair"
        )}
      >
        <div className="relative bg-white shadow-2xl rounded-sm transition-transform duration-200 border border-slate-200 select-text">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-2">
                <Icons.Loader2 className="animate-spin text-primary" size={24} />
                <span className="text-xs font-semibold">Streaming document page contents...</span>
              </div>
            }
          >
            <div
              onClick={handlePageClick}
              className="relative"
              style={{
                transform: `scale(${zoomScale})`,
                transformOrigin: 'top center',
              }}
            >
              <Page
                pageNumber={currentPage}
                width={612}
                renderAnnotationLayer={true}
                renderTextLayer={true}
              />

              {/* Render Active Page Annotations overlays */}
              {annotations
                .filter((ann) => ann.pageNumber === currentPage)
                .map((ann) => (
                  <div
                    key={ann.id}
                    className="absolute border-2 border-amber-400 bg-amber-400/20 group cursor-pointer"
                    style={{
                      left: `${ann.x}%`,
                      top: `${ann.y}%`,
                      width: `${ann.width}%`,
                      height: `${ann.height}%`,
                    }}
                  >
                    {/* Note Hover Popover */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-xl z-20 whitespace-nowrap border border-slate-700">
                      <span className="text-slate-300 font-semibold">{ann.text}</span>
                      {!isReadOnly && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAnnotation(ann.id);
                          }}
                          className="ml-2 text-rose-400 hover:text-rose-300"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}

              {/* Highlight AI-cited pages overlays */}
              {highlightedPage === currentPage && (
                <div className="absolute top-1/4 left-5 right-5 h-12 border border-sky-400 bg-sky-400/20 pulse-highlight-box rounded z-10" />
              )}

              {/* New annotation prompt portal */}
              {clickAnnotationPos && (
                <div
                  className="absolute bg-slate-950/95 border border-slate-800 p-3 rounded-lg shadow-2xl z-30 flex flex-col gap-2"
                  style={{
                    left: `${clickAnnotationPos.x}%`,
                    top: `${clickAnnotationPos.y}%`,
                  }}
                >
                  <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Enter annotation note..."
                    className="text-xs p-1.5 rounded bg-slate-900 border border-slate-800 text-white resize-none w-48 h-16 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => setClickAnnotationPos(null)}
                      className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded hover:bg-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitAnnotation}
                      className="px-2 py-1 bg-primary text-white text-[10px] rounded hover:bg-primary/95"
                    >
                      Save
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
}


