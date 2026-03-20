const Parser = require("./Parser");
const Chunker = require("./Chunker");
const EmbeddingService = require("./EmbeddingService");
const VectorStore = require("./VectorStore");
const { updateModel } = require("../../data/operations/update");

class IngestionPipeline {
  constructor({ chunkSize = 512, chunkOverlap = 64 } = {}) {
    this.parser = new Parser();
    this.chunker = new Chunker({ chunkSize, chunkOverlap });
    this.embeddingService = new EmbeddingService();
    this.vectorStore = new VectorStore();
  }

  async ingest(document) {
    const { id: documentId, file_path, mime_type } = document;

    try {
      await updateModel("document", { status: "processing" }, documentId);

      const { text, metadata: parseMetadata } = await this.parser.parse(
        file_path,
        mime_type
      );

      if (!text || !text.trim()) {
        throw new Error("Document contains no extractable text");
      }

      const chunks = this.chunker.chunk(text);

      if (chunks.length === 0) {
        throw new Error("Chunking produced no output");
      }

      console.log(
        `[RAG] Document ${documentId}: parsed ${text.length} chars → ${chunks.length} chunks`
      );

      const embeddings = await this.embeddingService.embedBatch(chunks);

      const chunkRecords = chunks.map((content, index) => ({
        index,
        content,
        embedding: embeddings[index],
        tokenCount: this.chunker.estimateTokenCount(content),
        metadata: {
          ...parseMetadata,
          chunkIndex: index,
          totalChunks: chunks.length,
        },
      }));

      await this.vectorStore.store(documentId, chunkRecords);

      await updateModel(
        "document",
        { status: "ready", chunk_count: chunks.length },
        documentId
      );

      console.log(
        `[RAG] Document ${documentId}: ingestion complete (${chunks.length} chunks embedded)`
      );

      return { chunkCount: chunks.length, status: "ready" };
    } catch (error) {
      console.error(`[RAG] Ingestion failed for document ${documentId}:`, error.message);

      await updateModel(
        "document",
        { status: "failed", error_message: error.message },
        documentId
      ).catch(() => {});

      throw error;
    }
  }
}

module.exports = IngestionPipeline;
