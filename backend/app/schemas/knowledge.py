from pydantic import BaseModel
from datetime import datetime


class KnowledgeBaseCreate(BaseModel):
    name: str
    description: str = ""


class KnowledgeBaseResponse(BaseModel):
    id: int
    name: str
    description: str
    created_at: datetime


class DocumentResponse(BaseModel):
    id: int
    knowledge_base_id: int
    filename: str
    status: str
    created_at: datetime
