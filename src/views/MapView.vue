<template>
  <div id="map"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import L from 'leaflet'

import { fetchCitiesFromGoogle } from '@/api/googleCities'
import { useSelectableCities } from '@/composables/useSelectableCities'

import {
  computeDistanceMiles,
  computeFlightHours,
  buildGreatCircleCoords,
} from '@/utils/geoUtils'

import {
  createRoutePolyline,
  highlightSelectedRoute,
} from '@/utils/mapUtils'

const pointerIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
})

onMounted(async () => {
  const map = L.map('map').setView([0, 0], 2)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map)

  const cities = await fetchCitiesFromGoogle('cities in brazil')

  console.log('cities from google:', cities)

  const { markers, loadCities, setRouteHandler } =
    useSelectableCities(map, pointerIcon, cities)

  const polylines: L.Polyline[] = []

  setRouteHandler((from, to) => {
    polylines.forEach(p => map.removeLayer(p))
    polylines.length = 0

    const coords = buildGreatCircleCoords(from, to)
    const polyline = createRoutePolyline(coords, 'red', map)
    polylines.push(polyline)

    const miles = computeDistanceMiles(from, to)
    const hours = computeFlightHours(miles)

    polyline.bindPopup(`
      <div class="route-popup">
        <strong>${Math.round(miles)} miles</strong><br>
        ${hours.toFixed(1)} hours (avg)
      </div>
    `)

    highlightSelectedRoute(polyline, polylines)

    markers[from.code]?.openPopup()
    markers[to.code]?.openPopup()

    setTimeout(() => polyline.openPopup(), 50)
  })

  await loadCities()
})
</script>

<style>
#map {
  height: 100vh;
  width: 100vw;
}
</style>