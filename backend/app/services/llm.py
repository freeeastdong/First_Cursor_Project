from typing import AsyncIterator
from openai import AsyncOpenAI
from app.config import settings

OLLAMA_MODELS = {"llama3", "llama3.1", "llama2", "mistral", "gemma", "qwen", "qwen2", "deepseek-r1"}


class LLMService:
    def _get_client(self, model: str) -> tuple[AsyncOpenAI, str]:
        model_lower = model.lower()
        is_ollama = any(model_lower.startswith(m) for m in OLLAMA_MODELS)

        if is_ollama:
            return AsyncOpenAI(base_url=settings.OLLAMA_BASE_URL, api_key="ollama"), model
        else:
            return AsyncOpenAI(base_url=settings.OPENAI_BASE_URL, api_key=settings.OPENAI_API_KEY), model

    async def stream_chat(
        self, messages: list[dict], model: str = "gpt-3.5-turbo"
    ) -> AsyncIterator[str]:
        client, resolved_model = self._get_client(model)
        stream = await client.chat.completions.create(
            model=resolved_model,
            messages=messages,
            stream=True,
        )
        async for chunk in stream:
            delta = chunk.choices[0].delta if chunk.choices else None
            if delta and delta.content:
                yield delta.content

    async def get_available_models(self) -> list[dict]:
        models = []
        if settings.OPENAI_API_KEY:
            models.extend([
                {"id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "provider": "openai"},
                {"id": "gpt-4o-mini", "name": "GPT-4o Mini", "provider": "openai"},
                {"id": "gpt-4o", "name": "GPT-4o", "provider": "openai"},
            ])
        try:
            client = AsyncOpenAI(base_url=settings.OLLAMA_BASE_URL, api_key="ollama")
            response = await client.models.list()
            for m in response.data:
                models.append({"id": m.id, "name": m.id, "provider": "ollama"})
        except Exception:
            pass
        return models
