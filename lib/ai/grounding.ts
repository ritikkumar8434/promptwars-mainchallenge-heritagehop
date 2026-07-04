import type { GroundingBundle, OsmPlace } from '@/types/travel';
import { findClosestCity } from '@/lib/data/india-destinations';

const FETCH_TIMEOUT_MS = 6_000;

async function fetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

// Best-effort Overpass (OpenStreetMap) lookup for named tourist attractions
// near a city's seed coordinates. Never throws — external API failure must
// never break the planning flow, so any error just yields an empty result.
async function fetchOsmPlaces(lat: number, lon: number): Promise<OsmPlace[]> {
  try {
    const query = `[out:json][timeout:5];(node["tourism"="attraction"](around:5000,${lat},${lon});node["historic"](around:5000,${lat},${lon}););out body 10;`;
    const res = await fetchWithTimeout('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: query,
    });
    if (!res.ok) return [];
    const data = await res.json();
    const elements: any[] = data?.elements ?? [];
    return elements
      .filter((el) => el.tags?.name)
      .slice(0, 10)
      .map((el) => ({
        name: el.tags.name as string,
        category: (el.tags.tourism ?? el.tags.historic ?? 'landmark') as string,
        lat: el.lat,
        lon: el.lon,
      }));
  } catch {
    return [];
  }
}

// Best-effort Wikipedia summary for cultural/heritage grounding.
async function fetchWikiSummary(cityName: string): Promise<string | undefined> {
  try {
    const res = await fetchWithTimeout(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`
    );
    if (!res.ok) return undefined;
    const data = await res.json();
    return typeof data?.extract === 'string' ? data.extract.slice(0, 800) : undefined;
  } catch {
    return undefined;
  }
}

// Assembles all grounding sources for a given city input. Runs external
// fetches in parallel and degrades gracefully — a missing seed city or
// failed external call never throws, it just yields a sparser bundle.
export async function buildGroundingBundle(cityInput: string): Promise<GroundingBundle> {
  const seedCity = findClosestCity(cityInput);

  const lat = seedCity?.coordinates.lat;
  const lon = seedCity?.coordinates.lon;

  const [osmPlaces, wikiSummary] = await Promise.all([
    lat && lon ? fetchOsmPlaces(lat, lon) : Promise.resolve([]),
    fetchWikiSummary(seedCity?.name ?? cityInput),
  ]);

  return { seedCity, osmPlaces, wikiSummary };
}
