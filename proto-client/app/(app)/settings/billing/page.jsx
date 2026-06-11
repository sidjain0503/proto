'use client'

import { PageLayout } from '@/components/shared/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CreditCard, Receipt } from 'lucide-react'
import Link from 'next/link'

export default function BillingSettingsPage() {
  return (
    <PageLayout
      title="Billing"
      description="Manage your subscription and payment methods."
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <CardTitle>Current plan</CardTitle>
          </div>
          <CardDescription>
            Billing integration is a stub — wire Stripe in client forks as needed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="font-medium">Development</p>
            <p className="text-sm text-muted-foreground">
              Free while building. No payment method on file.
            </p>
          </div>
          <Button type="button" disabled>
            Upgrade plan
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <CardTitle>Invoices</CardTitle>
          </div>
          <CardDescription>View past invoices and receipts</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No invoices yet. Connect{' '}
            <Link href="/settings/billing" className="text-cyan-400 hover:underline">
              Stripe
            </Link>{' '}
            to enable billing for client deployments.
          </p>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
