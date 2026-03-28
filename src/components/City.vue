<!-- src/components/City.vue -->
<script setup lang="ts">
import type { City } from "@/types";
import { onMounted, watch } from "vue";
import { useCityDetails } from "@/composables/useCityDetails";
import { useCityPlaces } from "@/composables/useCityPlaces";

const props = defineProps<{ city: City }>();

const emit = defineEmits<{ (e: "close"): void }>();

const { loading, error, details, load } = useCityDetails();
const { places, placesLoading, loadPlaces } = useCityPlaces();

function countryToFlag(code: string): string {
  return String.fromCodePoint(
    ...Array.from(code.toUpperCase()).map(
      (c) => 0x1f1e6 + c.charCodeAt(0) - 65
    )
  );
}

// Load details on mount
onMounted(() => {
  load(props.city);
});

// Reload details when city changes
watch(
  () => props.city,
  (newCity) => {
    if (newCity) load(newCity);
  }
);

// When details load, fetch places
watch(
  () => details.value,
  (d) => {
    if (d) loadPlaces(props.city);
  }
);
</script>

<template>
  <div class="panel">
    <button class="close-btn" @click="emit('close')">×</button>

    <div class="content">
      <h2>
        {{ props.city.name }}
        <span class="country-flag">{{ countryToFlag(props.city.country) }}</span>
      </h2>

      <div v-if="loading" class="loading">Loading details…</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="details">
        <img
          v-if="details.photoUrl"
          :src="details.photoUrl"
          alt="City photo"
          class="hero"
        />
        <div v-else class="flag-hero">
          {{ countryToFlag(props.city.country) }}
        </div>

        <p class="summary">{{ details.summary }}</p>

        <div class="meta">
          <p v-if="details.population">
            <strong>Population:</strong>
            {{ details.population.toLocaleString() }}
          </p>

          <p v-if="details.rating">
            <strong>Rating:</strong>
            {{ details.rating }} ({{ details.ratingCount }} reviews)
          </p>

          <p v-if="details.wikiUrl">
            <a :href="details.wikiUrl" target="_blank">Wikipedia</a>
          </p>
        </div>

        <div class="places-section" v-if="places.length">
          <h3>Places of Interest</h3>

          <div class="places-list">
            <div v-for="p in places" :key="p.id" class="place-card">
              <img
                v-if="p.photoUrl"
                :src="p.photoUrl"
                :alt="p.name"
                class="place-photo"
              />

              <div class="place-info">
                <h4>{{ p.name }}</h4>
                <p class="category">{{ p.category }}</p>
                <p class="distance">{{ p.distance }} • {{ p.bearing }}</p>
              </div>
            </div>
          </div>

          <div v-if="placesLoading" class="places-loading">
            Updating nearby places…
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* (unchanged styles) */
</style>