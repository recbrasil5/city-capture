<!-- src/components/Compare.vue -->
<script setup lang="ts">
import type { City, CompareResult } from "@/types";

const props = defineProps<{
  cityA: City;
  cityB: City;
  result: CompareResult | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<template>
  <div class="compare-view">
    <header class="header">
      <h1>Compare Cities</h1>
      <button class="close" @click="emit('close')">✕</button>
    </header>

    <section class="cities">
      <div class="city-block">
        <h2>{{ cityA.name }}</h2>
        <p>{{ cityA.country }}</p>
        <p>Pop: {{ cityA.population.toLocaleString() }}</p>
      </div>

      <div class="city-block">
        <h2>{{ cityB.name }}</h2>
        <p>{{ cityB.country }}</p>
        <p>Pop: {{ cityB.population.toLocaleString() }}</p>
      </div>
    </section>

    <section class="stats">
      <div v-if="result">
        <h3>Distance</h3>
        <p>{{ result.distanceMiles.toFixed(0) }} miles</p>
        <p>{{ result.distanceKm.toFixed(0) }} km</p>
      </div>

      <div v-else>
        <p>Calculating…</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.compare-view {
  padding: 16px;
  overflow-y: auto;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}
.cities {
  display: flex;
  justify-content: space-between;
  margin-top: 16px;
}
.city-block {
  width: 48%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
}
.stats {
  margin-top: 20px;
}
</style>