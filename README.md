# 🌆 City-Center

City-Center is a prototype for a personal, map-driven city exploration app.  
It’s built in **Vue 3 + Vite** as a fast, expressive environment for discovering the product’s shape before we commit to a full mobile build in React Native.

The goal is simple:  
**help people understand cities the way they actually feel them — through movement, density, airports, and lived experience — not through generic travel guides.**

---

## 🧭 Core Concept

City-Center revolves around three primary views that reflect how people naturally explore places.

### 1. 🗺️ Map View — Orientation

A clean, minimal map that reveals:

- major cities  
- population-based visibility thresholds  
- airport overlays  
- region groupings  
- zoom-based filtering  
- deterministic click + selection behavior  

This view focuses on **spatial understanding** — how cities relate, cluster, and scale.

---

### 2. 🏙️ City Detail View — Identity

A focused profile for each city:

- population  
- region  
- airport presence  
- quick facts  
- flag and country identity  
- future: vibe notes, density indicators, cultural anchors  

This view focuses on **what makes a city itself**.

---

### 3. ⚖️ Compare View — Decision-Making

A lightweight comparison tool:

- pick two cities  
- see them side-by-side  
- compare population, airports, density, region, and other attributes  
- deterministic state machine for selection + clearing  

This view supports **choosing where to travel, move, or explore next**.

---

## 🧠 Architecture Philosophy

City-Center follows a simple principle:

**UI should be thin. Behavior should be explicit. Domain logic should be portable.**

Key architectural decisions:

- domain layer (behaviors, rules, transitions) lives outside the UI  
- composables are thin reactive wrappers  
- components are declarative and predictable  
- map behavior is deterministic and state-driven  
- flags, utils, and formatting are unified and centralized  
- environment is locked to Node `22.22.0` and port `3000` for stability  

This keeps the prototype fast, safe, and ready for mobile migration.

---

## 🎯 Why Vue for the Prototype

Vue is the sketchbook — the place where ideas move fast.

We use Vue because:

- template syntax makes UI exploration frictionless  
- composables map cleanly to domain behaviors  
- Vite dev server is fast and predictable  
- we can iterate on map interactions without mobile constraints  

The Vue prototype is **not** the final product — it’s where we discover:

- the right data model  
- the right interactions  
- the right emotional tone  
- the right map behavior  
- the right abstractions for portability  

Once the prototype feels right, we’ll port the architecture to **React Native** for the real mobile experience.

---

## 📱 Long-Term Vision: React Native

City-Center is ultimately a **mobile-first** product.

After the Vue prototype stabilizes, we will:

- migrate the domain layer (behaviors, utils, data models) directly  
- rebuild the UI in React Native  
- integrate native maps, gestures, and camera features  
- support offline city packs  
- add journaling, clippings, and personal notes  

The Vue prototype ensures we don’t waste time doing massive refactors in React Native.  
We figure out the soul of the product here — then bring it to life