<!-- src/components/City.vue -->
<script setup lang="ts">
import type { City } from "@/types";
import { useCityDetails } from "@/composables/useCityDetails";
import { onMounted, watch } from "vue";

const props = defineProps<{
  city: City;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const { loading, error, details, load } = useCityDetails();

onMounted(() => {
  load(props.city);
});

watch(
  () => props.city,
  (newCity) => {
    if (newCity) load(newCity);
  }
);
</script>

<template>
  <div class="panel">
    <button class="close-btn" @click="emit('close')">×</button>

    <div class="content">
      <h2>{{ props.city.name }}, {{ props.city.country }}</h2>

      <div v-if="loading" class="loading">Loading details…</div>
      <div v-if="error" class="error">{{ error }}</div>

      <div v-if="details">
        <img
          v-if="details.photoUrl"
          :src="details.photoUrl"
          alt="City photo"
          class="hero"
        />

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
  background: #eee;
  border: none;
  font-size: 22px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
}

.content {
  margin-top: 40px;
}

.hero {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
}

.summary {
  font-size: 15px;
  line-height: 1.5;
  margin-bottom: 16px;
}

.meta p {
  margin: 6px 0;
}

.loading {
  margin-top: 20px;
  color: #666;
}

.error {
  margin-top: 20px;
  color: #b00;
}
</style>