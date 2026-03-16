// src/composables/useCompareInsights.ts
import { computed } from "vue";
import type { City, CompareResult } from "@/types";

export function useCompareInsights(
  cityA: City,
  cityB: City,
  allCities: City[],
  result: CompareResult
) {
  // ------------------------------------------------------------
  // Helpers
  // ------------------------------------------------------------
  function closestByPopulation(target: City): City | null {
    const others = allCities.filter(c => c.name !== target.name);
    if (!others.length) return null;

    return others.reduce((best, c) => {
      const diff = Math.abs(c.population - target.population);
      const bestDiff = Math.abs(best.population - target.population);
      return diff < bestDiff ? c : best;
    });
  }

  function climateZone(lat: number): string {
    const a = Math.abs(lat);
    if (a < 23.5) return "tropical";
    if (a < 35) return "subtropical";
    if (a < 50) return "temperate";
    return "cold";
  }

  // ------------------------------------------------------------
  // Most comparable cities
  // ------------------------------------------------------------
  const comparableA = computed(() => closestByPopulation(cityA));
  const comparableB = computed(() => closestByPopulation(cityB));

  // ------------------------------------------------------------
  // Interesting connections
  // ------------------------------------------------------------
  const interestingFacts = computed(() => {
    const facts: string[] = [];

    if (!cityA || !cityB || !result) return facts;

    // Latitude proximity
    const latDiff = Math.abs(cityA.lat - cityB.lat);
    if (latDiff < 1.5) {
      facts.push(`Both cities sit within ${latDiff.toFixed(1)}° of latitude.`);
    }

    // Climate zone
    const zoneA = climateZone(cityA.lat);
    const zoneB = climateZone(cityB.lat);
    if (zoneA === zoneB) {
      facts.push(`Both cities are in the ${zoneA} climate zone.`);
    }

    // Density similarity (if area exists)
    if (cityA.areaKm2 && cityB.areaKm2) {
      const densityA = cityA.population / cityA.areaKm2;
      const densityB = cityB.population / cityB.areaKm2;
      const diff = Math.abs(densityA - densityB) / densityA;

      if (diff < 0.15) {
        facts.push(
          `Their population densities differ by only ${(diff * 100).toFixed(0)}%.`
        );
      }
    }

    // Time zone (if provided)
    if (cityA.tz && cityB.tz && cityA.tz === cityB.tz) {
      facts.push(`Both cities share the same time zone (${cityA.tz}).`);
    }

    // Flight time symmetry
    const hours = result.flightTimeHours;
    if (hours < 5) {
      facts.push(`The cities are only ${hours.toFixed(1)} hours apart by air.`);
    }

    return facts;
  });

  return {
    comparableA,
    comparableB,
    interestingFacts,
  };
}