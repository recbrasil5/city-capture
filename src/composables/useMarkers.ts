// src/composables/useMarkers.ts
import { ref } from "vue";
import type { City } from "@/types";

export function useMarkers(map: any, emit: any) {
  const markers = ref<google.maps.Marker[]>([]);
  const TOL = 0.001;

  function isAirportLike(name: string): boolean {
    return (
      /airport|intl|international|terminal|air\s?base|airfield/i.test(name) ||
      /^[A-Z]{3}$/.test(name)
    );
  }

  function getPopulationThresholdForZoom(zoom: number): number {
    if (zoom < 5) return 500000;
    if (zoom < 7) return 100000;
    return 50000;
  }

  function clearMarkers() {
    markers.value.forEach((m) => m.setMap(null));
    markers.value = [];
  }

  function matchCity(marker: google.maps.Marker, cities: City[]) {
    const pos = marker.getPosition();
    if (!pos) return;

    return cities.find((c) => {
      return (
        Math.abs(c.lat - pos.lat()) < TOL &&
        Math.abs(c.lng - pos.lng()) < TOL
      );
    });
  }

  function highlightMarkers(
    cities: City[],
    selectedA: City | null,
    selectedB: City | null
  ) {
    markers.value.forEach((marker) => {
      const city = matchCity(marker, cities);
      if (!city) return;

      if (selectedA && city.name === selectedA.name) {
        marker.setIcon({
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new google.maps.Size(50, 50),
        });
      } else if (selectedB && city.name === selectedB.name) {
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

  function handleCityClick(
    city: City,
    selectedA: City | null,
    selectedB: City | null
  ) {
    if (!selectedA) {
      emit("city-selected", city);
      return;
    }

    if (!selectedB) {
      emit("city-selected-b", city);
      return;
    }

    emit("city-selected", selectedB);
    emit("city-selected-b", city);
  }

  function createMarkers(
    cities: City[],
    selectedA: City | null,
    selectedB: City | null
  ) {
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
          icon: {
            url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          },
        });

        marker.addListener("click", (e: any) => {
          if (e.domEvent) e.domEvent.stopPropagation();
          handleCityClick(city, selectedA, selectedB);
        });

        return marker;
      });

    highlightMarkers(cities, selectedA, selectedB);
  }

  return {
    markers,
    createMarkers,
    clearMarkers,
    highlightMarkers,
  };
}