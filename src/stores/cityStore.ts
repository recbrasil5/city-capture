import { defineStore } from 'pinia'
import type { City } from '../world/types'

export const useCityStore = defineStore('city', {
  state: () => ({
    cities: <City[]>[
      {
        id: 'austin',
        name: 'Austin',
        country: 'United States',
        state: 'Texas',
        lat: 30.2672,
        lon: -97.7431,
        timezone: 'America/Chicago',
        square_area: 771.56,
        airport: {
          code: 'AUS',
          name: 'Austin-Bergstrom International Airport',
          lat: 30.1975,
          lon: -97.6664
        },
        photos: [],
        createdAt: Date.now()
      },

      {
        id: 'recife',
        name: 'Recife',
        country: 'Brazil',
        state: 'Pernambuco',
        lat: -8.0476,
        lon: -34.8770,
        timezone: 'America/Recife',
        square_area: 218.84,
        airport: {
          code: 'REC',
          name: 'Recife/Guararapes-Gilberto Freyre International Airport',
          lat: -8.1265,
          lon: -34.9230
        },
        photos: [],
        createdAt: Date.now()
      },

      // New York City (JFK)
      {
        id: 'new_york',
        name: 'New York City',
        country: 'United States',
        state: 'New York',
        lat: 40.7128,
        lon: -74.0060,
        timezone: 'America/New_York',
        square_area: 783.8,
        airport: {
          code: 'JFK',
          name: 'John F. Kennedy International Airport',
          lat: 40.6413,
          lon: -73.7781
        },
        photos: [],
        createdAt: Date.now()
      },

      // Chicago (ORD)
      {
        id: 'chicago',
        name: 'Chicago',
        country: 'United States',
        state: 'Illinois',
        lat: 41.8781,
        lon: -87.6298,
        timezone: 'America/Chicago',
        square_area: 606.1,
        airport: {
          code: 'ORD',
          name: "O'Hare International Airport",
          lat: 41.9742,
          lon: -87.9073
        },
        photos: [],
        createdAt: Date.now()
      },

      // La Crosse (LSE)
      {
        id: 'la_crosse',
        name: 'La Crosse',
        country: 'United States',
        state: 'Wisconsin',
        lat: 43.8014,
        lon: -91.2396,
        timezone: 'America/Chicago',
        square_area: 23.79,
        airport: {
          code: 'LSE',
          name: 'La Crosse Regional Airport',
          lat: 43.8790,
          lon: -91.2567
        },
        photos: [],
        createdAt: Date.now()
      },

      // Paris (CDG)
      {
        id: 'paris',
        name: 'Paris',
        country: 'France',
        state: null,
        lat: 48.8566,
        lon: 2.3522,
        timezone: 'Europe/Paris',
        square_area: 40.7,
        airport: {
          code: 'CDG',
          name: 'Charles de Gaulle Airport',
          lat: 49.0097,
          lon: 2.5479
        },
        photos: [],
        createdAt: Date.now()
      }
    ]
  }),

  actions: {
    addCity(city: City) {
      this.cities.push(city)
    }
  }
})