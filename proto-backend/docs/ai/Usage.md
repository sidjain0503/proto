# AI Layer Usage Guide

This guide provides step-by-step instructions for using the Proto AI layer, adding new chains, tools, and extending the system.

## Table of Contents

1. [Overview](#overview)
2. [Quick Start](#quick-start)
3. [Using the AI Layer](#using-the-ai-layer)
4. [Adding New Chains](#adding-new-chains)
5. [Adding New Steps](#adding-new-steps)
6. [Adding New Providers](#adding-new-providers)
7. [Adding Tools (Future)](#adding-tools-future)
8. [Best Practices](#best-practices)

---

## Overview

The Proto AI layer is a modular, provider-agnostic system for orchestrating LLM interactions. It consists of:

- **LLM Compute Layer**: Provider abstraction (OpenAI, DeepSeek, etc.)
- **Execution Layer**: Chains that define control flow and reasoning
- **Steps**: Individual units of execution (LLM calls, validators, tools)
- **Context**: Runtime state passed through execution

```
┌─────────────────┐
│   Application   │
└────────┬────────┘
         │
┌────────▼────────┐
│     Chains      │  ← Execution Layer
│  (Control Flow) │
└────────┬────────┘
         │
┌────────▼────────┐
│     Steps       │  ← Individual Operations
│  (LLM, Tools)   │
└────────┬────────┘
         │
┌────────▼────────┐
│   Adapter/      │  ← Compute Layer
│   Providers     │
└─────────────────┘
```

---

## Quick Start

### Basic Usage (Simple Chat)

The simplest way to use the AI layer is through the existing route:

```javascript
// POST /ai/chat
{
  "prompt": "Hello, how are you?",
  "options": {
    "temperature": 0.7,
    "maxTokens": 512
  }
}
```

This uses `AIServiceModule` which handles streaming responses automatically.

### Using Chains (Advanced)

For more control, use the chain-based approach:

```javascript
const ExecutionContext = require("./services/ai/executor/aicontext/executionContext");
const BasicChatChain = require("./services/ai/executor/chains/basicChain");
const ChainRunner = require("./services/ai/executor/chains/chainRunner");

// Create execution context
const ctx = new ExecutionContext({
  userId: req.user.id,
  messages: req.body.messages, // Array of { role, content }
  provider: "deepseek",
  providerOpts: {
    model: "deepseek/deepseek-r1-0528:free",
  },
});

// Create and run chain
const chain = new BasicChatChain({
  stream: true,
  res: res, // Express response object for streaming
});

const runner = new ChainRunner();
await runner.run(chain, ctx);
```

---

## Using the AI Layer

### Step 1: Choose Your Approach

**Option A: Simple Service (AIServiceModule)**
- Use for straightforward chat interactions
- Handles streaming automatically
- Good for: Simple Q&A, chat interfaces

**Option B: Chains (Execution Layer)**
- Use for complex workflows
- Full control over execution flow
- Good for: Multi-step reasoning, tool usage, validation

### Step 2: Set Up Execution Context

The `ExecutionContext` holds all runtime state:

```javascript
const ctx = new ExecutionContext({
  userId: "user123",              // Optional: for usage tracking
  messages: [                      // Conversation history
    { role: "user", content: "Hello" }
  ],
  provider: "deepseek",           // Provider name from registry
  providerOpts: {                 // Provider-specific options
    model: "deepseek/deepseek-r1-0528:free",
  },
});
```

**Context Properties:**
- `messages`: Array of conversation messages
- `userId`: For usage tracking
- `provider`: Provider name (must exist in `model_registry`)
- `providerOpts`: Model-specific configuration
- `steps`: Array of executed steps (populated during execution)
- `usage`: Aggregated token usage

### Step 3: Create or Select a Chain

**Using Existing Chain:**
```javascript
const chain = new BasicChatChain({
  stream: true,  // Enable streaming
  res: res,      // Express response for streaming
});
```

**Creating Custom Chain:** (See [Adding New Chains](#adding-new-chains))

### Step 4: Run the Chain

```javascript
const runner = new ChainRunner();
const result = await runner.run(chain, ctx);

// Result contains:
// {
//   output: "Final response text",
//   context: ctx (with updated state)
// }
```

### Step 5: Handle Response

**For Streaming:**
- Response is automatically streamed to `res` object
- No return value needed

**For Non-Streaming:**
```javascript
const result = await runner.run(chain, ctx);
res.json({ 
  response: result.output,
  usage: result.context.usage 
});
```

---

## Adding New Chains

Chains define the execution flow. Here's how to create a new chain:

### Step 1: Create Chain File

Create a new file in `services/ai/executor/chains/`:

```javascript
// services/ai/executor/chains/myCustomChain.js
const LLMStep = require("../steps/llmSteps");
const StreamingLLMStep = require("../steps/streamingLLMStep");

class MyCustomChain {
  constructor({ stream = false, res = null, customParam = null } = {}) {
    this.stream = stream;
    this.res = res;
    this.customParam = customParam;
    this.stepCount = 0;
  }

  // Initialize the chain (called once at start)
  init(ctx) {
    // Add system prompt if needed
    if (!ctx.messages.some(m => m.role === "system")) {
      ctx.addMessage(
        "system",
        "You are a specialized assistant for [your purpose]."
      );
    }

    // Set up any initial state
    this.stepCount = 0;
  }

  // Determine the next step to execute
  nextStep(ctx) {
    this.stepCount++;

    // Example: Multi-step chain
    if (this.stepCount === 1) {
      // First step: Initial LLM call
      if (this.stream) {
        return new StreamingLLMStep({ res: this.res });
      }
      return new LLMStep();
    }

    if (this.stepCount === 2) {
      // Second step: Could be validation, tool call, etc.
      // For now, return another LLM step
      return new LLMStep();
    }

    // No more steps
    return null;
  }

  // Determine if chain should terminate
  shouldTerminate(ctx) {
    // Terminate after 2 steps in this example
    return this.stepCount >= 2;
  }
}

module.exports = MyCustomChain;
```

### Step 2: Update ChainRunner (if needed)

The current `ChainRunner` supports single-step chains. For multi-step chains, you'll need to enhance it:

```javascript
// Enhanced ChainRunner for multi-step chains
class ChainRunner {
  async run(chain, ctx) {
    chain.init(ctx);

    while (!chain.shouldTerminate(ctx)) {
      const step = chain.nextStep(ctx);
      
      if (!step) {
        throw new Error("Chain returned no step but should not terminate");
      }

      const result = await step.execute(ctx);

      // Handle step results
      if (result.type === "error") {
        throw new Error(result.error);
      }

      // If step indicates termination, break
      if (result.type === "final") {
        return {
          output: result.output,
          context: ctx,
        };
      }
    }

    // Chain terminated without final output
    throw new Error("Chain ended without final output");
  }
}
```

### Step 3: Use Your Chain

```javascript
const MyCustomChain = require("./services/ai/executor/chains/myCustomChain");

const chain = new MyCustomChain({
  stream: false,
  customParam: "value",
});

const runner = new ChainRunner();
const result = await runner.run(chain, ctx);
```

### Chain Examples

**Example 1: Validation Chain**
```javascript
class ValidatedChatChain {
  constructor({ stream = false, res = null } = {}) {
    this.stream = stream;
    this.res = res;
    this.validated = false;
  }

  init(ctx) {
    ctx.addMessage("system", "You are a helpful assistant.");
  }

  nextStep(ctx) {
    if (!this.validated) {
      // First: Generate response
      return this.stream 
        ? new StreamingLLMStep({ res: this.res })
        : new LLMStep();
    } else {
      // Second: Validate (custom step - see next section)
      return new ValidationStep();
    }
  }

  shouldTerminate(ctx) {
    return this.validated;
  }
}
```

**Example 2: ReAct-Style Chain (Tool Usage)**
```javascript
class ReActChain {
  constructor({ stream = false, res = null, maxIterations = 5 } = {}) {
    this.stream = stream;
    this.res = res;
    this.maxIterations = maxIterations;
    this.iteration = 0;
    this.finished = false;
  }

  init(ctx) {
    ctx.addMessage("system", 
      "You are a reasoning agent. Think step by step, then decide on an action."
    );
  }

  nextStep(ctx) {
    this.iteration++;

    if (this.finished) {
      return null; // Chain complete
    }

    // Alternate between thinking and acting
    if (this.iteration % 2 === 1) {
      // Odd: LLM reasoning step
      return this.stream 
        ? new StreamingLLMStep({ res: this.res })
        : new LLMStep();
    } else {
      // Even: Tool execution step (when implemented)
      return new ToolExecutionStep();
    }
  }

  shouldTerminate(ctx) {
    return this.finished || this.iteration >= this.maxIterations * 2;
  }
}
```

---

## Adding New Steps

Steps are the atomic units of execution. Here's how to create custom steps:

### Step 1: Create Step File

Create a new file in `services/ai/executor/steps/`:

```javascript
// services/ai/executor/steps/validationStep.js

class ValidationStep {
  async execute(ctx) {
    // Get the last assistant message
    const lastMessage = ctx.messages
      .filter(m => m.role === "assistant")
      .pop();

    if (!lastMessage) {
      return {
        type: "error",
        error: "No assistant message to validate",
      };
    }

    // Perform validation logic
    const isValid = this.validateResponse(lastMessage.content);

    if (!isValid) {
      // Add feedback to context
      ctx.addMessage("user", 
        "Your previous response was invalid. Please try again."
      );
      
      return {
        type: "continue", // Signal chain to continue
      };
    }

    // Validation passed
    ctx.steps.push({
      type: "validation",
      status: "passed",
      timestamp: Date.now(),
    });

    return {
      type: "final",
      output: lastMessage.content,
    };
  }

  validateResponse(content) {
    // Your validation logic here
    // Example: Check length, format, etc.
    return content.length > 10 && content.includes("answer");
  }
}

module.exports = ValidationStep;
```

### Step 2: Use Your Step in a Chain

```javascript
const ValidationStep = require("../steps/validationStep");

class MyChain {
  nextStep(ctx) {
    if (this.needsValidation) {
      return new ValidationStep();
    }
    return new LLMStep();
  }
}
```

### Step Types

Steps should return one of these result types:

- `{ type: "final", output: "..." }` - Chain complete, return output
- `{ type: "continue" }` - Continue to next step
- `{ type: "error", error: "..." }` - Error occurred, stop chain

### Step Examples

**Example: Conditional Step**
```javascript
class ConditionalStep {
  constructor({ condition, trueStep, falseStep }) {
    this.condition = condition;
    this.trueStep = trueStep;
    this.falseStep = falseStep;
  }

  async execute(ctx) {
    const shouldBranch = await this.condition(ctx);
    const nextStep = shouldBranch ? this.trueStep : this.falseStep;
    
    return {
      type: "continue",
      nextStep: nextStep, // Chain runner would use this
    };
  }
}
```

**Example: Retry Step**
```javascript
class RetryStep {
  constructor({ maxRetries = 3, step }) {
    this.maxRetries = maxRetries;
    this.step = step;
    this.attempts = 0;
  }

  async execute(ctx) {
    this.attempts++;
    
    try {
      const result = await this.step.execute(ctx);
      
      if (result.type === "error" && this.attempts < this.maxRetries) {
        // Retry
        return this.execute(ctx);
      }
      
      return result;
    } catch (error) {
      if (this.attempts < this.maxRetries) {
        return this.execute(ctx);
      }
      throw error;
    }
  }
}
```

---

## Adding New Providers

To add support for a new LLM provider:

### Step 1: Create Provider File

Create a new file in `services/ai/providers/`:

```javascript
// services/ai/providers/AnthropicProvider.js
const config = require("../../../config");

class AnthropicProvider {
  constructor({ model = "claude-3-5-sonnet-20241022" } = {}) {
    this.model = model;
    this.apiKey = config.ANTHROPIC_API_KEY;
    this.baseURL = config.ANTHROPIC_BASE_URL || "https://api.anthropic.com";
  }

  async generate({ messages, maxTokens = 512, temperature = 0.2 }) {
    const response = await fetch(`${this.baseURL}/v1/messages`, {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: this.normalizeMessages(messages),
        max_tokens: maxTokens,
        temperature,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(`Anthropic API error: ${JSON.stringify(error)}`);
    }

    const res = await response.json();
    
    return {
      text: res.content[0].text || "",
      usage: {
        input_tokens: res.usage.input_tokens,
        output_tokens: res.usage.output_tokens,
        total_tokens: res.usage.input_tokens + res.usage.output_tokens,
      },
      model: this.model,
    };
  }

  async stream({ messages, temperature = 0.2 }, onToken) {
    const response = await fetch(`${this.baseURL}/v1/messages`, {
      method: "POST",
      headers: {
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: this.normalizeMessages(messages),
        max_tokens: 4096,
        temperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(`Anthropic API error: ${JSON.stringify(error)}`);
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
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          
          const data = line.slice(6).trim();
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            const token = parsed.delta?.text;
            if (token) {
              onToken(token);
            }
          } catch {
            // Ignore malformed chunks
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return {
      provider: "anthropic",
      model: this.model,
      usage: {}, // Extract from final chunk if available
    };
  }

  normalizeMessages(messages) {
    // Convert OpenAI format to Anthropic format if needed
    return messages.map(msg => ({
      role: msg.role === "assistant" ? "assistant" : "user",
      content: msg.content,
    }));
  }
}

module.exports = AnthropicProvider;
```

### Step 2: Register Provider

Add to `services/ai/model_registry.js`:

```javascript
const OpenAIProvider = require("./providers/OpenAIProvider");
const DeepSeekProvider = require("./providers/DeepSeekProvider");
const AnthropicProvider = require("./providers/AnthropicProvider");

const model_registry = {
  openai: (opts = {}) => new OpenAIProvider(opts),
  deepseek: (opts = {}) => new DeepSeekProvider(opts),
  anthropic: (opts = {}) => new AnthropicProvider(opts), // 👈 New provider
};

module.exports = {
  model_registry
};
```

### Step 3: Use New Provider

```javascript
const ctx = new ExecutionContext({
  provider: "anthropic", // 👈 Use new provider
  providerOpts: {
    model: "claude-3-5-sonnet-20241022",
  },
  // ... other options
});
```

---

## Adding Tools (Future)

Tools enable the AI to perform actions and access external resources. Here's the planned structure:

### Step 1: Create Tool Definition

```javascript
// services/ai/tools/searchTool.js

class SearchTool {
  constructor() {
    this.name = "search";
    this.description = "Search the web for information";
    this.parameters = {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "The search query",
        },
      },
      required: ["query"],
    };
  }

  async execute({ query }) {
    // Tool implementation
    const results = await performSearch(query);
    return {
      success: true,
      results: results,
    };
  }
}

module.exports = SearchTool;
```

### Step 2: Register Tool

```javascript
// services/ai/tools/index.js
const SearchTool = require("./searchTool");
const DatabaseTool = require("./databaseTool");

const toolRegistry = {
  search: new SearchTool(),
  database: new DatabaseTool(),
};

module.exports = { toolRegistry };
```

### Step 3: Create Tool Execution Step

```javascript
// services/ai/executor/steps/toolStep.js

const { toolRegistry } = require("../../tools");

class ToolStep {
  constructor({ toolName, toolArgs }) {
    this.toolName = toolName;
    this.toolArgs = toolArgs;
  }

  async execute(ctx) {
    const tool = toolRegistry[this.toolName];
    
    if (!tool) {
      return {
        type: "error",
        error: `Tool ${this.toolName} not found`,
      };
    }

    const result = await tool.execute(this.toolArgs);

    // Add tool result to context
    ctx.addMessage("tool", JSON.stringify(result));
    ctx.steps.push({
      type: "tool",
      tool: this.toolName,
      result: result,
      timestamp: Date.now(),
    });

    return {
      type: "continue",
    };
  }
}

module.exports = ToolStep;
```

### Step 4: Use Tools in Chains

```javascript
class ToolUsingChain {
  nextStep(ctx) {
    // Parse LLM output to determine if tool is needed
    const lastMessage = ctx.messages
      .filter(m => m.role === "assistant")
      .pop();

    if (this.needsTool(lastMessage)) {
      const { toolName, toolArgs } = this.parseToolCall(lastMessage);
      return new ToolStep({ toolName, toolArgs });
    }

    return new LLMStep();
  }
}
```

---

## Best Practices

### 1. Context Management

- Always initialize context with proper `userId` for usage tracking
- Use `ctx.addMessage()` to modify conversation state
- Access `ctx.steps` for execution history
- Check `ctx.usage` for token/cost tracking

### 2. Error Handling

```javascript
try {
  const result = await runner.run(chain, ctx);
  // Handle success
} catch (error) {
  // Log error with context
  logger.error("Chain execution failed", {
    error: error.message,
    userId: ctx.userId,
    steps: ctx.steps,
  });
  // Return appropriate error response
}
```

### 3. Streaming vs Non-Streaming

- **Use streaming** for: User-facing chat, long responses, real-time feedback
- **Use non-streaming** for: Background processing, batch operations, when you need the full response before proceeding

### 4. Provider Selection

- Use environment variables or config for provider selection
- Consider cost, latency, and capability when choosing providers
- Allow runtime provider switching for A/B testing

### 5. Testing Chains

- Test chains independently of LLM calls (mock steps)
- Use deterministic steps for validation
- Test termination conditions thoroughly
- Verify context state transitions

### 6. Usage Tracking

Always track usage for:
- Cost analysis
- Rate limiting
- Model comparison
- Debugging

```javascript
// Usage is automatically tracked in ExecutionContext
// Access via:
ctx.usage.model
ctx.usage.tokens
ctx.totalTokens
ctx.totalCost
```

### 7. Chain Design

- Keep chains focused on a single purpose
- Make termination conditions explicit
- Design for observability (log steps, context state)
- Consider retry logic for transient failures
- Set reasonable limits (max steps, token budgets)

---

## Common Patterns

### Pattern 1: Simple Chat

```javascript
const chain = new BasicChatChain({ stream: true, res });
const runner = new ChainRunner();
await runner.run(chain, ctx);
```

### Pattern 2: Multi-Step Reasoning

```javascript
class ReasoningChain {
  nextStep(ctx) {
    if (this.stepCount === 0) return new LLMStep(); // Think
    if (this.stepCount === 1) return new LLMStep(); // Refine
    return null; // Done
  }
}
```

### Pattern 3: Conditional Flow

```javascript
class ConditionalChain {
  nextStep(ctx) {
    const condition = this.evaluateCondition(ctx);
    return condition 
      ? new PathAStep()
      : new PathBStep();
  }
}
```

### Pattern 4: Retry on Failure

```javascript
class RetryChain {
  nextStep(ctx) {
    if (this.attempts < this.maxRetries) {
      return new LLMStep();
    }
    return null; // Give up
  }
}
```

---

## Troubleshooting

### Issue: Chain doesn't terminate

**Solution:** Ensure `shouldTerminate()` returns `true` eventually, or enhance `ChainRunner` to check termination after each step.

### Issue: Context state not persisting

**Solution:** Context is request-scoped. If you need persistence, save `ctx.messages` or `ctx.steps` to database after execution.

### Issue: Provider not found

**Solution:** Ensure provider is registered in `model_registry.js` and name matches exactly (case-sensitive).

### Issue: Streaming not working

**Solution:** 
- Ensure `res` object is passed to chain constructor
- Check that response headers are set before streaming starts
- Verify provider's `stream()` method is implemented correctly

### Issue: Usage not tracked

**Solution:** 
- Ensure `userId` is set in `ExecutionContext`
- Check that steps call `ctx.recordLLMUsage()`
- Verify provider returns usage information

---

## Next Steps

1. **Explore existing chains**: Study `BasicChatChain` as a reference
2. **Create custom chains**: Start with simple chains, then add complexity
3. **Add tools**: Implement tool system when needed
4. **Monitor usage**: Use `ctx.usage` for analytics
5. **Extend providers**: Add support for new LLM providers as needed

For architecture details, see [Readme.md](./Readme.md) and [Chains.md](./Chains.md).

