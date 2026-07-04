import type { FoodCard as FoodCardType } from '@/types/travel';
import { BudgetBadge } from './ConfidenceBadge';

const SPICE_ICON: Record<string, string> = { Mild: '🌶️', Medium: '🌶️🌶️', Spicy: '🌶️🌶️🌶️' };

export function FoodCard({ food }: { food: FoodCardType }) {
  return (
    <article className="card" aria-labelledby={`food-${slug(food.name)}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 id={`food-${slug(food.name)}`} className="text-lg font-semibold text-slate-900">
          {food.name}
        </h3>
        <BudgetBadge level={food.priceHint} />
      </div>
      <p className="mt-2 text-sm text-slate-700">{food.description}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        <span className="badge bg-green-100 text-green-800">
          {food.isVegetarian ? '🌱 Vegetarian' : '🍖 Non-vegetarian'}
        </span>
        <span className="badge bg-orange-100 text-orange-800">
          {SPICE_ICON[food.spiceLevel]} {food.spiceLevel}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">📍 {food.whereToFind}</p>
      {food.culturalNote && <p className="mt-2 text-xs text-slate-500">{food.culturalNote}</p>}
    </article>
  );
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
