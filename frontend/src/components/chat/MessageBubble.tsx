import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import type { Message } from "../../types";
import "../../styles/ink.css";

export default function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`message-enter flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-stone-800 text-stone-50"
            : "bg-white/80 border border-stone-200 text-stone-800"
        }`}
      >
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        ) : (
          <div className="prose prose-sm prose-stone max-w-none">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
              {message.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
