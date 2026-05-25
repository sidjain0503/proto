'use client'

import { Brain, FileText, GitBranch } from 'lucide-react'

const LAYERS = [
  {
    title: 'Execution',
    icon: GitBranch,
    bg: 'from-cyan-500/20 to-blue-500/20',
    iconColor: 'text-cyan-400',
    description:
      'Chains, steps, retries, control flow. Separated from compute. Test without invoking models.',
  },
  {
    title: 'Compute',
    icon: Brain,
    bg: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-400',
    description:
      'LLMs as interchangeable engines. Swap models without rewriting logic.',
  },
  {
    title: 'Knowledge',
    icon: FileText,
    bg: 'from-emerald-500/20 to-teal-500/20',
    iconColor: 'text-emerald-400',
    description:
      'RAG with provenance and traceability. Answers know where they came from.',
  },
]

export function AuthMarketingPanel() {
  return (
    <div className="hidden lg:flex flex-col justify-center p-8 lg:p-16 bg-black/20 border-r border-slate-800">
      <div className="max-w-xl mx-auto w-full space-y-8">
        <div className="space-y-4">
          <div className="inline-block px-3 py-1 bg-slate-800/50 border border-slate-700 rounded-full">
            <span className="text-xs text-slate-400 font-medium tracking-wide">
              INFRASTRUCTURE LAYERS
            </span>
          </div>
          <h2 className="text-4xl font-bold text-white">Welcome to Proto</h2>
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
                className="space-y-3 p-6 rounded-xl bg-slate-900/50 border border-slate-800"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${layer.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${layer.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{layer.title}</h3>
                </div>
                <p className="text-sm text-slate-400 leading-relaxed">{layer.description}</p>
              </div>
            )
          })}
        </div>

        <p className="text-sm text-slate-500 italic text-center pt-4">
          No magic prompts. No black boxes. Just systems you can understand, test, and evolve.
        </p>
      </div>
    </div>
  )
}
