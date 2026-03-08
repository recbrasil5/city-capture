import { defineStore } from 'pinia'

export interface Airport {
  code: string
  name: string
  lat: number
  lon: number
  cityId?: string
}

export const useAirportStore = defineStore('airports', {
  state: () => ({
    airports: [] as Airport[],
  }),

  getters: {
    byCode: (state) => (code: string) =>
      state.airports.find(a => a.code === code),
  },

  actions: {
    loadInitial() {
      this.airports = [
        { code: 'AUS', name: 'Austin-Bergstrom', lat: 30.1975, lon: -97.6664, cityId: 'austin' },
        { code: 'REC', name: 'Recife Guararapes', lat: -8.1265, lon: -34.9230, cityId: 'recife' },
        { code: 'JFK', name: 'John F. Kennedy', lat: 40.6413, lon: -73.7781, cityId: 'new_york' },
        { code: 'SYD', name: 'Sydney Kingsford Smith', lat: -33.9399, lon: 151.1753, cityId: 'sydney' },
      ]
    }
  }
})