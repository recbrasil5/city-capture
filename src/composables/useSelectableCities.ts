import L from 'leaflet'
import { useCityStore } from '@/stores/cityStore'
import { createMarker } from '@/utils/mapUtils'
import { ref } from 'vue'

export function useSelectableCities(map: L.Map, icon: L.Icon) {
  const store = useCityStore()
  const selectedCity = ref(null)
  const markers: Record<string, L.Marker> = {}

  function loadCitiesWithAirports() {
    store.cities.forEach(city => {
      if (!city.airport) return

      const marker = createMarker(city.airport, icon, map)
      markers[city.code] = marker

      marker.on('click', () => {
        selectedCity.value = city
      })
    })
  }

  return {
    markers,
    selectedCity,
    loadCitiesWithAirports
  }
}