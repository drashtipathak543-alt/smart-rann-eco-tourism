import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { QueryProvider } from "@/components/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Smart Rann Eco Tourism Planner",
  description: "AI-powered eco-tourism planning for the Rann of Kutch — itineraries, crowd forecasts, weather, and more.",
  keywords: ["Rann of Kutch", "eco tourism", "Gujarat", "Rann Utsav", "sustainable travel"],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Toaster
              position="top-right"
              toastOptions={{ style: { borderRadius: "12px", fontSize: "14px" } }}
            />
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
