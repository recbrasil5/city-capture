export interface City {
  id: string
  name: string
  country: string
  state?: string
  lat: number
  lon: number
  timezone: string
  square_area: number   // km²
  airport: {
    code: string        // IATA
    name: string
    lat: number
    lon: number
  }
  photos: string[]
  notes?: string
  createdAt: number
}

export interface CityCaptureState {
  cities: City[]
  selectedA: City | null
  selectedB: City | null
}

export interface CompareResult {
  distanceKm: number
  distanceMiles: number
  greatCircleKm: number
  greatCircleMiles: number
  // airportA?: AirportInfo
  // airportB?: AirportInfo
  // weatherA?: WeatherInfo
  // weatherB?: WeatherInfo
}