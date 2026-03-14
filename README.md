# InkChat - 智能问答系统

基于 FastAPI + React 的智能问答系统，支持 OpenAI / Ollama 双模型、RAG 知识库检索增强生成，前端采用水墨画视觉风格。

## 功能特性

- **多模型支持**: 同时接入 OpenAI API 和本地 Ollama 模型
- **RAG 知识库**: 上传文档 (PDF/Word/TXT/MD)，基于文档内容智能回答
- **流式输出**: SSE 实时流式响应，逐字显示
- **多轮对话**: 支持上下文记忆的多轮对话
- **会话管理**: 创建、切换、删除多个会话
- **用户认证**: 注册/登录，JWT 令牌鉴权
- **水墨风格**: 动态水墨画 Canvas 背景 + 墨色主题

## 技术栈

### 后端
- FastAPI + Uvicorn
- SQLModel + SQLite
- ChromaDB (向量存储)
- LangChain (文档切片)
- OpenAI SDK (兼容 Ollama)

### 前端
- React 18 + TypeScript + Vite
- Tailwind CSS
- Zustand (状态管理)
- React Router v6
- Canvas API (水墨动效)

## 快速开始

### 1. 后端

```bash
cd backend

# 创建虚拟环境
python -m venv venv
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的 API Key

# 启动服务
uvicorn app.main:app --reload --port 8000
```

### 2. 前端

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 3. 访问

打开浏览器访问 http://localhost:5173

## 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `SECRET_KEY` | JWT 签名密钥 | dev-secret-key... |
| `OPENAI_API_KEY` | OpenAI API Key | - |
| `OPENAI_BASE_URL` | OpenAI API 地址 | https://api.openai.com/v1 |
| `OLLAMA_BASE_URL` | Ollama API 地址 | http://localhost:11434/v1 |

## 项目结构

```
├── backend/          # FastAPI 后端
│   ├── app/
│   │   ├── main.py         # 应用入口
│   │   ├── config.py       # 配置管理
│   │   ├── core/           # 数据库、安全
│   │   ├── models/         # 数据模型
│   │   ├── schemas/        # 请求/响应模型
│   │   ├── api/            # API 路由
│   │   └── services/       # 业务逻辑 (LLM, RAG)
│   └── requirements.txt
├── frontend/         # React 前端
│   ├── src/
│   │   ├── components/     # UI 组件
│   │   ├── pages/          # 页面
│   │   ├── services/       # API 调用
│   │   ├── stores/         # 状态管理
│   │   └── styles/         # 水墨动画样式
│   └── package.json
└── README.md
```
