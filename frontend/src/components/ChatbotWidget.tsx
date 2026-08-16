import { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendChatMessage } from "../api/chatbot";
import type { ChatMessage } from "../types";

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "bot", content: "Hi! Ask me about events, prices, or availability." },
  ]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: sendChatMessage,
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    },
    onError: () => {
      setMessages((prev) => [...prev, { role: "bot", content: "Sorry, something went wrong. Try again." }]);
    },
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, chatMutation.isPending]);

useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 639px)");

        if (isOpen && mediaQuery.matches) {
        document.body.style.overflow = "hidden";
        } else {
        document.body.style.overflow = "";
        }

        return () => {
        document.body.style.overflow = "";
        };
    }, [isOpen]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setInput("");
    chatMutation.mutate(trimmed);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {isOpen && (
        <div
          className="
            fixed z-50 bg-surface border border-border shadow-2xl flex flex-col overflow-hidden
            inset-x-0 bottom-0 rounded-t-2xl h-[70vh]
            sm:inset-auto sm:bottom-19 sm:right-6 sm:w-72 sm:h-100 sm:max-h-[60vh] sm:rounded-2xl
          "
        >
          <div className="bg-bg border-b border-border px-3 py-2.5 flex items-center justify-between gap-3 shrink-0">
            <div className="min-w-0">
              <p className="font-display font-semibold text-text text-sm">Event Assistant</p>
              <p className="text-text-muted text-xs">Ask about events & bookings</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-text-muted hover:text-text text-base leading-none w-7 h-7 flex items-center justify-center shrink-0"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-3 space-y-2.5">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-1.5 text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-gold text-bg"
                      : "bg-bg border border-border text-text"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="bg-bg border border-border rounded-2xl px-3 py-1.5 text-sm text-text-muted">
                  Typing...
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSend} className="border-t border-border p-2.5 flex items-center gap-2 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about events..."
              className="flex-1 bg-bg border border-border rounded-full px-3.5 py-1.5 text-sm text-text focus:outline-none focus:border-gold min-w-0"
            />
            <button
              type="submit"
              disabled={chatMutation.isPending}
              className="bg-gold hover:bg-gold-light text-bg font-medium px-3.5 py-1.5 rounded-full text-sm transition-colors disabled:opacity-50 shrink-0"
            >
              Send
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-4 right-4 sm:right-6 z-50 w-11 h-11 bg-gold hover:bg-gold-light text-bg rounded-full shadow-xl items-center justify-center text-lg transition-colors ${
          isOpen ? "hidden sm:flex" : "flex"
        }`}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </>
  );
}