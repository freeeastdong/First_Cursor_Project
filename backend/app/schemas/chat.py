from pydantic import BaseModel
from datetime import datetime


class ChatRequest(BaseModel):
    message: str
    conversation_id: int | None = None
    model: str = "gpt-3.5-turbo"
    knowledge_base_id: int | None = None


class MessageResponse(BaseModel):
    id: int
    conversation_id: int
    role: str
    content: str
    created_at: datetime


class ConversationCreate(BaseModel):
    title: str = "新对话"
    model_name: str = "gpt-3.5-turbo"


class ConversationResponse(BaseModel):
    id: int
    title: str
    model_name: str
    created_at: datetime
    updated_at: datetime
