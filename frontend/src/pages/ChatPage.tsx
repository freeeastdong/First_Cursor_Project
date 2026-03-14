import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import ChatWindow from "../components/chat/ChatWindow";
import InkBackground from "../components/ink/InkBackground";

export default function ChatPage() {
  return (
    <div className="flex h-screen bg-[#f5f0e8] relative overflow-hidden">
      <InkBackground />
      <div className="relative z-10 flex w-full">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <Header />
          <ChatWindow />
        </main>
      </div>
    </div>
  );
}
