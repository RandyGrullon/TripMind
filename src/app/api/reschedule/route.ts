import { NextResponse } from 'next/server'
import { rescheduleActivity } from '@/lib/ai/rescheduleActivity'
import { z } from 'zod'

const schema = z.object({
  activityId: z.string(),
  reason: z.string().min(1),
  availableSlots: z.array(z.string()).min(1),
})

export async function POST(request: Request): Promise<NextResponse> {
  const body: unknown = await request.json()
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }

  const res = await fetch(`/api/activities/${parsed.data.activityId}`)
  if (!res.ok) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 })
  }

  const { activity } = (await res.json()) as {
    activity: Parameters<typeof rescheduleActivity>[0]
  }
  const updated = await rescheduleActivity(
    activity,
    parsed.data.reason,
    parsed.data.availableSlots
  )
  return NextResponse.json({ activity: updated })
}
