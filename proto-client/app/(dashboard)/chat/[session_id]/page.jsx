'use client'

import { Suspense } from 'react'
import ChatSessionPage from './ChatSessionInner'

export default function ChatSessionWrapper() {
  return (
    <Suspense fallback={<div className="flex flex-1 items-center justify-center p-8 text-muted-foreground">Loading chat...</div>}>
      <ChatSessionPage />
    </Suspense>
  )
}
