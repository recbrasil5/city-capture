// src/main.ts
import { createApp } from "vue";
import App from "./App.vue";

async function bootstrap() {
  // No Google Maps script injection here.
  // The composable handles loading the API.

  const app = createApp(App);
  app.mount("#app");
}

bootstrap();