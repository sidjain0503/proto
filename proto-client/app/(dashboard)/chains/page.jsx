'use client'

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/shared/StatusBadge"
import { FeatureLockedBanner } from "@/components/coming-soon/FeatureLockedBanner"
import { Workflow, MessageSquare, Search, GitBranch } from "lucide-react"

const chains = [
  {
    id: 1,
    name: "Basic Chat Chain",
    type: "Simple",
    description: "Simple conversational chain for basic Q&A interactions",
    steps: [
      { step: 1, name: "User Input Processing", model: "GPT-4" },
      { step: 2, name: "Response Generation", model: "GPT-4" },
    ],
    status: "Available",
  },
  {
    id: 2,
    name: "RAG Chat Chain",
    type: "Sequential",
    description: "Retrieval-Augmented Generation chain for context-aware responses",
    steps: [
      { step: 1, name: "Query Understanding", model: "GPT-4" },
      { step: 2, name: "Document Retrieval", model: "Embedding Model" },
      { step: 3, name: "Context Assembly", model: "GPT-4" },
      { step: 4, name: "Response Generation", model: "GPT-4" },
    ],
    status: "Coming Soon",
  },
  {
    id: 3,
    name: "Research Agent",
    type: "Agentic",
    description: "Autonomous research agent that can plan, search, and synthesize information",
    steps: [
      { step: 1, name: "Task Planning", model: "Claude" },
      { step: 2, name: "Information Gathering", model: "Search API" },
      { step: 3, name: "Analysis & Synthesis", model: "Claude" },
      { step: 4, name: "Report Generation", model: "GPT-4" },
    ],
    status: "Coming Soon",
  },
  {
    id: 4,
    name: "Workflow Orchestrator",
    type: "Complex",
    description: "Multi-step workflow orchestrator with conditional branching and parallel execution",
    steps: [
      { step: 1, name: "Workflow Initialization", model: "GPT-4" },
      { step: 2, name: "Condition Evaluation", model: "Claude" },
      { step: 3, name: "Parallel Task Execution", model: "Multiple Models" },
      { step: 4, name: "Result Aggregation", model: "GPT-4" },
    ],
    status: "Coming Soon",
  },
]

const typeIcons = {
  Simple: MessageSquare,
  Sequential: GitBranch,
  Agentic: Search,
  Complex: Workflow,
}

export default function ChainsPage() {
  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chains</h1>
          <p className="text-muted-foreground mt-2">
            Execution chains define how AI models work together to accomplish tasks.
          </p>
        </div>

        <FeatureLockedBanner
          title="Chain Management Coming Soon"
          message="Chain configuration, execution monitoring, and step-by-step debugging will be available soon."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {chains.map((chain) => {
            const TypeIcon = typeIcons[chain.type] || Workflow
            return (
              <Card key={chain.id} className="relative">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="w-5 h-5 text-muted-foreground" />
                      <CardTitle>{chain.name}</CardTitle>
                    </div>
                    <StatusBadge
                      status={chain.status}
                      variant={chain.status === "Available" ? "available" : "comingSoon"}
                    />
                  </div>
                  <CardDescription className="mt-2">{chain.description}</CardDescription>
                  <div className="mt-2">
                    <StatusBadge status={chain.type} variant="info" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Execution Steps:</h4>
                    <div className="space-y-1">
                      {chain.steps.map((step) => (
                        <div
                          key={step.step}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                            {step.step}
                          </span>
                          <span className="flex-1">{step.name}</span>
                          <span className="text-xs">{step.model}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </ProtectedRoute>
  )
}
