import Anthropic from '@anthropic-ai/sdk'
import type { Activity } from '@/types/activity'

const client = new Anthropic()

export async function rescheduleActivity(
  activity: Activity,
  reason: string,
  availableSlots: string[]
): Promise<Activity> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    messages: [
      {
        role: 'user',
        content: `Reschedule this activity due to: ${reason}. Available slots: ${availableSlots.join(', ')}. Return the updated activity as JSON:\n${JSON.stringify(activity)}`,
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

  return JSON.parse(jsonMatch[0]) as Activity
}
