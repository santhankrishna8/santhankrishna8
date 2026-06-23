"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Send, Sparkles } from "lucide-react";
import type { AiPick, Category, Place } from "@/lib/types";

const PROMPTS: Record<Category, string[]> = {
  restaurant: [
    "What should I eat tonight?",
    "Best spot for a date",
    "Cheap but highly rated",
  ],
  hotel: [
    "Best value for a family",
    "Most luxurious stay",
    "Great for a weekend trip",
  ],
  school: [
    "Top-rated for my kid",
    "Best for STEM",
    "Strong reputation nearby",
  ],
};

export function AiAssistant({
  category,
  places,
  onPicks,
}: {
  category: Category;
  places: Place[];
  onPicks: (picks: AiPick[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [tip, setTip] = useState<string | null>(null);

  async function ask(message: string) {
    if (!message.trim() || loading) return;
    setLoading(true);
    setAnswer(null);
    setTip(null);
    try {
      const res = await fetch("/api/ai/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, message, places }),
      });
      const data = await res.json();
      setAnswer(data.answer ?? "");
      setTip(data.tip ?? null);
      onPicks(data.picks ?? []);
    } catch {
      setAnswer("Something went wrong — please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glass rounded-3xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="brand-gradient grid h-8 w-8 place-items-center rounded-lg shadow">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none">Ask Spotlight AI</p>
          <p className="text-[11px] text-muted">Personalized picks in seconds</p>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        {PROMPTS[category].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => ask(p)}
            disabled={loading}
            className="rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:border-brand hover:text-brand disabled:opacity-50"
          >
            {p}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
          setInput("");
        }}
        className="flex items-center gap-2 rounded-full border border-border bg-surface-2 p-1 pl-4"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${category}s…`}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={loading}
          aria-label="Send"
          className="brand-gradient grid h-9 w-9 shrink-0 place-items-center rounded-full text-white shadow disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>

      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 rounded-2xl border border-brand/30 bg-brand/5 p-3 text-sm">
              <p className="leading-relaxed">{answer}</p>
              {tip && (
                <p className="mt-2 text-xs text-muted">💡 {tip}</p>
              )}
              <p className="mt-2 text-[11px] font-medium text-brand">
                ✨ Highlighted the top picks in the list →
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
