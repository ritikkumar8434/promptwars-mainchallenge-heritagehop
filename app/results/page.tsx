'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { TravelPlanInput, TravelPlanOutput } from '@/types/travel';
import { ResultTabs } from '@/components/ResultTabs';
import { Chatbot } from '@/components/Chatbot';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState, InlineAlert } from '@/components/ErrorState';
import { AIBadge, GroundedBadge, ConfidenceBadge } from '@/components/ConfidenceBadge';

interface PlanMeta {
  usedFallback: boolean;
  message: string;
  providerAttempts: { name: string; failed: boolean; reason?: string }[];
}

const STYLE_VARIANTS = ['more adventurous', 'more relaxed and slow-paced', 'more food-focused', 'more offbeat and local'];

export default function ResultsPage() {
  const [plan, setPlan] = useState<TravelPlanOutput | null>(null);
  const [meta, setMeta] = useState<PlanMeta | null>(null);
  const [input, setInput] = useState<TravelPlanInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);
  const [pendingQuestion, setPendingQuestion] = useState<{ text: string; nonce: number } | undefined>();

  useEffect(() => {
    const storedPlan = sessionStorage.getItem('heritagehop:lastPlan');
    const storedMeta = sessionStorage.getItem('heritagehop:lastMeta');
    const storedInput = sessionStorage.getItem('heritagehop:lastInput');

    if (!storedPlan || !storedInput) {
      setNotFound(true);
      return;
    }
    try {
      setPlan(JSON.parse(storedPlan));
      setMeta(storedMeta ? JSON.parse(storedMeta) : null);
      setInput(JSON.parse(storedInput));
    } catch {
      setNotFound(true);
    }
  }, []);

  async function regenerate(styleVariant?: string) {
    if (!input) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, styleVariant }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Unable to regenerate your plan.');
        setLoading(false);
        return;
      }
      setPlan(data.plan);
      setMeta(data.meta);
      sessionStorage.setItem('heritagehop:lastPlan', JSON.stringify(data.plan));
      sessionStorage.setItem('heritagehop:lastMeta', JSON.stringify(data.meta));
    } catch {
      setError('Network error — please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (notFound) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <ErrorState
          title="No trip plan found"
          message="We couldn't find a generated plan. Start by telling us about your trip."
        />
        <Link href="/planner" className="btn-primary mt-6 inline-flex">
          Go to Planner
        </Link>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <LoadingState message="Loading your travel plan…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        <AIBadge />
        {meta && !meta.usedFallback && <GroundedBadge />}
        <ConfidenceBadge confidence={plan.confidence} />
      </div>

      {meta?.usedFallback && (
        <div className="mt-4">
          <InlineAlert tone="warning" message={meta.message} />
        </div>
      )}

      {error && (
        <div className="mt-4">
          <ErrorState message={error} onRetry={() => regenerate()} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={() => regenerate(STYLE_VARIANTS[Math.floor(Math.random() * STYLE_VARIANTS.length)])}
          className="btn-secondary"
        >
          🔄 Regenerate with different style
        </button>
        <button type="button" onClick={() => setExportNotice(true)} className="btn-secondary">
          📤 Export itinerary
        </button>
      </div>

      {exportNotice && (
        <div className="mt-3">
          <InlineAlert message="Export is coming soon — for now, you can print this page or copy details manually." />
        </div>
      )}

      <div className="mt-8">
        {loading ? (
          <LoadingState />
        ) : (
          <ResultTabs
            plan={plan}
            onAskAI={(q) => setPendingQuestion({ text: q, nonce: Date.now() % 1_000_000_000 })}
          />
        )}
      </div>

      <div className="mt-10">
        <Chatbot
          city={plan.city}
          planSummary={plan.overview}
          suggestions={plan.chatbotSuggestions}
          pendingQuestion={pendingQuestion}
        />
      </div>
    </div>
  );
}
