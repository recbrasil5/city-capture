// src/composables/useGoogleMap.ts
import { ref } from "vue";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

export function useGoogleMap() {
  const mapEl = ref<HTMLDivElement | null>(null);
  const map = ref<google.maps.Map | null>(null);

  async function initMap(options: google.maps.MapOptions) {
    const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

    if (!key) {
      console.error("[useGoogleMap] VITE_GOOGLE_MAPS_API_KEY is missing — check .env.local");
      return;
    }

    console.log(`[useGoogleMap] key loaded: ${key.slice(0, 8)}…${key.slice(-4)}`);

    try {
      setOptions({ key, v: "weekly" });
      const { Map } = await importLibrary("maps");

      if (!mapEl.value) {
        console.warn("[useGoogleMap] mapEl ref is null — is the template mounted?");
        return;
      }

      map.value = new Map(mapEl.value, options);
      console.log("[useGoogleMap] map created ✓");
    } catch (err) {
      console.error("[useGoogleMap] initMap failed:", err);
    }
  }

  return { mapEl, map, initMap };
}