import { ref } from "vue";
import type { City } from "@/types";
import { searchPlace, getPhotoUrl } from "@/api/places";
import { fetchWikipediaSummary } from "@/api/wiki";

export interface CityDetails {
  name: string;
  country: string;
  population?: number;
  summary: string;
  shortDescription?: string;
  rating?: number;
  ratingCount?: number;
  photoUrl?: string;
  wikiUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export function useCityDetails() {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const details = ref<CityDetails | null>(null);

  async function load(city: City) {
    loading.value = true;
    error.value = null;
    details.value = null;

    try {
      const place = await searchPlace(city.name);
      const anyPlace = place as any | undefined;

      // Google summary
      let summary: string =
        anyPlace?.editorialSummary?.text ??
        anyPlace?.editorialSummary ??
        "";

      summary = summary?.trim() ?? "";

      const isGarbage =
        !summary ||
        summary.length < 20 ||
        summary.toLowerCase().startsWith(`${city.name.toLowerCase()} refers to:`);

      // Wikipedia fallback
      const wiki = await fetchWikipediaSummary(city.name, city.country);

      if (isGarbage && wiki?.extract) {
        summary = wiki.extract;
      }

      // Photo
      const photoRef = anyPlace?.photos?.[0]?.name;
      const googlePhoto = photoRef ? getPhotoUrl(photoRef) : null;
      const wikiPhoto = wiki?.thumbnail?.source;

      const photoUrl = googlePhoto || wikiPhoto || null;

      details.value = {
        name: anyPlace?.displayName?.text ?? city.name,
        country: city.country,
        population: city.population,
        summary: summary || "No description available.",
        shortDescription: wiki?.description,
        rating: anyPlace?.rating,
        ratingCount: anyPlace?.userRatingCount,
        photoUrl,
        wikiUrl: wiki?.content_urls?.desktop?.page,
        coordinates: {
          lat: city.lat,
          lng: city.lng
        }
      };
    } catch (err) {
      console.error("useCityDetails error:", err);
      error.value = "Failed to load city details";
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    error,
    details,
    load
  };
}