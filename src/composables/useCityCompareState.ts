// src/composables/useCityCompareState.ts
import { ref, computed } from "vue";
import type { City } from "@/types";
import { createCityCompareBehavior } from "@/domain/CityCompareBehavior";

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

    handleMarkerClick,
    handleMapClick,
    resetAll,
  };
}