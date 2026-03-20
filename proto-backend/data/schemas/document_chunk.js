module.exports = {
  $id: "document_chunk",
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    document_id: { type: "integer", minimum: 1 },
    chunk_index: { type: "integer", minimum: 0 },
    content: { type: "string", minLength: 1 },
    embedding: { type: ["array", "null"], items: { type: "number" } },
    token_count: { type: "integer", minimum: 0 },
    metadata: { type: ["object", "null"] },
    created_at: { type: "string", format: "date-time" },
  },
  required: ["document_id", "chunk_index", "content"],
};
