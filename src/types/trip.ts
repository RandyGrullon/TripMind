export interface Trip {
  id: string
  userId: string
  title: string
  destination: string
  startDate: string
  endDate: string
  budget: number
  currency: string
  status: 'planning' | 'active' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt: string
}

export interface TripPackage {
  type: 'budget' | 'standard' | 'premium' | 'luxury'
  label: string
  priceMultiplier: number
}
