export async function lookupCityByLatLng(lat: number, lng: number) {
  const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  const url =
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json` +
    `?location=${lat},${lng}` +
    `&radius=50000` +
    `&type=locality` +
    `&key=${key}`

  const res = await fetch(url)
  const data = await res.json()

  if (!data.results?.length) return null

  const place = data.results[0]

  return {
    name: place.name,
    lat: place.geometry.location.lat,
    lon: place.geometry.location.lng,
    placeId: place.place_id
  }
}