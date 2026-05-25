'use client'

export function PageLayout({ title, description, actions, children }) {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
      {(title || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && (
              <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
            )}
            {description && (
              <p className="mt-2 text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="shrink-0">{actions}</div>}
        </div>
      )}
      {children}
    </div>
  )
}
