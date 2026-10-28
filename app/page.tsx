
"use client";

import { useEffect, useRef, useState } from "react";
import rules from "./rules.json";

type Message = {
  id: number;
  sender: "user" | "bot";
  text: string;
};

const initialMessage: Message = {
  id: 1,
  sender: "bot",
  text:
    "👋 Assalam-o-Alaikum! Welcome to Desi Bites.\n\n" +
    "I'm your virtual restaurant assistant! 🍔\n\n" +
    "Ask me about our menu, deals, delivery, timings, location, or payment methods.\n\n" +
    "How can I help you today?",
};

const quickTopics = [
  { label: "Menu", icon: "🍽️" },
  { label: "Deals", icon: "🔥" },
  { label: "Timings", icon: "🕒" },
  { label: "Location", icon: "📍" },
  { label: "Delivery", icon: "🛵" },
  { label: "Payment", icon: "💳" },
];

// Normalize text before matching rules.
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Check complete words or phrases rather than substrings.
function matchesKeyword(
  message: string,
  keyword: string
): boolean {
  const cleanMessage = normalizeText(message);
  const cleanKeyword = normalizeText(keyword);

  if (!cleanKeyword) return false;

  return (` ${cleanMessage} `).includes(
    ` ${cleanKeyword} `
  );
}

// Find the first matching rule.
function getBotReply(userMessage: string): string {
  for (const rule of rules) {
    const matched = rule.keywords.some((keyword) =>
      matchesKeyword(userMessage, keyword)
    );

    if (matched) {
      return rule.reply;
    }
  }

  return (
    "🤔 Sorry, I didn't quite understand that.\n\n" +
    "I can help you with:\n\n" +
    "🍽️ Menu and prices\n" +
    "🔥 Special deals\n" +
    "🕒 Opening hours\n" +
    "📍 Restaurant location\n" +
    "🛵 Food delivery\n" +
    "💳 Payment methods\n" +
    "🛒 How to order\n\n" +
    "Please try asking about one of these topics!"
  );
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    initialMessage,
  ]);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageIdRef = useRef(2);
  const timeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  // Scroll to the newest message.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  // Clear pending timeout when component unmounts.
  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function sendMessage(text?: string) {
    const userText = (text ?? input).trim();

    if (!userText || isTyping) return;

    const userMessage: Message = {
      id: messageIdRef.current++,
      sender: "user",
      text: userText,
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setIsTyping(true);

    const reply = getBotReply(userText);

    timeoutRef.current = setTimeout(() => {
      const botMessage: Message = {
        id: messageIdRef.current++,
        sender: "bot",
        text: reply,
      };

      setMessages((previous) => [
        ...previous,
        botMessage,
      ]);

      setIsTyping(false);
      timeoutRef.current = null;
    }, 500);
  }

  function handleReset() {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setMessages([initialMessage]);
    setInput("");
    setIsTyping(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 px-3 py-5 text-gray-900 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">

        {/* BRAND HEADER */}
        <div className="mb-6 text-center">
          <div className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-orange-500 text-4xl shadow-lg shadow-orange-200">
            🍔
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-orange-600 sm:text-4xl">
            Desi Bites
          </h1>

          <p className="mt-2 text-sm text-gray-600 sm:text-base">
            Delicious Food. Happy Conversations.
          </p>

          <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-2 text-xs font-medium text-orange-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Restaurant Assistant • Demo Project
          </div>
        </div>

        {/* CHAT CONTAINER */}
        <section className="overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-2xl shadow-orange-200/60">

          {/* CHAT HEADER */}
          <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-4 text-white sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-2xl">
                🤖
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-lg font-bold">
                  Desi Bites Assistant
                </h2>
                <p className="flex items-center gap-2 text-xs text-orange-100">
                  <span className="h-2 w-2 rounded-full bg-green-300" />
                  Ready to help • Rule-Based Bot
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="shrink-0 rounded-xl bg-white/20 px-3 py-2 text-xs font-semibold transition hover:bg-white/30"
            >
              ↻ Reset
            </button>
          </div>

          {/* QUICK TOPIC BUTTONS */}
          <div className="border-b border-orange-100 bg-orange-50/70 px-4 py-4 sm:px-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-orange-700">
              Explore quick topics
            </p>

            <div className="flex flex-wrap gap-2">
              {quickTopics.map((topic) => (
                <button
                  key={topic.label}
                  type="button"
                  disabled={isTyping}
                  onClick={() => sendMessage(topic.label)}
                  className="rounded-full border border-orange-200 bg-white px-4 py-2 text-sm font-medium text-orange-700 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-400 hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="mr-1">
                    {topic.icon}
                  </span>
                  {topic.label}
                </button>
              ))}
            </div>
          </div>

          {/* CHAT MESSAGES */}
          <div
            className="h-[420px] overflow-y-auto bg-gradient-to-b from-white to-orange-50/50 px-3 py-5 sm:h-[480px] sm:px-6"
            aria-live="polite"
          >
            <div className="space-y-5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-end gap-2 ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-lg">
                      🍔
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[75%] ${
                      message.sender === "user"
                        ? "rounded-br-sm bg-orange-500 text-white"
                        : "rounded-bl-sm border border-orange-100 bg-white text-gray-800"
                    }`}
                  >
                    <p className="whitespace-pre-wrap break-words">
                      {message.text}
                    </p>
                  </div>

                  {message.sender === "user" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg">
                      👤
                    </div>
                  )}
                </div>
              ))}

              {/* TYPING INDICATOR */}
              {isTyping && (
                <div className="flex items-end gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-100 text-lg">
                    🍔
                  </div>

                  <div className="rounded-2xl rounded-bl-sm border border-orange-100 bg-white px-5 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Typing
                      </span>

                      <div className="flex items-center gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-orange-400" />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-orange-400"
                          style={{ animationDelay: "150ms" }}
                        />
                        <span
                          className="h-2 w-2 animate-bounce rounded-full bg-orange-400"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* CHAT INPUT */}
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendMessage();
            }}
            className="border-t border-orange-100 bg-white p-3 sm:p-5"
          >
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                placeholder="Ask me anything about Desi Bites..."
                aria-label="Your message"
                disabled={isTyping}
                className="min-w-0 flex-1 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-100 disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="shrink-0 rounded-2xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-md shadow-orange-200 transition hover:bg-orange-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 sm:px-7"
              >
                Send ➤
              </button>
            </div>

            <p className="mt-3 text-center text-xs text-gray-400">
              ⚠️ Demo restaurant • No real orders or payments
            </p>
          </form>
        </section>

        {/* FOOTER */}
        <footer className="mt-6 text-center">
          <p className="text-sm font-semibold text-orange-700">
            Made with ❤️ for Desi Bites
          </p>

          <p className="mt-1 text-xs text-gray-500">
            Rule-Based Restaurant Chatbot • Next.js & Tailwind CSS
          </p>
        </footer>
      </div>
    </main>
  );
}
