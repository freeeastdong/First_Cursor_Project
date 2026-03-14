import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ChatPage from "./pages/ChatPage";
import KnowledgePage from "./pages/KnowledgePage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center">
        <div className="text-stone-400 text-sm">加载中...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const { fetchUser } = useAuthStore();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/knowledge"
          element={
            <ProtectedRoute>
              <KnowledgePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
