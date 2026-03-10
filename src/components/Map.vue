<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useGoogleMap } from "@/composables/useGoogleMap";
import { useMarkers } from "@/composables/useMarkers";
import type { City } from "@/types";

const props = defineProps<{
  cities: City[];
  selectedA: City | null;
  selectedB: City | null;
}>();

const emit = defineEmits(["city-selected", "city-selected-b"]);

const { mapEl, map, initMap } = useGoogleMap();
const { createMarkers } = useMarkers(map, emit);

onMounted(async () => {
  await initMap({
    center: { lat: 39, lng: -98 },
    zoom: 4,
    disableDefaultUI: true,
  });

  createMarkers(props.cities, props.selectedA, props.selectedB);
});

watch(
  () => [props.cities, props.selectedA, props.selectedB],
  () => {
    if (!map.value) return;
    createMarkers(props.cities, props.selectedA, props.selectedB);
  }
);
</script>

<template>
  <div ref="mapEl" class="map-pane"></div>
</template>

<style>
.map-pane {
  width: 100%;
  height: 100%;
}
</style>