import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated'
}

export function Card({
  variant = 'default',
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white p-6',
        {
          'shadow-sm': variant === 'default',
          'border border-gray-200': variant === 'bordered',
          'shadow-lg': variant === 'elevated',
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
