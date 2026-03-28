// src/composables/useCityBehavior.ts
import { ref, watch } from "vue";
import type { City } from "@/types";
import {
  createCityBehavior,
  type CityDetails,
  type CityPlace
} from "@/domain/CityBehavior";

export function useCityBehavior(city: City) {
  const behavior = createCityBehavior();

  // Reactive state
  const loading = ref(false);
  const error = ref<string | null>(null);
  const details = ref<CityDetails | null>(null);

  const places = ref<CityPlace[]>([]);
  const placesLoading = ref(false);

  // Load both details + places
  async function loadAll(city: City) {
    loading.value = true;
    error.value = null;
    details.value = null;

    try {
      // Load city details
      details.value = await behavior.loadDetails(city);

      // Load places of interest
      placesLoading.value = true;
      places.value = await behavior.loadPlaces(city);
    } catch (err) {
      console.error("useCityBehavior error:", err);
      error.value = "Failed to load city data";
    } finally {
      loading.value = false;
      placesLoading.value = false;
    }
  }

  // Reload whenever the city changes
  watch(
    () => city,
    (c) => c && loadAll(c),
    { immediate: true }
  );

  return {
    loading,
    error,
    details,
    places,
    placesLoading
  };
}