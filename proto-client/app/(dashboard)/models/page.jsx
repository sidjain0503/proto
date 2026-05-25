'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PageLayout } from '@/components/shared/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { FeatureLockedBanner } from '@/components/coming-soon/FeatureLockedBanner'
import { ComingSoonOverlay } from '@/components/coming-soon/ComingSoonOverlay'
import { Brain, Zap, DollarSign } from 'lucide-react'

const models = [
  {
    id: 1,
    name: 'GPT-4.x',
    provider: 'OpenAI',
    strength: 'Reasoning',
    description: 'Advanced reasoning capabilities for complex problem-solving',
    status: 'Planned',
    cost: 'High',
  },
  {
    id: 2,
    name: 'Claude',
    provider: 'Anthropic',
    strength: 'Long context',
    description: 'Extended context window for comprehensive analysis',
    status: 'Planned',
    cost: 'High',
  },
  {
    id: 3,
    name: 'Cost-optimized Model',
    provider: 'OpenAI',
    strength: 'Fast',
    description: 'Optimized for speed and cost efficiency',
    status: 'Planned',
    cost: 'Low',
  },
  {
    id: 4,
    name: 'Embedding Model',
    provider: 'OpenAI',
    strength: 'Semantic Search',
    description: 'High-quality embeddings for retrieval tasks',
    status: 'Available',
    cost: 'Low',
  },
]

const strengthIcons = {
  Reasoning: Brain,
  'Long context': Brain,
  Fast: Zap,
  'Semantic Search': Brain,
}

export default function ModelsPage() {
  return (
    <ProtectedRoute>
      <PageLayout
        title="Models"
        description="AI models are abstracted resources, not provider-specific implementations."
      >
        <FeatureLockedBanner
          title="Model Configuration Coming Soon"
          message="Model selection, provider management, and performance monitoring will be available soon."
        />

        <ComingSoonOverlay description="Model configuration and provider management are under development. Preview data shown below.">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {models.map((model) => {
              const StrengthIcon = strengthIcons[model.strength] || Brain
              return (
                <Card key={model.id} className="opacity-60">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{model.name}</CardTitle>
                        <CardDescription className="mt-1">{model.provider}</CardDescription>
                      </div>
                      <StatusBadge
                        status={model.status}
                        variant={model.status === 'Available' ? 'available' : 'planned'}
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <StrengthIcon className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{model.strength}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{model.description}</p>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Cost: {model.cost}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </ComingSoonOverlay>
      </PageLayout>
    </ProtectedRoute>
  )
}
