<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { City, CompareResult } from "@/types";

import Map from "@/components/Map.vue";
import CityPanel from "@/components/City.vue";
import Compare from "@/components/Compare.vue";

import { loadAllCities } from "@/composables/useAllCities";
import { useGreatCircle } from "@/composables/useGreatCircle";

const { computeCompareResult } = useGreatCircle();

const cities = ref<City[]>([]);
const selectedA = ref<City | null>(null);
const selectedB = ref<City | null>(null);
const compareResult = ref<CompareResult | null>(null);

const mode = ref<"map" | "city" | "compare">("map");
const isLoading = ref(true);

onMounted(async () => {
  isLoading.value = true;
  try {
    const loaded = await loadAllCities();
    cities.value = Array.isArray(loaded) ? loaded : [];
  } finally {
    isLoading.value = false;
  }
});

function handleCitySelected(city: City | null) {
  if (!city) {
    selectedA.value = null;
    selectedB.value = null;
    compareResult.value = null;
    mode.value = "map";
    return;
  }

  if (!selectedA.value) {
    selectedA.value = city;
    mode.value = "city";
    return;
  }

  if (!selectedB.value) {
    selectedB.value = city;
    compareResult.value = computeCompareResult(selectedA.value, selectedB.value);
    mode.value = "compare";
    return;
  }
}

function closeCityPanel() {
  selectedA.value = null;
  selectedB.value = null;
  compareResult.value = null;
  mode.value = "map";
}

function closeCompare() {
  selectedA.value = null;
  selectedB.value = null;
  compareResult.value = null;
  mode.value = "map";
}
</script>

<template>
  <div class="app-layout">
    <Map
      class="map-pane"
      :cities="cities"
      :loading="isLoading"
      :selectedA="selectedA"
      :selectedB="selectedB"
      :arcPoints="compareResult?.arcPoints"
      @city-selected="handleCitySelected"
    />

    <div v-if="mode !== 'map'" class="panel-container">
      <CityPanel
        v-if="mode === 'city' && selectedA"
        :city="selectedA"
        @close="closeCityPanel"
      />

      <Compare
        v-if="mode === 'compare' && selectedA && selectedB && compareResult"
        :cityA="selectedA"
        :cityB="selectedB"
        :result="compareResult"
        @close="closeCompare"
      />
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.map-pane {
  flex: 1;
  min-width: 50%;
}

.panel-container {
  width: 420px;
  max-width: 420px;
  height: 100%;
  overflow: hidden;
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }

  .map-pane {
    width: 100%;
    height: 50vh;
  }

  .panel-container {
    width: 100%;
    max-width: none;
    height: 50vh;
  }
}
</style>