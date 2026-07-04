'use client';

import { useState } from 'react';
import type { ExperienceCard as ExperienceCardType } from '@/types/travel';
import { BudgetBadge } from './ConfidenceBadge';

export function ExperienceCard({ experience, onAskAI }: { experience: ExperienceCardType; onAskAI?: (question: string) => void }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleCta(cta: string) {
    if (cta === 'Save Experience') {
      setSaved(true);
      return;
    }
    if (cta === 'Ask AI for Details' && onAskAI) {
      onAskAI(`Tell me more about the "${experience.name}" experience`);
      return;
    }
    setModalOpen(true);
  }

  return (
    <article className="card" aria-labelledby={`exp-${slug(experience.name)}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 id={`exp-${slug(experience.name)}`} className="text-lg font-semibold text-slate-900">
          {experience.name}
        </h3>
        <BudgetBadge level={experience.priceHint} />
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{experience.type}</p>
      <p className="mt-3 text-sm text-slate-700">{experience.description}</p>
      {experience.culturalContext && <p className="mt-2 text-xs text-slate-500">{experience.culturalContext}</p>}

      {experience.groupSuitability.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Suitable for">
          {experience.groupSuitability.map((g) => (
            <li key={g} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {g}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {experience.ctaOptions.map((cta) => (
          <button
            key={cta}
            type="button"
            onClick={() => handleCta(cta)}
            className="btn-secondary !px-3 !py-1.5 text-xs"
          >
            {cta === 'Save Experience' && saved ? 'Saved ✓' : cta}
          </button>
        ))}
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="booking-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 id="booking-modal-title" className="text-lg font-semibold text-slate-900">
              Coming soon
            </h4>
            <p className="mt-2 text-sm text-slate-600">
              Booking workflow coming soon. This demo focuses on AI-powered discovery and cultural planning.
            </p>
            <button type="button" className="btn-primary mt-4 w-full" onClick={() => setModalOpen(false)}>
              Got it
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
