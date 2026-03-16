import { computed } from "vue";
import type { City, CompareResult } from "@/types";

// ------------------------------------------------------------
// Pure math helpers
// ------------------------------------------------------------
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateFlightTimeHours(distanceKm: number): number {
  return distanceKm / 800 + 0.8;
}

// ------------------------------------------------------------
// Peer cities (similar population)
// ------------------------------------------------------------
function getPeerCities(city: City, all: City[]) {
  const min = city.population * 0.8;
  const max = city.population * 1.2;

  return all
    .filter(
      (c) =>
        c.country === city.country &&
        c.name !== city.name &&
        c.population >= min &&
        c.population <= max
    )
    .sort(
      (a, b) =>
        Math.abs(a.population - city.population) -
        Math.abs(b.population - city.population)
    )
    .slice(0, 3);
}

// ------------------------------------------------------------
// Comparable trips (similar flight time)
// ------------------------------------------------------------
function getComparableTrips(origin: City, all: City[], target: number) {
  return all
    .filter((c) => c.name !== origin.name)
    .map((c) => {
      const d = haversine(origin.lat, origin.lng, c.lat, c.lng);
      const t = estimateFlightTimeHours(d);
      return { city: c, time: t };
    })
    .filter((x) => Math.abs(x.time - target) < 0.5)
    .sort(
      (a, b) =>
        Math.abs(a.time - target) - Math.abs(b.time - target)
    )
    .slice(0, 3);
}

// ------------------------------------------------------------
// Main composable
// ------------------------------------------------------------
export function useCompareInsights(
  cityA: City,
  cityB: City,
  allCities: City[],
  result: CompareResult
) {
  const flightTimeHours = computed(() => result.flightTimeHours);

  const peersA = computed(() => getPeerCities(cityA, allCities));
  const peersB = computed(() => getPeerCities(cityB, allCities));

  const comparableTripsFromA = computed(() =>
    getComparableTrips(cityA, allCities, flightTimeHours.value)
  );

  const comparableTripsFromB = computed(() =>
    getComparableTrips(cityB, allCities, flightTimeHours.value)
  );

  return {
    peersA,
    peersB,
    comparableTripsFromA,
    comparableTripsFromB,
    flightTimeHours
  };
}