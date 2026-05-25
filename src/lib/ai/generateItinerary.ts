import Anthropic from '@anthropic-ai/sdk'
import type { TripFormData } from '@/lib/validations/tripForm'
import type { DayItinerary } from '@/types/activity'

const client = new Anthropic()

export async function generateItinerary(
  tripData: TripFormData
): Promise<DayItinerary[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: `Generate a detailed travel itinerary for:
Destination: ${tripData.destination}
Start: ${tripData.startDate}
End: ${tripData.endDate}
Budget: ${tripData.budget} ${tripData.currency}
Travelers: ${tripData.travelers}
Package: ${tripData.packageType}

Return valid JSON array of DayItinerary objects with activities including GPS coordinates.`,
      },
    ],
  })

  const content = message.content[0]
  if (content?.type !== 'text') {
    throw new Error('Unexpected response type from AI')
  }

  const jsonMatch = content.text.match(/\[[\s\S]*\]/)
  if (!jsonMatch?.[0]) {
    throw new Error('No JSON found in AI response')
  }

  return JSON.parse(jsonMatch[0]) as DayItinerary[]
}
