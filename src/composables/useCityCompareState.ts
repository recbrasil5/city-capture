// src/composables/useCityCompareState.ts
import { ref, computed } from "vue";
import type { City } from "@/types";
import { createCityCompareBehavior } from "@/domain/CityCompareBehavior";
import { computeCityZoom } from "@/utils/cityBounds";

export function useCityCompareState() {
  const behavior = createCityCompareBehavior();
  const cities = ref<City[]>([]);

  // Reactive wrapper around domain state
  const fsm = ref(behavior.getState());

  function sync() {
    fsm.value = behavior.getState();
  }

  // ------------------------------------------------------------
  // Exposed reactive state
  // ------------------------------------------------------------
  const mode = computed(() => fsm.value.mode);

  const selectedA = computed(() =>
    fsm.value.mode === "city" || fsm.value.mode === "compare"
      ? fsm.value.a
      : null
  );

  const selectedB = computed(() =>
    fsm.value.mode === "compare" ? fsm.value.b : null
  );

  const compareResult = computed(() =>
    fsm.value.mode === "compare" ? fsm.value.result : null
  );

  // Zoom level derived from cityA selection (null = don't zoom)
  const targetZoom = computed(() =>
    fsm.value.mode === "city" ? computeCityZoom(fsm.value.a) : null
  );

  // Bounds for compare mode — fit map to show both cities
  const compareBounds = computed(() => {
    if (fsm.value.mode !== "compare") return null;
    return [
      { lat: fsm.value.a.lat, lng: fsm.value.a.lng },
      { lat: fsm.value.b.lat, lng: fsm.value.b.lng },
    ];
  });

  // Short-route label for bottom overlay (null = long route, shown on arc instead)
  const shortRouteLabel = computed(() => {
    const r = compareResult.value;
    if (!r || r.distanceMiles >= 2500) return null;
    const mi = Math.round(r.distanceMiles).toLocaleString();
    const km = Math.round(r.distanceKm).toLocaleString();
    return { distance: `${mi} mi / ${km} km`, time: r.flightTime };
  });

  // ------------------------------------------------------------
  // Event handlers (sync after domain updates)
  // ------------------------------------------------------------
  function handleMarkerClick(city: City) {
    behavior.onMarkerClick(city);
    sync();
  }

  function handleMapClick() {
    behavior.onMapClick();
    sync();
  }

  function resetAll() {
    behavior.resetAll();
    sync();
  }

  return {
    cities,
    mode,
    selectedA,
    selectedB,
    compareResult,
    targetZoom,
    compareBounds,
    shortRouteLabel,

    handleMarkerClick,
    handleMapClick,
    resetAll,
  };
}