export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  preferences: UserPreferences
  createdAt: string
}

export interface UserPreferences {
  currency: string
  language: string
  notificationsEnabled: boolean
  defaultPackageType: 'budget' | 'standard' | 'premium' | 'luxury'
}
