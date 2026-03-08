import { defineStore } from 'pinia'

export const useProfileStore = defineStore('profile', {
  state: () => ({
    id: 'local-user',
    name: 'Traveler',
    homeAirport: null as string | null,
    visitedAirports: [] as string[],
    visitedCities: [] as string[],
    preferences: {
      units: 'imperial',
      mapStyle: 'default',
    },
    createdAt: Date.now(),
  }),

  actions: {
    setHomeAirport(code: string) {
      this.homeAirport = code
    },

    addVisitedAirport(code: string) {
      if (!this.visitedAirports.includes(code)) {
        this.visitedAirports.push(code)
      }
    },

    addVisitedCity(id: string) {
      if (!this.visitedCities.includes(id)) {
        this.visitedCities.push(id)
      }
    }
  }
})