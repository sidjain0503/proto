'use client'

import { ProtectedRoute } from '@/components/ProtectedRoute'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  GitBranch,
  Brain,
  BarChart3,
  FileText,
  Settings,
  FileUp,
} from 'lucide-react'

const quickLinks = [
  { title: 'Chat', url: '/chat', icon: MessageSquare, description: 'Start a conversation' },
  { title: 'Documents', url: '/documents', icon: FileUp, description: 'Upload files for RAG' },
  { title: 'Chains', url: '/chains', icon: GitBranch, description: 'View execution chains' },
  { title: 'Models', url: '/models', icon: Brain, description: 'Manage AI models' },
  { title: 'Usage', url: '/usage', icon: BarChart3, description: 'Monitor usage' },
  { title: 'Prompts', url: '/prompts', icon: FileText, description: 'Manage prompts' },
  { title: 'Settings', url: '/settings', icon: Settings, description: 'Configure settings' },
]

const LAYERS = [
  {
    title: 'Execution',
    icon: GitBranch,
    color: 'text-cyan-400',
    bg: 'from-cyan-500/20 to-blue-500/20',
    description:
      'Chains, steps, retries, control flow. Separated from compute. Test without invoking models.',
  },
  {
    title: 'Compute',
    icon: Brain,
    color: 'text-purple-400',
    bg: 'from-purple-500/20 to-pink-500/20',
    description:
      'LLMs as interchangeable engines. Swap models without rewriting logic.',
  },
  {
    title: 'Knowledge',
    icon: FileText,
    color: 'text-emerald-400',
    bg: 'from-emerald-500/20 to-teal-500/20',
    description:
      'RAG with provenance and traceability. Answers know where they came from.',
  },
]

export default function Home() {
  const router = useRouter()

  const handleNavigate = (url) => {
    router.push(url)
  }

  const handleKeyDown = (e, url) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleNavigate(url)
    }
  }

  return (
    <ProtectedRoute>
      <div className="min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="grid min-h-full gap-0 lg:grid-cols-2">
          <div className="flex flex-col justify-center border-b border-slate-800 p-8 lg:border-b-0 lg:border-r lg:p-16">
            <div className="mx-auto w-full max-w-xl space-y-8">
              <div className="space-y-4">
                <div className="inline-block rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1">
                  <span className="text-xs font-medium tracking-wide text-cyan-400">
                    CONTROL PLANE
                  </span>
                </div>
                <h1 className="text-5xl font-bold tracking-tight text-white lg:text-6xl">
                  Proto
                </h1>
                <p className="text-lg text-slate-400">
                  AI infrastructure you can reason about.
                </p>
              </div>

              <div className="space-y-3 pt-4">
                {quickLinks.map((link) => {
                  const Icon = link.icon
                  return (
                    <button
                      key={link.title}
                      type="button"
                      onClick={() => handleNavigate(link.url)}
                      onKeyDown={(e) => handleKeyDown(e, link.url)}
                      tabIndex={0}
                      aria-label={`Go to ${link.title}: ${link.description}`}
                      className="group relative w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 p-5 text-left transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-800/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 transition-all group-hover:from-cyan-500/30 group-hover:to-blue-500/30">
                          <Icon className="h-6 w-6 text-cyan-400" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="mb-1 text-lg font-semibold text-white transition-colors group-hover:text-cyan-400">
                            {link.title}
                          </h3>
                          <p className="text-sm text-slate-400">{link.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center bg-black/20 p-8 lg:p-16">
            <div className="mx-auto w-full max-w-xl space-y-8">
              <div className="space-y-4">
                <div className="inline-block rounded-full border border-slate-700 bg-slate-800/50 px-3 py-1">
                  <span className="text-xs font-medium tracking-wide text-slate-400">
                    INFRASTRUCTURE LAYERS
                  </span>
                </div>
                <h2 className="text-4xl font-bold text-white">What Proto Is</h2>
                <p className="text-slate-400">
                  Proto treats AI as infrastructure, not a feature. Built as clear, intentional layers.
                </p>
              </div>

              <div className="grid gap-6 pt-4">
                {LAYERS.map((layer) => {
                  const Icon = layer.icon
                  return (
                    <div
                      key={layer.title}
                      className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/50 p-6"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${layer.bg}`}
                        >
                          <Icon className={`h-5 w-5 ${layer.color}`} />
                        </div>
                        <h3 className="text-xl font-semibold text-white">{layer.title}</h3>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-400">{layer.description}</p>
                    </div>
                  )
                })}
              </div>

              <p className="pt-4 text-center text-sm italic text-slate-500">
                No magic prompts. No black boxes. Just systems you can understand, test, and evolve.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
