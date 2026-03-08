import { useCityStore } from '@/stores/cityStore'

export function getAirport(code: string) {
  const store = useCityStore()
  const city = store.cities.find(c => c.airport.code === code)
  return city?.airport
}