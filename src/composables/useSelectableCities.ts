import L from 'leaflet'
import { ref } from 'vue'

export function useSelectableCities(
  map: L.Map,
  icon: L.Icon,
  cities: Array<{ id: string; name: string; lat: number; lng: number }>
) {
  const selectedCity = ref<any>(null)
  const markers: Record<string, L.Marker> = {}

  function loadCities() {
    cities.forEach(city => {
      if (!city.lat || !city.lng) return

      const marker = L.marker([city.lat, city.lng], { icon })
        .addTo(map)
        .on('click', () => {
          selectedCity.value = city
          if (routeHandler.value) {
            routeHandler.value(selectedCity.value, city)
          }
        })

      markers[city.id] = marker
    })
  }

  const routeHandler = ref<null | ((from: any, to: any) => void)>(null)

  function setRouteHandler(fn: (from: any, to: any) => void) {
    routeHandler.value = fn
  }

  return {
    markers,
    selectedCity,
    loadCities,
    setRouteHandler,
  }
}