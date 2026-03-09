// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded?
    if (window.google && window.google.maps) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => resolve();
    script.onerror = () => reject("Google Maps failed to load");

    document.head.appendChild(script);
  });
}

async function bootstrap() {
  await loadGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

  const app = createApp(App);
  app.mount("#app");
}

bootstrap();