import type { PlaceCard } from '@/types/travel';
import { ConfidenceBadge, BudgetBadge } from './ConfidenceBadge';

export function AttractionCard({ place }: { place: PlaceCard }) {
  return (
    <article className="card animate-slide-up" aria-labelledby={`attraction-${slug(place.name)}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 id={`attraction-${slug(place.name)}`} className="text-lg font-semibold text-slate-900">
          {place.name}
        </h3>
        <BudgetBadge level={place.budgetLevel} />
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{place.category}</p>
      <p className="mt-3 text-sm text-slate-700">{place.description}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-semibold text-slate-800">Why visit</dt>
          <dd className="text-slate-600">{place.whyVisit}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Cultural significance</dt>
          <dd className="text-slate-600">{place.culturalSignificance}</dd>
        </div>
      </dl>

      <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
        <p>⏱ <span className="font-medium">{place.estimatedTime}</span></p>
        <p>📍 <span className="font-medium">{place.locationHint}</span></p>
        <p>♿ {place.accessibilityNote}</p>
        <p>🛡️ {place.safetyNote}</p>
      </div>

      {place.tags.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Tags">
          {place.tags.map((tag) => (
            <li key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
              {tag}
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4">
        <ConfidenceBadge confidence={place.confidence} />
      </div>
    </article>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
