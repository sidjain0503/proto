'use client'

import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { MessageSquare, GitBranch, Brain, BarChart3, FileText, Settings, FileUp } from "lucide-react"

const quickLinks = [
  { title: "Chat", url: "/chat", icon: MessageSquare, description: "Start a conversation" },
  { title: "Documents", url: "/documents", icon: FileUp, description: "Upload files for RAG" },
  { title: "Chains", url: "/chains", icon: GitBranch, description: "View execution chains" },
  { title: "Models", url: "/models", icon: Brain, description: "Manage AI models" },
  { title: "Usage", url: "/usage", icon: BarChart3, description: "Monitor usage" },
  { title: "Prompts", url: "/prompts", icon: FileText, description: "Manage prompts" },
  { title: "Settings", url: "/settings", icon: Settings, description: "Configure settings" },
]

export default function Home() {
  const router = useRouter()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex flex-col justify-center p-8 lg:p-16 border-r border-slate-800">
            <div className="max-w-xl mx-auto w-full space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                  <span className="text-xs text-cyan-400 font-medium tracking-wide">CONTROL PLANE</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold text-white tracking-tight">
                  Protolabs
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
                      onClick={() => router.push(link.url)}
                      className="w-full group relative overflow-hidden bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-5 transition-all duration-300 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center group-hover:from-cyan-500/30 group-hover:to-blue-500/30 transition-all">
                          <Icon className="w-6 h-6 text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-cyan-400 transition-colors">
                            {link.title}
                          </h3>
                          <p className="text-sm text-slate-400">
                            {link.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
      </div>
    </ProtectedRoute>
  )
}