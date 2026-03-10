export interface City {
  name: string;
  country: string;
  lat: number;
  lng: number;
  population: number;
}

export interface CompareResult {
  distanceKm: number;
  distanceMiles: number;

  greatCircleKm: number;
  greatCircleMiles: number;

  arcPoints: [number, number][];

  flightTime: string; // "2h 13m"
}