# City-Center

City-Center is a prototype for a personal, map‑driven city exploration app.  
It’s built in **Vue 3 + Vite** as a fast, expressive environment for discovering the product’s shape before we commit to a full mobile build in React Native.
The goal is simple:  
**help people understand cities the way they actually feel them — through movement, density, and lived experience — not through generic travel guides.**

---

## 🌆 Core Concept

City-Center revolves around three primary views:

### 1. **Map View**
The heart of the app.  
A clean, minimal map that shows:

- major cities  
- population‑based visibility thresholds  
- airport overlays  
- region groupings  
- zoom‑based filtering  

This view is about *orientation* — understanding where cities sit in relation to each other and how they cluster.

### 2. **City Detail View**
When a user taps a city, they get a focused profile:
```

- population  
- region  
- airport presence  
- quick facts  
- emotional “vibe” notes (future feature)  

This view is about *identity* — what makes this city itself.

### 3. **Compare View**
A lightweight comparison tool:

- pick two cities  
- see them side‑by‑side  
- compare population, airports, density, region, and other attributes  

This view is about *decision‑making* — helping users choose where to travel, move, or explore next.

---

## 🎯 Why Vue for the Prototype

City-Center is being prototyped in Vue because:

- Vue is fast to iterate in  
- the template syntax makes UI exploration frictionless  
- Pinia stores let us model the domain cleanly  
- we can rapidly test ideas without wrestling with mobile constraints  

The Vue prototype is **not** the final product — it’s the sketchbook where we discover:

- the right data model  
- the right interactions  
- the right emotional tone  
- the right map behavior  

Once the prototype feels right, we’ll port the architecture to **React Native** for the real mobile experience.

---

## 📱 Long-Term Vision: React Native

City-Center is ultimately a **mobile-first** product.

After the Vue prototype stabilizes, we will:

- migrate the domain layer (stores, utils, data models) directly  
- rebuild the UI in React Native  
- integrate native maps, gestures, and camera features  
- support offline city packs  
- add journaling, clippings, and personal notes  

The Vue prototype ensures we don’t waste time doing massive refactors in React Native.  
We figure out the soul of the product here — then bring it to life natively.

---

## 🧱 Tech Stack

- Vue 3  
- Vite  
- TypeScript  
- Pinia  
- Google Maps (prototype)  
- Future: React Native + Expo  

---

## 🚧 Status

Active prototype.  
Architecture is stabilizing.  
Map engine is evolving.  
React Native migration planned once the UX is locked in.