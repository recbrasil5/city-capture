import { defineStore } from 'pinia'

export interface Visit {
  id: string
  airportCode: string
  date: number
  notes?: string
}

export const useVisitStore = defineStore('visits', {
  state: () => ({
    visits: [] as Visit[],
  }),

  actions: {
    addVisit(airportCode: string, notes?: string) {
      this.visits.push({
        id: crypto.randomUUID(),
        airportCode,
        date: Date.now(),
        notes,
      })
    }
  }
})