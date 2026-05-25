'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { getPageTitle } from '@/lib/pageTitles'
import { usePathname } from 'next/navigation'

export function AppHeader() {
  const pathname = usePathname()
  const pageTitle = getPageTitle(pathname)

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <SidebarTrigger />
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <span className="text-sm font-semibold tracking-tight truncate">{pageTitle}</span>
        <span className="hidden sm:inline-flex items-center rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-cyan-400">
          Dev
        </span>
      </div>
      <ThemeToggle />
    </header>
  )
}
