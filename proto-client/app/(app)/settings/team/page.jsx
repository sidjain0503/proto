'use client'

import { PageLayout } from '@/components/shared/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, UserPlus } from 'lucide-react'

const PLACEHOLDER_MEMBERS = [
  { name: 'You', email: 'owner@example.com', role: 'Owner' },
]

export default function TeamSettingsPage() {
  return (
    <PageLayout
      title="Team"
      description="Invite teammates and manage roles."
    >
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                <CardTitle>Members</CardTitle>
              </div>
              <CardDescription>
                Team management is a stub — extend with roles when needed.
              </CardDescription>
            </div>
            <Button type="button" size="sm" disabled className="gap-1">
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Invite
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {PLACEHOLDER_MEMBERS.map((member) => (
            <div
              key={member.email}
              className="flex items-center justify-between rounded-lg border border-border p-3"
            >
              <div>
                <p className="font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
              <span className="text-xs text-muted-foreground">{member.role}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invite by email</CardTitle>
          <CardDescription>Send an invitation to join this workspace</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input type="email" placeholder="colleague@company.com" disabled />
          <Button type="button" disabled>
            Send invite
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
