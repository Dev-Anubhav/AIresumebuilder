import { create } from 'zustand';
import { ChatMessage } from '@ai-document-platform/types';

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  streamingText: string;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
  setStreaming: (isStreaming: boolean) => void;
  setStreamingText: (text: string) => void;
  clearChat: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  streamingText: '',
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  setStreamingText: (streamingText) => set({ streamingText }),
  clearChat: () => set({ messages: [], streamingText: '' }),
}));
