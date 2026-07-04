import { NextRequest, NextResponse } from 'next/server';
import { EventsRequestSchema } from '@/lib/validation/schemas';
import { checkRateLimit, getClientKey } from '@/lib/security/rate-limit';
import { findClosestCity } from '@/lib/data/india-destinations';
import type { EventCard } from '@/types/travel';

export const runtime = 'nodejs';

const REQUEST_TIMEOUT_MS = 8_000;

// Returns real events when TICKETMASTER_API_KEY is configured and a match
// is found; otherwise falls back to clearly labeled sample event categories
// from local seed data. External API failure never breaks this endpoint.
export async function GET(req: NextRequest) {
  const clientKey = getClientKey(req.headers);
  const rate = checkRateLimit(`events:${clientKey}`, { max: 20, windowMs: 60_000 });
  if (!rate.allowed) {
    return NextResponse.json({ error: 'Too many requests. Please wait a moment.' }, { status: 429 });
  }

  const city = req.nextUrl.searchParams.get('city') ?? '';
  const parsed = EventsRequestSchema.safeParse({ city });
  if (!parsed.success) {
    return NextResponse.json({ error: 'Please provide a valid city name.' }, { status: 400 });
  }

  const seedCity = findClosestCity(parsed.data.city);
  const ticketmasterKey = process.env.TICKETMASTER_API_KEY;

  if (ticketmasterKey && seedCity) {
    try {
      const realEvents = await fetchTicketmasterEvents(seedCity.name, ticketmasterKey);
      if (realEvents.length > 0) {
        return NextResponse.json({ events: realEvents, grounded: true });
      }
    } catch (err) {
      console.error('[HeritageHop] Ticketmaster fetch failed:', err);
      // fall through to sample events
    }
  }

  const sampleEvents: EventCard[] = (seedCity?.eventCategories ?? [
    'Heritage walk',
    'Craft workshop',
    'Food trail',
    'Museum exhibition',
  ]).map((category) => ({
    name: `${category}${seedCity ? ` in ${seedCity.name}` : ''}`,
    category,
    description: `A ${category.toLowerCase()} experience commonly available${seedCity ? ` in ${seedCity.name}` : ' in this region'}.`,
    isSample: true,
    dateHint: 'Timing varies — check locally for current schedules',
    locationHint: seedCity?.name ?? parsed.data.city,
    sourceLabel: 'sample/demo cultural event suggestion',
  }));

  return NextResponse.json({ events: sampleEvents, grounded: false });
}

async function fetchTicketmasterEvents(cityName: string, apiKey: string): Promise<EventCard[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?city=${encodeURIComponent(
      cityName
    )}&countryCode=IN&apikey=${apiKey}`;
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return [];
    const data = await res.json();
    const events: any[] = data?._embedded?.events ?? [];
    return events.slice(0, 6).map((e) => ({
      name: e.name,
      category: e.classifications?.[0]?.segment?.name ?? 'Event',
      description: e.info ?? `Live event in ${cityName}.`,
      isSample: false,
      dateHint: e.dates?.start?.localDate ?? 'Date TBC',
      locationHint: e._embedded?.venues?.[0]?.name ?? cityName,
      sourceLabel: 'Ticketmaster Discovery API',
    }));
  } finally {
    clearTimeout(timeout);
  }
}
