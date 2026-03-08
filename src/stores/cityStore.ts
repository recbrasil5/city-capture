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

      // Sydney (SYD)
      {
        id: 'sydney',
        name: 'Sydney',
        country: 'Australia',
        state: 'New South Wales',
        lat: -33.8688,
        lon: 151.2093,
        timezone: 'Australia/Sydney',
        square_area: 1687.0,
        airport: {
          code: 'SYD',
          name: 'Sydney Kingsford Smith Airport',
          lat: -33.9399,
          lon: 151.1753
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