'use client'

import { PageLayout } from '@/components/shared/PageLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfileSettingsPage() {
  const { user } = useAuth()

  return (
    <PageLayout
      title="Profile"
      description="Your personal account information."
    >
      <Card>
        <CardHeader>
          <CardTitle>Personal info</CardTitle>
          <CardDescription>Update your name and email</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="profile-name" className="text-sm font-medium">
              Full name
            </label>
            <Input
              id="profile-name"
              defaultValue={user?.name || ''}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="profile-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="profile-email"
              type="email"
              defaultValue={user?.email || ''}
              disabled
            />
            <p className="text-xs text-muted-foreground">
              Email changes require backend support in this template.
            </p>
          </div>
          <Button type="button" disabled>
            Save changes
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
