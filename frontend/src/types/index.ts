export interface User {
  id: number;
  username: string;
  email: string;
}

export interface Conversation {
  id: number;
  title: string;
  model_name: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: "openai" | "ollama";
}

export interface KnowledgeBase {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface Document {
  id: number;
  knowledge_base_id: number;
  filename: string;
  status: string;
  created_at: string;
}
