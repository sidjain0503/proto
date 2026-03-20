"use client";

import { useState, useEffect, useRef } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";
import DocumentService from "@/lib/Services/DocumentService";

const STATUS_CONFIG = {
  pending: { icon: Clock, label: "Pending", color: "text-yellow-500" },
  processing: { icon: Cpu, label: "Processing", color: "text-blue-500", spin: true },
  ready: { icon: CheckCircle2, label: "Ready", color: "text-green-500" },
  failed: { icon: XCircle, label: "Failed", color: "text-red-500" },
};

function formatBytes(bytes) {
  if (!bytes) return "—";
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);
  const pollingRef = useRef(null);

  const fetchDocuments = async () => {
    try {
      const res = await DocumentService.list();
      setDocuments(res.data || []);
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();

    pollingRef.current = setInterval(() => {
      fetchDocuments();
    }, 5000);

    return () => clearInterval(pollingRef.current);
  }, []);

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);

    try {
      for (const file of files) {
        await DocumentService.upload(file, file.name);
      }
      await fetchDocuments();
    } catch (err) {
      console.error("Upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (id) => {
    try {
      await DocumentService.deleteDocument(id);
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleReingest = async (id) => {
    try {
      await DocumentService.reingest(id);
      await fetchDocuments();
    } catch (err) {
      console.error("Reingest error:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleUpload(Array.from(e.dataTransfer.files));
  };

  const processingCount = documents.filter(
    (d) => d.status === "pending" || d.status === "processing"
  ).length;
  const readyCount = documents.filter((d) => d.status === "ready").length;
  const totalChunks = documents.reduce((sum, d) => sum + (d.chunk_count || 0), 0);

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground mt-2">
            Upload documents for RAG-powered chat. Files are parsed, chunked,
            embedded, and made available for retrieval.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documents Ready</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{readyCount}</div>
              <p className="text-xs text-muted-foreground">
                Available for retrieval
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chunks</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalChunks}</div>
              <p className="text-xs text-muted-foreground">
                Indexed and searchable
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Processing</CardTitle>
              <Cpu className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{processingCount}</div>
              <p className="text-xs text-muted-foreground">
                Currently being ingested
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Upload zone */}
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
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/25"
              }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
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
                  "Choose Files"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Document list */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Your Documents</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No documents yet. Upload a file to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {documents.map((doc) => {
                const statusCfg = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
                const StatusIcon = statusCfg.icon;
                return (
                  <Card key={doc.id}>
                    <CardContent className="flex items-center gap-4 py-4">
                      <div className="flex-shrink-0">
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{doc.title}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{doc.filename}</span>
                          <span>{formatBytes(doc.size_bytes)}</span>
                          {doc.chunk_count > 0 && (
                            <span>{doc.chunk_count} chunks</span>
                          )}
                        </div>
                        {doc.status === "failed" && doc.error_message && (
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
                            className={`h-4 w-4 ${statusCfg.spin ? "animate-spin" : ""}`}
                          />
                          {statusCfg.label}
                        </div>
                        {doc.status === "failed" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleReingest(doc.id)}
                            title="Retry ingestion"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(doc.id)}
                          title="Delete document"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
