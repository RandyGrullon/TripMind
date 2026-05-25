import { NextResponse } from 'next/server'
import { analyzeVideo } from '@/lib/ai/analyzeVideo'
import { z } from 'zod'

const schema = z.object({
  imageBase64: z.string().min(1),
  mediaType: z.enum(['image/jpeg', 'image/png', 'image/webp']),
})

export async function POST(request: Request): Promise<NextResponse> {
  const body: unknown = await request.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const result = await analyzeVideo(
    parsed.data.imageBase64,
    parsed.data.mediaType
  )
  return NextResponse.json(result)
}
