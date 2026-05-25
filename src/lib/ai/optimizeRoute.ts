import Anthropic from '@anthropic-ai/sdk'
import type { Activity } from '@/types/activity'

const client = new Anthropic()

export async function optimizeRoute(
  activities: Activity[]
): Promise<Activity[]> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `Optimize the order of these activities to minimize travel time and maximize experience. Return the same activities array reordered as JSON:\n${JSON.stringify(activities)}`,
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

  return JSON.parse(jsonMatch[0]) as Activity[]
}
