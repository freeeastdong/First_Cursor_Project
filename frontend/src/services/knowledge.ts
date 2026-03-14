import api from "./api";
import type { KnowledgeBase, Document } from "../types";

export async function getKnowledgeBases() {
  const { data } = await api.get<KnowledgeBase[]>("/knowledge");
  return data;
}

export async function createKnowledgeBase(name: string, description: string) {
  const { data } = await api.post<KnowledgeBase>("/knowledge", {
    name,
    description,
  });
  return data;
}

export async function deleteKnowledgeBase(kbId: number) {
  await api.delete(`/knowledge/${kbId}`);
}

export async function uploadDocument(kbId: number, file: File) {
  const form = new FormData();
  form.append("file", file);
  const { data } = await api.post<Document>(
    `/knowledge/${kbId}/upload`,
    form
  );
  return data;
}

export async function getDocuments(kbId: number) {
  const { data } = await api.get<Document[]>(`/knowledge/${kbId}/documents`);
  return data;
}
