import os
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from sqlmodel import Session, select
from app.config import settings
from app.core.database import get_session
from app.models.user import User
from app.models.knowledge import KnowledgeBase, Document
from app.schemas.knowledge import KnowledgeBaseCreate, KnowledgeBaseResponse, DocumentResponse
from app.api.deps import get_current_user
from app.services.knowledge import KnowledgeIngestionService

router = APIRouter(prefix="/knowledge", tags=["知识库"])


@router.get("", response_model=list[KnowledgeBaseResponse])
def list_knowledge_bases(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    kbs = session.exec(
        select(KnowledgeBase).where(KnowledgeBase.user_id == current_user.id)
    ).all()
    return kbs


@router.post("", response_model=KnowledgeBaseResponse)
def create_knowledge_base(
    body: KnowledgeBaseCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    kb = KnowledgeBase(user_id=current_user.id, name=body.name, description=body.description)
    session.add(kb)
    session.commit()
    session.refresh(kb)
    return kb


@router.post("/{kb_id}/upload", response_model=DocumentResponse)
async def upload_document(
    kb_id: int,
    file: UploadFile = File(...),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    kb = session.get(KnowledgeBase, kb_id)
    if not kb or kb.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="知识库不存在")

    upload_dir = os.path.join(settings.UPLOAD_DIR, str(kb_id))
    os.makedirs(upload_dir, exist_ok=True)
    file_path = os.path.join(upload_dir, file.filename)

    content = await file.read()
    with open(file_path, "wb") as f:
        f.write(content)

    doc = Document(
        knowledge_base_id=kb_id,
        filename=file.filename,
        file_path=file_path,
        status="processing",
    )
    session.add(doc)
    session.commit()
    session.refresh(doc)

    try:
        ingestion = KnowledgeIngestionService()
        ingestion.ingest_document(file_path, kb_id)
        doc.status = "ready"
    except Exception:
        doc.status = "error"
    session.add(doc)
    session.commit()
    session.refresh(doc)

    return doc


@router.get("/{kb_id}/documents", response_model=list[DocumentResponse])
def list_documents(
    kb_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    kb = session.get(KnowledgeBase, kb_id)
    if not kb or kb.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="知识库不存在")
    docs = session.exec(
        select(Document).where(Document.knowledge_base_id == kb_id)
    ).all()
    return docs


@router.delete("/{kb_id}")
def delete_knowledge_base(
    kb_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    kb = session.get(KnowledgeBase, kb_id)
    if not kb or kb.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="知识库不存在")
    docs = session.exec(select(Document).where(Document.knowledge_base_id == kb_id)).all()
    for doc in docs:
        session.delete(doc)
    session.delete(kb)
    session.commit()
    return {"detail": "知识库已删除"}
