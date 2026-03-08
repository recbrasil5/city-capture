<template>
  <MapView />
</template>

<script setup>
import MapView from './views/MapView.vue'
console.log(import.meta.env.VITE_GOOGLE_API_KEY)
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>