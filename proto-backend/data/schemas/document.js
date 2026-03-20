module.exports = {
  $id: "document",
  type: "object",
  properties: {
    id: { type: "integer", minimum: 1 },
    user_id: { type: "integer", minimum: 1 },
    title: { type: "string", minLength: 1, maxLength: 255 },
    filename: { type: "string", minLength: 1, maxLength: 255 },
    file_path: { type: "string", minLength: 1, maxLength: 512 },
    mime_type: { type: ["string", "null"], maxLength: 100 },
    size_bytes: { type: ["integer", "null"], minimum: 0 },
    status: {
      type: "string",
      enum: ["pending", "processing", "ready", "failed"],
    },
    chunk_count: { type: "integer", minimum: 0 },
    error_message: { type: ["string", "null"] },
    created_at: { type: "string", format: "date-time" },
    updated_at: { type: "string", format: "date-time" },
  },
  required: ["user_id", "title", "filename", "file_path"],
  additionalProperties: false,
};
