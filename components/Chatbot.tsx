'use client';

import { useEffect, useState } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export function Chatbot({
  city,
  planSummary,
  suggestions,
  pendingQuestion,
}: {
  city: string;
  planSummary: string;
  suggestions: string[];
  pendingQuestion?: { text: string; nonce: number };
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (pendingQuestion?.text) {
      sendMessage(pendingQuestion.text);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingQuestion?.nonce]);

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, context: { city, currentPlanSummary: planSummary } }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', text: data.reply ?? 'Sorry, I couldn\'t process that.' }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'I couldn\'t reach the assistant right now — please try again shortly.' },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <section aria-labelledby="chatbot-heading" className="card">
      <h3 id="chatbot-heading" className="text-lg font-semibold text-slate-900">
        🤖 Ask HeritageHop AI
      </h3>
      <p className="mt-1 text-sm text-slate-600">Ask for refinements or details about your {city} plan.</p>

      {suggestions.length > 0 && messages.length === 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button key={s} type="button" onClick={() => sendMessage(s)} className="chip text-xs">
              {s}
            </button>
          ))}
        </div>
      )}

      <div
        aria-live="polite"
        className="mt-4 max-h-72 space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-3"
      >
        {messages.length === 0 && <p className="text-sm text-slate-400">No messages yet — ask a question below.</p>}
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
              m.role === 'user' ? 'ml-auto bg-saffron-600 text-white' : 'bg-white text-slate-800 shadow-sm'
            }`}
          >
            {m.text}
          </div>
        ))}
        {sending && <p className="text-sm text-slate-400">Thinking…</p>}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="mt-3 flex gap-2"
      >
        <label htmlFor="chat-input" className="sr-only">
          Ask a question about your trip
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. Make this itinerary more senior-friendly"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-saffron-500 focus:ring-saffron-500"
          maxLength={500}
        />
        <button type="submit" disabled={sending || !input.trim()} className="btn-primary !px-4">
          Send
        </button>
      </form>
    </section>
  );
}
