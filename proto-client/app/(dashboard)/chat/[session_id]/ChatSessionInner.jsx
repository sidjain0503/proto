'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Send,
  Loader2,
  PencilIcon,
  Home,
  FileText,
  MessageSquare,
  Bot,
  User,
} from 'lucide-react'
import ChatService from '@/lib/Services/ChatService'
import MessageService from '@/lib/Services/MessageService'
import MarkdownMessage from '@/components/shared/MarkdownMessage'
import { useParams } from 'next/navigation'
import { useAppStore } from '@/contexts/Store'
import { ModelService } from '@/lib/Services'
import { menuItems } from '@/app/menu'

const sessionItem = [
  {
    section: 'Navigations',
    items: [
      { title: 'Home', url: '/', icon: Home },
      { title: 'New Chat', url: '/chat', icon: PencilIcon },
    ],
  },
]

const isVisibleRole = (role) => {
  const normalized = role?.toLowerCase()
  return normalized === 'user' || normalized === 'assistant'
}

const streamToMessages = (stream) => [
  { role: 'user', content: stream.userMessage },
  { role: 'assistant', content: stream.assistantContent },
]

const STATUS_LABELS = {
  retrieving: 'Searching your documents…',
  retrieved: 'Reading relevant snippets…',
  generating: 'Generating answer…',
}

const formatStatus = (status) => {
  if (!status || !status.stage) return null
  if (status.stage === 'retrieved') {
    if (!status.count) return null
    const label =
      status.count === 1
        ? 'Found 1 relevant snippet…'
        : `Found ${status.count} relevant snippets…`
    return label
  }
  return STATUS_LABELS[status.stage] || null
}

