import { createApp } from 'vue'
import { createPinia } from 'pinia'

import * as L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './assets/global.css'

import App from './App.vue'

import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'

const app = createApp(App)

app.use(createPinia())

// Register globally
app.component('LMap', LMap)
app.component('LTileLayer', LTileLayer)

app.mount('#app')