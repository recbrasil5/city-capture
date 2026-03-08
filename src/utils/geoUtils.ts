import * as turf from '@turf/turf'

export function computeDistanceMiles(
  a: { lat: number; lon: number },
  b: { lat: number; lon: number }
): number {
  const from = turf.point([a.lon, a.lat])
  const to = turf.point([b.lon, b.lat])
  return turf.distance(from, to, { units: 'miles' })
}

export function computeFlightHours(miles: number, speedMph = 520): number {
  return miles / speedMph
}

export function buildGreatCircleCoords(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
  npoints = 256
): [number, number][] {
  const gc = turf.greatCircle(
    turf.point([from.lon, from.lat]),
    turf.point([to.lon, to.lat]),
    { npoints }
  )

  return gc.geometry.coordinates.map(([lng, lat]) => [lat, lng])
}