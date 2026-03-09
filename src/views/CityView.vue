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

    <img
      v-if="details?.photoUrl"
      class="hero"
      :src="details.photoUrl"
    />

    <h1>{{ details?.name || city.name }}</h1>

    <p v-if="details?.shortDescription" class="tagline">
      {{ details.shortDescription }}
    </p>

    <img
      class="flag"
      :src="`https://flagsapi.com/${city.country}/flat/64.png`"
    />

    <p class="population">
      <strong>Population:</strong> {{ city.population.toLocaleString() }}
    </p>

    <p v-if="details?.rating" class="rating">
      ⭐ {{ details.rating }} ({{ details.ratingCount }} reviews)
    </p>

    <div v-if="loading" class="loading">Loading…</div>

    <p v-else-if="details?.summary" class="summary">
      {{ details.summary }}
    </p>

    <div class="coords" v-if="details?.coordinates">
      <strong>Coordinates:</strong>
      {{ details.coordinates.lat.toFixed(4) }},
      {{ details.coordinates.lng.toFixed(4) }}
    </div>

    <a
      v-if="details?.wikiUrl"
      class="wiki-link"
      :href="details.wikiUrl"
      target="_blank"
    >
      Read more on Wikipedia →
    </a>
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

.hero {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
}

.tagline {
  margin-top: -8px;
  margin-bottom: 12px;
  color: #666;
}

.rating {
  margin-bottom: 16px;
  color: #444;
}

.coords {
  margin-top: 16px;
  font-size: 14px;
  color: #555;
}

.wiki-link {
  display: inline-block;
  margin-top: 16px;
  color: #0066cc;
  text-decoration: none;
}

.wiki-link:hover {
  text-decoration: underline;
}
</style>