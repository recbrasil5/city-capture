// src/composables/useArc.ts
import { ref } from "vue";

export function useArc(map: any) {
  const arcPolyline = ref<google.maps.Polyline | null>(null);

  function drawArc(points: [number, number][] | null) {
    if (!map.value) return;

    if (arcPolyline.value) {
      arcPolyline.value.setMap(null);
      arcPolyline.value = null;
    }

    if (!points || points.length === 0) return;

    arcPolyline.value = new google.maps.Polyline({
      path: points.map(([lat, lng]) => ({ lat, lng })),
      geodesic: true,
      strokeColor: "#007bff",
      strokeOpacity: 0.9,
      strokeWeight: 2,
      map: map.value,
    });
  }

  return { arcPolyline, drawArc };
}