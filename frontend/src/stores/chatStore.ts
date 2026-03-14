import { create } from "zustand";
import type { Conversation, Message, ModelInfo } from "../types";
import * as chatService from "../services/chat";

interface ChatState {
  conversations: Conversation[];
  currentConversationId: number | null;
  messages: Message[];
  models: ModelInfo[];
  selectedModel: string;
  streaming: boolean;
  streamingText: string;
  knowledgeBaseId: number | null;

  loadConversations: () => Promise<void>;
  selectConversation: (id: number) => Promise<void>;
  createNewChat: () => void;
  deleteConversation: (id: number) => Promise<void>;
  loadModels: () => Promise<void>;
  setSelectedModel: (model: string) => void;
  setKnowledgeBaseId: (id: number | null) => void;
  sendMessage: (content: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  messages: [],
  models: [],
  selectedModel: "gpt-3.5-turbo",
  streaming: false,
  streamingText: "",
  knowledgeBaseId: null,

  loadConversations: async () => {
    const conversations = await chatService.getConversations();
    set({ conversations });
  },

  selectConversation: async (id) => {
    set({ currentConversationId: id, streamingText: "" });
    const messages = await chatService.getMessages(id);
    set({ messages });
  },

  createNewChat: () => {
    set({
      currentConversationId: null,
      messages: [],
      streamingText: "",
    });
  },

  deleteConversation: async (id) => {
    await chatService.deleteConversation(id);
    const { currentConversationId } = get();
    if (currentConversationId === id) {
      set({ currentConversationId: null, messages: [] });
    }
    await get().loadConversations();
  },

  loadModels: async () => {
    try {
      const models = await chatService.getModels();
      set({ models });
      if (models.length > 0 && !models.find((m) => m.id === get().selectedModel)) {
        set({ selectedModel: models[0].id });
      }
    } catch {
      /* models endpoint may not be available */
    }
  },

  setSelectedModel: (model) => set({ selectedModel: model }),

  setKnowledgeBaseId: (id) => set({ knowledgeBaseId: id }),

  sendMessage: (content) => {
    const { currentConversationId, selectedModel, knowledgeBaseId, messages } =
      get();

    const userMsg: Message = {
      id: Date.now(),
      conversation_id: currentConversationId || 0,
      role: "user",
      content,
      created_at: new Date().toISOString(),
    };

    set({ messages: [...messages, userMsg], streaming: true, streamingText: "" });

    chatService.streamChat(
      content,
      selectedModel,
      currentConversationId,
      knowledgeBaseId,
      (chunk) => {
        set((s) => ({ streamingText: s.streamingText + chunk }));
      },
      async (conversationId) => {
        const { streamingText } = get();
        const assistantMsg: Message = {
          id: Date.now() + 1,
          conversation_id: conversationId,
          role: "assistant",
          content: streamingText,
          created_at: new Date().toISOString(),
        };
        set((s) => ({
          streaming: false,
          streamingText: "",
          messages: [...s.messages, assistantMsg],
          currentConversationId: conversationId,
        }));
        await get().loadConversations();
      },
      (err) => {
        console.error("Chat error:", err);
        set({ streaming: false, streamingText: "" });
      }
    );
  },
}));
