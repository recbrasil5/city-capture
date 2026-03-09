<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import type { City } from "@/types";

const props = defineProps<{
  cities: City[];
  loading?: boolean;

  selectedA?: City | null;
  selectedB?: City | null;

  arcPoints?: [number, number][] | null;
}>();

const emit = defineEmits<{
  (e: "city-selected", city: City | null): void;
}>();

const mapEl = ref<HTMLDivElement | null>(null);
const map = ref<google.maps.Map | null>(null);

let markers: google.maps.Marker[] = [];
let arcPolyline: google.maps.Polyline | null = null;

function googleReady(): boolean {
  return typeof window !== "undefined" && !!window.google && !!window.google.maps;
}

function waitForGoogle(): Promise<void> {
  return new Promise((resolve) => {
    if (googleReady()) {
      resolve();
      return;
    }

    const interval = setInterval(() => {
      if (googleReady()) {
        clearInterval(interval);
        resolve();
      }
    }, 50);
  });
}

function isAirportLike(name: string): boolean {
  return (
    /airport|intl|international|aeroporto|aeropuerto|aéroport|terminal|air\s?base|airfield/i.test(
      name
    ) ||
    /^[A-Z]{3}$/.test(name)
  );
}

async function initMap() {
  if (!mapEl.value) return;

  await waitForGoogle();

  if (!googleReady()) return;

  map.value = new google.maps.Map(mapEl.value, {
    center: { lat: 20, lng: 0 },
    zoom: 3,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });

  map.value.addListener("click", () => {
    emit("city-selected", null);
  });

  if (props.cities.length) {
    createMarkers(props.cities);
  }
}

function clearMarkers() {
  markers.forEach((m) => m.setMap(null));
  markers = [];
}

function createMarkers(cities: City[]) {
  if (!map.value || !googleReady()) return;

  clearMarkers();

  markers = cities
    .filter((c) => c.population >= 30000 && !isAirportLike(c.name))
    .map((city) => {
      const marker = new google.maps.Marker({
        position: { lat: city.lat, lng: city.lng },
        map: map.value!,
        title: city.name,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        },
      });

      marker.addListener("click", (e: any) => {
        e.domEvent?.stopPropagation?.();
        emit("city-selected", city);
      });

      return marker;
    });

  highlightSelectedMarkers();
}

function highlightSelectedMarkers() {
  if (!googleReady()) return;

  markers.forEach((marker) => {
    const pos = marker.getPosition();
    if (!pos) return;

    const city = props.cities.find(
      (c) => c.lat === pos.lat() && c.lng === pos.lng()
    );

    if (!city) return;

    if (props.selectedA && city.name === props.selectedA.name) {
      marker.setIcon({
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        scaledSize: new google.maps.Size(50, 50),
      });
    } else if (props.selectedB && city.name === props.selectedB.name) {
      marker.setIcon({
        url: "http://maps.google.com/mapfiles/ms/icons/orange-dot.png",
        scaledSize: new google.maps.Size(50, 50),
      });
    } else {
      marker.setIcon({
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });
    }
  });
}

function drawArc() {
  if (!map.value || !googleReady()) return;

  if (arcPolyline) {
    arcPolyline.setMap(null);
    arcPolyline = null;
  }

  if (!props.arcPoints || props.arcPoints.length === 0) return;

  arcPolyline = new google.maps.Polyline({
    path: props.arcPoints.map(([lat, lng]) => ({ lat, lng })),
    geodesic: true,
    strokeColor: "#007bff",
    strokeOpacity: 0.9,
    strokeWeight: 2,
    map: map.value,
  });
}

function zoomToFit() {
  if (!map.value || !googleReady()) return;
  if (!props.selectedA || !props.selectedB) return;

  const bounds = new google.maps.LatLngBounds();

  bounds.extend({ lat: props.selectedA.lat, lng: props.selectedA.lng });
  bounds.extend({ lat: props.selectedB.lat, lng: props.selectedB.lng });

  map.value.fitBounds(bounds, 80);
}

onMounted(() => {
  initMap();
});

watch(
  () => props.cities,
  (newCities) => {
    if (!googleReady()) return;
    if (!map.value) return;

    if (!newCities.length) {
      clearMarkers();
      return;
    }

    createMarkers(newCities);
  },
  { deep: true }
);

watch(
  () => [props.selectedA, props.selectedB],
  () => {
    if (!googleReady()) return;
    highlightSelectedMarkers();
    zoomToFit();
  },
  { deep: true }
);

watch(
  () => props.arcPoints,
  () => {
    if (!googleReady()) return;
    drawArc();
  }
);
</script>

<template>
  <div class="map-container">
    <div ref="mapEl" class="map"></div>

    <div v-if="loading" class="loading-overlay">
      Loading cities…
    </div>
  </div>
</template>

<style scoped>
.map-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.map {
  width: 100%;
  height: 100%;
}

.loading-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #555;
  box-shadow: 0 1px 3px rgba(0,0,0,0.15);
}
</style>