// src/domain/CityBehavior.ts
import type { City } from "@/types";
import { searchPlace, getPhotoUrl, searchCityPointsOfInterest } from "@/api/places";
import { fetchWikipediaSummary } from "@/api/wiki";
import { computeDistanceKm, computeBearing } from "@/utils/geo";

export interface CityDetails {
  name: string;
  country: string;
  population?: number;
  summary: string;
  shortDescription?: string;
  rating?: number;
  ratingCount?: number;
  photoUrl?: string | null;
  wikiUrl?: string | null;
  coordinates: { lat: number; lng: number };
}

export interface CityPlace {
  id: string;
  name: string;
  category: string;
  photoUrl: string | null;
  distance: string;
  bearing: string;
}

export function createCityBehavior() {
  async function loadDetails(city: City): Promise<CityDetails> {
    const place = await searchPlace(city.name);
    const anyPlace = place as any | undefined;

    let summary =
      anyPlace?.editorialSummary?.text ??
      anyPlace?.editorialSummary ??
      "";

    summary = summary?.trim() ?? "";

    const isGarbage =
      !summary ||
      summary.length < 20 ||
      summary.toLowerCase().startsWith(`${city.name.toLowerCase()} refers to:`);

    const wiki = await fetchWikipediaSummary(city.name, city.country);

    if (isGarbage && wiki?.extract) {
      summary = wiki.extract;
    }

    const photoRef = anyPlace?.photos?.[0]?.name;
    const googlePhoto = photoRef ? getPhotoUrl(photoRef) : null;
    const wikiPhoto = wiki?.thumbnail?.source;

    return {
      name: anyPlace?.displayName?.text ?? city.name,
      country: city.country,
      population: city.population,
      summary: summary || "No description available.",
      shortDescription: wiki?.description,
      rating: anyPlace?.rating,
      ratingCount: anyPlace?.userRatingCount,
      photoUrl: wikiPhoto || googlePhoto || null,
      wikiUrl: wiki?.content_urls?.desktop?.page ?? null,
      coordinates: { lat: city.lat, lng: city.lng }
    };
  }

  async function loadPlaces(city: City): Promise<CityPlace[]> {
    const tier = city.population
      ? city.population < 50000
        ? 3
        : city.population < 500000
        ? 5
        : 6
      : 4;

    const raw = await searchCityPointsOfInterest(city.name);
    if (!raw) return [];

    const mapped = raw
      .map((p: any) => {
        const lat = p.location?.latitude;
        const lng = p.location?.longitude;
        if (typeof lat !== "number" || typeof lng !== "number") return null;

        const distanceKm = computeDistanceKm(city.lat, city.lng, lat, lng);

        return {
          id: p.id,
          name: p.displayName?.text ?? "Unknown place",
          category: (p.types?.[0]?.replace(/_/g, " ") as string) || "Attraction",
          photoUrl: p.photos?.[0] ? getPhotoUrl(p.photos[0].name) : null,
          distance: `${distanceKm.toFixed(1)} km`,
          bearing: computeBearing(city.lat, city.lng, lat, lng),
          _score: -distanceKm
        };
      })
      .filter(Boolean) as (CityPlace & { _score: number })[];

    return mapped
      .sort((a, b) => b._score - a._score)
      .slice(0, tier)
      .map(({ _score, ...rest }) => rest);
  }

  return {
    loadDetails,
    loadPlaces
  };
}