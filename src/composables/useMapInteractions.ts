// src/composables/useMapInteractions.ts
import { watch, type Ref } from "vue";
import type { City, CompareResult } from "@/types";

type MapProps = {
  selectedA: City | null;
  selectedB: City | null;
  compareResult: CompareResult | null;
  compareBounds: { lat: number; lng: number }[] | null;
};

export function useMapInteractions(
  map: Ref<google.maps.Map | null>,
  props: MapProps,
  updateSelection: (a: City | null, b: City | null) => void,
  drawArc: (result: CompareResult | null) => void
) {
  // City A → zoom to regional view
  watch(() => props.selectedA, (city) => {
    updateSelection(props.selectedA, props.selectedB);

    if (!map.value || !city) return;

    const CITY_CLICK_ZOOM = 5;
    map.value.setZoom(CITY_CLICK_ZOOM);
    map.value.panTo({ lat: city.lat, lng: city.lng });
  });

  // City B → update selection only
  watch(() => props.selectedB, () => {
    updateSelection(props.selectedA, props.selectedB);
  });

  // Arc drawing
  watch(() => props.compareResult, () => {
    drawArc(props.compareResult ?? null);
  });

  // Fit bounds only when both cities exist
  watch(() => props.compareBounds, (bounds) => {
    if (!map.value || !bounds) return;
    if (!props.selectedA || !props.selectedB) return;

    const gBounds = new google.maps.LatLngBounds();
    bounds.forEach((p) => gBounds.extend(p));
    map.value.fitBounds(gBounds, 60);
  });
}