const AMADEUS_BASE_URL = 'https://test.api.amadeus.com/v1'

interface AmadeusToken {
  access_token: string
  expires_in: number
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env['AMADEUS_CLIENT_ID']
  const clientSecret = process.env['AMADEUS_CLIENT_SECRET']

  if (!clientId || !clientSecret) {
    throw new Error('Amadeus credentials not configured')
  }

  const res = await fetch(`${AMADEUS_BASE_URL}/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!res.ok) {
    throw new Error(`Amadeus auth failed: ${res.status}`)
  }

  const data = (await res.json()) as AmadeusToken
  return data.access_token
}

export async function searchFlights(
  origin: string,
  destination: string,
  date: string,
  adults: number
): Promise<unknown> {
  const token = await getAccessToken()
  const params = new URLSearchParams({
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate: date,
    adults: String(adults),
    max: '10',
  })

  const res = await fetch(
    `${AMADEUS_BASE_URL}/shopping/flight-offers?${params}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )

  if (!res.ok) {
    throw new Error(`Amadeus flight search failed: ${res.status}`)
  }

  return res.json()
}
