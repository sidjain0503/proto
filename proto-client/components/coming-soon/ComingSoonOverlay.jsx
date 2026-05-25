'use client'

import { Clock } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ComingSoonOverlay({ title, description, children, className }) {
  return (
    <div className={cn('relative w-full min-h-[280px]', className)}>
      <div className="h-full w-full opacity-60 pointer-events-none select-none">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-background/75 p-4 backdrop-blur-sm">
        <div className="w-full max-w-[280px] shrink-0 rounded-lg border bg-card p-5 shadow-lg sm:max-w-sm">
          <div className="mb-2 flex items-center gap-2">
            <Clock className="h-5 w-5 shrink-0 text-muted-foreground" />
            <h3 className="text-base font-semibold leading-none">Coming Soon</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description ||
              'This feature is currently under development and will be available soon.'}
          </p>
          {title && (
            <p className="mt-2 text-sm text-muted-foreground">{title}</p>
          )}
        </div>
      </div>
    </div>
  )
}
