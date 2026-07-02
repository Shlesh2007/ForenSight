import type { ReactNode } from 'react'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info'

interface Props {
  variant?: BadgeVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-700 text-gray-300',
  success: 'bg-green-900/50 text-green-400 border border-green-800/60',
  warning: 'bg-amber-900/50 text-amber-400 border border-amber-800/60',
  danger:  'bg-red-900/50 text-red-400 border border-red-800/60',
  info:    'bg-blue-900/50 text-blue-400 border border-blue-800/60',
}

export default function Badge({ variant = 'default', children, className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${variantClasses[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
