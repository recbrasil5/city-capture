// src/composables/useCityPlaces.ts
import { ref } from "vue";
import type { City } from "@/types";
import { getPhotoUrl } from "@/api/places";
import { computeDistanceKm, computeBearing } from "@/utils/geo";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export interface CityPlace {
  id: string;
  name: string;
  category: string;
  photoUrl: string | null;
  distance: string;
  bearing: string;
}

export function useCityPlaces() {
  const places = ref<CityPlace[]>([]);
  const placesLoading = ref(false);

  async function loadPlaces(city: City) {
    placesLoading.value = true;

    try {
      const tier = city.population
        ? city.population < 50000
          ? 3
          : city.population < 500000
          ? 5
          : 6
        : 4;

      const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`;

      const body = {
        textQuery: `points of interest in ${city.name}`,
        languageCode: "en"
      };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask":
            "places.id,places.displayName,places.photos,places.location,places.types"
        },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        console.error("Places search error:", await res.text());
        places.value = [];
        return;
      }

      const data = await res.json();
      const raw = data.places || [];

      const mapped: (CityPlace & { _score: number })[] = raw
        .map((p: any) => {
          const category =
            (p.types?.[0]?.replace(/_/g, " ") as string | undefined) || "Attraction";

          const lat = p.location?.latitude;
          const lng = p.location?.longitude;

          if (typeof lat !== "number" || typeof lng !== "number") {
            return null;
          }

          const distanceKm = computeDistanceKm(city.lat, city.lng, lat, lng);
          const bearing = computeBearing(city.lat, city.lng, lat, lng);

          return {
            id: p.id,
            name: p.displayName?.text ?? "Unknown place",
            category,
            photoUrl: p.photos?.[0] ? getPhotoUrl(p.photos[0].name) : null,
            distance: `${distanceKm.toFixed(1)} km`,
            bearing,
            _score: -distanceKm
          };
        })
        .filter(Boolean) as (CityPlace & { _score: number })[];

      const sorted = mapped.sort((a, b) => b._score - a._score).slice(0, tier);

      places.value = sorted.map(({ _score, ...rest }) => rest);
    } catch (err) {
      console.error("useCityPlaces error:", err);
      places.value = [];
    } finally {
      placesLoading.value = false;
    }
  }

  return {
    places,
    placesLoading,
    loadPlaces
  };
}