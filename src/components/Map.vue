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
  targetZoom: number | null;
  compareBounds: { lat: number; lng: number }[] | null;
  shortRouteLabel: { distance: string; time: string } | null;
}>();

const emit = defineEmits(["marker-click", "map-click"]);

const { mapEl, map, initMap } = useGoogleMap();
const { initMarkers, updateSelection } = useMarkers(map, emit);
const { drawArc } = useArc(map);

onMounted(async () => {
  await initMap({
    center: { lat: 39, lng: -98 },
    zoom: 4,
    disableDefaultUI: true,
  });

  initMarkers(props.cities);
  updateSelection(props.selectedA, props.selectedB);
  map.value?.addListener("click", () => emit("map-click"));
});

watch(() => props.selectedA, () => {
  updateSelection(props.selectedA, props.selectedB);
});

watch(() => props.selectedB, () => {
  updateSelection(props.selectedA, props.selectedB);
});

watch(() => props.compareResult, () => {
  drawArc(props.compareResult ?? null);
});

watch(() => props.targetZoom, (zoom, oldZoom) => {
  if (!map.value || zoom === null || !props.selectedA) return;
  if (oldZoom !== null) return;
  map.value.setZoom(zoom);
  map.value.panTo({ lat: props.selectedA.lat, lng: props.selectedA.lng });
});

watch(() => props.compareBounds, (bounds) => {
  if (!map.value || !bounds) return;
  const gBounds = new google.maps.LatLngBounds();
  bounds.forEach(p => gBounds.extend(p));
  map.value.fitBounds(gBounds, 60);
});
</script>

<template>
  <div class="map-wrapper">
    <div ref="mapEl" class="map-pane"></div>

    <div v-if="props.shortRouteLabel" class="arc-label">
      {{ props.shortRouteLabel.distance }}
      <span class="arc-label-time">{{ props.shortRouteLabel.time }}</span>
    </div>
  </div>
</template>

<style>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.map-pane {
  width: 100%;
  height: 100%;
}

.arc-label {
  position: absolute;
  bottom: 24px;
  left: 12px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(6px);
  padding: 6px 12px;
  border-radius: 8px;
  font: 600 13px/1.4 system-ui;
  color: #333;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
  pointer-events: none;
  z-index: 1;
}

.arc-label-time {
  font-weight: 400;
  color: #666;
  margin-left: 6px;
}
</style>
