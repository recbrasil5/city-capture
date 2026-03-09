// -----------------------------
// Airport
// -----------------------------
export interface Airport {
  code: string;
  name: string;
  lat: number;
  lon: number;
  cityId?: string;
}

// -----------------------------
// City (50K dataset version)
// -----------------------------
export interface City {
  name: string;
  lat: number;
  lng: number;
  country: string;
  population: number;
}

// -----------------------------
// CityCaptureState
// -----------------------------
export interface CityCaptureState {
  cities: City[];
  selectedA: City | null;
  selectedB: City | null;
}

// -----------------------------
// CompareResult
// -----------------------------
export interface CompareResult {
  distanceKm: number;
  distanceMiles: number;
  greatCircleKm: number;
  greatCircleMiles: number;
}