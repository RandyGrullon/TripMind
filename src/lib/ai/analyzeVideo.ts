import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export interface VideoAnalysisResult {
  location: string
  activities: string[]
  mood: string
  suggestedDestinations: string[]
}

export async function analyzeVideo(
  imageBase64: string,
  mediaType: 'image/jpeg' | 'image/png' | 'image/webp'
): Promise<VideoAnalysisResult> {
  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType,
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: 'Analyze this travel image. Return JSON with {location, activities[], mood, suggestedDestinations[]}.',
          },
        ],
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

  return JSON.parse(jsonMatch[0]) as VideoAnalysisResult
}
