'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PageLayout } from '@/components/shared/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FeatureLockedBanner } from '@/components/coming-soon/FeatureLockedBanner'
import { ComingSoonOverlay } from '@/components/coming-soon/ComingSoonOverlay'
import { FileText, GitBranch, TestTube } from 'lucide-react'
import { Button } from '@/components/ui/button'

const samplePrompts = [
  {
    id: 1,
    name: 'System Prompt - Chat Assistant',
    version: 'v1.2.0',
    description: 'Main system prompt for conversational AI assistant',
    lastModified: '2024-01-15',
  },
  {
    id: 2,
    name: 'System Prompt - Research Agent',
    version: 'v0.9.0',
    description: 'Prompt for autonomous research and information synthesis',
    lastModified: '2024-01-10',
  },
  {
    id: 3,
    name: 'System Prompt - Code Assistant',
    version: 'v1.0.0',
    description: 'Specialized prompt for code generation and debugging',
    lastModified: '2024-01-12',
  },
]

export default function PromptsPage() {
  return (
    <ProtectedRoute>
      <PageLayout
        title="Prompts"
        description="Prompts are engineering assets. Version, test, and optimize them systematically."
        actions={<Button disabled>New Prompt</Button>}
      >
        <FeatureLockedBanner
          title="Prompt Versioning and Testing Coming Soon"
          message="Prompt versioning, A/B testing, and model comparison will be available soon."
        />

        <ComingSoonOverlay description="Prompt management tools are under development. Sample data shown below.">
          <div className="space-y-6 opacity-60">
            <div className="grid gap-6">
              {samplePrompts.map((prompt) => (
                <Card key={prompt.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-muted-foreground" />
                        <div>
                          <CardTitle>{prompt.name}</CardTitle>
                          <CardDescription className="mt-1">{prompt.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{prompt.version}</span>
                        <span>•</span>
                        <span>Modified {prompt.lastModified}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button variant="outline" size="sm" disabled>
                        <GitBranch className="w-4 h-4 mr-2" />
                        View Versions
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        <TestTube className="w-4 h-4 mr-2" />
                        Test Prompt
                      </Button>
                      <Button variant="outline" size="sm" disabled>
                        Compare Models
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Prompt Editor</CardTitle>
                <CardDescription>Edit and version your prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed text-muted-foreground">
                  Prompt editor will be available soon
                </div>
              </CardContent>
            </Card>
          </div>
        </ComingSoonOverlay>
      </PageLayout>
    </ProtectedRoute>
  )
}
