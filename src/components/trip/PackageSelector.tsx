import type { TripPackage } from '@/types/trip'
import { cn } from '@/lib/utils/cn'

const PACKAGES: TripPackage[] = [
  { type: 'budget', label: 'Budget', priceMultiplier: 0.7 },
  { type: 'standard', label: 'Standard', priceMultiplier: 1 },
  { type: 'premium', label: 'Premium', priceMultiplier: 1.5 },
  { type: 'luxury', label: 'Luxury', priceMultiplier: 2.5 },
]

interface PackageSelectorProps {
  value: TripPackage['type']
  onChange: (type: TripPackage['type']) => void
}

export function PackageSelector({ value, onChange }: PackageSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {PACKAGES.map((pkg) => (
        <button
          key={pkg.type}
          onClick={() => onChange(pkg.type)}
          className={cn(
            'rounded-lg border-2 p-3 text-center transition-colors',
            value === pkg.type
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
          )}
        >
          <p className="font-semibold">{pkg.label}</p>
          <p className="text-xs text-gray-500">{pkg.priceMultiplier}x</p>
        </button>
      ))}
    </div>
  )
}
