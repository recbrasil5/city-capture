<script setup lang="ts">
import type { City, CompareResult } from "@/types";
import { useCompareInsights } from "@/composables/useCompareInsights";

const props = defineProps<{
  cityA: City;
  cityB: City;
  result: CompareResult;
  allCities: City[];
}>();

const emit = defineEmits<{ (e: "close"): void }>();

const {
  peersA,
  peersB,
  comparableTripsFromA,
  comparableTripsFromB,
  flightTimeHours
} = useCompareInsights(props.cityA, props.cityB, props.allCities, props.result);
</script>

<template>
  <div class="panel">
    <button class="close-btn" @click="emit('close')">×</button>

    <div class="content">
      <h2>Compare Cities</h2>

      <section class="pair-summary">
        <div class="city-block">
          <h3>{{ cityA.name }} ({{ cityA.country }})</h3>
          <p>Population: {{ cityA.population.toLocaleString() }}</p>

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
          <h3>{{ cityB.name }} ({{ cityB.country }})</h3>
          <p>Population: {{ cityB.population.toLocaleString() }}</p>

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

      <section class="distance-summary">
        <h3>Trip Summary</h3>
        <p>{{ Math.round(result.distanceMiles) }} miles / {{ Math.round(result.distanceKm) }} km</p>
        <p>Flight time: {{ result.flightTime }}</p>
      </section>

      <section class="comparable-trips">
        <div v-if="comparableTripsFromA.length">
          <h4>Similar trips from {{ cityA.name }}</h4>
          <ul>
            <li v-for="t in comparableTripsFromA" :key="t.city.name">
              {{ cityA.name }} → {{ t.city.name }} ({{ t.time.toFixed(1) }}h)
            </li>
          </ul>
        </div>

        <div v-if="comparableTripsFromB.length">
          <h4>Similar trips from {{ cityB.name }}</h4>
          <ul>
            <li v-for="t in comparableTripsFromB" :key="t.city.name">
              {{ cityB.name }} → {{ t.city.name }} ({{ t.time.toFixed(1) }}h)
            </li>
          </ul>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.panel {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fafafa;
  border-left: 1px solid #ddd;
  overflow-y: auto;
  padding: 20px;
}

@media (max-width: 768px) {
  .panel {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-left: none;
    z-index: 20;
  }
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
  background: #ddd;
  border: 1px solid #bbb;
  font-size: 22px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  line-height: 30px;
  text-align: center;
}
.close-btn:hover {
  background: #ccc;
}

.content {
  margin-top: 40px;
}

h2 {
  margin-bottom: 16px;
}

h3 {
  margin: 16px 0 8px;
}

h4 {
  margin: 10px 0 4px;
  font-size: 13px;
  color: #555;
}

.city-block {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #eee;
}

.distance-summary {
  margin: 16px 0;
  padding: 12px;
  background: #f0f4ff;
  border-radius: 8px;
}

.comparable-trips ul {
  padding-left: 18px;
}

.comparable-trips li {
  margin: 4px 0;
  font-size: 14px;
}
</style>