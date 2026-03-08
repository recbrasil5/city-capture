// FILE: src/types.ts

export interface Airport {
  code: string
  name: string
  lat: number
  lon: number
  cityId?: string
}

export interface City {
  id: string
  name: string
  country: string
  state?: string
  lat: number
  lon: number
  timezone: string
  square_area: number
  airport?: Airport
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
}