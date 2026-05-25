import Anthropic from '@anthropic-ai/sdk'
import type { DayItinerary } from '@/types/activity'

const client = new Anthropic()

export interface ScheduleValidation {
  valid: boolean
  issues: string[]
  suggestions: string[]
}

export async function validateSchedule(
  itinerary: DayItinerary[]
): Promise<ScheduleValidation> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: `Validate this travel schedule for conflicts, unrealistic timings, or logistical issues. Return JSON with {valid, issues[], suggestions[]}:\n${JSON.stringify(itinerary)}`,
      },
    ],
  })

  const content = message.content[0]
  if (content?.type !== 'text') {
    throw new Error('Unexpected response type from AI')
  }

  const jsonMatch = content.text.match(/\{[\s\S]*\}/)
  if (!jsonMatch?.[0]) {
    throw new Error('No JSON found in AI response')
  }

  return JSON.parse(jsonMatch[0]) as ScheduleValidation
}
