import Anthropic from '@anthropic-ai/sdk'
import type { AlertLevelNumber } from '@/types/geofencing'
import type { Activity } from '@/types/activity'

const client = new Anthropic()

export async function generateAlertMessage(
  level: AlertLevelNumber,
  activity: Activity,
  distanceMeters: number
): Promise<string> {
  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 256,
    messages: [
      {
        role: 'user',
        content: `Generate a friendly alert message (level ${level}/5) for a traveler who is ${distanceMeters}m from "${activity.title}" at ${activity.location.name}. Keep it under 2 sentences.`,
      },
    ],
  })

  const content = message.content[0]
  if (content?.type !== 'text') {
    throw new Error('Unexpected response type from AI')
  }

  return content.text
}
