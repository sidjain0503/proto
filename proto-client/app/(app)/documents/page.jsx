'use client'

import { useState, useEffect, useRef } from 'react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { PageLayout } from '@/components/shared/PageLayout'
import { EmptyState } from '@/components/shared/EmptyState'
import { ConfirmDialog } from '@/components/shared/ConfirmDialog'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  FileUp,
  Trash2,
  RefreshCw,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  FileText,
  MoreHorizontal,
} from 'lucide-react'
import DocumentService from '@/lib/Services/DocumentService'

const STATUS_CONFIG = {
  pending: { icon: Clock, label: 'Pending', color: 'text-yellow-500' },
  processing: { icon: Cpu, label: 'Processing', color: 'text-blue-500', spin: true },
  ready: { icon: CheckCircle2, label: 'Ready', color: 'text-green-500' },
  failed: { icon: XCircle, label: 'Failed', color: 'text-red-500' },
}

function formatBytes(bytes) {
  if (!bytes) return '—'
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

function formatLastUpdated(date) {
  if (!date) return ''
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 5) return 'just now'
  if (seconds < 60) return `${seconds}s ago`
  return `${Math.floor(seconds / 60)}m ago`
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [dragOver, setDragOver] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const fileInputRef = useRef(null)
  const pollingRef = useRef(null)

  const fetchDocuments = async () => {
    try {
      const res = await DocumentService.list()
      setDocuments(res.data || [])
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to load documents:', err)
      setFeedback({ type: 'error', message: 'Failed to load documents.' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
    pollingRef.current = setInterval(fetchDocuments, 5000)
    return () => clearInterval(pollingRef.current)
  }, [])

  useEffect(() => {
    if (!feedback) return
    const timer = setTimeout(() => setFeedback(null), 4000)
    return () => clearTimeout(timer)
  }, [feedback])

  const handleUpload = async (files) => {
    if (!files?.length) return
    setUploading(true)
    setFeedback(null)

    try {
      for (const file of files) {
        await DocumentService.upload(file, file.name)
      }
      await fetchDocuments()
      setFeedback({
        type: 'success',
        message: `${files.length} file${files.length === 1 ? '' : 's'} uploaded successfully.`,
      })
    } catch (err) {
      console.error('Upload error:', err)
      setFeedback({ type: 'error', message: 'Upload failed. Please try again.' })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      await DocumentService.deleteDocument(deleteTarget.id)
      setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id))
      setFeedback({ type: 'success', message: `"${deleteTarget.title}" deleted.` })
    } catch (err) {
      console.error('Delete error:', err)
      setFeedback({ type: 'error', message: 'Failed to delete document.' })
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleReingest = async (id) => {
    try {
      await DocumentService.reingest(id)
      await fetchDocuments()
      setFeedback({ type: 'success', message: 'Re-ingestion started.' })
    } catch (err) {
      console.error('Reingest error:', err)
      setFeedback({ type: 'error', message: 'Re-ingestion failed.' })
    }
    setOpenMenuId(null)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleUpload(Array.from(e.dataTransfer.files))
  }

  const processingCount = documents.filter(
    (d) => d.status === 'pending' || d.status === 'processing'
  ).length
  const readyCount = documents.filter((d) => d.status === 'ready').length
  const totalChunks = documents.reduce((sum, d) => sum + (d.chunk_count || 0), 0)

  return (
    <ProtectedRoute>
      <PageLayout
        title="Documents"
        description="Upload documents for RAG-powered chat. Files are parsed, chunked, embedded, and made available for retrieval."
        actions={
          lastUpdated && (
            <span className="text-xs text-muted-foreground">
              Updated {formatLastUpdated(lastUpdated)}
              {processingCount > 0 && (
                <span className="ml-2 inline-flex items-center gap-1 text-blue-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-400" />
                  syncing
                </span>
              )}
            </span>
          )
        }
      >
        {feedback && (
          <Alert variant={feedback.type === 'error' ? 'destructive' : 'default'}>
            <AlertDescription>{feedback.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Ready</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readyCount}</div>
              <p className="text-xs text-muted-foreground">Available for retrieval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chunks</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalChunks}</div>
              <p className="text-xs text-muted-foreground">Indexed and searchable</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Cpu className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processingCount}</div>
              <p className="text-xs text-muted-foreground">Currently being ingested</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Document</CardTitle>
            <CardDescription>
              Supported formats: PDF, TXT, Markdown, CSV (max 20MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver
                  ? 'border-cyan-500/50 bg-cyan-500/5'
                  : 'border-muted-foreground/25'
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <FileUp className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop files here, or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.txt,.md,.csv"
                className="hidden"
                onChange={(e) => handleUpload(Array.from(e.target.files))}
              />
              <Button
                variant="outline"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Choose Files'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Your Documents</h2>
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full rounded-lg" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <EmptyState
              title="No documents yet"
              description="Upload a PDF, text, or markdown file to enable RAG-powered chat with source citations."
              icon={FileText}
              action={
                <Button onClick={() => fileInputRef.current?.click()}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload your first document
                </Button>
              }
            />
          ) : (
            <div className="grid gap-3">
              {documents.map((doc) => {
                const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending
                const StatusIcon = statusCfg.icon
                const menuOpen = openMenuId === doc.id

                return (
                  <Card key={doc.id}>
                    <CardContent className="flex items-center gap-4 py-4">
                      <FileText className="h-8 w-8 shrink-0 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.title}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{doc.filename}</span>
                          <span>{formatBytes(doc.size_bytes)}</span>
                          {doc.chunk_count > 0 && (
                            <span>{doc.chunk_count} chunks</span>
                          )}
                        </div>
                        {doc.status === 'failed' && doc.error_message && (
                          <p className="text-xs text-red-500 mt-1 truncate">
                            {doc.error_message}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1 text-xs font-medium ${statusCfg.color}`}
                        >
                          <StatusIcon
                            className={`h-4 w-4 ${statusCfg.spin ? 'animate-spin' : ''}`}
                          />
                          {statusCfg.label}
                        </div>
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Document actions"
                            onClick={() => setOpenMenuId(menuOpen ? null : doc.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          {menuOpen && (
                            <div className="absolute right-0 top-full z-10 mt-1 min-w-[140px] rounded-md border bg-popover p-1 shadow-md">
                              {doc.status === 'failed' && (
                                <button
                                  type="button"
                                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                                  onClick={() => handleReingest(doc.id)}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                  Retry
                                </button>
                              )}
                              <button
                                type="button"
                                className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                                onClick={() => {
                                  setDeleteTarget({ id: doc.id, title: doc.title })
                                  setOpenMenuId(null)
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </PageLayout>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete document?"
        description={
          deleteTarget
            ? `"${deleteTarget.title}" will be permanently removed and will no longer be available for RAG retrieval.`
            : ''
        }
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </ProtectedRoute>
  )
}
