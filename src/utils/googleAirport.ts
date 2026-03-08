import type { Airport, City } from '@/types'

export async function fetchAirportForCity(city: City): Promise<Airport> {
  return {
    code: city.name.slice(0, 3).toUpperCase(),
    name: `${city.name} Airport`,
    lat: city.lat,
    lon: city.lon,
    cityId: city.id,
  }
}