// src/composables/useGreatCircle.ts

export function useGreatCircle() {
  type LatLon = [number, number]

  const toRad = (deg: number): number => (deg * Math.PI) / 180
  const toDeg = (rad: number): number => (rad * 180) / Math.PI

  function unwrapLongitudes(lon1: number, lon2: number): [number, number] {
    // If the difference is > 180°, shift one longitude by 360°
    if (Math.abs(lon2 - lon1) > Math.PI) {
      if (lon1 > lon2) {
        lon2 += 2 * Math.PI
      } else {
        lon1 += 2 * Math.PI
      }
    }
    return [lon1, lon2]
  }

  function greatCirclePoints(start: LatLon, end: LatLon, numPoints = 128): LatLon[] {
    let lat1 = toRad(start[0])
    let lon1 = toRad(start[1])
    let lat2 = toRad(end[0])
    let lon2 = toRad(end[1])

    // Unwrap BEFORE interpolation
    ;[lon1, lon2] = unwrapLongitudes(lon1, lon2)

    const d = 2 * Math.asin(
      Math.sqrt(
        Math.sin((lat2 - lat1) / 2) ** 2 +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin((lon2 - lon1) / 2) ** 2
      )
    )

    const denom = Math.sin(d) === 0 ? 1e-9 : Math.sin(d)
    const points: LatLon[] = []

    for (let i = 0; i <= numPoints; i++) {
      const f = i / numPoints
      const A = Math.sin((1 - f) * d) / denom
      const B = Math.sin(f * d) / denom

      const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2)
      const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2)
      const z = A * Math.sin(lat1) + B * Math.sin(lat2)

      const lat = Math.atan2(z, Math.sqrt(x * x + y * y))
      let lon = Math.atan2(y, x)

      // Normalize AFTER interpolation
      let lonDeg = toDeg(lon)
      if (lonDeg > 180) lonDeg -= 360
      if (lonDeg < -180) lonDeg += 360

      points.push([toDeg(lat), lonDeg])
    }

    return points
  }

  function greatCircleDistanceMiles(start: LatLon, end: LatLon): number {
    const R = 3958.8
    const lat1 = toRad(start[0])
    const lon1 = toRad(start[1])
    const lat2 = toRad(end[0])
    const lon2 = toRad(end[1])

    const dLat = lat2 - lat1
    const dLon = lon2 - lon1

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1) * Math.cos(lat2) *
      Math.sin(dLon / 2) ** 2

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c
  }

  return {
    greatCirclePoints,
    greatCircleDistanceMiles
  }
}