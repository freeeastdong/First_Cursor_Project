import { useState, useRef, useEffect } from "react";
import { Send } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 150) + "px";
    }
  }, [input]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  return (
    <div className="border-t border-stone-200 bg-white/60 backdrop-blur-sm p-4">
      <div className="max-w-3xl mx-auto flex items-end gap-3">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="输入你的问题..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
        />
        <button
          onClick={handleSubmit}
          disabled={disabled || !input.trim()}
          className="shrink-0 w-10 h-10 rounded-xl bg-stone-800 text-white flex items-center justify-center hover:bg-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
