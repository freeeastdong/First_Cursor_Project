import { useEffect, useState } from "react";
import { ChevronDown, Database } from "lucide-react";
import { useChatStore } from "../../stores/chatStore";
import * as knowledgeService from "../../services/knowledge";
import type { KnowledgeBase } from "../../types";

export default function Header() {
  const { models, selectedModel, setSelectedModel, loadModels, knowledgeBaseId, setKnowledgeBaseId } =
    useChatStore();
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);

  useEffect(() => {
    loadModels();
    knowledgeService.getKnowledgeBases().then(setKbs).catch(() => {});
  }, [loadModels]);

  return (
    <header className="h-14 border-b border-stone-200 bg-white/60 backdrop-blur-sm flex items-center px-6 justify-between">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <span className="text-sm text-stone-500">模型</span>
          <div className="relative">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="appearance-none bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
            >
              {models.length === 0 && (
                <option value={selectedModel}>{selectedModel}</option>
              )}
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.provider})
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
            />
          </div>
        </div>

        {kbs.length > 0 && (
          <div className="flex items-center gap-2">
            <Database size={14} className="text-stone-400" />
            <div className="relative">
              <select
                value={knowledgeBaseId ?? ""}
                onChange={(e) =>
                  setKnowledgeBaseId(e.target.value ? Number(e.target.value) : null)
                }
                className="appearance-none bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-stone-300"
              >
                <option value="">不使用知识库</option>
                {kbs.map((kb) => (
                  <option key={kb.id} value={kb.id}>
                    {kb.name}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
