"""
AI Chatbot API — uses OpenAI GPT-4 with a Rann-specific system prompt.
Supports English, Hindi, and Gujarati via the language field.
"""
from fastapi import APIRouter, HTTPException
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.services.chatbot_service import get_chat_reply

router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest):
    try:
        reply = await get_chat_reply(payload.messages, payload.language)
        return ChatResponse(reply=reply, language=payload.language)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
