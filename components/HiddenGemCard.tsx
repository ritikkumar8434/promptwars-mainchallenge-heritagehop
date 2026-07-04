import type { HiddenGemCard as HiddenGemCardType } from '@/types/travel';
import { ConfidenceBadge, BudgetBadge, HiddenGemBadge } from './ConfidenceBadge';

export function HiddenGemCard({ gem }: { gem: HiddenGemCardType }) {
  return (
    <article className="card animate-slide-up border-purple-200 bg-purple-50/40" aria-labelledby={`gem-${slug(gem.name)}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 id={`gem-${slug(gem.name)}`} className="text-lg font-semibold text-slate-900">
          {gem.name}
        </h3>
        <div className="flex gap-2">
          <HiddenGemBadge />
          <BudgetBadge level={gem.budgetLevel} />
        </div>
      </div>
      <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-500">{gem.category}</p>
      <p className="mt-3 text-sm text-slate-700">{gem.description}</p>

      <dl className="mt-4 space-y-2 text-sm">
        <div>
          <dt className="font-semibold text-slate-800">Why it's hidden</dt>
          <dd className="text-slate-600">{gem.whyHidden}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Why it matters culturally</dt>
          <dd className="text-slate-600">{gem.culturalImportance}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Best time to visit</dt>
          <dd className="text-slate-600">{gem.bestTimeToVisit}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-800">Responsible travel note</dt>
          <dd className="text-slate-600">{gem.responsibleTravelNote}</dd>
        </div>
      </dl>

      <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-slate-600 sm:grid-cols-2">
        <p>⏱ <span className="font-medium">{gem.estimatedTime}</span></p>
        <p>📍 <span className="font-medium">{gem.locationHint}</span></p>
        <p>♿ {gem.accessibilityNote}</p>
        <p>🛡️ {gem.safetyNote}</p>
      </div>

      <div className="mt-4">
        <ConfidenceBadge confidence={gem.confidence} />
      </div>
    </article>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
