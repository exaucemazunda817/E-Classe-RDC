"use client";

import { useEffect, useRef, useState } from "react";
import { IconSend } from "@/lib/icons";

type ChatMessage = {
  id: string;
  content: string;
  createdAt: string;
  senderId: string;
  sender: { id: string; name: string };
};

export default function ChatThread({
  conversationId,
  currentUserId,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  initialMessages: ChatMessage[];
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/messages/conversations/${conversationId}`);
      if (res.ok) setMessages(await res.json());
    }, 4000);
    return () => clearInterval(interval);
  }, [conversationId]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = content.trim();
    if (!text || sending) return;

    setSending(true);
    setContent("");

    const res = await fetch(`/api/messages/conversations/${conversationId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });

    if (res.ok) {
      const message = await res.json();
      setMessages((prev) => [...prev, message]);
    } else {
      setContent(text);
    }
    setSending(false);
  }

  return (
    <div className="flex flex-col h-[65vh] rounded-2xl border border-brand-line bg-white overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-brand-slate/50 text-center mt-10">
            Aucun message pour l&apos;instant. Écris le premier !
          </p>
        ) : (
          messages.map((m) => {
            const isMine = m.senderId === currentUserId;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                    isMine
                      ? "bg-brand-blue text-white rounded-br-sm"
                      : "bg-brand-line/60 text-brand-navy rounded-bl-sm"
                  }`}
                >
                  {!isMine && (
                    <p className="text-xs font-semibold text-brand-blue/70 mb-0.5">{m.sender.name}</p>
                  )}
                  <p className="whitespace-pre-wrap break-words">{m.content}</p>
                  <p className={`text-[10px] mt-1 ${isMine ? "text-white/60" : "text-brand-slate/40"}`}>
                    {new Date(m.createdAt).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-brand-line p-3">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Écris ton message..."
          className="flex-1 rounded-full border border-brand-line px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
        />
        <button
          type="submit"
          disabled={sending || !content.trim()}
          aria-label="Envoyer"
          className="shrink-0 bg-brand-orange hover:bg-brand-orangeDark transition-colors text-white rounded-full p-3 disabled:opacity-50"
        >
          <IconSend className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
