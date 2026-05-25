export interface PlaceDetails {
  placeId: string
  name: string
  address: string
  lat: number
  lng: number
  rating?: number
  photos?: string[]
}

export async function searchPlace(query: string): Promise<PlaceDetails[]> {
  const apiKey = process.env['GOOGLE_MAPS_API_KEY']

  if (!apiKey) {
    throw new Error('Google Maps API key not configured')
  }

  const params = new URLSearchParams({ query, key: apiKey })
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`
  )

  if (!res.ok) {
    throw new Error(`Google Maps search failed: ${res.status}`)
  }

  const data = (await res.json()) as {
    results: Array<{
      place_id: string
      name: string
      formatted_address: string
      geometry: { location: { lat: number; lng: number } }
      rating?: number
    }>
  }

  return data.results.map((r) => {
    const place: PlaceDetails = {
      placeId: r.place_id,
      name: r.name,
      address: r.formatted_address,
      lat: r.geometry.location.lat,
      lng: r.geometry.location.lng,
    }
    if (r.rating !== undefined) place.rating = r.rating
    return place
  })
}
