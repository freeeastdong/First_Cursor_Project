import chromadb
from chromadb.config import Settings as ChromaSettings
from app.config import settings


class RAGService:
    def __init__(self):
        self._client = chromadb.PersistentClient(
            path=settings.CHROMA_DIR,
            settings=ChromaSettings(anonymized_telemetry=False),
        )

    def retrieve(self, query: str, knowledge_base_id: int, top_k: int = 5) -> str:
        collection_name = f"kb_{knowledge_base_id}"
        try:
            collection = self._client.get_collection(collection_name)
        except Exception:
            return ""

        results = collection.query(query_texts=[query], n_results=top_k)

        if not results["documents"] or not results["documents"][0]:
            return ""

        chunks = results["documents"][0]
        return "\n\n---\n\n".join(chunks)
