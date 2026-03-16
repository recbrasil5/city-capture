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

  createMarkers(props.cities);
  highlightMarkers(props.cities, props.selectedA, props.selectedB);

  map.value?.addListener("click", () => emit("map-click"));

  map.value?.addListener("zoom_changed", () => {
    createMarkers(props.cities);
    highlightMarkers(props.cities, props.selectedA, props.selectedB);
  });
});

// ---------------------------------------------------------------------------
// WATCHERS — stable, no duplicate redraws
// ---------------------------------------------------------------------------
watch(
  () => props.cities.map(c => c.name).join("|"),
  () => {
    if (!map.value) return;
    createMarkers(props.cities);
    highlightMarkers(props.cities, props.selectedA, props.selectedB);
  }
);

watch(
  () => [props.selectedA?.name, props.selectedB?.name],
  () => {
    if (!map.value) return;
    highlightMarkers(props.cities, props.selectedA, props.selectedB);
  }
);

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