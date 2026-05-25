import { NextResponse } from 'next/server'
import { validateSchedule } from '@/lib/ai/validateSchedule'
import type { DayItinerary } from '@/types/activity'

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as { itinerary: DayItinerary[] }

  if (!Array.isArray(body.itinerary)) {
    return NextResponse.json(
      { error: 'itinerary must be an array' },
      { status: 400 }
    )
  }

  const result = await validateSchedule(body.itinerary)
  return NextResponse.json(result)
}
