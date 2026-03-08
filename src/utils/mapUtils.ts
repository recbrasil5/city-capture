import L from 'leaflet'

export function createMarker(
  airport: { lat: number; lon: number; code: string; name: string },
  icon: L.Icon,
  map: L.Map
): L.Marker {
  return L.marker([airport.lat, airport.lon], { icon })
    .addTo(map)
    .bindPopup(`${airport.code} — ${airport.name}`)
}

export function createRoutePolyline(
  coords: [number, number][],
  color: string,
  map: L.Map
): L.Polyline {
  return L.polyline(coords, {
    color,
    weight: 3,
    opacity: 0.8,
  }).addTo(map)
}

export function highlightSelectedRoute(
  selected: L.Polyline,
  all: L.Polyline[]
) {
  all.forEach(pl => {
    if (pl === selected) {
      pl.setStyle({ weight: 6, opacity: 1 })
    } else {
      pl.setStyle({ weight: 2, opacity: 0.3 })
    }
  })
}