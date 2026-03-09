<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet'
import type { City } from '@/types'

// ---------------------------------------------
// Dynamic loader for country-based city files
// ---------------------------------------------
const modules = import.meta.glob('@/data/cities-by-country/*.json')

// ---------------------------------------------
// Map + marker state
// ---------------------------------------------
const map = ref<LeafletMap | null>(null)
const markers = ref<Record<string, LeafletMarker>>({})

// ---------------------------------------------
// Load a single country's city file
// ---------------------------------------------
async function loadCountry(code: string): Promise<City[]> {
  const path = `/src/data/cities-by-country/${code}.json`
  const loader = modules[path]
  if (!loader) return []
  const mod = await loader()
  return mod.default as City[]
}

// ---------------------------------------------
// Determine which country codes are visible
// ---------------------------------------------
function getVisibleCountryCodes(): string[] {
  if (!map.value) return []

  const codes = new Set<string>()

  // For now, load ALL countries (refine later)
  Object.keys(modules).forEach(path => {
    const code = path.split('/').pop()!.replace('.json', '')
    codes.add(code)
  })

  return Array.from(codes)
}

// ---------------------------------------------
// Marker selection
// ---------------------------------------------
function selectCity(city: City) {
  console.log('Selected city:', city.name, city.country)
}

// ---------------------------------------------
// Clear all markers
// ---------------------------------------------
function clearMarkers() {
  if (!map.value) return

  Object.values(markers.value).forEach(marker => {
    map.value!.removeLayer(marker)
  })
  markers.value = {}
}

// ---------------------------------------------
// Render markers for visible cities
// ---------------------------------------------
function renderMarkers(visibleCities: City[]) {
  if (!map.value) return

  clearMarkers()

  visibleCities.forEach(city => {
    const marker = L.marker([city.lat, city.lng])
      .bindPopup(`<b>${city.name}</b> — ${city.country}`)
      .addTo(map.value!)

    marker.on('click', () => {
      marker.openPopup()
      selectCity(city)
    })

    markers.value[`${city.name}-${city.country}`] = marker
  })
}

// ---------------------------------------------
// Main update: load cities + filter by viewport
// ---------------------------------------------
async function updateVisibleCities() {
  if (!map.value) return

  const bounds = map.value.getBounds()
  const countryCodes = getVisibleCountryCodes()

  let allCities: City[] = []

  for (const code of countryCodes) {
    const cities = await loadCountry(code)
    allCities.push(...cities)
  }

  const visible = allCities
    .filter(c => c.population >= 50000)
    .filter(c => bounds.contains([c.lat, c.lng]))

  renderMarkers(visible)
}

// ---------------------------------------------
// Map initialization
// ---------------------------------------------
onMounted(() => {
  const m = L.map('map', {
    center: [20, 0],
    zoom: 3,
  })

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(m)

  map.value = m

  updateVisibleCities()

  m.on('moveend', updateVisibleCities)
})

// ---------------------------------------------
// Cleanup
// ---------------------------------------------
onBeforeUnmount(() => {
  if (map.value) {
    map.value.off('moveend', updateVisibleCities)
    map.value.remove()
  }
})
</script>

<template>
  <div id="map" style="width: 100%; height: 100%;"></div>
</template>

<style scoped>
#map {
  width: 100%;
  height: 100%;
}
</style>