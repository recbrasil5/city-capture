import { ref } from "vue";
import type { City } from "@/types";
import { flagImg } from "@/utils/flags";

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

export function useMarkers(map: any, emit: any) {
  let ICON_DEFAULT: google.maps.Icon;
  let ICON_A: google.maps.Icon;
  let ICON_B: google.maps.Icon;

  function ensureIcons() {
    if (!ICON_DEFAULT) {
      ICON_DEFAULT = makeIcon("#2A81CB", "#164A8B", 20);
      ICON_A = makeIcon("#2A81CB", "#164A8B", 32);
      ICON_B = makeIcon("#CB8E2A", "#8B6414", 32);
    }
  }
  // Markers are created ONCE and reused. Only icons/labels change.
  const markers = ref<{ marker: google.maps.Marker; city: City }[]>([]);
  let labels: google.maps.InfoWindow[] = [];

  function isAirportLike(name: string): boolean {
    return (
      /airport|intl|international|terminal|air\s?base|airfield/i.test(name) ||
      /^[A-Z]{3}$/.test(name)
    );
  }

  function clearLabels() {
    for (const iw of labels) iw.close();
    labels = [];
  }

  function addLabel(city: City, marker: google.maps.Marker) {
    const iw = new google.maps.InfoWindow({
      content: `<div style="font:500 11px/1 system-ui;white-space:nowrap;padding:2px 6px">${city.name}, ${city.country} ${flagImg(city.country, 9)}</div>`,
      disableAutoPan: true,
    });
    iw.open(map.value, marker);
    labels.push(iw);
  }

  /** Call once to populate the map with all city markers. */
  function initMarkers(cities: City[]) {
    if (!map.value) return;
    ensureIcons();

    markers.value = cities
      .filter((c) => !isAirportLike(c.name))
      .map((city) => {
        const marker = new google.maps.Marker({
          position: { lat: city.lat, lng: city.lng },
          map: map.value,
          title: city.name,
          icon: ICON_DEFAULT,
        });

        marker.addListener("click", (e: any) => {
          if (e.domEvent) e.domEvent.stopPropagation();
          emit("marker-click", city);
        });

        return { marker, city };
      });
  }

  /** Update icons and labels to reflect current selection. Cheap — no marker creation/destruction. */
  function updateSelection(selectedA: City | null, selectedB: City | null) {
    ensureIcons();
    clearLabels();

    for (const { marker, city } of markers.value) {
      const isA = selectedA && city.name === selectedA.name && city.country === selectedA.country;
      const isB = selectedB && city.name === selectedB.name && city.country === selectedB.country;

      if (isA) {
        marker.setIcon(ICON_A);
        addLabel(city, marker);
      } else if (isB) {
        marker.setIcon(ICON_B);
        addLabel(city, marker);
      } else {
        marker.setIcon(ICON_DEFAULT);
      }
    }
  }

  return { initMarkers, updateSelection };
}
