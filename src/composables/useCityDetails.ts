import { ref } from "vue";
import type { City } from "@/types";
import { searchPlace } from "@/api/places";
import { fetchWikipediaSummary } from "@/api/wiki";

export interface CityDetails {
  name: string;
  country: string;
  population?: number;
  flagUrl?: string;
  summary: string;
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

      // -----------------------------
      // 1. Extract Google summary
      // -----------------------------
      let summary: string =
        anyPlace?.editorialSummary?.text ??
        anyPlace?.editorialSummary ??
        "";

      // Normalize whitespace
      summary = summary?.trim() ?? "";

      // -----------------------------
      // 2. Detect useless Google summaries
      // -----------------------------
      const isGarbage =
        !summary ||
        summary.length < 20 ||
        summary.toLowerCase().startsWith(`${city.name.toLowerCase()} refers to:`);

      // -----------------------------
      // 3. Wikipedia fallback
      // -----------------------------
      if (isGarbage) {
        const wiki = await fetchWikipediaSummary(city.name, city.country);
        if (wiki) summary = wiki;
      }

      // -----------------------------
      // 4. Final normalized details
      // -----------------------------
      details.value = {
        name: anyPlace?.displayName?.text ?? anyPlace?.name ?? city.name,
        country: city.country,
        population: city.population,
        flagUrl: undefined,
        summary: summary || "No description available."
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