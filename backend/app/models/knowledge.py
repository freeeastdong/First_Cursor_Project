from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class KnowledgeBase(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(index=True, foreign_key="user.id")
    name: str = Field(max_length=100)
    description: str = Field(default="", max_length=500)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Document(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    knowledge_base_id: int = Field(index=True, foreign_key="knowledgebase.id")
    filename: str = Field(max_length=255)
    file_path: str
    status: str = Field(default="pending", max_length=20)  # pending, processing, ready, error
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
