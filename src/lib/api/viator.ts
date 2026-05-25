const VIATOR_BASE_URL = 'https://api.viator.com/partner'

export async function searchActivities(
  destination: string,
  date: string
): Promise<unknown> {
  const apiKey = process.env['VIATOR_API_KEY']

  if (!apiKey) {
    throw new Error('Viator API key not configured')
  }

  const res = await fetch(
    `${VIATOR_BASE_URL}/search/products?destId=${encodeURIComponent(destination)}&startDate=${date}`,
    {
      headers: {
        'exp-api-key': apiKey,
        Accept: 'application/json;version=2.0',
      },
    }
  )

  if (!res.ok) {
    throw new Error(`Viator search failed: ${res.status}`)
  }

  return res.json()
}
