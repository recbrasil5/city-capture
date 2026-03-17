<!-- src/components/City.vue -->
<script setup lang="ts">
import type { City } from "@/types";
import { onMounted, watch } from "vue";
import { useCityDetails } from "@/composables/useCityDetails";
import { useCityPlaces } from "@/composables/useCityPlaces";

const props = defineProps<{
  city: City;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { loading, error, details, load } = useCityDetails();
const { places, placesLoading, loadPlaces } = useCityPlaces();

function countryToFlag(code: string): string {
  return String.fromCodePoint(
    ...Array.from(code.toUpperCase()).map((c) => 0x1f1e6 + c.charCodeAt(0) - 65)
  );
}

onMounted(() => {
  load(props.city);
});

watch(
  () => props.city,
  (newCity) => {
    if (newCity) load(newCity);
  }
);

watch(
  () => details.value,
  (d) => {
    if (d) {
      loadPlaces(props.city);
    }
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
            <strong>Population:</strong> {{ details.population.toLocaleString() }}
          </p>

          <p v-if="details.rating">
            <strong>Rating:</strong> {{ details.rating }} ({{ details.ratingCount }} reviews)
          </p>

          <p v-if="details.wikiUrl">
            <a :href="details.wikiUrl" target="_blank">Wikipedia</a>
          </p>
        </div>

        <div class="places-section" v-if="places && places.length">
          <h3>Places of Interest</h3>

          <div class="places-list">
            <div
              v-for="p in places"
              :key="p.id"
              class="place-card"
            >
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
.panel {
  position: relative;
  width: 100%;
  height: 100%;
  background: #fafafa;
  border-left: 1px solid #ddd;
  overflow-y: auto;
  padding: 20px;
}

/* Mobile: full-screen overlay */
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

.hero {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
}

.flag-hero {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 140px;
  background: linear-gradient(135deg, #e8ecf1, #d4dbe5);
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 64px;
}

.summary {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.meta p {
  margin: 6px 0;
}

.country-flag {
  font-size: 0.75em;
  vertical-align: middle;
}

.loading {
  margin-top: 20px;
  color: #666;
}

.error {
  margin-top: 20px;
  color: #b00;
}

/* Places of Interest */

.places-section {
  margin-top: 28px;
}

.places-section h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #333;
}

.places-list {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.place-card {
  min-width: 180px;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 10px;
  padding: 10px;
  backdrop-filter: blur(6px);
  border: 1px solid #e5e5e5;
}

.place-photo {
  width: 100%;
  height: 110px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 8px;
}

.place-info h4 {
  font-size: 15px;
  margin: 0 0 4px;
}

.category {
  font-size: 13px;
  color: #666;
}

.distance {
  font-size: 12px;
  color: #777;
}

.places-loading {
  margin-top: 8px;
  font-size: 12px;
  color: #777;
}
</style>