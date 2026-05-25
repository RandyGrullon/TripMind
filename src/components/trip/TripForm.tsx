'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { TripFormData } from '@/lib/validations/tripForm'

interface TripFormProps {
  onSubmit: (data: TripFormData) => Promise<void>
  loading?: boolean
}

export function TripForm({ onSubmit, loading = false }: TripFormProps) {
  const [form, setForm] = useState<Partial<TripFormData>>({
    packageType: 'standard',
    currency: 'USD',
    travelers: 1,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(form as TripFormData)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        id="title"
        label="Trip name"
        placeholder="My European Adventure"
        value={form.title ?? ''}
        onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        required
      />
      <Input
        id="destination"
        label="Destination"
        placeholder="Paris, France"
        value={form.destination ?? ''}
        onChange={(e) =>
          setForm((f) => ({ ...f, destination: e.target.value }))
        }
        required
      />
      <div className="flex gap-4">
        <Input
          id="startDate"
          label="Start date"
          type="date"
          value={form.startDate ?? ''}
          onChange={(e) =>
            setForm((f) => ({ ...f, startDate: e.target.value }))
          }
          required
        />
        <Input
          id="endDate"
          label="End date"
          type="date"
          value={form.endDate ?? ''}
          onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
          required
        />
      </div>
      <Button type="submit" loading={loading}>
        Generate Itinerary
      </Button>
    </form>
  )
}
