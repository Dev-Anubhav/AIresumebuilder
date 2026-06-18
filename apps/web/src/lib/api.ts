import { Document, ChatMessage, DocumentAnalysis, Annotation, User } from '@ai-document-platform/types';

const BASE_URL = ''; // Proxied via next.config.ts rewrites

export async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `API Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// Documents
export const fetchDocuments = () => apiFetch<{ documents: Document[] }>('/api/documents');
export const fetchDocumentDetails = (id: string) => apiFetch<{ document: Document }>([`/api/documents/${id}`].join(''));
export const renameDocument = (id: string, title: string) =>
  apiFetch<{ document: Document }>(`/api/documents/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });
export const deleteDocument = (id: string) =>
  apiFetch<{ message: string }>(`/api/documents/${id}`, {
    method: 'DELETE',
  });
export const fetchDocumentStatus = (id: string) =>
  apiFetch<{ status: string; pageCount: number }>(`/api/documents/${id}/status`);

// Chat History
export const fetchChatHistory = (documentId: string) =>
  apiFetch<{ messages: ChatMessage[] }>(`/api/chat/${documentId}/history`);
export const clearChatHistory = (documentId: string) =>
  apiFetch<{ message: string }>(`/api/chat/${documentId}/history`, {
    method: 'DELETE',
  });

// Analysis & Annotations
export const fetchAnalysis = (documentId: string) =>
  apiFetch<{ analysis: DocumentAnalysis }>(`/api/analysis/${documentId}`);
export const regenerateAnalysis = (documentId: string) =>
  apiFetch<{ analysis: DocumentAnalysis }>(`/api/analysis/${documentId}/regenerate`, {
    method: 'POST',
  });
export const fetchAnnotations = (documentId: string) =>
  apiFetch<{ annotations: Annotation[] }>(`/api/analysis/${documentId}/annotations`);
export const createAnnotation = (documentId: string, annotation: Omit<Annotation, 'id' | 'userId' | 'documentId' | 'createdAt'>) =>
  apiFetch<{ annotation: Annotation }>(`/api/analysis/${documentId}/annotations`, {
    method: 'POST',
    body: JSON.stringify(annotation),
  });
export const deleteAnnotation = (id: string) =>
  apiFetch<{ message: string }>(`/api/analysis/annotations/${id}`, {
    method: 'DELETE',
  });

// Share links
export const createShareToken = (documentId: string) =>
  apiFetch<{ token: string }>(`/api/share/${documentId}`, {
    method: 'POST',
  });
export const revokeShareToken = (documentId: string) =>
  apiFetch<{ message: string }>(`/api/share/${documentId}`, {
    method: 'DELETE',
  });
export const fetchSharedDocument = (shareId: string) =>
  apiFetch<{ document: Document }>(`/api/share/public/${shareId}`);
