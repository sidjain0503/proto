'use client'

import { cn } from "@/lib/utils"

export function StatusBadge({ 
  status, 
  variant = "default",
  className 
}) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-green-500/10 text-green-700 dark:text-green-400",
    warning: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    error: "bg-red-500/10 text-red-700 dark:text-red-400",
    info: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
    comingSoon: "bg-purple-500/10 text-purple-700 dark:text-purple-400",
    available: "bg-green-500/10 text-green-700 dark:text-green-400",
    planned: "bg-gray-500/10 text-gray-700 dark:text-gray-400",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant] || variants.default,
        className
      )}
    >
      {status}
    </span>
  )
}
