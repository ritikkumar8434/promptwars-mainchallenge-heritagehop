import { z } from 'zod';

// ── Input validation (traveler-submitted, untrusted) ────────────────────

export const InterestEnum = z.enum([
  'Heritage', 'Food', 'Art', 'Architecture', 'Spirituality', 'Markets',
  'Nature', 'Museums', 'Festivals', 'Photography', 'Local life', 'Music and dance',
]);

export const BudgetEnum = z.enum(['Budget', 'Mid-range', 'Premium']);
export const PaceEnum = z.enum(['Relaxed', 'Balanced', 'Fast-paced']);
export const GroupTypeEnum = z.enum(['Solo', 'Couple', 'Family', 'Friends', 'Senior travelers', 'Students']);
export const AccessibilityEnum = z.enum([
  'None', 'Wheelchair-friendly', 'Low walking', 'Senior-friendly', 'Child-friendly', 'Avoid stairs', 'Quiet places',
]);
export const ExperienceTypeEnum = z.enum([
  'Heritage walk', 'Artisan workshop', 'Cooking class', 'Local festival', 'Food trail',
  'Spiritual experience', 'Market walk', 'Museum guide', 'Community experience',
]);

// Names/free-text fields: bounded length, no control characters, to blunt
// prompt-injection payloads and oversized requests before they reach the AI layer.
const hasControlChars = (v: string): boolean => {
  for (let i = 0; i < v.length; i++) {
    const code = v.charCodeAt(i);
    if (code <= 8 || (code >= 11 && code <= 31) || code === 127) return true;
  }
  return false;
};
const safeShortText = (max: number) =>
  z.string().trim().min(1).max(max).refine((v) => !hasControlChars(v), 'Contains invalid control characters');

export const TravelPlanInputSchema = z.object({
  city: safeShortText(60),
  durationDays: z.coerce.number().int().min(1).max(14),
  interests: z.array(InterestEnum).min(1).max(12),
  budget: BudgetEnum,
  pace: PaceEnum,
  groupType: GroupTypeEnum,
  language: safeShortText(30).default('English'),
  accessibilityNeeds: z.array(AccessibilityEnum).max(7).default(['None']),
  foodPreference: safeShortText(40).default('No preference'),
  experienceType: ExperienceTypeEnum,
  styleVariant: safeShortText(60).optional(),
  refinementRequest: safeShortText(300).optional(),
});

export type TravelPlanInputParsed = z.infer<typeof TravelPlanInputSchema>;

export const ChatRequestSchema = z.object({
  message: safeShortText(500),
  context: z
    .object({
      city: safeShortText(60).optional(),
      currentPlanSummary: safeShortText(2000).optional(),
    })
    .optional(),
});

export const EventsRequestSchema = z.object({
  city: safeShortText(60),
});

// ── Output validation (AI-generated, must be schema-safe before render) ──

const BudgetLevelEnum = z.enum(['Free', 'Low', 'Medium', 'Premium']);

const PlaceCardSchema = z.object({
  name: z.string().min(1).max(120),
  category: z.string().min(1).max(60),
  description: z.string().min(1).max(600),
  whyVisit: z.string().min(1).max(400),
  culturalSignificance: z.string().min(1).max(400),
  estimatedTime: z.string().min(1).max(60),
  budgetLevel: BudgetLevelEnum,
  accessibilityNote: z.string().min(1).max(300),
  safetyNote: z.string().min(1).max(300),
  locationHint: z.string().min(1).max(150),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  tags: z.array(z.string().max(30)).max(10).default([]),
  confidence: z.number().min(0).max(1),
});

const HiddenGemCardSchema = PlaceCardSchema.extend({
  whyHidden: z.string().min(1).max(400),
  culturalImportance: z.string().min(1).max(400),
  bestTimeToVisit: z.string().min(1).max(150),
  responsibleTravelNote: z.string().min(1).max(300),
});

const DayPlanSchema = z.object({
  day: z.number().int().min(1).max(30),
  title: z.string().min(1).max(120),
  summary: z.string().min(1).max(400),
  morning: z.array(z.string().max(300)).max(6).default([]),
  afternoon: z.array(z.string().max(300)).max(6).default([]),
  evening: z.array(z.string().max(300)).max(6).default([]),
  walkingIntensity: z.enum(['Low', 'Moderate', 'High']),
  notes: z.string().max(400).default(''),
});

const StoryCardSchema = z.object({
  placeName: z.string().min(1).max(120),
  title: z.string().min(1).max(150),
  narrative: z.string().min(1).max(1500),
  historicalNote: z.string().max(400).default(''),
  respectfulnessNote: z.string().max(300).default(''),
  audioGuideScript: z.string().max(1500).default(''),
});

const EventCardSchema = z.object({
  name: z.string().min(1).max(120),
  category: z.string().min(1).max(60),
  description: z.string().min(1).max(400),
  isSample: z.boolean().default(true),
  dateHint: z.string().max(80).default('Timing varies — check locally'),
  locationHint: z.string().max(150).default(''),
  sourceLabel: z.string().max(80).default('sample/demo cultural event suggestion'),
});

const ExperienceCardSchema = z.object({
  type: z.string().min(1).max(60),
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(400),
  culturalContext: z.string().max(400).default(''),
  groupSuitability: z.array(z.string().max(40)).max(10).default([]),
  priceHint: BudgetLevelEnum,
  ctaOptions: z
    .array(z.enum(['Request Local Guide', 'Save Experience', 'Ask AI for Details']))
    .default(['Request Local Guide', 'Save Experience', 'Ask AI for Details']),
});

const FoodCardSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(400),
  isVegetarian: z.boolean().default(false),
  spiceLevel: z.enum(['Mild', 'Medium', 'Spicy']).default('Medium'),
  whereToFind: z.string().max(150).default(''),
  priceHint: BudgetLevelEnum,
  culturalNote: z.string().max(300).default(''),
});

export const TravelPlanOutputSchema = z.object({
  city: z.string().min(1).max(60),
  title: z.string().min(1).max(150),
  overview: z.string().min(1).max(1200),
  bestFor: z.array(z.string().max(40)).max(10).default([]),
  attractions: z.array(PlaceCardSchema).max(12).default([]),
  hiddenGems: z.array(HiddenGemCardSchema).max(10).default([]),
  itinerary: z.array(DayPlanSchema).max(14).default([]),
  stories: z.array(StoryCardSchema).max(8).default([]),
  localEvents: z.array(EventCardSchema).max(10).default([]),
  experiences: z.array(ExperienceCardSchema).max(10).default([]),
  food: z.array(FoodCardSchema).max(10).default([]),
  etiquette: z.array(z.string().max(300)).max(12).default([]),
  safety: z.array(z.string().max(300)).max(12).default([]),
  accessibility: z.array(z.string().max(300)).max(12).default([]),
  sustainability: z.array(z.string().max(300)).max(12).default([]),
  chatbotSuggestions: z.array(z.string().max(150)).max(8).default([]),
  confidence: z.number().min(0).max(1),
  sourcesUsed: z.array(z.string().max(80)).max(10).default([]),
  fallbackUsed: z.boolean().default(false),
});

export type TravelPlanOutputParsed = z.infer<typeof TravelPlanOutputSchema>;
