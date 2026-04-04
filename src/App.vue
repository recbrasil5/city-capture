<script setup lang="ts">
import { onMounted } from "vue";
import Map from "@/components/Map.vue";
import CityPanel from "@/components/City.vue";
import Compare from "@/components/Compare.vue";

import { loadAllCities } from "@/composables/useAllCities";
import { useCityCompareState } from "@/composables/useCityCompareState";

const {
  cities,
  selectedA,
  selectedB,
  compareResult,
  compareBounds,
  shortRouteLabel,
  mode,
  handleMarkerClick,
  handleMapClick,
  resetAll,
} = useCityCompareState();

onMounted(async () => {
  const loaded = await loadAllCities();
  cities.value = Array.isArray(loaded) ? loaded : [];
});
</script>

<template>
  <div class="app-layout">
    <Map
      class="map-pane"
      :cities="cities"
      :selectedA="selectedA"
      :selectedB="selectedB"
      :compareResult="compareResult"
      :compareBounds="compareBounds"
      :shortRouteLabel="shortRouteLabel"
      @marker-click="handleMarkerClick"
      @map-click="handleMapClick"
    />

    <div v-if="mode === 'city' || mode === 'compare'" class="panel-container">
      <CityPanel
        v-if="mode === 'city' && selectedA"
        :city="selectedA"
        @close="resetAll"
      />

      <Compare
        v-if="mode === 'compare' && selectedA && selectedB && compareResult"
        :cityA="selectedA"
        :cityB="selectedB"
        :result="compareResult"
        :allCities="cities"
        @close="resetAll"
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
}

.panel-container {
  width: 420px;
  max-width: 420px;
  height: 100%;
  overflow: hidden;
}
</style>