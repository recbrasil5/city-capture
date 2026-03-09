export async function fetchCitiesFromGoogle(query: string) {
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY

  const url = `https://places.googleapis.com/v1/places:searchText?key=${apiKey}`

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-FieldMask": "places.displayName,places.location,places.id"
    },
    body: JSON.stringify({
      textQuery: query
    })
  })

  if (!response.ok) {
    console.error("Google Places error:", await response.text())
    throw new Error("Failed to fetch cities from Google")
  }

  const data = await response.json()

  return data.places?.map(p => ({
    name: p.displayName?.text ?? "Unknown",
    lat: p.location?.latitude,
    lng: p.location?.longitude,
    id: p.id
  })) ?? []
}