export default function ChatSessionPage() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [statusLabel, setStatusLabel] = useState(null)
  const messagesEndRef = useRef(null)
  const {
    setMenuItem,
    getActiveStream,
    subscribeActiveStream,
    clearActiveStream,
  } = useAppStore()
  const { session_id } = useParams()

  const visibleMessages = useMemo(
    () => messages.filter((message) => isVisibleRole(message.role)),
    [messages]
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getAllMessages = async () => {
    const msgs = await MessageService.getAllMessages({
      filters: { session_id },
    })
    setMessages(msgs)
    return msgs
  }

  const refreshFromServer = async (fallbackMessages) => {
    try {
      const msgs = await MessageService.getAllMessages({
        filters: { session_id },
      })
      const hasAssistant = msgs?.some(
        (m) => m.role?.toLowerCase() === 'assistant'
      )
      if (hasAssistant) {
        setMessages(msgs)
      } else if (fallbackMessages) {
        setMessages(fallbackMessages)
      }
    } catch (error) {
      console.error('Failed to refresh messages:', error)
    }
  }

  const getAllSessions = async () => {
    const allservices = await ModelService.fetchModel('session')
    const history = {
      section: 'History',
      items: allservices.map((item) => ({
        id: item.id,
        title: item.title || 'New Chat',
        url: `/chat/${item.id}`,
        icon: MessageSquare,
      })),
    }
    setMenuItem([...sessionItem, history])
  }

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim() || loading) return

    setInput('')
    setLoading(true)
    setStatusLabel(null)

    const optimisticMessages = [
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '' },
    ]
    setMessages((prev) => [
      ...prev.filter((m) => !(m.role === 'assistant' && m.content === '')),
      ...optimisticMessages,
    ])

    let assistantBuffer = ''

    try {
      await ChatService.sendMessage(session_id, userMessage, {
        onToken: (token) => {
          assistantBuffer += token
          setStatusLabel(null)
          setMessages((prev) => {
            if (prev.length === 0) return prev
            const lastIndex = prev.length - 1
            if (prev[lastIndex].role?.toLowerCase() !== 'assistant') return prev
            const next = [...prev]
            next[lastIndex] = { ...next[lastIndex], content: assistantBuffer }
            return next
          })
        },
        onStatus: (event) => setStatusLabel(formatStatus(event)),
        onComplete: () => setStatusLabel(null),
        onError: (error) => {
          setStatusLabel(null)
          throw error
        },
      })

      await refreshFromServer()
    } catch (error) {
      setMessages((prev) => {
        const next = prev.filter(
          (m) => !(m.role === 'assistant' && m.content === '')
        )
        return [
          ...next,
          { role: 'assistant', content: `Error: ${error.message}` },
        ]
      })
    } finally {
      setLoading(false)
      setStatusLabel(null)
    }
  }

  useEffect(() => {
    getAllSessions()

    const activeStream = getActiveStream(session_id)

    if (!activeStream) {
      getAllMessages()
      return () => setMenuItem(menuItems)
    }

    setMessages(streamToMessages(activeStream))
    setLoading(!activeStream.done)
    setStatusLabel(formatStatus(activeStream.status))

    const handleDone = (stream) => {
      const finalMessages = streamToMessages(stream)
      setStatusLabel(null)
      clearActiveStream(session_id)

      if (stream.error) {
        setMessages([
          ...finalMessages.filter((m) => m.role === 'user'),
          {
            role: 'assistant',
            content: `Error: ${stream.error.message || 'Stream failed.'}`,
          },
        ])
        return
      }

      refreshFromServer(finalMessages)
      getAllSessions()
    }

    if (activeStream.done) {
      handleDone(activeStream)
      return () => setMenuItem(menuItems)
    }

    const unsubscribe = subscribeActiveStream((stream) => {
      setMessages(streamToMessages(stream))
      setLoading(!stream.done)
      setStatusLabel(formatStatus(stream.status))
      if (stream.done) handleDone(stream)
    })

    return () => {
      unsubscribe()
      setMenuItem(menuItems)
    }
  }, [session_id])

  useEffect(() => {
    scrollToBottom()
  }, [visibleMessages])

  const handleSend = async (e) => {
    e.preventDefault()
    await sendMessage(input.trim())
  }

  const sessionTitle =
    visibleMessages.find((m) => m.role?.toLowerCase() === 'user')?.content?.slice(0, 60) ||
    'New conversation'

  return (
    <ProtectedRoute>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold">{sessionTitle}</h2>
            <p className="text-xs text-muted-foreground">
              RAG auto-detects when documents are uploaded
            </p>
          </div>
          {loading && (
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />
              Streaming
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {visibleMessages.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <p className="text-sm text-muted-foreground">
                {loading
                  ? 'Waiting for response...'
                  : 'Start a conversation by typing a message below.'}
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {visibleMessages.map((message, index) => {
                const meta = message.metadata
                  ? typeof message.metadata === 'string'
                    ? JSON.parse(message.metadata)
                    : message.metadata
                  : null
                const sources = meta?.sources
                const isUser = message.role?.toLowerCase() === 'user'

                return (
                  <div key={message.id ?? index} className="space-y-2">
                    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20'
                        }`}
                      >
                        {isUser ? (
                          <User className="h-4 w-4" />
                        ) : (
                          <Bot className="h-4 w-4" />
                        )}
                      </div>
                      <div
                        className={`max-w-[85%] rounded-xl px-4 py-3 ${
                          isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'border border-border bg-card'
                        }`}
                      >
                        {message.content ? (
                          <MarkdownMessage content={message.content} />
                        ) : !isUser && statusLabel ? (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>{statusLabel}</span>
                          </div>
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    {sources?.length > 0 && (
                      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ml-11`}>
                        <div className="max-w-[85%] space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">
                            Sources used
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {sources.map((src, i) => (
                              <div
                                key={i}
                                className="flex cursor-default items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1.5 text-xs"
                                title={src.preview}
                              >
                                <FileText className="h-3 w-3 shrink-0 text-muted-foreground" />
                                <span className="max-w-[140px] truncate font-medium">
                                  {src.documentTitle}
                                </span>
                                <span className="text-muted-foreground">
                                  chunk {src.chunkIndex + 1}
                                </span>
                                <span className="text-muted-foreground">
                                  ({(src.score * 100).toFixed(0)}%)
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <form onSubmit={handleSend} className="mx-auto flex max-w-3xl gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  if (input.trim() && !loading) {
                    sendMessage(input.trim())
                  }
                }
              }}
            />
            <Button type="submit" disabled={loading || !input.trim()}>
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
          <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground">
            Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>
    </ProtectedRoute>
  )
}
