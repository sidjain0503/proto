'use client'

import Link from 'next/link'
import { appConfig } from '@/config/app.config'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

export const FeatureGate = ({ featureId, children }) => {
  const isEnabled = appConfig.features[featureId]

  if (isEnabled) {
    return children
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Lock className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Feature not enabled</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Enable <code className="rounded bg-muted px-1">{featureId}</code> in{' '}
          <code className="rounded bg-muted px-1">config/app.config.js</code> for
          this fork.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  )
}
