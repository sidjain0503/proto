'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PageLayout } from '@/components/shared/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FeatureLockedBanner } from '@/components/coming-soon/FeatureLockedBanner'
import { ComingSoonOverlay } from '@/components/coming-soon/ComingSoonOverlay'
import { BarChart3, TrendingUp, DollarSign, Activity } from 'lucide-react'

export default function UsagePage() {
  return (
    <ProtectedRoute>
      <PageLayout
        title="Usage"
        description="Monitor token usage, costs, and system performance across all products."
      >
        <FeatureLockedBanner
          title="Usage Insights Coming Soon"
          message="Usage insights will appear here once enabled. Preview layout shown below."
        />

        <ComingSoonOverlay description="Usage analytics and cost monitoring are under development.">
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                { title: 'Total Tokens', icon: BarChart3 },
                { title: 'Cost This Month', icon: DollarSign },
                { title: 'Requests Today', icon: Activity },
                { title: 'Growth Rate', icon: TrendingUp },
              ].map(({ title, icon: Icon }) => (
                <Card key={title} className="opacity-60">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">—</div>
                    <p className="text-xs text-muted-foreground">Coming soon</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="opacity-60">
                <CardHeader>
                  <CardTitle>Token Usage by Product</CardTitle>
                  <CardDescription>Distribution of tokens across different products</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-center justify-center text-muted-foreground">
                    Chart will appear here once enabled
                  </div>
                </CardContent>
              </Card>
              <Card className="opacity-60">
                <CardHeader>
                  <CardTitle>Cost by Model</CardTitle>
                  <CardDescription>Cost breakdown by AI model</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-64 items-center justify-center text-muted-foreground">
                    Chart will appear here once enabled
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </ComingSoonOverlay>
      </PageLayout>
    </ProtectedRoute>
  )
}
