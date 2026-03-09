import L from "leaflet";
import type { City } from "@/types";

export function useSelectableCities(
  map: L.Map,
  icon: L.Icon,
  cities: City[]
) {
  let routeHandler: ((prev: City | null, next: City) => void) | null = null;

  function loadCities() {
    cities.forEach((city) => {
      const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);

      marker.on("click", () => {
        if (routeHandler) {
          routeHandler(null, city);
        }
      });
    });
  }

  function setRouteHandler(handler: (prev: City | null, next: City) => void) {
    routeHandler = handler;
  }

  return {
    loadCities,
    setRouteHandler
  };
}