import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Upload,
  FileText,
  Database,
} from "lucide-react";
import * as knowledgeService from "../services/knowledge";
import type { KnowledgeBase, Document } from "../types";
import InkBackground from "../components/ink/InkBackground";

export default function KnowledgePage() {
  const navigate = useNavigate();
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [selectedKb, setSelectedKb] = useState<KnowledgeBase | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [uploading, setUploading] = useState(false);

  const loadKbs = async () => {
    const data = await knowledgeService.getKnowledgeBases();
    setKbs(data);
  };

  useEffect(() => {
    loadKbs();
  }, []);

  const loadDocs = async (kbId: number) => {
    const data = await knowledgeService.getDocuments(kbId);
    setDocs(data);
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    await knowledgeService.createKnowledgeBase(name, desc);
    setName("");
    setDesc("");
    setShowCreate(false);
    loadKbs();
  };

  const handleDelete = async (kbId: number) => {
    await knowledgeService.deleteKnowledgeBase(kbId);
    if (selectedKb?.id === kbId) {
      setSelectedKb(null);
      setDocs([]);
    }
    loadKbs();
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || !selectedKb) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      await knowledgeService.uploadDocument(selectedKb.id, file);
    }
    setUploading(false);
    loadDocs(selectedKb.id);
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] relative overflow-hidden">
      <InkBackground />
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/")}
            className="p-2 rounded-lg hover:bg-stone-200/50 transition-colors"
          >
            <ArrowLeft size={20} className="text-stone-600" />
          </button>
          <h1 className="text-2xl text-stone-800 font-light">知识库管理</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-stone-200/50 p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-stone-700">知识库列表</h2>
                <button
                  onClick={() => setShowCreate(!showCreate)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-500"
                >
                  <Plus size={16} />
                </button>
              </div>

              {showCreate && (
                <div className="mb-4 p-3 rounded-xl bg-stone-50 space-y-2">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="知识库名称"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-300"
                  />
                  <input
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    placeholder="描述（可选）"
                    className="w-full px-3 py-2 rounded-lg border border-stone-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-stone-300"
                  />
                  <button
                    onClick={handleCreate}
                    className="w-full py-2 rounded-lg bg-stone-800 text-white text-sm hover:bg-stone-700 transition-all"
                  >
                    创建
                  </button>
                </div>
              )}

              <div className="space-y-1">
                {kbs.map((kb) => (
                  <div
                    key={kb.id}
                    className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer transition-all text-sm ${
                      selectedKb?.id === kb.id
                        ? "bg-stone-200/80 text-stone-900"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                    onClick={() => {
                      setSelectedKb(kb);
                      loadDocs(kb.id);
                    }}
                  >
                    <Database size={14} className="shrink-0" />
                    <span className="truncate flex-1">{kb.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(kb.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                {kbs.length === 0 && (
                  <p className="text-center text-stone-400 text-sm py-4">
                    暂无知识库
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            {selectedKb ? (
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-stone-200/50 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg text-stone-800">{selectedKb.name}</h2>
                    {selectedKb.description && (
                      <p className="text-sm text-stone-400 mt-1">
                        {selectedKb.description}
                      </p>
                    )}
                  </div>
                  <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-800 text-white text-sm cursor-pointer hover:bg-stone-700 transition-all">
                    <Upload size={14} />
                    {uploading ? "上传中..." : "上传文档"}
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.txt,.docx,.md"
                      className="hidden"
                      onChange={(e) => handleUpload(e.target.files)}
                      disabled={uploading}
                    />
                  </label>
                </div>

                <div className="space-y-2">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-50 border border-stone-100"
                    >
                      <FileText size={16} className="text-stone-400 shrink-0" />
                      <span className="text-sm text-stone-700 flex-1 truncate">
                        {doc.filename}
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          doc.status === "ready"
                            ? "bg-green-100 text-green-700"
                            : doc.status === "error"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {doc.status === "ready"
                          ? "就绪"
                          : doc.status === "error"
                            ? "失败"
                            : "处理中"}
                      </span>
                    </div>
                  ))}
                  {docs.length === 0 && (
                    <p className="text-center text-stone-400 text-sm py-8">
                      暂无文档，请上传文件
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-stone-400 text-sm">
                请选择一个知识库
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
