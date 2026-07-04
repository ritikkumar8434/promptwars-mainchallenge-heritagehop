// Best-effort recovery of near-miss AI output before strict schema
// validation. Despite explicit prompt instructions (lib/ai/prompts.ts),
// LLMs occasionally decorate enum fields ("Moderate (with options to
// reduce)") or wrap a single-item array as a bare object — both observed
// in practice across different providers. Recovering these here means a
// good response isn't discarded to the next fallback provider over a
// cosmetic formatting slip; genuinely malformed output still fails the
// Zod schema validation that runs immediately after this.

const BUDGET_LEVELS = ['Free', 'Low', 'Medium', 'Premium'];
const WALKING_INTENSITIES = ['Low', 'Moderate', 'High'];
const SPICE_LEVELS = ['Mild', 'Medium', 'Spicy'];

function coerceEnum(value: unknown, options: string[], fallback: string): string {
  if (typeof value !== 'string') return fallback;
  const exact = options.find((o) => o.toLowerCase() === value.toLowerCase());
  if (exact) return exact;
  const firstMatch = options.find((o) => new RegExp(`\\b${o}\\b`, 'i').test(value));
  return firstMatch ?? fallback;
}

// Some models return the string "true"/"false" for boolean fields despite
// an explicit `: boolean` type in the prompt — observed with Gemini.
function coerceBoolean(value: unknown, fallback: boolean): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    if (value.toLowerCase() === 'true') return true;
    if (value.toLowerCase() === 'false') return false;
  }
  return fallback;
}

// AI output sometimes returns a single object instead of a one-item array
// for fields the schema requires to be arrays.
function ensureArray(value: unknown): unknown[] {
  if (Array.isArray(value)) return value;
  if (value && typeof value === 'object') return [value];
  if (typeof value === 'string') return [value];
  return [];
}

function normalizePlace(place: unknown): unknown {
  if (!place || typeof place !== 'object') return place;
  const p = place as Record<string, unknown>;
  return {
    ...p,
    budgetLevel: coerceEnum(p.budgetLevel, BUDGET_LEVELS, 'Medium'),
    confidence: typeof p.confidence === 'number' ? p.confidence : 0.7,
  };
}

export function normalizeTravelPlanOutput(raw: unknown): unknown {
  if (!raw || typeof raw !== 'object') return raw;
  const r = raw as Record<string, unknown>;

  return {
    ...r,
    bestFor: ensureArray(r.bestFor),
    attractions: ensureArray(r.attractions).map(normalizePlace),
    hiddenGems: ensureArray(r.hiddenGems).map(normalizePlace),
    itinerary: ensureArray(r.itinerary).map((day) => {
      if (!day || typeof day !== 'object') return day;
      const d = day as Record<string, unknown>;
      return { ...d, walkingIntensity: coerceEnum(d.walkingIntensity, WALKING_INTENSITIES, 'Moderate') };
    }),
    stories: ensureArray(r.stories),
    localEvents: ensureArray(r.localEvents).map((event) => {
      if (!event || typeof event !== 'object') return event;
      const e = event as Record<string, unknown>;
      return { ...e, isSample: coerceBoolean(e.isSample, true) };
    }),
    experiences: ensureArray(r.experiences).map((exp) => {
      if (!exp || typeof exp !== 'object') return exp;
      const e = exp as Record<string, unknown>;
      return { ...e, priceHint: coerceEnum(e.priceHint, BUDGET_LEVELS, 'Medium') };
    }),
    food: ensureArray(r.food).map((item) => {
      if (!item || typeof item !== 'object') return item;
      const f = item as Record<string, unknown>;
      return {
        ...f,
        isVegetarian: coerceBoolean(f.isVegetarian, false),
        priceHint: coerceEnum(f.priceHint, BUDGET_LEVELS, 'Medium'),
        spiceLevel: coerceEnum(f.spiceLevel, SPICE_LEVELS, 'Medium'),
      };
    }),
  };
}
