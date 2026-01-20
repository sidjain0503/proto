'use client'

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FeatureLockedBanner } from "@/components/coming-soon/FeatureLockedBanner"
import { FileText, GitBranch, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"

const samplePrompts = [
  {
    id: 1,
    name: "System Prompt - Chat Assistant",
    version: "v1.2.0",
    description: "Main system prompt for conversational AI assistant",
    lastModified: "2024-01-15",
  },
  {
    id: 2,
    name: "System Prompt - Research Agent",
    version: "v0.9.0",
    description: "Prompt for autonomous research and information synthesis",
    lastModified: "2024-01-10",
  },
  {
    id: 3,
    name: "System Prompt - Code Assistant",
    version: "v1.0.0",
    description: "Specialized prompt for code generation and debugging",
    lastModified: "2024-01-12",
  },
]

export default function PromptsPage() {
  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
            <p className="text-muted-foreground mt-2">
              Prompts are engineering assets. Version, test, and optimize them systematically.
            </p>
          </div>
          <Button disabled>New Prompt</Button>
        </div>

        <FeatureLockedBanner
          title="Prompt Versioning and Testing Coming Soon"
          message="Prompt versioning, A/B testing, and model comparison will be available soon. This system treats prompts as engineering assets."
        />

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
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{prompt.version}</span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      Modified {prompt.lastModified}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
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
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
              Prompt editor will be available soon
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Model Comparison</CardTitle>
            <CardDescription>Test prompts across different models</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg text-muted-foreground">
              Model comparison tool will be available soon
            </div>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  )
}
