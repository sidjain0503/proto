'use client'

import { PageLayout } from '@/components/shared/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Building2, Key, Globe } from 'lucide-react'

export default function OrganizationSettingsPage() {
  return (
    <PageLayout
      title="Organization"
      description="Manage your organization settings and configuration."
    >
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <CardTitle>Organization</CardTitle>
          </div>
          <CardDescription>Your organization details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="org-name" className="text-sm font-medium">
              Organization name
            </label>
            <Input id="org-name" placeholder="Your Organization" />
          </div>
          <Button type="button">Save changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
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
            <Key className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
            <CardTitle>API keys</CardTitle>
          </div>
          <CardDescription>Manage provider credentials for this workspace</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="openai-key" className="text-sm font-medium">
              OpenAI API key
            </label>
            <Input id="openai-key" type="password" placeholder="sk-..." disabled />
            <p className="text-xs text-muted-foreground">
              Configure via server environment variables in this template.
            </p>
          </div>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
