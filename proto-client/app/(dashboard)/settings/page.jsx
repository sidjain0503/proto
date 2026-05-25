'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PageLayout } from '@/components/shared/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Building2, Key, Globe } from 'lucide-react'

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <PageLayout
        title="Settings"
        description="Manage your organization settings and configuration."
      >
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Organization</CardTitle>
            </div>
            <CardDescription>Your organization details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="org-name" className="text-sm font-medium">
                Organization Name
              </label>
              <Input id="org-name" placeholder="Your Organization" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Environment</CardTitle>
            </div>
            <CardDescription>Current environment configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Environment:</span>
              <span className="inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400">
                Development
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-muted-foreground" />
              <CardTitle>API Keys</CardTitle>
            </div>
            <CardDescription>Manage your API keys and credentials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="openai-key" className="text-sm font-medium">
                OpenAI API Key
              </label>
              <Input id="openai-key" type="password" placeholder="sk-..." disabled />
              <p className="text-xs text-muted-foreground">
                API key management will be available soon
              </p>
            </div>
            <div className="space-y-2">
              <label htmlFor="anthropic-key" className="text-sm font-medium">
                Anthropic API Key
              </label>
              <Input id="anthropic-key" type="password" placeholder="sk-ant-..." disabled />
              <p className="text-xs text-muted-foreground">
                API key management will be available soon
              </p>
            </div>
          </CardContent>
        </Card>
      </PageLayout>
    </ProtectedRoute>
  )
}
