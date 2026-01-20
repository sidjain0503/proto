'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function EmptyState({ 
  title, 
  description, 
  icon: Icon,
  action 
}) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md">
        <CardHeader>
          {Icon && (
            <div className="flex justify-center mb-4">
              <Icon className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          <CardTitle className="text-center">{title}</CardTitle>
          <CardDescription className="text-center">
            {description}
          </CardDescription>
        </CardHeader>
        {action && (
          <CardContent className="flex justify-center">
            {action}
          </CardContent>
        )}
      </Card>
    </div>
  )
}
