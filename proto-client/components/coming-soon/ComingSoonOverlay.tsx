'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

export function ComingSoonOverlay({ title, description, children }) {
  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 rounded-lg">
        <Card className="max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <CardTitle>Coming Soon</CardTitle>
            </div>
            <CardDescription>
              {description || "This feature is currently under development and will be available soon."}
            </CardDescription>
          </CardHeader>
          {title && (
            <CardContent>
              <p className="text-sm text-muted-foreground">{title}</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
