import { create } from 'zustand';

type PanelTab = 'chat' | 'summary' | 'extracted' | 'annotations';

interface UIState {
  activeTab: PanelTab;
  zoomScale: number;
  currentPage: number;
  totalPages: number;
  isAnnotating: boolean;
  highlightedPage: number | null;
  setActiveTab: (tab: PanelTab) => void;
  setZoomScale: (zoom: number) => void;
  setCurrentPage: (page: number) => void;
  setTotalPages: (pages: number) => void;
  setAnnotating: (annotating: boolean) => void;
  setHighlightedPage: (page: number | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'chat',
  zoomScale: 1.0,
  currentPage: 1,
  totalPages: 1,
  isAnnotating: false,
  highlightedPage: null,
  setActiveTab: (activeTab) => set({ activeTab }),
  setZoomScale: (zoomScale) => set({ zoomScale }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setTotalPages: (totalPages) => set({ totalPages }),
  setAnnotating: (isAnnotating) => set({ isAnnotating }),
  setHighlightedPage: (highlightedPage) => set({ highlightedPage }),
}));
