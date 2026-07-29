import { Chatbot } from "@/components/features/Chatbot";
import { getLocale } from "next-intl/server";

export const metadata = { title: "RannGuide AI Chatbot | Rann Eco Planner" };

export default async function ChatbotPage() {
  const locale = await getLocale();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Chatbot language={locale} />
    </div>
  );
}
