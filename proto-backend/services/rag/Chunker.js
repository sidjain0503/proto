class Chunker {
  constructor({
    chunkSize = 512,
    chunkOverlap = 64,
    separators = ["\n\n", "\n", ". ", " ", ""],
  } = {}) {
    this.chunkSize = chunkSize;
    this.chunkOverlap = chunkOverlap;
    this.separators = separators;
  }

  chunk(text) {
    const rawChunks = this._recursiveSplit(text, this.separators);
    return this._mergeWithOverlap(rawChunks);
  }

  _recursiveSplit(text, separators) {
    if (text.length <= this.chunkSize) {
      return [text.trim()].filter(Boolean);
    }

    const sep = separators[0];
    const remaining = separators.slice(1);

    if (sep === "") {
      const chunks = [];
      for (let i = 0; i < text.length; i += this.chunkSize) {
        chunks.push(text.slice(i, i + this.chunkSize).trim());
      }
      return chunks.filter(Boolean);
    }

    const parts = text.split(sep);
    const chunks = [];
    let current = "";

    for (const part of parts) {
      const candidate = current ? current + sep + part : part;

      if (candidate.length <= this.chunkSize) {
        current = candidate;
      } else {
        if (current) chunks.push(current.trim());

        if (part.length > this.chunkSize && remaining.length > 0) {
          chunks.push(...this._recursiveSplit(part, remaining));
          current = "";
        } else {
          current = part;
        }
      }
    }

    if (current.trim()) {
      chunks.push(current.trim());
    }

    return chunks.filter(Boolean);
  }

  _mergeWithOverlap(chunks) {
    if (this.chunkOverlap === 0 || chunks.length <= 1) return chunks;

    const result = [];
    for (let i = 0; i < chunks.length; i++) {
      let chunk = chunks[i];

      if (i > 0) {
        const prevText = chunks[i - 1];
        const overlapText = prevText.slice(-this.chunkOverlap);
        chunk = overlapText + chunk;
      }

      result.push(chunk);
    }
    return result;
  }

  estimateTokenCount(text) {
    return Math.ceil(text.length / 4);
  }
}

module.exports = Chunker;
