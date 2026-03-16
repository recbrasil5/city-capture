<script setup lang="ts">
import type { City, CompareResult } from "@/types";
import { useCompareInsights } from "@/composables/useCompareInsights";

// Flag helper
function flagEmoji(code: string): string {
  if (!code) return "";
  return code
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

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
  interestingFacts
} = useCompareInsights(props.cityA, props.cityB, props.allCities, props.result);
</script>

<template>
  <div class="panel">
    <button class="close-btn" @click="emit('close')">×</button>

    <div class="content">
      <h2>Compare Cities</h2>

      <!-- City A + B summary -->
      <section class="pair-summary">
        <div class="city-block">
          <h3>
            {{ flagEmoji(cityA.country) }} {{ cityA.name }}
            <span class="country">({{ cityA.country }})</span>
          </h3>
          <p>Population: {{ cityA.population.toLocaleString() }}</p>

          <div v-if="comparableA">
            <h4>Most comparable city</h4>
            <p>
              {{ flagEmoji(comparableA.country) }}
              {{ comparableA.name }} —
              {{ comparableA.population.toLocaleString() }}
            </p>
          </div>
        </div>

        <div class="city-block">
          <h3>
            {{ flagEmoji(cityB.country) }} {{ cityB.name }}
            <span class="country">({{ cityB.country }})</span>
          </h3>
          <p>Population: {{ cityB.population.toLocaleString() }}</p>

          <div v-if="comparableB">
            <h4>Most comparable city</h4>
            <p>
              {{ flagEmoji(comparableB.country) }}
              {{ comparableB.name }} —
              {{ comparableB.population.toLocaleString() }}
            </p>
          </div>
        </div>
      </section>

      <!-- Trip summary -->
      <section class="distance-summary">
        <h3>Trip Summary</h3>
        <p>{{ Math.round(result.distanceMiles) }} miles / {{ Math.round(result.distanceKm) }} km</p>
        <p>Flight time: {{ result.flightTime }}</p>
      </section>

      <!-- Interesting connections -->
      <section
        v-if="Array.isArray(interestingFacts) && interestingFacts.length"
        class="connections"
      >
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
  display: flex;
  align-items: center;
  gap: 6px;
}

.country {
  color: #777;
  font-weight: 400;
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

.connections ul {
  padding-left: 18px;
}

.connections li {
  margin: 4px 0;
  font-size: 14px;
}
</style>