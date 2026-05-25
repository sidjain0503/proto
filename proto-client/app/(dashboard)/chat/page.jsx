'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Loader2,
  Send,
  PencilIcon,
  Home,
  FolderIcon,
  MessageSquare,
  Sparkles,
  FileText,
  GitBranch,
} from 'lucide-react'
import { useAppStore } from '@/contexts/Store'
import ChatService from '@/lib/Services/ChatService'
import { ModelService } from '@/lib/Services'
import { menuItems } from '@/app/menu'
import DocumentService from '@/lib/Services/DocumentService'

const sessionItem = [
  {
    section: 'Navigations',
    items: [
      { title: 'Home', url: '/', icon: Home },
      { title: 'New Chat', url: '/chat', icon: PencilIcon },
      { title: 'Documents', url: '/documents', icon: FolderIcon },
    ],
  },
]

const STARTER_PROMPTS = [
  {
    label: 'Summarize my documents',
    prompt: 'Summarize the key points from my uploaded documents.',
    icon: FileText,
  },
  {
    label: 'Explain RAG chains',
    prompt: 'How does the RAG chain work in Proto?',
    icon: GitBranch,
  },
  {
    label: 'What can Proto do?',
    prompt: 'What are the main capabilities of the Proto platform?',
    icon: Sparkles,
  },
]

export default function ChatPage() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [readyDocCount, setReadyDocCount] = useState(0)
  const {
    setMenuItem,
    initActiveStream,
    appendActiveStreamToken,
    setActiveStreamStatus,
    finishActiveStream,
    failActiveStream,
  } = useAppStore()
  const router = useRouter()

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

  useEffect(() => {
    getAllSessions()
    DocumentService.list()
      .then((res) => {
        const docs = res.data || []
        setReadyDocCount(docs.filter((d) => d.status === 'ready').length)
      })
      .catch(() => {})

    return () => {
      setMenuItem(menuItems)
    }
  }, [])

  const startChat = async (message) => {
    const trimmed = message.trim()
    if (!trimmed || loading) return
    setLoading(true)

    try {
      await ChatService.startNewChat(trimmed, {
        onSessionReady: (sessionId) => {
          initActiveStream(sessionId, trimmed)
          router.push(`/chat/${sessionId}`)
        },
        onToken: appendActiveStreamToken,
        onStatus: setActiveStreamStatus,
        onComplete: finishActiveStream,
        onError: failActiveStream,
      })
    } catch (error) {
      console.error(error.message || 'Failed to create chat session.')
      failActiveStream(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async (e) => {
    e.preventDefault()
    await startChat(input)
  }

  const handleStarterClick = (prompt) => {
    setInput(prompt)
    startChat(prompt)
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        <div className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 ring-1 ring-cyan-500/20">
            <Sparkles className="h-6 w-6 text-cyan-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            What can Proto help you with?
          </h1>
          <p className="text-sm text-muted-foreground">
            {readyDocCount > 0
              ? `RAG enabled — ${readyDocCount} document${readyDocCount === 1 ? '' : 's'} ready for retrieval`
              : 'Upload documents to enable RAG-powered answers with source citations'}
          </p>
        </div>

        <form onSubmit={handleSend} className="relative">
          <div className="rounded-xl border border-border bg-card shadow-sm focus-within:ring-2 focus-within:ring-cyan-500/30">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={loading}
              className="border-0 bg-transparent px-4 py-6 text-base shadow-none focus-visible:ring-0"
            />
            <div className="flex items-center justify-between border-t border-border px-3 py-2">
              <span className="text-xs text-muted-foreground">
                Press Enter to send
              </span>
              <Button type="submit" size="sm" disabled={loading || !input.trim()}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Send
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        <div className="grid gap-2 sm:grid-cols-3">
          {STARTER_PROMPTS.map((starter) => {
            const Icon = starter.icon
            return (
              <button
                key={starter.label}
                type="button"
                onClick={() => handleStarterClick(starter.prompt)}
                disabled={loading}
                tabIndex={0}
                aria-label={starter.label}
                className="flex flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-cyan-500/30 hover:bg-cyan-500/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 disabled:opacity-50"
              >
                <Icon className="h-4 w-4 text-cyan-400" />
                <span className="text-sm font-medium">{starter.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
