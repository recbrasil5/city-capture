import type { City, CompareResult } from "@/types";

export function useGreatCircle() {
  const R_KM = 6371;

  function toRad(deg: number) {
    return (deg * Math.PI) / 180;
  }

  function haversine(a: City, b: City) {
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);

    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const h =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

    return 2 * R_KM * Math.asin(Math.sqrt(h));
  }

  function generateArcPoints(a: City, b: City, steps = 64): [number, number][] {
    const lat1 = toRad(a.lat);
    const lng1 = toRad(a.lng);
    const lat2 = toRad(b.lat);
    const lng2 = toRad(b.lng);

    const d = 2 * Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) * Math.sin((lng2 - lng1) / 2) ** 2
      )
    );

    const points: [number, number][] = [];

    for (let i = 0; i <= steps; i++) {
      const f = i / steps;

      const A = Math.sin((1 - f) * d) / Math.sin(d);
      const B = Math.sin(f * d) / Math.sin(d);

      const x =
        A * Math.cos(lat1) * Math.cos(lng1) +
        B * Math.cos(lat2) * Math.cos(lng2);
      const y =
        A * Math.cos(lat1) * Math.sin(lng1) +
        B * Math.cos(lat2) * Math.sin(lng2);
      const z = A * Math.sin(lat1) + B * Math.sin(lat2);

      const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
      const lng = Math.atan2(y, x);

      points.push([lat * (180 / Math.PI), lng * (180 / Math.PI)]);
    }

    return points;
  }

  function computeCompareResult(a: City, b: City): CompareResult {
    const greatCircleKm = haversine(a, b);
    const greatCircleMiles = greatCircleKm * 0.621371;

    return {
      distanceKm: greatCircleKm,
      distanceMiles: greatCircleMiles,
      greatCircleKm,
      greatCircleMiles,
      arcPoints: generateArcPoints(a, b),
    };
  }

  return { computeCompareResult };
}