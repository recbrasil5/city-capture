// src/composables/useMarkers.ts
import { ref } from "vue";
import type { City } from "@/types";

// ---------------------------------------------------------------------------
// SVG icon factory — Leaflet-style teardrop pin
// ---------------------------------------------------------------------------
function makePinSvg(fill: string, border: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z"
          fill="${fill}" stroke="${border}" stroke-width="1.5"/>
    <circle cx="12.5" cy="12.5" r="5" fill="white"/>
  </svg>`;
}

function makeIcon(fill: string, border: string, size: number): google.maps.Icon {
  const svg = makePinSvg(fill, border);
  const h = Math.round(size * 1.64);
  return {
    url: `data:image/svg+xml,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(size, h),
    anchor: new google.maps.Point(size / 2, h),
  };
}

// ---------------------------------------------------------------------------
// Composable
// ---------------------------------------------------------------------------
export function useMarkers(map: any, emit: any) {
  const markers = ref<google.maps.Marker[]>([]);
  const TOL = 0.001;

  // InfoWindow labels for selected markers
  let labelA: google.maps.InfoWindow | null = null;
  let labelB: google.maps.InfoWindow | null = null;

  // --- helpers ---------------------------------------------------------------

  function isAirportLike(name: string): boolean {
    return (
      /airport|intl|international|terminal|air\s?base|airfield/i.test(name) ||
      /^[A-Z]{3}$/.test(name)
    );
  }

  function getPopulationThresholdForZoom(zoom: number): number {
    if (zoom <= 4) return 500_000;   // Continental view — major cities only
    if (zoom <= 6) return 200_000;
    if (zoom <= 8) return 100_000;
    if (zoom <= 10) return 75_000;
    return 50_000;                    // Regional view — smaller cities
  }

  function matchCity(marker: google.maps.Marker, cities: City[]) {
    const pos = marker.getPosition();
    if (!pos) return;
    return cities.find(
      (c) =>
        Math.abs(c.lat - pos.lat()) < TOL &&
        Math.abs(c.lng - pos.lng()) < TOL
    );
  }

  function closeLabels() {
    labelA?.close();
    labelB?.close();
    labelA = null;
    labelB = null;
  }

  function clearMarkers() {
    closeLabels();
    markers.value.forEach((m) => m.setMap(null));
    markers.value = [];
  }

  // --- highlight (updates icons + labels without rebuilding) ------------------

  function highlightMarkers(
    cities: City[],
    selectedA: City | null,
    selectedB: City | null
  ) {
    closeLabels();

    markers.value.forEach((marker) => {
      const city = matchCity(marker, cities);
      if (!city) return;

      const isA = selectedA && city.name === selectedA.name && city.country === selectedA.country;
      const isB = selectedB && city.name === selectedB.name && city.country === selectedB.country;

      if (isA) {
        marker.setIcon(makeIcon("#2A81CB", "#164A8B", 32));
        labelA = new google.maps.InfoWindow({
          content: `<div style="font:600 13px/1.2 system-ui;white-space:nowrap;padding:2px 6px">${city.name} <span style="font-weight:400;color:#888">– ${city.country}</span></div>`,
          disableAutoPan: true,
        });
        labelA.open(map.value, marker);
      } else if (isB) {
        marker.setIcon(makeIcon("#CB8E2A", "#8B6414", 32));
        labelB = new google.maps.InfoWindow({
          content: `<div style="font:600 13px/1.2 system-ui;white-space:nowrap;padding:2px 6px">${city.name} <span style="font-weight:400;color:#888">– ${city.country}</span></div>`,
          disableAutoPan: true,
        });
        labelB.open(map.value, marker);
      } else {
        marker.setIcon(makeIcon("#2A81CB", "#164A8B", 20));
      }
    });
  }

  // --- create (full rebuild — call when cities array or zoom changes) ---------

  function createMarkers(cities: City[]) {
    if (!map.value) return;

    clearMarkers();

    const zoom = map.value.getZoom() ?? 3;
    const threshold = getPopulationThresholdForZoom(zoom);

    markers.value = cities
      .filter((c) => c.population >= threshold && !isAirportLike(c.name))
      .map((city) => {
        const marker = new google.maps.Marker({
          position: { lat: city.lat, lng: city.lng },
          map: map.value,
          title: city.name,
          icon: makeIcon("#2A81CB", "#164A8B", 20),
        });

        marker.addListener("click", (e: any) => {
          if (e.domEvent) e.domEvent.stopPropagation();
          emit("marker-click", city);
        });

        return marker;
      });
  }

  return {
    markers,
    createMarkers,
    clearMarkers,
    highlightMarkers,
  };
}
