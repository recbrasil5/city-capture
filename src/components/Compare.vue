<script setup lang="ts">
import type { City, CompareResult } from "@/types";
import { useCompareInsights } from "@/composables/useCompareInsights";
import { flagUrl } from "@/utils/flags";

const props = defineProps<{
  cityA: City;
  cityB: City;
  result: CompareResult;
  allCities: City[];
}>();

const emit = defineEmits<{ (e: "close"): void }>();

const {
  comparableA,
  comparableB,
  interestingFacts,
} = useCompareInsights(props.cityA, props.cityB, props.allCities, props.result);
</script>

<template>
  <div class="panel">
    <button class="close-btn" @click="emit('close')">×</button>

    <div class="content">
      <h2>Compare Cities</h2>

      <section class="pair-summary">
        <div class="city-block">
          <h3>
            <img :src="flagUrl(cityA.country)" class="country-flag" />
            {{ cityA.name }}
            <span class="country">({{ cityA.country }})</span>
          </h3>
          <p>Population: {{ cityA.population.toLocaleString() }}</p>

          <div v-if="comparableA">
            <h4>Most comparable city</h4>
            <p>
              <img :src="flagUrl(comparableA.country)" class="country-flag" />
              {{ comparableA.name }} —
              {{ comparableA.population.toLocaleString() }}
            </p>
          </div>
        </div>

        <div class="city-block">
          <h3>
            <img :src="flagUrl(cityB.country)" class="country-flag" />
            {{ cityB.name }}
            <span class="country">({{ cityB.country }})</span>
          </h3>
          <p>Population: {{ cityB.population.toLocaleString() }}</p>

          <div v-if="comparableB">
            <h4>Most comparable city</h4>
            <p>
              <img :src="flagUrl(comparableB.country)" class="country-flag" />
              {{ comparableB.name }} —
              {{ comparableB.population.toLocaleString() }}
            </p>
          </div>
        </div>
      </section>

      <section class="distance-summary">
        <h3>Trip Summary</h3>
        <p>{{ Math.round(result.distanceMiles) }} miles / {{ Math.round(result.distanceKm) }} km</p>
        <p>Flight time: {{ result.flightTime }}</p>
      </section>

      <section v-if="interestingFacts?.length" class="connections">
        <h3>Interesting Connections</h3>
        <ul>
          <li v-for="fact in interestingFacts" :key="fact">{{ fact }}</li>
        </ul>
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

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ddd;
  border: 1px solid #bbb;
  font-size: 22px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
}

.country-flag {
  height: 1em;
  border-radius: 2px;
}

.distance-summary {
  margin: 16px 0;
  padding: 12px;
  background: #f0f4ff;
  border-radius: 8px;
}
</style>