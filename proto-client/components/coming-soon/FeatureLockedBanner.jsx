'use client'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Clock, Lock } from "lucide-react"

export function FeatureLockedBanner({ 
  title = "Feature Locked", 
  message = "This feature is currently under development and will be available soon.",
  variant = "default" // "default" | "info" | "warning"
}) {
  const Icon = variant === "warning" ? Lock : Clock
  
  return (
    <Alert variant={variant === "warning" ? "destructive" : "default"} className="mb-6">
      <Icon className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
