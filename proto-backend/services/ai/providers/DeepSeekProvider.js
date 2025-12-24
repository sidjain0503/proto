const config = require("../../../config");

class DeepSeekProvider {
  constructor({ 
    model = "",
    appName = "Proto AI"
  } = {}) {
    console.log('deepseek model', model)
    this.model = model;
    this.apiKey = config.OPENROUTER_API_KEY;
    this.baseURL = config.OPENROUTER_BASE_URL;
    this.appName = appName;
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

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim() === "") continue;
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") {
              return;
            }
            try {
              const parsed = JSON.parse(data);
              const token = parsed.choices?.[0]?.delta?.content || "";
              if (token) onToken(token);
            } catch (e) {
              // Skip invalid JSON lines
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
}

module.exports = DeepSeekProvider;

