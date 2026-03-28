// src/utils/cityBounds.ts
import type { City } from "@/types";

export interface LatLng {
  lat: number;
  lng: number;
}

/**
 * Returns a zoom level proportional to city population.
 * Bigger city = more zoomed out.
 */
export function computeCityZoom(city: City): number {
  if (city.population > 5_000_000) return 3;
  if (city.population > 1_000_000) return 3;
  if (city.population > 500_000) return 5;
  if (city.population > 200_000) return 6;
  if (city.population > 100_000) return 7;
  return 8;
}

/**
 * Given a selected city and all cities, returns the bounding points
 * the map should fit to. Density-driven: includes the 5 nearest
 * neighbors so sparse regions zoom out and dense regions stay tight.
 */
export function computeCityBounds(city: City, allCities: City[]): LatLng[] {
  const sorted = allCities
    .filter(c => c.name !== city.name)
    .map(c => ({
      lat: c.lat,
      lng: c.lng,
      dist2: (c.lat - city.lat) ** 2 + (c.lng - city.lng) ** 2,
    }))
    .sort((a, b) => a.dist2 - b.dist2);

  const count = Math.min(5, sorted.length);
  const points: LatLng[] = [{ lat: city.lat, lng: city.lng }];

  for (let i = 0; i < count; i++) {
    points.push({ lat: sorted[i].lat, lng: sorted[i].lng });
  }

  return points;
}
