'use client';

import { useState } from 'react';
import type { StoryCard } from '@/types/travel';

export function StoryMode({ stories }: { stories: StoryCard[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAudioScript, setShowAudioScript] = useState(false);

  if (stories.length === 0) {
    return <p className="text-sm text-slate-500">No immersive stories available yet.</p>;
  }

  const story = stories[activeIndex];

  return (
    <div className="rounded-2xl border border-heritage-200 bg-gradient-to-br from-heritage-50 to-saffron-50 p-6">
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Story selection">
        {stories.map((s, i) => (
          <button
            key={s.placeName}
            role="tab"
            aria-selected={i === activeIndex}
            onClick={() => {
              setActiveIndex(i);
              setShowAudioScript(false);
            }}
            className={`chip ${i === activeIndex ? 'chip-selected' : ''}`}
          >
            {s.placeName}
          </button>
        ))}
      </div>

      <div className="mt-5" role="tabpanel">
        <h3 className="font-display text-2xl font-semibold text-heritage-900">{story.title}</h3>
        <p className="mt-3 whitespace-pre-line text-base leading-relaxed text-slate-800">{story.narrative}</p>

        {story.historicalNote && (
          <p className="mt-4 text-xs text-slate-500">
            <span className="font-semibold">Historical note:</span> {story.historicalNote}
          </p>
        )}
        {story.respectfulnessNote && (
          <p className="mt-1 text-xs text-slate-500">
            <span className="font-semibold">A note on this narrative:</span> {story.respectfulnessNote}
          </p>
        )}

        {story.audioGuideScript && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowAudioScript((v) => !v)}
              className="btn-secondary !px-3 !py-1.5 text-xs"
              aria-expanded={showAudioScript}
            >
              🎧 {showAudioScript ? 'Hide' : 'Show'} audio-guide script
            </button>
            {showAudioScript && (
              <p className="mt-3 rounded-lg bg-white/70 p-4 text-sm italic text-slate-700">{story.audioGuideScript}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
