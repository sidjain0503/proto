const config = require("../../../config");

class OpenRouterProvider {
  constructor({ 
    model = "",
    appName = "Proto AI"
  } = {}) {
    this.model = model;
    this.apiKey = config.OPENROUTER_API_KEY;
    this.baseURL = config.OPENROUTER_BASE_URL;
    this.appName = appName;
  }

  estimatePromptTokens(messages) {
    return Math.ceil(
      messages.reduce((acc, m) => acc + (m.content?.length || 0), 0) / 4
    );
  }
  
  calculateCredits(totalTokens) {
    // placeholder pricing
    return totalTokens * 0.000001;
  }

  async generate({ messages, maxTokens = 512, temperature = 0.2 }) {
    if (!this.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "X-Title": this.appName,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(`OpenRouter API error: ${JSON.stringify(error)}`);
    }

    const res = await response.json();
    return {
      text: res.choices?.[0]?.message?.content || "",
      usage: res.usage,
      model: this.model,
    };
  }

  async stream({ messages, temperature = 0.2 }, onToken) {
    if (!this.apiKey) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }
  
    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "X-Title": this.appName,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages,
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(`OpenRouter API error: ${JSON.stringify(error)}`);
    }
  
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
  
    let buffer = "";
    let completionTokens = 0;
    let usageFromProvider = null;
  
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
  
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
  
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
  
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;
  
          try {
            const parsed = JSON.parse(data);
  
            // token streaming
            const token = parsed.choices?.[0]?.delta?.content;
            if (token) {
              completionTokens++;
              onToken(token);
            }
  
            // OpenRouter sometimes sends usage at the end
            if (parsed.usage) {
              usageFromProvider = parsed.usage;
            }
          } catch {
            // ignore malformed chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  
    const promptTokens =
      usageFromProvider?.prompt_tokens ??
      this.estimatePromptTokens(messages); // fallback
  
    const totalTokens =
      usageFromProvider?.total_tokens ??
      promptTokens + completionTokens;
  
      const usage = {
        prompt_tokens: promptTokens,
        completion_tokens: completionTokens,
        total_tokens: totalTokens,
      };
    
      return {
        provider: "deepseek",
        model: this.model,
        usage,
        creditsUsed: this.calculateCredits(totalTokens),
      };
  }
  
}

module.exports = OpenRouterProvider;

