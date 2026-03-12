// src/composables/useArc.ts
import { ref } from "vue";
import type { CompareResult } from "@/types";

export function useArc(map: any) {
  const arcPolyline = ref<google.maps.Polyline | null>(null);
  let arcLabel: google.maps.InfoWindow | null = null;

  function clearArc() {
    if (arcPolyline.value) {
      arcPolyline.value.setMap(null);
      arcPolyline.value = null;
    }
    if (arcLabel) {
      arcLabel.close();
      arcLabel = null;
    }
  }

  function drawArc(result: CompareResult | null) {
    if (!map.value) return;

    clearArc();

    if (!result || !result.arcPoints || result.arcPoints.length === 0) return;

    const path = result.arcPoints.map(([lat, lng]) => ({ lat, lng }));

    arcPolyline.value = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#007bff",
      strokeOpacity: 0.9,
      strokeWeight: 2,
      map: map.value,
    });

    // Label at the midpoint of the arc
    const midIdx = Math.floor(result.arcPoints.length / 2);
    const mid = result.arcPoints[midIdx];

    if (mid) {
      const dist = `${Math.round(result.distanceMiles).toLocaleString()} mi`;
      const km = `${Math.round(result.distanceKm).toLocaleString()} km`;
      const time = `~${result.flightTimeHours.toFixed(1)}h flight`;

      arcLabel = new google.maps.InfoWindow({
        content: `<div style="font:600 12px/1.4 system-ui;white-space:nowrap;padding:3px 8px;text-align:center">
          ${dist} / ${km}<br>
          <span style="font-weight:400;color:#555">${time}</span>
        </div>`,
        position: { lat: mid[0], lng: mid[1] },
        disableAutoPan: true,
      });
      arcLabel.open(map.value);
    }
  }

  return { arcPolyline, drawArc, clearArc };
}
