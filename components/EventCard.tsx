import type { EventCard as EventCardType } from '@/types/travel';

export function EventCard({ event }: { event: EventCardType }) {
  return (
    <article className="card" aria-labelledby={`event-${slug(event.name)}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 id={`event-${slug(event.name)}`} className="text-lg font-semibold text-slate-900">
          {event.name}
        </h3>
        <span className={`badge ${event.isSample ? 'bg-slate-100 text-slate-700' : 'bg-emerald-100 text-emerald-800'}`}>
          {event.isSample ? 'Sample suggestion' : 'Grounded event'}
        </span>
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{event.category}</p>
      <p className="mt-3 text-sm text-slate-700">{event.description}</p>
      <div className="mt-3 space-y-1 text-xs text-slate-600">
        <p>🗓 {event.dateHint}</p>
        <p>📍 {event.locationHint}</p>
        <p className="text-slate-400">Source: {event.sourceLabel}</p>
      </div>
    </article>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
