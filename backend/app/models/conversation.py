from datetime import datetime, timezone
from sqlmodel import SQLModel, Field


class Conversation(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(index=True, foreign_key="user.id")
    title: str = Field(default="新对话", max_length=200)
    model_name: str = Field(default="gpt-3.5-turbo", max_length=100)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Message(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    conversation_id: int = Field(index=True, foreign_key="conversation.id")
    role: str = Field(max_length=20)  # "user", "assistant", "system"
    content: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
