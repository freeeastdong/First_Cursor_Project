from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlmodel import Session, select
from app.core.database import get_session
from app.models.user import User
from app.models.conversation import Conversation, Message
from app.schemas.chat import (
    ChatRequest,
    MessageResponse,
    ConversationCreate,
    ConversationResponse,
)
from app.api.deps import get_current_user
from app.services.llm import LLMService
from app.services.rag import RAGService

router = APIRouter(tags=["对话"])


@router.post("/chat/completions")
async def chat_completions(
    body: ChatRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    if body.conversation_id:
        conversation = session.get(Conversation, body.conversation_id)
        if not conversation or conversation.user_id != current_user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="会话不存在")
    else:
        conversation = Conversation(
            user_id=current_user.id,
            title=body.message[:30] + ("..." if len(body.message) > 30 else ""),
            model_name=body.model,
        )
        session.add(conversation)
        session.commit()
        session.refresh(conversation)

    user_msg = Message(conversation_id=conversation.id, role="user", content=body.message)
    session.add(user_msg)
    session.commit()

    history = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation.id)
        .order_by(Message.created_at)
    ).all()
    messages = [{"role": m.role, "content": m.content} for m in history]

    if body.knowledge_base_id:
        rag_service = RAGService()
        context = rag_service.retrieve(body.message, body.knowledge_base_id)
        if context:
            system_prompt = f"请基于以下参考资料回答用户的问题。如果资料中没有相关信息，请如实说明。\n\n参考资料：\n{context}"
            messages.insert(0, {"role": "system", "content": system_prompt})

    llm = LLMService()
    collected_content: list[str] = []

    async def generate():
        async for chunk in llm.stream_chat(messages, model=body.model):
            collected_content.append(chunk)
            yield f"data: {chunk}\n\n"

        full_content = "".join(collected_content)
        assistant_msg = Message(
            conversation_id=conversation.id, role="assistant", content=full_content
        )
        session.add(assistant_msg)
        conversation.updated_at = datetime.now(timezone.utc)
        session.add(conversation)
        session.commit()

        yield f"data: [DONE]|{conversation.id}\n\n"

    return StreamingResponse(generate(), media_type="text/event-stream")


@router.get("/conversations", response_model=list[ConversationResponse])
def list_conversations(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    conversations = session.exec(
        select(Conversation)
        .where(Conversation.user_id == current_user.id)
        .order_by(Conversation.updated_at.desc())
    ).all()
    return conversations


@router.post("/conversations", response_model=ConversationResponse)
def create_conversation(
    body: ConversationCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    conversation = Conversation(
        user_id=current_user.id,
        title=body.title,
        model_name=body.model_name,
    )
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageResponse])
def get_messages(
    conversation_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    conversation = session.get(Conversation, conversation_id)
    if not conversation or conversation.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="会话不存在")
    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .order_by(Message.created_at)
    ).all()
    return messages


@router.delete("/conversations/{conversation_id}")
def delete_conversation(
    conversation_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    conversation = session.get(Conversation, conversation_id)
    if not conversation or conversation.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="会话不存在")
    messages = session.exec(
        select(Message).where(Message.conversation_id == conversation_id)
    ).all()
    for msg in messages:
        session.delete(msg)
    session.delete(conversation)
    session.commit()
    return {"detail": "会话已删除"}
