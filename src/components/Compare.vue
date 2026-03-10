<script setup lang="ts">
import { computed } from "vue";
import type { City } from "@/types";

const props = defineProps<{
  allCities: City[];
  selectedA: City | null;
  selectedB: City | null;
  distanceKm: number | null;
  distanceMiles: number | null;
  flightTimeHours: number | null;
}>();

function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function estimateFlightTimeHours(distanceKm: number): number {
  return distanceKm / 800 + 0.8;
}

function getPeerCities(city: City, all: City[]) {
  const min = city.population * 0.8;
  const max = city.population * 1.2;

  return all
    .filter(
      (c) =>
        c.country === city.country &&
        c.name !== city.name &&
        c.population >= min &&
        c.population <= max
    )
    .sort(
      (a, b) =>
        Math.abs(a.population - city.population) -
        Math.abs(b.population - city.population)
    )
    .slice(0, 3);
}

function getComparableTrips(origin: City, all: City[], target: number) {
  return all
    .filter((c) => c.name !== origin.name)
    .map((c) => {
      const d = haversine(origin.lat, origin.lng, c.lat, c.lng);
      const t = estimateFlightTimeHours(d);
      return { city: c, time: t };
    })
    .filter((x) => Math.abs(x.time - target) < 0.5)
    .sort(
      (a, b) =>
        Math.abs(a.time - target) - Math.abs(b.time - target)
    )
    .slice(0, 3);
}

const peersA = computed(() =>
  props.selectedA ? getPeerCities(props.selectedA, props.allCities) : []
);

const peersB = computed(() =>
  props.selectedB ? getPeerCities(props.selectedB, props.allCities) : []
);

const comparableTripsFromA = computed(() => {
  if (!props.selectedA || props.flightTimeHours == null) return [];
  return getComparableTrips(props.selectedA, props.allCities, props.flightTimeHours);
});

const comparableTripsFromB = computed(() => {
  if (!props.selectedB || props.flightTimeHours == null) return [];
  return getComparableTrips(props.selectedB, props.allCities, props.flightTimeHours);
});
</script>

<template>
  <div v-if="selectedA && selectedB" class="compare-panel">
    <h2>Compare Cities</h2>

    <section class="pair-summary">
      <div class="city-block">
        <h3>{{ selectedA.name }} ({{ selectedA.country }})</h3>
        <p>Population: {{ selectedA.population.toLocaleString() }}</p>

        <div v-if="peersA.length">
          <h4>Similar-sized cities</h4>
          <ul>
            <li v-for="p in peersA" :key="p.name">
              {{ p.name }} — {{ p.population.toLocaleString() }}
            </li>
          </ul>
        </div>
      </div>

      <div class="city-block">
        <h3>{{ selectedB.name }} ({{ selectedB.country }})</h3>
        <p>Population: {{ selectedB.population.toLocaleString() }}</p>

        <div v-if="peersB.length">
          <h4>Similar-sized cities</h4>
          <ul>
            <li v-for="p in peersB" :key="p.name">
              {{ p.name }} — {{ p.population.toLocaleString() }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <section v-if="distanceKm != null" class="distance-summary">
      <h3>Trip Summary</h3>
      <p>{{ Math.round(distanceMiles) }} miles / {{ Math.round(distanceKm) }} km</p>
      <p>Flight time: {{ flightTimeHours.toFixed(1) }} hours</p>
    </section>

    <section class="comparable-trips">
      <div v-if="comparableTripsFromA.length">
        <h4>Trips similar to {{ selectedA.name }} → {{ selectedB.name }}</h4>
        <ul>
          <li v-for="t in comparableTripsFromA" :key="t.city.name">
            {{ selectedA.name }} → {{ t.city.name }} ({{ t.time.toFixed(1) }}h)
          </li>
        </ul>
      </div>

      <div v-if="comparableTripsFromB.length">
        <h4>Trips similar to {{ selectedA.name }} → {{ selectedB.name }} (from {{ selectedB.name }})</h4>
        <ul>
          <li v-for="t in comparableTripsFromB" :key="t.city.name">
            {{ selectedB.name }} → {{ t.city.name }} ({{ t.time.toFixed(1) }}h)
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>