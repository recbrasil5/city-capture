<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import L from 'leaflet'

import { getAirport } from '@/utils/cityUtils'
import { computeDistanceMiles, computeFlightHours, buildGreatCircleCoords } from '@/utils/geoUtils'
import { createRoutePolyline, highlightSelectedRoute } from '@/utils/mapUtils'
import { useSelectableCities } from '@/composables/useSelectableCities'

const pointerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

onMounted(() => {
  const REC = getAirport('REC')
  const LSE = getAirport('LSE')
  const CDG = getAirport('CDG')

  if (!REC || !LSE || !CDG) {
    console.error('Missing airport(s):', { REC, LSE, CDG })
    return
  }

  const map = L.map('map').setView([10, -20], 3)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map)

  // Load all selectable cities (any city with an airport)
  const { markers, selectedCity, loadCitiesWithAirports } =
    useSelectableCities(map, pointerIcon)

  loadCitiesWithAirports()

  // Hard-coded demo routes for now
  const routes = [
    { from: REC, to: LSE, color: 'red' },
    { from: REC, to: CDG, color: 'blue' }
  ]

  const polylines: L.Polyline[] = []

  routes.forEach(route => {
    const { from, to, color } = route

    const coords = buildGreatCircleCoords(from, to)
    const polyline = createRoutePolyline(coords, color, map)
    polylines.push(polyline)

    const miles = computeDistanceMiles(from, to)
    const hours = computeFlightHours(miles)

    polyline.bindPopup(`
      <div class="route-popup">
        <strong>${Math.round(miles)} miles</strong><br>
        ${hours.toFixed(1)} hours (avg)
      </div>
    `)

    polyline.on('click', () => {
      highlightSelectedRoute(polyline, polylines)

      // Open both endpoint popups
      markers[from.code]?.openPopup()
      markers[to.code]?.openPopup()

      // Open route popup last so it wins focus
      setTimeout(() => polyline.openPopup(), 50)
    })
  })
})
</script>

<style>
#map {
  height: 100vh;
  width: 100vw;
}

.route-popup {
  font-size: 14px;
  padding: 4px 2px;
}
</style>