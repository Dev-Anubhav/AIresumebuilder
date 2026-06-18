import { DocumentAnalysis } from './analysis.js';

export type DocumentStatus = 'UPLOADING' | 'PROCESSING' | 'READY' | 'FAILED';

export interface Document {
  id: string;
  title: string;
  originalName: string;
  fileSize: number;
  pageCount: number;
  status: DocumentStatus;
  filePath: string;
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  analysis?: DocumentAnalysis | null;
}


export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  pageNumber: number;
  chunkIndex: number;
  createdAt: Date;
}
