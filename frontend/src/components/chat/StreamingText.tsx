import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

export default function StreamingText({ text }: { text: string }) {
  if (!text) return null;

  return (
    <div className="flex justify-start mb-4">
      <div className="max-w-[75%] rounded-2xl px-4 py-3 bg-white/80 border border-stone-200 text-stone-800">
        <div className="prose prose-sm prose-stone max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
            {text}
          </ReactMarkdown>
          <span className="inline-block w-2 h-4 bg-stone-400 animate-pulse ml-0.5" />
        </div>
      </div>
    </div>
  );
}
