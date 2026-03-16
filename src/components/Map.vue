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

// ---------------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------------
onMounted(async () => {
  await initMap({
    center: { lat: 39, lng: -98 },
    zoom: 4,
    disableDefaultUI: true,
  });

  // Initial marker build
  createMarkers(props.cities);
  highlightMarkers(props.cities, props.selectedA, props.selectedB);

  // Clicking empty map → deselect
  map.value?.addListener("click", () => emit("map-click"));

  // Rebuild markers on zoom change (population threshold changes)
  map.value?.addListener("zoom_changed", () => {
    createMarkers(props.cities);
    highlightMarkers(props.cities, props.selectedA, props.selectedB);
  });
});

// ---------------------------------------------------------------------------
// WATCHERS — stable, leak‑free, no duplicate redraws
// ---------------------------------------------------------------------------

// 1. Rebuild markers ONLY when the actual city list changes
watch(
  () => props.cities.map(c => c.name).join("|"),
  () => {
    if (!map.value) return;
    createMarkers(props.cities);
    highlightMarkers(props.cities, props.selectedA, props.selectedB);
  }
);

// 2. Highlight markers ONLY when A or B identity changes
watch(
  () => [props.selectedA?.name, props.selectedB?.name],
  () => {
    if (!map.value) return;
    highlightMarkers(props.cities, props.selectedA, props.selectedB);
  }
);

// 3. Draw arc ONLY when the actual route changes
watch(
  () => props.compareResult?.distanceMiles,
  () => {
    drawArc(props.compareResult ?? null);
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