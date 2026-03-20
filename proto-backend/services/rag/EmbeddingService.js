let pipeline = null;

async function getPipeline() {
  if (!pipeline) {
    const { pipeline: tfPipeline } = await import("@xenova/transformers");
    pipeline = await tfPipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
    console.log("[RAG] Embedding model loaded: all-MiniLM-L6-v2 (384d)");
  }
  return pipeline;
}

class EmbeddingService {
  constructor({ batchSize = 32 } = {}) {
    this.batchSize = batchSize;
  }

  async embed(text) {
    const extractor = await getPipeline();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  }

  async embedBatch(texts) {
    const extractor = await getPipeline();
    const allEmbeddings = [];

    for (let i = 0; i < texts.length; i += this.batchSize) {
      const batch = texts.slice(i, i + this.batchSize);
      const outputs = await extractor(batch, {
        pooling: "mean",
        normalize: true,
      });

      // outputs.data is a flat Float32Array; reshape to individual vectors
      const dim = 384;
      for (let j = 0; j < batch.length; j++) {
        const start = j * dim;
        allEmbeddings.push(Array.from(outputs.data.slice(start, start + dim)));
      }
    }

    return allEmbeddings;
  }
}

module.exports = EmbeddingService;
