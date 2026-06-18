// ---------------------------------------------------------------------------
// Shared types for the ResuCraft AI web app.
// Previously imported from the non-existent "@ai-document-platform/types" package.
// ---------------------------------------------------------------------------

export type DocumentStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface Document {
  id: string;
  userId: string;
  title: string;
  originalName: string;
  fileSize: number;
  pageCount: number;
  status: DocumentStatus;
  uploadedAt: string;
  updatedAt: string;
  shareToken?: string | null;
  // The server embeds the related analysis object when fetching document details
  analysis?: DocumentAnalysis | null;
}

export interface ExtractedField {
  field: string;
  value: string;
  category: string;
  pageReference: string;
  confidence: number;
}

export interface DocumentAnalysis {
  id: string;
  documentId: string;
  summary: string;
  documentType: string;
  language: string;
  keyInsights: string[] | string;
  riskFlags: string[] | string;
  createdAt: string;
  updatedAt: string;
  extractedData?: ExtractedField[];
}

export type MessageRole = 'USER' | 'ASSISTANT';

export interface ChatCitation {
  pageNumber: number;
  chunkId: string;
  relevanceScore: number;
}

export interface ChatMessage {
  id: string;
  documentId: string;
  role: MessageRole;
  content: string;
  citations: ChatCitation[] | null;
  createdAt: string;
}

export interface Annotation {
  id: string;
  documentId: string;
  userId: string;
  pageNumber: number;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string | null;
  avatarColor?: string | null;
  createdAt: string;
}
