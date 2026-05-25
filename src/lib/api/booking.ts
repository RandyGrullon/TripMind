export async function searchHotels(
  destination: string,
  checkIn: string,
  checkOut: string,
  guests: number
): Promise<unknown> {
  const apiKey = process.env['BOOKING_API_KEY']

  if (!apiKey) {
    throw new Error('Booking.com API key not configured')
  }

  const params = new URLSearchParams({
    destination,
    checkin_date: checkIn,
    checkout_date: checkOut,
    adults_number: String(guests),
  })

  const res = await fetch(
    `https://distribution-xml.booking.com/2.9/json/hotels?${params}`,
    { headers: { Authorization: `Bearer ${apiKey}` } }
  )

  if (!res.ok) {
    throw new Error(`Booking.com search failed: ${res.status}`)
  }

  return res.json()
}
