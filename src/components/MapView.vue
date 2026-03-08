<template>
  <div id="map"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import L from 'leaflet'
import * as turf from '@turf/turf'

// Simple airport dataset (restore your real one later)
const airports = [
  { code: 'JFK', name: 'New York JFK', lat: 40.6413, lng: -73.7781 },
  { code: 'LAX', name: 'Los Angeles', lat: 33.9416, lng: -118.4085 },
  { code: 'SYD', name: 'Sydney', lat: -33.8688, lng: 151.2093 },
]

// Pointer icon (same as before)
const pointerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

onMounted(() => {
  console.log('MapView mounted')

  const map = L.map('map').setView([20, 0], 2)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map)

  // --- 1. Add airport markers back ---
  airports.forEach(a => {
    L.marker([a.lat, a.lng], { icon: pointerIcon })
      .addTo(map)
      .bindPopup(`${a.code} — ${a.name}`)
  })

  // --- 2. Draw straight lines between airports (restore old behavior) ---
  for (let i = 0; i < airports.length; i++) {
    for (let j = i + 1; j < airports.length; j++) {
      const a = airports[i]
      const b = airports[j]

      L.polyline(
        [
          [a.lat, a.lng],
          [b.lat, b.lng],
        ],
        { color: '#555', weight: 1, opacity: 0.6 }
      ).addTo(map)
    }
  }

  // --- 3. Keep your JFK → SYD great‑circle arc ---
  const jfk = turf.point([-73.7781, 40.6413])
  const syd = turf.point([151.2093, -33.8688])

  const gc = turf.greatCircle(jfk, syd, { npoints: 256 })
  const coords = gc.geometry.coordinates.map(([lng, lat]) => [lat, lng])

  L.polyline(coords, {
    color: 'red',
    weight: 3,
  }).addTo(map)
})
</script>

<style>
#map {
  height: 100vh;
  width: 100vw;
}
</style>