'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { TravelPlanOutput } from '@/types/travel';
import { AttractionCard } from './AttractionCard';
import { HiddenGemCard } from './HiddenGemCard';
import { ItineraryView } from './ItineraryView';
import { StoryMode } from './StoryMode';
import { EventCard } from './EventCard';
import { ExperienceCard } from './ExperienceCard';
import { FoodCard } from './FoodCard';
import { EmptyState } from './ErrorState';
import { AccessibilityBadge, SafetyBadge } from './ConfidenceBadge';
import { findClosestCity } from '@/lib/data/india-destinations';

const MapView = dynamic(() => import('./MapView').then((m) => m.MapView), {
  ssr: false,
  loading: () => <div className="skeleton h-[420px] w-full" />,
});

const TABS = [
  'Overview', 'Attractions', 'Hidden Gems', 'Itinerary', 'Stories',
  'Events', 'Food', 'Culture Notes', 'Map',
] as const;

type Tab = (typeof TABS)[number];

export function ResultTabs({ plan, onAskAI }: { plan: TravelPlanOutput; onAskAI?: (q: string) => void }) {
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const cityCoords = findClosestCity(plan.city)?.coordinates;

  return (
    <div>
      <div role="tablist" aria-label="Travel plan sections" className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab}
            role="tab"
            id={`tab-${tab}`}
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              activeTab === tab ? 'bg-saffron-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6" role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {activeTab === 'Overview' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="font-display text-2xl font-semibold text-slate-900">{plan.title}</h2>
              <p className="mt-3 text-slate-700">{plan.overview}</p>
              {plan.bestFor.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {plan.bestFor.map((b) => (
                    <span key={b} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {b}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <NotesCard title="Accessibility notes" items={plan.accessibility} icon={<AccessibilityBadge label="" />} />
              <NotesCard title="Safety notes" items={plan.safety} icon={<SafetyBadge />} />
              <NotesCard title="Sustainability tips" items={plan.sustainability} icon={<span aria-hidden="true">🌿</span>} />
              <NotesCard title="Cultural etiquette" items={plan.etiquette} icon={<span aria-hidden="true">🙏</span>} />
            </div>
          </div>
        )}

        {activeTab === 'Attractions' && (
          plan.attractions.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {plan.attractions.map((a) => <AttractionCard key={a.name} place={a} />)}
            </div>
          ) : <EmptyState message="No attractions found for this destination yet." />
        )}

        {activeTab === 'Hidden Gems' && (
          plan.hiddenGems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {plan.hiddenGems.map((g) => <HiddenGemCard key={g.name} gem={g} />)}
            </div>
          ) : <EmptyState message="No hidden gems surfaced for this destination yet." />
        )}

        {activeTab === 'Itinerary' && <ItineraryView days={plan.itinerary} />}

        {activeTab === 'Stories' && <StoryMode stories={plan.stories} />}

        {activeTab === 'Events' && (
          plan.localEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {plan.localEvents.map((e) => <EventCard key={e.name} event={e} />)}
            </div>
          ) : <EmptyState message="No local events found — check back closer to your travel dates." />
        )}

        {activeTab === 'Food' && (
          plan.food.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {plan.food.map((f) => <FoodCard key={f.name} food={f} />)}
            </div>
          ) : <EmptyState message="No food suggestions available yet." />
        )}

        {activeTab === 'Culture Notes' && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NotesCard title="Etiquette" items={plan.etiquette} icon={<span aria-hidden="true">🙏</span>} />
            <NotesCard title="Safety" items={plan.safety} icon={<SafetyBadge />} />
            <NotesCard title="Accessibility" items={plan.accessibility} icon={<AccessibilityBadge label="" />} />
            <NotesCard title="Sustainability" items={plan.sustainability} icon={<span aria-hidden="true">🌿</span>} />
          </div>
        )}

        {activeTab === 'Map' && cityCoords && (
          <MapView centerLat={cityCoords.lat} centerLon={cityCoords.lon} places={[...plan.attractions, ...plan.hiddenGems]} />
        )}
        {activeTab === 'Map' && !cityCoords && <EmptyState message="Map data unavailable for this destination." />}
      </div>

      {plan.experiences.length > 0 && (
        <section aria-labelledby="experiences-heading" className="mt-10">
          <h2 id="experiences-heading" className="font-display text-2xl font-semibold text-slate-900">
            Authentic Cultural Experiences
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {plan.experiences.map((exp) => (
              <ExperienceCard key={exp.name} experience={exp} onAskAI={onAskAI} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function NotesCard({ title, items, icon }: { title: string; items: string[]; icon: React.ReactNode }) {
  return (
    <div className="card">
      <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900">
        {icon} {title}
      </h3>
      {items.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-700">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="mt-2 text-sm text-slate-400">Nothing to show yet.</p>
      )}
    </div>
  );
}
