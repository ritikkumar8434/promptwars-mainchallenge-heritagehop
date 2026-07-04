// Core domain types shared between the AI layer, API routes, and UI.

export type BudgetLevel = 'Free' | 'Low' | 'Medium' | 'Premium';

export interface PlaceCard {
  name: string;
  category: string;
  description: string;
  whyVisit: string;
  culturalSignificance: string;
  estimatedTime: string;
  budgetLevel: BudgetLevel;
  accessibilityNote: string;
  safetyNote: string;
  locationHint: string;
  latitude?: number;
  longitude?: number;
  tags: string[];
  confidence: number;
}

export interface HiddenGemCard extends PlaceCard {
  whyHidden: string;
  culturalImportance: string;
  bestTimeToVisit: string;
  responsibleTravelNote: string;
}

export interface DayPlan {
  day: number;
  title: string;
  summary: string;
  morning: string[];
  afternoon: string[];
  evening: string[];
  walkingIntensity: 'Low' | 'Moderate' | 'High';
  notes: string;
}

export interface StoryCard {
  placeName: string;
  title: string;
  narrative: string;
  historicalNote: string;
  respectfulnessNote: string;
  audioGuideScript: string;
}

export interface EventCard {
  name: string;
  category: string;
  description: string;
  isSample: boolean;
  dateHint: string;
  locationHint: string;
  sourceLabel: string;
}

export interface ExperienceCard {
  type: string;
  name: string;
  description: string;
  culturalContext: string;
  groupSuitability: string[];
  priceHint: BudgetLevel;
  ctaOptions: ('Request Local Guide' | 'Save Experience' | 'Ask AI for Details')[];
}

export interface FoodCard {
  name: string;
  description: string;
  isVegetarian: boolean;
  spiceLevel: 'Mild' | 'Medium' | 'Spicy';
  whereToFind: string;
  priceHint: BudgetLevel;
  culturalNote: string;
}

export interface TravelPlanOutput {
  city: string;
  title: string;
  overview: string;
  bestFor: string[];
  attractions: PlaceCard[];
  hiddenGems: HiddenGemCard[];
  itinerary: DayPlan[];
  stories: StoryCard[];
  localEvents: EventCard[];
  experiences: ExperienceCard[];
  food: FoodCard[];
  etiquette: string[];
  safety: string[];
  accessibility: string[];
  sustainability: string[];
  chatbotSuggestions: string[];
  confidence: number;
  sourcesUsed: string[];
  fallbackUsed: boolean;
  providerUsed: 'gemini' | 'openrouter' | 'groq' | 'mock';
}

export type InterestTag =
  | 'Heritage'
  | 'Food'
  | 'Art'
  | 'Architecture'
  | 'Spirituality'
  | 'Markets'
  | 'Nature'
  | 'Museums'
  | 'Festivals'
  | 'Photography'
  | 'Local life'
  | 'Music and dance';

export type BudgetChoice = 'Budget' | 'Mid-range' | 'Premium';
export type TravelPace = 'Relaxed' | 'Balanced' | 'Fast-paced';
export type GroupType = 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Senior travelers' | 'Students';
export type AccessibilityNeed =
  | 'None'
  | 'Wheelchair-friendly'
  | 'Low walking'
  | 'Senior-friendly'
  | 'Child-friendly'
  | 'Avoid stairs'
  | 'Quiet places';
export type ExperienceType =
  | 'Heritage walk'
  | 'Artisan workshop'
  | 'Cooking class'
  | 'Local festival'
  | 'Food trail'
  | 'Spiritual experience'
  | 'Market walk'
  | 'Museum guide'
  | 'Community experience';

export interface TravelPlanInput {
  city: string;
  durationDays: number;
  interests: InterestTag[];
  budget: BudgetChoice;
  pace: TravelPace;
  groupType: GroupType;
  language: string;
  accessibilityNeeds: AccessibilityNeed[];
  foodPreference: string;
  experienceType: ExperienceType;
  styleVariant?: string;
  refinementRequest?: string;
}

export interface AIProvider {
  name: 'gemini' | 'openrouter' | 'groq' | 'mock';
  generateTravelPlan(input: TravelPlanInput, grounding: GroundingBundle): Promise<TravelPlanOutput>;
}

export interface GroundingBundle {
  seedCity?: CitySeed;
  osmPlaces?: OsmPlace[];
  wikiSummary?: string;
}

export interface OsmPlace {
  name: string;
  category: string;
  lat: number;
  lon: number;
}

export interface CitySeed {
  slug: string;
  name: string;
  state: string;
  coordinates: { lat: number; lon: number };
  tagline: string;
  overview: string;
  attractions: PlaceCard[];
  hiddenGems: HiddenGemCard[];
  food: FoodCard[];
  etiquette: string[];
  safety: string[];
  experiences: ExperienceCard[];
  eventCategories: string[];
}
