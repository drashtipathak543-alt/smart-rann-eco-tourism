"use client";
import { useRef, useEffect, useState, FormEvent } from "react";
import { useTranslations } from "next-intl";
import { Send, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { sendChatMessage, ChatMessage } from "@/lib/api";
import { cn } from "@/lib/utils";

export function Chatbot({ language = "en" }: { language?: string }) {
  const t = useTranslations("chatbot");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const res = await sendChatMessage(updated, language);
      setMessages([...updated, { role: "assistant", content: res.data.reply }]);
    } catch {
      setMessages([...updated, {
        role: "assistant",
        content: "Sorry, I couldn't connect to the server. Please try again.",
      }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-[600px] card">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-stone-100 bg-gradient-to-r from-sand-50 to-rann-sky/20">
        <div className="w-9 h-9 rounded-full bg-sand-500 flex items-center justify-center">
          <Bot size={18} className="text-white" />
        </div>
        <div>
          <p className="font-semibold text-stone-800 text-sm">{t("title")}</p>
          <p className="text-xs text-emerald-600">● Online</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-stone-50">
        {/* Welcome message */}
        {messages.length === 0 && (
          <div className="flex justify-start">
            <span className="bubble-assistant">{t("welcome")}</span>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
          >
            {msg.role === "user" ? (
              <span className="bubble-user">{msg.content}</span>
            ) : (
              <span className="bubble-assistant prose prose-sm max-w-none">
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </span>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <span className="bubble-assistant text-stone-400 animate-pulse">{t("thinking")}</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-stone-200 bg-white flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          disabled={loading}
          className="input-field flex-1"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="btn-primary px-4 py-2.5 disabled:opacity-50"
        >
          <Send size={15} />
          <span className="hidden sm:inline">{t("send")}</span>
        </button>
      </form>
    </div>
  );
}
