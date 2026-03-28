// src/domain/CityCompareBehavior.ts
import type { City, CompareResult } from "@/types";
import { computeCompareResult } from "@/utils/greatCircle";

// ------------------------------------------------------------
// Domain State Types
// ------------------------------------------------------------
export type CityCompareState =
  | { mode: "empty" }
  | { mode: "city"; a: City }
  | { mode: "compare"; a: City; b: City; result: CompareResult };

// ------------------------------------------------------------
// Behavior Factory
// ------------------------------------------------------------
export function createCityCompareBehavior(initial?: CityCompareState) {
  let state: CityCompareState = initial ?? { mode: "empty" };

  // ------------------------------------------------------------
  // Getters
  // ------------------------------------------------------------
  function getState() {
    return state;
  }

  // ------------------------------------------------------------
  // Transitions
  // ------------------------------------------------------------
  function resetAll() {
    state = { mode: "empty" };
  }

  function goToCity(a: City) {
    state = { mode: "city", a };
  }

  function goToCompare(b: City) {
    if (state.mode !== "city") return;

    const a = state.a;
    const result = computeCompareResult(a, b);

    state = { mode: "compare", a, b, result };
  }

  function replaceB(b: City) {
    if (state.mode !== "compare") return;

    const a = state.a;
    const result = computeCompareResult(a, b);

    state = { mode: "compare", a, b, result };
  }

  function backToCity() {
    if (state.mode !== "compare") return;

    state = { mode: "city", a: state.a };
  }

  // ------------------------------------------------------------
  // Event Handlers (domain-level)
  // ------------------------------------------------------------
  function onMarkerClick(city: City) {
    switch (state.mode) {
      case "empty":
        goToCity(city);
        break;

      case "city":
        goToCompare(city);
        break;

      case "compare":
        if (city.name === state.a.name) {
          backToCity();
        } else {
          replaceB(city);
        }
        break;
    }
  }

  function onMapClick() {
    switch (state.mode) {
      case "empty":
        break;

      case "city":
        resetAll();
        break;

      case "compare":
        backToCity();
        break;
    }
  }

  return {
    // state access
    getState,

    // transitions
    resetAll,
    goToCity,
    goToCompare,
    replaceB,
    backToCity,

    // events
    onMarkerClick,
    onMapClick,
  };
}