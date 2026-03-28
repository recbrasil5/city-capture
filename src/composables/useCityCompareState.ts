// src/composables/useCityCompareState.ts
import { ref } from "vue";
import type { City, CompareResult } from "@/types";
import { computeCompareResult } from "@/utils/greatCircle";

export function useCityCompareState() {
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
    if (!selectedA.value) return;

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
    // If comparing, go back to city view
    if (selectedB.value) {
      selectedB.value = null;
      compareResult.value = null;
      mode.value = "city";
      return;
    }

    // Otherwise reset everything
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