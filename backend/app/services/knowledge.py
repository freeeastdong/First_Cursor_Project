import os
import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.config import settings


class KnowledgeIngestionService:
    def __init__(self):
        self._client = chromadb.PersistentClient(
            path=settings.CHROMA_DIR,
            settings=ChromaSettings(anonymized_telemetry=False),
        )
        self._splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", "。", ".", " ", ""],
        )

    def _load_text(self, file_path: str) -> str:
        ext = os.path.splitext(file_path)[1].lower()

        if ext == ".txt":
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        elif ext == ".pdf":
            from pypdf import PdfReader
            reader = PdfReader(file_path)
            return "\n".join(page.extract_text() or "" for page in reader.pages)
        elif ext in (".docx", ".doc"):
            from docx import Document as DocxDocument
            doc = DocxDocument(file_path)
            return "\n".join(p.text for p in doc.paragraphs)
        elif ext == ".md":
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()

    def ingest_document(self, file_path: str, knowledge_base_id: int):
        text = self._load_text(file_path)
        if not text.strip():
            return

        chunks = self._splitter.split_text(text)
        collection_name = f"kb_{knowledge_base_id}"
        collection = self._client.get_or_create_collection(collection_name)

        ids = [f"{knowledge_base_id}_{os.path.basename(file_path)}_{i}" for i in range(len(chunks))]
        collection.add(documents=chunks, ids=ids)
