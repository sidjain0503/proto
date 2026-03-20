class Reranker {
  constructor({ weights = { vector: 0.7, keyword: 0.3 } } = {}) {
    this.weights = weights;
  }

  rerank(query, results, { topK = 5 } = {}) {
    const queryTerms = this._tokenize(query);

    const scored = results.map((result) => {
      const keywordScore = this._keywordScore(queryTerms, result.content);
      const combinedScore =
        result.score * this.weights.vector +
        keywordScore * this.weights.keyword;

      return {
        ...result,
        vectorScore: result.score,
        keywordScore,
        score: combinedScore,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }

  _keywordScore(queryTerms, text) {
    if (!queryTerms.length) return 0;
    const textLower = text.toLowerCase();
    const matches = queryTerms.filter((term) => textLower.includes(term));
    return matches.length / queryTerms.length;
  }

  _tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .split(/\s+/)
      .filter((t) => t.length > 2);
  }
}

module.exports = Reranker;
