const db = require("../../db");

class VectorStore {
  async store(documentId, chunks) {
    for (const chunk of chunks) {
      const sql = `
        INSERT INTO document_chunk (document_id, chunk_index, content, embedding, token_count, metadata)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.query(sql, [
        documentId,
        chunk.index,
        chunk.content,
        JSON.stringify(chunk.embedding),
        chunk.tokenCount || 0,
        JSON.stringify(chunk.metadata || {}),
      ]);
    }
  }

  async search(queryEmbedding, userId, { topK = 10, threshold = 0.3 } = {}) {
    const sql = `
      SELECT dc.id, dc.document_id, dc.chunk_index, dc.content, dc.embedding,
             dc.token_count, dc.metadata, d.title AS document_title, d.filename
      FROM document_chunk dc
      JOIN document d ON dc.document_id = d.id
      WHERE d.user_id = ? AND d.status = 'ready'
    `;
    const rows = await db.query(sql, [userId]);

    const scored = rows
      .map((row) => {
        const embedding = typeof row.embedding === "string"
          ? JSON.parse(row.embedding)
          : row.embedding;

        const score = this._cosineSimilarity(queryEmbedding, embedding);
        return {
          id: row.id,
          documentId: row.document_id,
          documentTitle: row.document_title,
          filename: row.filename,
          chunkIndex: row.chunk_index,
          content: row.content,
          tokenCount: row.token_count,
          metadata: typeof row.metadata === "string" ? JSON.parse(row.metadata) : row.metadata,
          score,
        };
      })
      .filter((r) => r.score >= threshold);

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  async getByDocument(documentId) {
    const sql = `SELECT id, chunk_index, content, token_count FROM document_chunk WHERE document_id = ? ORDER BY chunk_index`;
    return db.query(sql, [documentId]);
  }

  async deleteByDocument(documentId) {
    await db.query("DELETE FROM document_chunk WHERE document_id = ?", [documentId]);
  }

  _cosineSimilarity(a, b) {
    if (!a || !b || a.length !== b.length) return 0;

    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const denom = Math.sqrt(normA) * Math.sqrt(normB);
    return denom === 0 ? 0 : dot / denom;
  }
}

module.exports = VectorStore;
