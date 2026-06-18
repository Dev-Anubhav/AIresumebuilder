'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../../stores/chatStore';
import { useUIStore } from '../../stores/uiStore';
import { useStreamingResponse } from '../../hooks/useStreamingResponse';
import { Icons } from '../ui/icons';
import { MessageRole } from '@ai-document-platform/types';

interface ChatPanelProps {
  documentId: string;
  isShared?: boolean;
  shareId?: string;
}

export default function ChatPanel({ documentId, isShared = false, shareId }: ChatPanelProps) {
  const { messages, setMessages, addMessage, clearChat } = useChatStore();
  const { setHighlightedPage, setCurrentPage } = useUIStore();
  const { streamingText, isStreaming, stream } = useStreamingResponse();
  const [inputText, setInputText] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = {
      id: Math.random().toString(),
      documentId,
      role: 'USER' as MessageRole,
      content: inputText,
      citations: null,
      createdAt: new Date().toISOString(),
    };

    addMessage(userMsg);
    setInputText('');

    const targetUrl = isShared
      ? `/api/share/public/${shareId}/chat`
      : `/api/chat/${documentId}/message`;

    // Fire the streaming hook
    const finalText = await stream(targetUrl, { content: userMsg.content });

    // When streaming completes, append the AI response to state
    if (finalText) {
      const finalAiMsg = {
        id: Math.random().toString(),
        documentId,
        role: 'ASSISTANT' as MessageRole,
        content: finalText,
        citations: [{ pageNumber: 1, chunkId: 'mock-1', relevanceScore: 0.95 }],
        createdAt: new Date().toISOString(),
      };
      addMessage(finalAiMsg);
    }
  };

  const handleCitationClick = (page: number) => {
    setCurrentPage(page);
    setHighlightedPage(page);
    setTimeout(() => {
      setHighlightedPage(null);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-[#fbfaf8]">
        <div className="flex items-center gap-2">
          <Icons.MessageSquare className="text-primary" size={18} />
          <h3 className="font-semibold text-foreground">AI Document Assistant</h3>
        </div>
        {!isShared && (
          <button
            onClick={() => clearChat()}
            className="p-1.5 rounded bg-muted hover:bg-slate-200/50 text-muted-foreground hover:text-foreground text-xs flex items-center gap-1 border border-border transition"
          >
            <Icons.Trash2 size={12} /> Clear Chat
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !streamingText && (
          <div className="text-center py-12 px-6 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
              <Icons.Sparkles size={24} />
            </div>
            <h4 className="text-sm font-semibold text-foreground mb-1">RAG-Powered Conversations</h4>
            <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
              Ask any question about termination clauses, pricing matrices, SLAs, or risk elements.
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.role === 'USER' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                msg.role === 'USER'
                  ? 'bg-primary text-white rounded-br-none shadow-sm'
                  : 'bg-muted text-foreground rounded-bl-none border border-border'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>

              {/* Citations overlays */}
              {msg.role === 'ASSISTANT' && msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 pt-2 border-t border-border flex flex-wrap gap-1.5 items-center">
                  <span className="text-[10px] text-muted-foreground">Sources:</span>
                  {msg.citations.map((cit, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleCitationClick(cit.pageNumber)}
                      className="px-2 py-0.5 rounded bg-sky-50 hover:bg-sky-100/70 border border-sky-200 text-sky-600 text-[10px] font-medium flex items-center gap-1 transition"
                    >
                      <Icons.FileText size={10} /> Page {cit.pageNumber}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Render SSE streaming token buffers */}
        {isStreaming && (
          <div className="flex flex-col items-start space-y-1">
            <div className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm bg-muted text-foreground rounded-bl-none border border-border">
              {streamingText ? (
                <>
                  <p className="whitespace-pre-wrap">{streamingText}</p>
                  <span className="inline-block w-1.5 h-3.5 ml-1 bg-primary animate-pulse" />
                </>
              ) : (
                <div className="flex items-center gap-1 py-1 px-1.5">
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
                </div>
              )}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />

      </div>

      {/* Suggested Followups */}
      {messages.length > 0 && !isStreaming && (
        <div className="p-3 bg-[#fbfaf8] border-t border-border flex gap-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setInputText('What is the Limitation of Liability?')}
            className="text-[11px] px-2.5 py-1 rounded-full bg-card hover:bg-slate-50 text-muted-foreground hover:text-foreground border border-border transition"
          >
            Limitation of Liability?
          </button>
          <button
            onClick={() => setInputText('Identify the SLA uptime target.')}
            className="text-[11px] px-2.5 py-1 rounded-full bg-card hover:bg-slate-50 text-muted-foreground hover:text-foreground border border-border transition"
          >
            SLA uptime?
          </button>
          <button
            onClick={() => setInputText('How is the contract terminated?')}
            className="text-[11px] px-2.5 py-1 rounded-full bg-card hover:bg-slate-50 text-muted-foreground hover:text-foreground border border-border transition"
          >
            Contract renewal terms?
          </button>
        </div>
      )}

      {/* Form controls */}
      <form onSubmit={handleSend} className="p-4 bg-[#fbfaf8] border-t border-border flex gap-2">
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a question about this document..."
          className="flex-1 px-4 py-2 rounded-lg bg-muted border border-border text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white placeholder-slate-400"
          disabled={isStreaming}
        />
        <button
          type="submit"
          className="p-2.5 rounded-lg bg-primary hover:bg-[#6d4ae5] text-white transition shadow-sm shadow-primary/10 disabled:opacity-50"
          disabled={isStreaming || !inputText.trim()}
        >
          {isStreaming ? <Icons.Loader2 size={16} className="animate-spin" /> : <Icons.Send size={16} />}
        </button>
      </form>
    </div>
  );
}
