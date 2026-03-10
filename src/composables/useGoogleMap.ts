// src/composables/useGoogleMap.ts
import { ref } from "vue";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export function useGoogleMap() {
  const mapEl = ref<HTMLDivElement | null>(null);
  const map = ref<google.maps.Map | null>(null);

  async function initMap(options: google.maps.MapOptions) {
    setOptions({
      apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
      version: "weekly",
    });

    const { Map } = await importLibrary("maps");

    if (!mapEl.value) return;

    map.value = new Map(mapEl.value, options);
  }

  return { mapEl, map, initMap };
}