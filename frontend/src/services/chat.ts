import api from "./api";
import type { Conversation, Message, ModelInfo } from "../types";

export async function getConversations() {
  const { data } = await api.get<Conversation[]>("/conversations");
  return data;
}

export async function createConversation(title: string, model_name: string) {
  const { data } = await api.post<Conversation>("/conversations", {
    title,
    model_name,
  });
  return data;
}

export async function getMessages(conversationId: number) {
  const { data } = await api.get<Message[]>(
    `/conversations/${conversationId}/messages`
  );
  return data;
}

export async function deleteConversation(conversationId: number) {
  await api.delete(`/conversations/${conversationId}`);
}

export async function getModels() {
  const { data } = await api.get<ModelInfo[]>("/models");
  return data;
}

export function streamChat(
  message: string,
  model: string,
  conversationId: number | null,
  knowledgeBaseId: number | null,
  onChunk: (text: string) => void,
  onDone: (conversationId: number) => void,
  onError: (err: string) => void
) {
  const token = localStorage.getItem("token");
  const body = JSON.stringify({
    message,
    model,
    conversation_id: conversationId,
    knowledge_base_id: knowledgeBaseId,
  });

  fetch("/api/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body,
  })
    .then(async (response) => {
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        onError(err.detail || "请求失败");
        return;
      }
      const reader = response.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6);
          if (payload.startsWith("[DONE]")) {
            const parts = payload.split("|");
            const convId = parts[1] ? parseInt(parts[1], 10) : 0;
            onDone(convId);
          } else {
            onChunk(payload);
          }
        }
      }
    })
    .catch(() => onError("网络错误"));
}
