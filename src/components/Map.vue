<script setup lang="ts">
import { onMounted, watch } from "vue";
import { useGoogleMap } from "@/composables/useGoogleMap";
import { useMarkers } from "@/composables/useMarkers";
import { useArc } from "@/composables/useArc";
import type { City, CompareResult } from "@/types";

const props = defineProps<{
  cities: City[];
  selectedA: City | null;
  selectedB: City | null;
  compareResult: CompareResult | null;
}>();

const emit = defineEmits(["marker-click", "map-click"]);

const { mapEl, map, initMap } = useGoogleMap();
const { createMarkers, highlightMarkers } = useMarkers(map, emit);
const { drawArc } = useArc(map);

onMounted(async () => {
  await initMap({
    center: { lat: 39, lng: -98 },
    zoom: 4,
    disableDefaultUI: true,
  });

  createMarkers(props.cities);
  highlightMarkers(props.cities, props.selectedA, props.selectedB);

  // Click empty map → deselect
  map.value?.addListener("click", () => {
    emit("map-click");
  });

  // Rebuild markers when zoom changes (population threshold varies by zoom)
  map.value?.addListener("zoom_changed", () => {
    createMarkers(props.cities);
    highlightMarkers(props.cities, props.selectedA, props.selectedB);
  });
});

// Rebuild only when city list actually changes (not on every parent re-render)
watch(
  () => props.cities.length,
  () => {
    if (!map.value) return;
    createMarkers(props.cities);
    highlightMarkers(props.cities, props.selectedA, props.selectedB);
  }
);

// Lightweight update when selection changes (icons + labels only)
watch(
  () => [props.selectedA, props.selectedB],
  () => {
    if (!map.value) return;
    highlightMarkers(props.cities, props.selectedA, props.selectedB);
  }
);

// Draw / clear arc when compare result changes
watch(
  () => props.compareResult,
  (result) => {
    drawArc(result ?? null);
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
