const config = require("../../../config");

class LocalProvider {
  constructor({ model = "deepseek-r1:1.5b", baseURL = config.OLLAMA_BASE_URL } = {}) {
    this.model = model;
    this.baseURL = baseURL || "http://localhost:11434";
  }

  normalizeMessages(messages = []) {
    return messages
      .filter((message) => message && typeof message.content === "string")
      .map((message) => {
        const normalizedRole = String(message.role || "user").toLowerCase();
        if (normalizedRole === "system" || normalizedRole === "assistant" || normalizedRole === "user" || normalizedRole === "tool") {
          return { role: normalizedRole, content: message.content };
        }
        return { role: "user", content: message.content };
      });
  }

  mapUsageFromOllama(chunk) {
    const promptTokens = chunk?.prompt_eval_count || 0;
    const completionTokens = chunk?.eval_count || 0;
    return {
      prompt_tokens: promptTokens,
      completion_tokens: completionTokens,
      total_tokens: promptTokens + completionTokens,
    };
  }

  async generate({ messages, maxTokens = 512, temperature = 0.2 }) {
    const normalizedMessages = this.normalizeMessages(messages);

    const response = await fetch(`${this.baseURL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: normalizedMessages,
        stream: false,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown Ollama error");
      throw new Error(`Ollama API error: ${errorText}`);
    }

    const data = await response.json();
    return {
      text: data?.message?.content || "",
      usage: this.mapUsageFromOllama(data),
      model: data?.model || this.model,
      creditsUsed: 0,
    };
  }

  async stream({ messages, maxTokens = 512, temperature = 0.2 }, onToken) {
    const normalizedMessages = this.normalizeMessages(messages);

    const response = await fetch(`${this.baseURL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: normalizedMessages,
        stream: true,
        options: {
          temperature,
          num_predict: maxTokens,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown Ollama error");
      throw new Error(`Ollama API error: ${errorText}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let finalChunk = null;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (!trimmedLine) continue;

          let parsedChunk;
          try {
            parsedChunk = JSON.parse(trimmedLine);
          } catch {
            continue;
          }

          if (parsedChunk.message?.content) {
            onToken(parsedChunk.message.content);
          }

          if (parsedChunk.done) {
            finalChunk = parsedChunk;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    if (!finalChunk && buffer.trim()) {
      try {
        const parsedFinalChunk = JSON.parse(buffer.trim());
        if (parsedFinalChunk.done) {
          finalChunk = parsedFinalChunk;
        }
      } catch {
        // Ignore malformed trailing buffer.
      }
    }

    const usage = this.mapUsageFromOllama(finalChunk);
    return {
      provider: "local",
      model: finalChunk?.model || this.model,
      usage,
      creditsUsed: 0,
    };
  }
}

module.exports = LocalProvider;
