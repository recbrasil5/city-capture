<script setup lang="ts">
import { watch } from "vue";
import type { City } from "@/types";
import { useCityDetails } from "@/composables/useCityDetails";

const props = defineProps<{
  city: City;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { loading, details, load } = useCityDetails();

watch(
  () => props.city,
  (city) => {
    if (city) load(city);
  },
  { immediate: true }
);
</script>

<template>
  <aside class="city-panel">
    <button class="close-btn" @click="emit('close')">×</button>

    <h1>{{ details?.name || city.name }}</h1>

    <img
      class="flag"
      :src="`https://flagsapi.com/${city.country}/flat/64.png`"
    />

    <p class="population">
      <strong>Population:</strong> {{ city.population.toLocaleString() }}
    </p>

    <div v-if="loading" class="loading">Loading…</div>

    <p v-else-if="details?.summary" class="summary">
      {{ details.summary }}
    </p>

    <p v-else>No description available.</p>
  </aside>
</template>

<style scoped>
.city-panel {
  flex: 0 0 380px;
  max-width: 380px;
  height: 100vh;
  overflow-y: auto;
  padding: 24px;
  background: #ffffff;
  border-left: 1px solid #e5e5e5;
  box-shadow: -2px 0 6px rgba(0, 0, 0, 0.05);
  position: relative;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  font-size: 28px;
  background: none;
  border: none;
  cursor: pointer;
  opacity: 0.6;
}

.close-btn:hover {
  opacity: 1;
}

.flag {
  width: 48px;
  margin: 12px 0;
}

.population {
  margin-bottom: 16px;
}

.summary {
  line-height: 1.5;
  margin-top: 12px;
}

.loading {
  opacity: 0.7;
}
</style>