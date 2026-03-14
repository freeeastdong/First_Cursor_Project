import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, MessageSquare, Trash2, BookOpen, LogOut } from "lucide-react";
import { useChatStore } from "../../stores/chatStore";
import { useAuthStore } from "../../stores/authStore";

export default function Sidebar() {
  const navigate = useNavigate();
  const {
    conversations,
    currentConversationId,
    loadConversations,
    selectConversation,
    createNewChat,
    deleteConversation,
  } = useChatStore();
  const { user, logout } = useAuthStore();

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return (
    <aside className="w-64 h-screen flex flex-col border-r border-stone-200 bg-stone-50/80 backdrop-blur-sm">
      <div className="p-4 border-b border-stone-200">
        <h1 className="text-xl font-bold text-stone-800 tracking-wide">
          墨 · InkChat
        </h1>
        <p className="text-xs text-stone-400 mt-1">智能问答系统</p>
      </div>

      <div className="p-3">
        <button
          onClick={() => {
            createNewChat();
            navigate("/");
          }}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-stone-300 text-stone-600 hover:bg-stone-100 hover:border-stone-400 transition-all text-sm"
        >
          <Plus size={16} />
          新对话
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-1">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
              currentConversationId === conv.id
                ? "bg-stone-200/80 text-stone-900"
                : "text-stone-600 hover:bg-stone-100"
            }`}
            onClick={() => {
              selectConversation(conv.id);
              navigate("/");
            }}
          >
            <MessageSquare size={14} className="shrink-0" />
            <span className="truncate flex-1">{conv.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteConversation(conv.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-stone-200 space-y-1">
        <button
          onClick={() => navigate("/knowledge")}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-stone-600 hover:bg-stone-100 transition-all text-sm"
        >
          <BookOpen size={16} />
          知识库
        </button>
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-stone-500 truncate">
            {user?.username}
          </span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="text-stone-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
