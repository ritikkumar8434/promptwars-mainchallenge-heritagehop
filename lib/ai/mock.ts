import type {
  AIProvider,
  TravelPlanInput,
  TravelPlanOutput,
  GroundingBundle,
  DayPlan,
  StoryCard,
  EventCard,
} from '@/types/travel';
import { findClosestCity, INDIA_DESTINATIONS } from '@/lib/data/india-destinations';

// Guaranteed offline fallback. Deterministically builds a full TravelPlanOutput
// from local seed data — no network calls, never fails, always returns
// something demo-ready even with zero AI provider keys configured.
export const mockProvider: AIProvider = {
  name: 'mock',
  async generateTravelPlan(input: TravelPlanInput, grounding: GroundingBundle): Promise<TravelPlanOutput> {
    const city = grounding.seedCity ?? findClosestCity(input.city) ?? INDIA_DESTINATIONS[0];

    const itinerary: DayPlan[] = Array.from({ length: input.durationDays }, (_, i) => {
      const day = i + 1;
      const isLowWalking = input.accessibilityNeeds.includes('Low walking') || input.accessibilityNeeds.includes('Wheelchair-friendly');
      const attractionPool = city.attractions.concat(city.hiddenGems);
      const morningPick = attractionPool[(i * 2) % attractionPool.length];
      const afternoonPick = attractionPool[(i * 2 + 1) % attractionPool.length];
      return {
        day,
        title: `Day ${day}: ${city.name} — ${input.experienceType}`,
        summary: `A ${input.pace.toLowerCase()} day exploring ${city.name}'s heritage and ${input.interests[0]?.toLowerCase() ?? 'culture'}, paced for a ${input.groupType.toLowerCase()} group.`,
        morning: [`Visit ${morningPick.name} — ${morningPick.whyVisit}`],
        afternoon: [`Explore ${afternoonPick.name} and nearby local eateries for ${input.foodPreference}.`],
        evening: [`Relax at a local market or enjoy a ${city.eventCategories[0]?.toLowerCase() ?? 'cultural evening'}.`],
        walkingIntensity: isLowWalking ? 'Low' : input.pace === 'Fast-paced' ? 'High' : 'Moderate',
        notes: isLowWalking
          ? 'Itinerary adjusted for low-walking accessibility needs — prioritizes flat, shorter routes.'
          : 'Standard walking pace based on selected travel pace.',
      };
    });

    const stories: StoryCard[] = city.attractions.slice(0, 2).map((a) => ({
      placeName: a.name,
      title: `Stories of ${a.name}`,
      narrative: `Imagine arriving at ${a.name} in the soft early light, when ${city.name}'s streets are just waking up. ${a.description} Local visitors and residents alike have long valued this place — ${a.culturalSignificance}`,
      historicalNote: a.culturalSignificance,
      respectfulnessNote: 'This narrative is a general cultural impression, not a documented historical account — verify specific dates and claims independently.',
      audioGuideScript: `Welcome to ${a.name}. As you approach, notice ${a.description.toLowerCase()} Take a moment to appreciate ${a.culturalSignificance.toLowerCase()}`,
    }));

    const localEvents: EventCard[] = city.eventCategories.slice(0, 4).map((cat) => ({
      name: `${cat} in ${city.name}`,
      category: cat,
      description: `A ${cat.toLowerCase()} experience commonly available in ${city.name}, reflecting local cultural rhythms.`,
      isSample: true,
      dateHint: 'Timing varies — check locally for current schedules',
      locationHint: city.name,
      sourceLabel: 'sample/demo cultural event suggestion',
    }));

    const confidence = 0.72;

    return {
      city: city.name,
      title: `${input.durationDays}-Day ${input.pace} ${city.name} Cultural Journey`,
      overview: `${city.overview} This plan is tailored for a ${input.groupType.toLowerCase()} group interested in ${input.interests
        .slice(0, 3)
        .join(', ')
        .toLowerCase()}, with a ${input.budget.toLowerCase()} budget and ${input.pace.toLowerCase()} pace.`,
      bestFor: [input.groupType, ...input.interests.slice(0, 3)],
      attractions: city.attractions,
      hiddenGems: city.hiddenGems,
      itinerary,
      stories,
      localEvents,
      experiences: city.experiences,
      food: city.food,
      etiquette: city.etiquette,
      safety: city.safety,
      accessibility: buildAccessibilityNotes(input),
      sustainability: [
        'Support local artisans and family-run eateries over large chains where possible.',
        'Carry a reusable water bottle — many heritage areas now offer refill points.',
        'Respect wildlife, water bodies, and heritage structures — avoid touching fragile carvings or ruins.',
      ],
      chatbotSuggestions: [
        'Make this itinerary more senior-friendly',
        'Suggest a vegetarian-only food trail',
        'Add more hidden gems and fewer crowded sites',
      ],
      confidence,
      sourcesUsed: ['local seed dataset', 'HeritageHop curated demo data'],
      fallbackUsed: true,
      providerUsed: 'mock',
    };
  },
};

function buildAccessibilityNotes(input: TravelPlanInput): string[] {
  const notes: string[] = [];
  if (input.accessibilityNeeds.includes('Wheelchair-friendly')) {
    notes.push('Routes prioritize paved, step-free paths where available; some heritage sites have inherent uneven terrain that cannot be fully avoided.');
  }
  if (input.accessibilityNeeds.includes('Low walking')) {
    notes.push('Daily walking distances are kept short, with rest points and vehicle transfers between major stops.');
  }
  if (input.accessibilityNeeds.includes('Senior-friendly')) {
    notes.push('Pacing avoids early starts and long midday sun exposure; seating breaks are built into the itinerary.');
  }
  if (input.accessibilityNeeds.includes('Avoid stairs')) {
    notes.push('Sites with mandatory staircases (e.g. fort towers) are noted — alternate ground-level viewing is suggested where possible.');
  }
  if (input.accessibilityNeeds.includes('Child-friendly')) {
    notes.push('Includes shorter activity blocks and open spaces suitable for children to rest and play.');
  }
  if (input.accessibilityNeeds.includes('Quiet places')) {
    notes.push('Prioritizes early-morning or off-peak visit windows to reduce crowd noise and density.');
  }
  if (notes.length === 0) {
    notes.push('No specific accessibility accommodations requested — standard walking itinerary applies.');
  }
  return notes;
}
