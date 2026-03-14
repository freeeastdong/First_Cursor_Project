import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import InkBackground from "../components/ink/InkBackground";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("两次密码输入不一致");
      return;
    }
    setLoading(true);
    try {
      await register(username, email, password);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.detail || "注册失败");
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
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-md rounded-2xl p-8 shadow-sm border border-stone-200/50"
        >
          <h2 className="text-lg text-stone-700 mb-6 text-center">注册</h2>

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
                邮箱
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                placeholder="请输入邮箱"
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
            <div>
              <label className="block text-sm text-stone-500 mb-1.5">
                确认密码
              </label>
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-stone-200 bg-white/80 text-sm text-stone-800 placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-300 transition-all"
                placeholder="请再次输入密码"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-2.5 rounded-xl bg-stone-800 text-white text-sm hover:bg-stone-700 disabled:opacity-50 transition-all"
          >
            {loading ? "注册中..." : "注册"}
          </button>

          <p className="text-center text-sm text-stone-400 mt-4">
            已有账号？{" "}
            <Link
              to="/login"
              className="text-stone-600 hover:text-stone-800 underline underline-offset-2"
            >
              登录
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
