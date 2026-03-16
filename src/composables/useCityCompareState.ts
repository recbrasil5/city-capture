// src/composables/useCityCompareState.ts
import { ref } from "vue";
import type { City, CompareResult } from "@/types";
import { useGreatCircle } from "@/composables/useGreatCircle";

export function useCityCompareState() {
  const { computeCompareResult } = useGreatCircle();

  // ------------------------------------------------------------
  // State
  // ------------------------------------------------------------
  const cities = ref<City[]>([]);
  const selectedA = ref<City | null>(null);
  const selectedB = ref<City | null>(null);
  const compareResult = ref<CompareResult | null>(null);
  const mode = ref<"map" | "city" | "compare">("map");

  // ------------------------------------------------------------
  // Transitions
  // ------------------------------------------------------------
  function resetAll() {
    selectedA.value = null;
    selectedB.value = null;
    compareResult.value = null;
    mode.value = "map";
  }

  function goToCity(city: City) {
    selectedA.value = city;
    selectedB.value = null;
    compareResult.value = null;
    mode.value = "city";
  }

  function goToCompare(cityB: City) {
    if (!selectedA.value) return; // safety guard
    selectedB.value = cityB;
    compareResult.value = computeCompareResult(selectedA.value, cityB);
    mode.value = "compare";
  }

  // ------------------------------------------------------------
  // Event handlers
  // ------------------------------------------------------------
  function handleMarkerClick(city: City) {
    if (!selectedA.value) {
      goToCity(city);
      return;
    }
    goToCompare(city);
  }

  function handleMapClick() {
    if (selectedB.value) {
      selectedB.value = null;
      compareResult.value = null;
      mode.value = "city";
      return;
    }
    resetAll();
  }

  return {
    cities,
    selectedA,
    selectedB,
    compareResult,
    mode,
    resetAll,
    goToCity,
    goToCompare,
    handleMarkerClick,
    handleMapClick,
  };
}