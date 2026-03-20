const EmbeddingService = require("../../../rag/EmbeddingService");
const VectorStore = require("../../../rag/VectorStore");
const Reranker = require("../../../rag/Reranker");

class RetrievalStep {
  constructor({ topK = 5, threshold = 0.3 } = {}) {
    this.topK = topK;
    this.threshold = threshold;
    this.embeddingService = new EmbeddingService();
    this.vectorStore = new VectorStore();
    this.reranker = new Reranker();
  }

  async execute(ctx) {
    const lastUserMsg = [...ctx.messages]
      .reverse()
      .find((m) => m.role === "user");

    if (!lastUserMsg) {
      ctx.retrievalResults = [];
      return { type: "continue" };
    }

    const query = lastUserMsg.content;
    console.log("[RAG] RetrievalStep: embedding query...");

    const queryEmbedding = await this.embeddingService.embed(query);

    const searchResults = await this.vectorStore.search(
      queryEmbedding,
      ctx.userId,
      { topK: this.topK * 2, threshold: this.threshold }
    );

    const reranked = this.reranker.rerank(query, searchResults, {
      topK: this.topK,
    });

    ctx.retrievalResults = reranked;

    if (reranked.length > 0) {
      const contextBlock = reranked
        .map(
          (r, i) =>
            `[Source ${i + 1}: ${r.documentTitle} (chunk ${r.chunkIndex + 1})] Score: ${r.score.toFixed(3)}\n${r.content}`
        )
        .join("\n\n---\n\n");

      const ragSystemPrompt =
        `You are a helpful assistant with access to the user's uploaded documents.\n` +
        `Use the following retrieved context to answer the user's question. ` +
        `If the context is relevant, cite which source you used. ` +
        `If the context doesn't help, say so and answer from your own knowledge.\n\n` +
        `--- RETRIEVED CONTEXT ---\n${contextBlock}\n--- END CONTEXT ---`;

      const sysIdx = ctx.messages.findIndex((m) => m.role === "system");
      if (sysIdx >= 0) {
        ctx.messages[sysIdx].content = ragSystemPrompt;
      } else {
        ctx.messages.unshift({ role: "system", content: ragSystemPrompt });
      }

      console.log(
        `[RAG] RetrievalStep: injected ${reranked.length} chunks into context`
      );
    } else {
      console.log("[RAG] RetrievalStep: no relevant chunks found");
    }

    ctx.steps.push({
      type: "retrieval",
      chunksRetrieved: reranked.length,
      topScore: reranked[0]?.score || 0,
      timestamp: Date.now(),
    });

    return { type: "continue" };
  }
}

module.exports = RetrievalStep;
