from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    OPENAI_API_KEY: str = ""
    OPENAI_BASE_URL: str = "https://api.openai.com/v1"
    OLLAMA_BASE_URL: str = "http://localhost:11434/v1"

    DATABASE_URL: str = "sqlite:///./data/inkchat.db"

    UPLOAD_DIR: str = str(Path(__file__).resolve().parent.parent / "data" / "uploads")
    CHROMA_DIR: str = str(Path(__file__).resolve().parent.parent / "data" / "chroma")

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
