import { useEffect, useRef } from "react";
import { useChatStore } from "../../stores/chatStore";
import MessageBubble from "./MessageBubble";
import StreamingText from "./StreamingText";
import ChatInput from "./ChatInput";

export default function ChatWindow() {
  const { messages, streaming, streamingText, sendMessage } = useChatStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 && !streaming && (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] text-center">
              <div className="text-6xl mb-6 opacity-20">墨</div>
              <h2 className="text-xl text-stone-600 font-light mb-2">
                InkChat
              </h2>
              <p className="text-sm text-stone-400">
                输入你的问题，开始对话
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {streaming && <StreamingText text={streamingText} />}
          <div ref={bottomRef} />
        </div>
      </div>
      <ChatInput onSend={sendMessage} disabled={streaming} />
    </div>
  );
}
