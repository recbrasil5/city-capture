// src/composables/useArc.ts
import { type Ref } from "vue";
import type { CompareResult } from "@/types";

export function useArc(map: Ref<google.maps.Map | null>) {
  const activePolylines: google.maps.Polyline[] = [];
  const activeOverlays: google.maps.OverlayView[] = [];

  function clearArc() {
    activePolylines.forEach((p) => p.setMap(null));
    activePolylines.length = 0;

    activeOverlays.forEach((o) => o.setMap(null));
    activeOverlays.length = 0;
  }

  function drawArc(result: CompareResult | null) {
    clearArc();

    if (!map.value) return;
    if (!result || !result.arcPoints || result.arcPoints.length === 0) return;

    const path = result.arcPoints.map(([lat, lng]) => ({ lat, lng }));

    const polyline = new google.maps.Polyline({
      path,
      geodesic: true,
      strokeColor: "#007bff",
      strokeOpacity: 0.9,
      strokeWeight: 2,
      clickable: false,
      map: map.value,
    });
    activePolylines.push(polyline);

    {
      const midIdx = Math.floor(result.arcPoints.length / 2);
      const mid = result.arcPoints[midIdx];
      if (!mid) return;

      const dist = `${Math.round(result.distanceMiles).toLocaleString()} mi / ${Math.round(
        result.distanceKm
      ).toLocaleString()} km`;
      const time = result.flightTime;
      const midLatLng = new google.maps.LatLng(mid[0], mid[1]);

      const overlay = new google.maps.OverlayView();
      const el = document.createElement("div");

      el.innerHTML = `${dist} <span style="color:#aaa;margin-left:4px">${time}</span>`;
      Object.assign(el.style, {
        position: "absolute",
        font: "500 11px/1 system-ui",
        whiteSpace: "nowrap",
        padding: "4px 10px",
        background: "#1a1a1a",
        color: "#fff",
        borderRadius: "4px",
        letterSpacing: "0.3px",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
      });

      overlay.onAdd = function () {
        this.getPanes()!.floatPane.appendChild(el);
      };

      overlay.draw = function () {
        const proj = this.getProjection();
        const px = proj.fromLatLngToDivPixel(midLatLng);
        if (px) {
          el.style.left = px.x + "px";
          el.style.top = px.y + "px";
        }
      };

      overlay.onRemove = function () {
        el.remove();
      };

      overlay.setMap(map.value);
      activeOverlays.push(overlay);
    }
  }

  return { drawArc, clearArc };
}