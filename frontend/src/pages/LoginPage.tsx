import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import InkBackground from "../components/ink/InkBackground";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(username, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "登录失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center relative overflow-hidden">
      <InkBackground />

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <div className="text-7xl text-stone-700 mb-3 font-serif">墨</div>
          <h1 className="text-2xl text-stone-700 font-light tracking-widest">
            InkChat
          </h1>
          <p className="text-sm text-stone-400 mt-1">智能问答系统</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-stone-200/50"
        >
          <h2 className="text-lg text-stone-700 mb-6 text-center">登录</h2>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-stone-500 mb-1.5">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                placeholder="请输入用户名"
              />
            </div>
            <div>
              <label className="block text-sm text-stone-500 mb-1.5">
                密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-2.5 rounded-xl bg-stone-800 text-white text-sm hover:bg-stone-700 disabled:opacity-50 transition-all"
          >
            {loading ? "登录中..." : "登录"}
          </button>

          <p className="text-center text-sm text-stone-400 mt-4">
            还没有账号？{" "}
            <Link
              to="/register"
              className="text-stone-600 hover:text-stone-800 underline underline-offset-2"
            >
              注册
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
