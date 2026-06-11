'use client'

import { useRouter } from 'next/navigation'
import { appConfig, getEnabledNavItems } from '@/config/app.config'
import {
  MessageSquare,
  FileUp,
  BarChart3,
  ArrowRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'

const QUICK_ACTIONS = [
  {
    id: 'chat',
    feature: 'chat',
    title: 'Start a chat',
    description: 'Open a new AI conversation',
    url: '/chat',
    icon: MessageSquare,
  },
  {
    id: 'documents',
    feature: 'documents',
    title: 'Upload documents',
    description: 'Add files for RAG-powered answers',
    url: '/documents',
    icon: FileUp,
  },
  {
    id: 'usage',
    feature: 'usage',
    title: 'View usage',
    description: 'Monitor tokens and AI costs',
    url: '/usage',
    icon: BarChart3,
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const enabledFeatures = getEnabledNavItems()
  const enabledIds = new Set(enabledFeatures.map((f) => f.id))

  const actions = QUICK_ACTIONS.filter((action) =>
    enabledIds.has(action.feature)
  )

  const handleNavigate = (url) => {
    router.push(url)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-6 lg:p-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}
        </h1>
        <p className="mt-1 text-muted-foreground">
          {appConfig.app.tagline} — pick up where you left off.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Card
              key={action.id}
              className="cursor-pointer transition-colors hover:border-cyan-500/30 hover:bg-accent/30"
              onClick={() => handleNavigate(action.url)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  handleNavigate(action.url)
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={`${action.title}: ${action.description}`}
            >
              <CardHeader className="pb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10">
                  <Icon className="h-5 w-5 text-cyan-400" aria-hidden="true" />
                </div>
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription>{action.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" size="sm" className="gap-1 px-0">
                  Open
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
          <CardDescription>
            Your {appConfig.app.name} instance is running in development mode.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Enabled features</p>
            <p className="text-2xl font-semibold">{enabledFeatures.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Account</p>
            <p className="truncate text-sm font-medium">{user?.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Environment</p>
            <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400">
              Development
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
