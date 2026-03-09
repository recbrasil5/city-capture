<script setup lang="ts">
import { onMounted, ref } from "vue";
import L from "leaflet";

import type { City } from "@/types";
import { useSelectableCities } from "@/composables/useSelectableCities";

const props = defineProps<{
  cities: City[];
}>();

const emit = defineEmits<{
  (e: "city-selected", city: City): void;
}>();

const mapContainer = ref<HTMLDivElement | null>(null);
const map = ref<L.Map | null>(null);

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

let selectable: ReturnType<typeof useSelectableCities> | null = null;

onMounted(() => {
  if (!mapContainer.value) return;

  map.value = L.map(mapContainer.value).setView([30, -97], 4);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map.value);

  selectable = useSelectableCities(map.value, icon, props.cities);

  selectable.loadCities();

  selectable.setRouteHandler((_prev, next) => {
    emit("city-selected", next);
  });
});
</script>

<template>
  <div class="map-view">
    <div ref="mapContainer" class="map"></div>
  </div>
</template>

<style scoped>
.map-view {
  flex: 1;
  height: 100vh;
}

.map {
  width: 100%;
  height: 100%;
}
</style>