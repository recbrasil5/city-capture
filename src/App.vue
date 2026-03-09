<script setup lang="ts">
import { ref } from "vue";
import type { City } from "@/types";

import MapView from "@/views/MapView.vue";
import CityView from "@/views/CityView.vue";

import US from "@/data/cities-by-country/US.json";

const cities = ref<City[]>(US);
const selectedCity = ref<City | null>(null);

function handleCitySelected(city: City) {
  selectedCity.value = city;
}
</script>

<template>
  <div class="app-layout">
    <MapView
      :cities="cities"
      @city-selected="handleCitySelected"
    />

    <CityView
      v-if="selectedCity"
      :city="selectedCity"
      @close="selectedCity = null"
    />
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: #f5f5f5;
}
</style>