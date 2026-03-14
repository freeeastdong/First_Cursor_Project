from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.core.database import init_db
from app.api import auth, chat, knowledge
from app.services.llm import LLMService


@asynccontextmanager
async def lifespan(app: FastAPI):
    Path(settings.UPLOAD_DIR).mkdir(parents=True, exist_ok=True)
    Path(settings.CHROMA_DIR).mkdir(parents=True, exist_ok=True)
    init_db()
    yield


app = FastAPI(title="InkChat API", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api")
app.include_router(chat.router, prefix="/api")
app.include_router(knowledge.router, prefix="/api")


@app.get("/api/models")
async def list_models():
    llm = LLMService()
    return await llm.get_available_models()


@app.get("/api/health")
def health():
    return {"status": "ok"}
