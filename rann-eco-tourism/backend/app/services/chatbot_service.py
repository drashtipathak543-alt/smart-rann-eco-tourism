"""
AI Chatbot Service — OpenAI GPT-4 with Rann-specific system prompt.
Falls back to a stub reply when no API key is configured.
"""
from typing import List
from openai import AsyncOpenAI, APIConnectionError
from app.core.config import settings
from app.schemas.chatbot import ChatMessage

LANG_NAMES = {"en": "English", "hi": "Hindi", "gu": "Gujarati"}

SYSTEM_PROMPT = """You are "RannGuide", an expert AI assistant for the Rann of Kutch Eco Tourism Planner.

Your expertise covers:
- Rann of Kutch geography, wildlife, and ecology
- Best travel seasons, routes, and transport options
- Eco-friendly travel tips (low-carbon choices, waste reduction)
- Rann Utsav festival details and cultural experiences
- Accommodation options (eco-lodges, homestays, camps)
- Gujarat cuisine, local handicrafts, and traditions
- Wildlife (flamingos, Indian Wild Ass, migratory birds)
- Safety tips, entry permits, and regulations

Always encourage sustainable tourism. Keep answers concise (3–5 sentences).
If the user writes in Hindi or Gujarati, reply in the same language."""


def _client() -> AsyncOpenAI:
    return AsyncOpenAI(api_key=settings.OPENAI_API_KEY)


async def get_chat_reply(messages: List[ChatMessage], language: str) -> str:
    if not settings.OPENAI_API_KEY:
        return _stub_reply(language)

    lang_name = LANG_NAMES.get(language, "English")
    system = SYSTEM_PROMPT + f"\n\nRespond in {lang_name}."

    openai_messages = [{"role": "system", "content": system}]
    openai_messages += [{"role": m.role, "content": m.content} for m in messages]

    client = _client()
    response = await client.chat.completions.create(
        model="gpt-4o-mini",
        messages=openai_messages,
        max_tokens=500,
        temperature=0.7,
    )
    return response.choices[0].message.content or ""


def _stub_reply(language: str) -> str:
    stubs = {
        "en": "Welcome to RannGuide! I'm your eco-tourism assistant for the Rann of Kutch. Ask me about the best time to visit, wildlife, or eco-friendly activities. (Configure OPENAI_API_KEY for full AI responses.)",
        "hi": "रण गाइड में आपका स्वागत है! मैं कच्छ के रण के लिए आपका पर्यावरण-पर्यटन सहायक हूँ। (पूर्ण AI उत्तरों के लिए OPENAI_API_KEY कॉन्फ़िगर करें।)",
        "gu": "RannGuide માં આપનું સ્વાગત છે! હું કચ્છના રણ માટે તમારો ઇકો-ટૂરિઝમ સહાયક છું। (સંપૂર્ણ AI જવાબો માટે OPENAI_API_KEY ગોઠવો.)",
    }
    return stubs.get(language, stubs["en"])
