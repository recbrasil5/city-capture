// src/api/places.ts
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const BASE_URL = "https://places.googleapis.com/v1";

async function post(endpoint: string, body: any, fieldMask: string) {
  const res = await fetch(`${BASE_URL}/${endpoint}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": fieldMask
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("PLACES API ERROR:", await res.text());
    return null;
  }

  return res.json();
}

// --- Public API functions ---

export async function searchPlace(query: string) {
  const data = await post(
    "places:searchText",
    { textQuery: query, languageCode: "en" },
    "places.id,places.displayName,places.editorialSummary,places.photos,places.rating,places.userRatingCount"
  );

  return data?.places?.[0] || null;
}

export async function searchCityPointsOfInterest(cityName: string) {
  const data = await post(
    "places:searchText",
    { textQuery: `points of interest in ${cityName}`, languageCode: "en" },
    "places.id,places.displayName,places.photos,places.location,places.types"
  );

  return data?.places || [];
}

export function getPhotoUrl(photoName: string | null) {
  if (!photoName) return null;
  return `${BASE_URL}/${photoName}/media?key=${apiKey}&maxWidth=800`;
}