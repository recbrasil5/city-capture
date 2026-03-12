const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export async function searchPlace(query: string) {
  const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`;

  const body = {
    textQuery: query,
    languageCode: "en"
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": [
        "places.displayName",
        "places.editorialSummary.text",
        "places.photos.name"
      ].join(",")
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    console.error("PLACES ERROR:", await res.text());
    return null;
  }

  const data = await res.json();
  return data.places?.[0] || null;
}

export function getPhotoUrl(photoName: string | null) {
  if (!photoName) return null;
  return `https://places.googleapis.com/v1/${photoName}/media?key=${apiKey}&maxWidth=800`;
}