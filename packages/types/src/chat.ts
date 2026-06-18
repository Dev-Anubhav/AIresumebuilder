export type MessageRole = 'USER' | 'ASSISTANT';

export interface Citation {
  pageNumber: number;
  chunkId: string;
  relevanceScore?: number;
}

export interface ChatMessage {
  id: string;
  documentId: string;
  role: MessageRole;
  content: string;
  citations: Citation[] | null;
  createdAt: Date | string;
}
