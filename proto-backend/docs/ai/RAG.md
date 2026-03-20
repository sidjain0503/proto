# RAG Layer: End-to-End Guide

This document explains how Proto's Retrieval-Augmented Generation (RAG) system works from upload to answer generation.

It covers:

1. Architecture and data flow
2. Ingestion pipeline (parse, chunk, embed, index)
3. Retrieval + reranking pipeline
4. Chain integration in chat
5. Data model and APIs
6. Ops notes and troubleshooting

---

## 1) What the RAG layer does

Proto's RAG layer allows users to upload documents and ask questions grounded in those documents.

At runtime, the system:

- Finds relevant chunks from uploaded docs
- Reranks them for better relevance
- Injects them into the model context
- Streams a grounded answer
- Stores source metadata for UI citation

---

## 2) High-level architecture

```text
Upload Document
    |
    v
DocumentRoutes (/documents/upload)
    |
    v
IngestionPipeline
  ├─ Parser (PDF/TXT/MD/CSV -> text)
  ├─ Chunker (recursive split + overlap)
  ├─ EmbeddingService (local all-MiniLM-L6-v2)
  └─ VectorStore (MySQL document_chunk.embedding JSON)
    |
    v
document.status = ready

User Query in Chat
    |
    v
ChatService.sendMessage()
    |
    +-- if ready docs exist -> RAGChain
    |       1) RetrievalStep
    |       2) StreamingLLMStep
    |
    +-- else -> BasicChatChain
    |
    v
Assistant response saved with metadata.sources
```

---

## 3) Ingestion pipeline (offline/indexing path)

### Trigger

- Endpoint: `POST /documents/upload`
- Auth required
- Uses `multer` disk storage
- Creates a `document` row with `status = pending`
- Starts ingestion asynchronously (fire-and-forget)

### Steps

#### A. Parse

`services/rag/Parser.js`

- Supported MIME types:
  - `application/pdf`
  - `text/plain`
  - `text/markdown`
  - `text/csv`
- PDF extraction uses `pdf-parse`
- Text-like files are read directly

#### B. Chunk

`services/rag/Chunker.js`

- Recursive splitting with separators:
  - paragraph -> line -> sentence -> word -> char fallback
- Default chunk size: `512` chars
- Default overlap: `64` chars
- Produces ordered chunks with estimated token counts

#### C. Embed

`services/rag/EmbeddingService.js`

- Uses local model via `@xenova/transformers`
- Model: `Xenova/all-MiniLM-L6-v2`
- Vector dimension: `384`
- Normalized mean-pooled vectors
- No OpenAI key required

#### D. Store

`services/rag/VectorStore.js`

- Inserts each chunk into `document_chunk`
- Stores:
  - raw chunk text
  - embedding (JSON)
  - token_count
  - metadata
- Marks document as:
  - `ready` on success
  - `failed` with error message on failure

### Document lifecycle status

- `pending` -> uploaded, waiting to process
- `processing` -> parsing/chunking/embedding/indexing in progress
- `ready` -> retrievable in chat
- `failed` -> indexing failed (error stored)

---

## 4) Retrieval pipeline (online/query path)

When chat receives a user message and there are ready docs, Proto uses `RAGChain`.

### Step 1: RetrievalStep

`services/ai/executor/steps/RetrievalStep.js`

1. Takes latest user message as query
2. Embeds query using same embedding model
3. Fetches candidate chunks from user's ready documents
4. Computes cosine similarity against stored vectors
5. Applies threshold filtering
6. Reranks with hybrid score:
   - vector score weight: `0.7`
   - keyword overlap weight: `0.3`
7. Picks top K chunks (default 5)
8. Injects retrieved context into system prompt
9. Saves retrieval result objects to `ctx.retrievalResults`

### Step 2: StreamingLLMStep

`services/ai/executor/steps/StreamingLLMStep.js`

- Calls model provider through Adapter
- Streams tokens to frontend
- Collects full output
- Returns final output to chain runner

### Persisted metadata

After answer generation, `ChatService` stores assistant message with:

- `metadata.sources[]`, each containing:
  - `documentId`
  - `documentTitle`
  - `filename`
  - `chunkIndex`
  - `score`
  - `preview`

Frontend reads this to render citations below assistant messages.

---

## 5) Chain integration in chat

