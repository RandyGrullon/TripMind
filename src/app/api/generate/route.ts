import { NextResponse } from 'next/server'
import { generateItinerary } from '@/lib/ai/generateItinerary'
import { tripFormSchema } from '@/lib/validations/tripForm'

export async function POST(request: Request): Promise<NextResponse> {
  const body: unknown = await request.json()
  const parsed = tripFormSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const itinerary = await generateItinerary(parsed.data)
  return NextResponse.json({ itinerary })
}
