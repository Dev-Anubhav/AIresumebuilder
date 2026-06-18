import { create } from 'zustand';
import { Document, Annotation, DocumentAnalysis } from '@/lib/types';

interface DocumentState {
  documents: Document[];
  activeDocument: Document | null;
  annotations: Annotation[];
  isUploading: boolean;
  uploadProgress: number;
  setDocuments: (docs: Document[]) => void;
  setActiveDocument: (doc: Document | null) => void;
  setAnnotations: (annotations: Annotation[]) => void;
  addAnnotation: (annotation: Annotation) => void;
  deleteAnnotation: (annotationId: string) => void;
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number) => void;
}

export const useDocumentStore = create<DocumentState>((set) => ({
  documents: [],
  activeDocument: null,
  annotations: [],
  isUploading: false,
  uploadProgress: 0,
  setDocuments: (documents) => set({ documents }),
  setActiveDocument: (activeDocument) => set({ activeDocument }),
  setAnnotations: (annotations) => set({ annotations }),
  addAnnotation: (annotation) => set((state) => ({ annotations: [...state.annotations, annotation] })),
  deleteAnnotation: (annotationId) =>
    set((state) => ({
      annotations: state.annotations.filter((a) => a.id !== annotationId),
    })),
  setUploading: (isUploading) => set({ isUploading }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
}));