### Auto chain selection

`services/ChatService.js`:

- Queries `document` table for `status = ready` by `user_id`
- If one or more exist:
  - uses `RAGChain` (RetrievalStep -> StreamingLLMStep)
- Else:
  - uses `BasicChatChain` (LLM-only chat)

This means chat automatically becomes RAG-enabled when documents are available.

### ChainRunner behavior

`services/ai/executor/chains/ChainRunner.js`

- Supports multi-step chains
- Executes until final output is returned
- Backward compatible with single-step chains

---

## 6) Data model

### `document`

Tracks uploaded files and ingestion state.

Key fields:

- `id`, `user_id`
- `title`, `filename`, `file_path`
- `mime_type`, `size_bytes`
- `status`, `chunk_count`, `error_message`
- `created_at`, `updated_at`

### `document_chunk`

Stores vector-indexed chunks.

Key fields:

- `id`, `document_id`, `chunk_index`
- `content`
- `embedding` (JSON)
- `token_count`
- `metadata` (JSON)
- `created_at`

### `message.metadata`

Added JSON column to store source citations for assistant responses.

Migration file:

- `migrations/001_rag_tables.sql`

---

## 7) API surface

### Document endpoints

- `POST /documents/upload` - upload + start ingestion
- `GET /documents` - list user documents
- `GET /documents/:id` - get one document
- `DELETE /documents/:id` - delete doc + chunks
- `POST /documents/:id/reingest` - re-run ingestion

### Chat endpoint (RAG-enabled)

- `POST /chat/:sessionId/message`
  - uses RAG automatically when docs are ready
  - streams response
  - persists citation metadata

---

## 8) Frontend behavior

### Documents page

`proto-client/app/(dashboard)/documents/page.jsx`

- Uploads one or multiple files
- Shows status (`pending`, `processing`, `ready`, `failed`)
- Shows chunk counts and ingestion metrics
- Supports delete and re-ingest actions
- Polls status periodically

### Chat page citations

`proto-client/app/(dashboard)/chat/[session_id]/page.jsx`

- Re-fetches messages after streaming
- Parses `message.metadata`
- Renders source badges for assistant messages

---

## 9) Configuration and model notes

### Embeddings

- Local model, no external key required

### Generation model (OpenRouter)

- Generation still depends on OpenRouter model availability and account settings.
- If you see:
  - "No endpoints found..."
  - "No endpoints available matching your guardrail restrictions and data policy..."
  check OpenRouter model status and privacy settings.

Privacy settings page:

- [https://openrouter.ai/settings/privacy](https://openrouter.ai/settings/privacy)

---

## 10) Known limitations and next improvements

Current implementation is intentionally simple and practical. Potential upgrades:

1. Move embeddings from JSON scan to dedicated vector DB / ANN index
2. Add per-document filters in retrieval (document scope selection)
3. Add chunk dedup and max-context token budgeting
4. Add semantic/rule-based query rewriting before retrieval
5. Add cross-encoder reranker for higher precision
6. Add eval suite for retrieval recall and groundedness
7. Add background queue for ingestion jobs

---

## 11) Quick sanity checklist

If RAG is not working as expected:

1. Run migration `001_rag_tables.sql`
2. Upload a document and wait until `status = ready`
3. Confirm chunks exist in `document_chunk`
4. Send chat query and verify assistant message has `metadata.sources`
5. Verify OpenRouter model + privacy settings if generation fails

---

## 12) File map

### Backend

- `routes/DocumentRoutes.js`
- `services/rag/Parser.js`
- `services/rag/Chunker.js`
- `services/rag/EmbeddingService.js`
- `services/rag/VectorStore.js`
- `services/rag/Reranker.js`
- `services/rag/IngestionPipeline.js`
- `services/ai/executor/steps/RetrievalStep.js`
- `services/ai/executor/chains/RAGChain.js`
- `services/ai/executor/chains/ChainRunner.js` (updated)
- `services/ChatService.js` (updated)
- `data/schemas/document.js`
- `data/schemas/document_chunk.js`
- `migrations/001_rag_tables.sql`

### Frontend

- `app/(dashboard)/documents/page.jsx`
- `lib/Services/DocumentService.js`
- `app/(dashboard)/chat/[session_id]/page.jsx` (citation UI)

