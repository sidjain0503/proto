'use client'

import { SettingsNav } from '@/components/shell/SettingsNav'

export default function SettingsLayout({ children }) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 lg:flex-row lg:p-8">
      <aside className="w-full shrink-0 lg:w-56">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Settings</h2>
          <p className="text-sm text-muted-foreground">
            Manage your account and workspace
          </p>
        </div>
        <SettingsNav />
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
