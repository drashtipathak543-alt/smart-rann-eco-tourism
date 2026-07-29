from pydantic import BaseModel
from typing import List


class ChatMessage(BaseModel):
    role: str        # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    language: str = "en"


class ChatResponse(BaseModel):
    reply: str
    language: str
