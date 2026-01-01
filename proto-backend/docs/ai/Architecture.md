## Architecture & Flow

### 🏗️ Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT / FRONTEND                              │
│                    (Browser, Mobile App, API Client)                      │
└───────────────────────────────┬─────────────────────────────────────────┘
                                 │
                                 │ HTTP Request
                                 │ POST /ai/chat or /ai/generate
                                 │ { prompt: "Hello", messages: [...] }
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         ROUTE LAYER (Express)                            │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │  AIRoutes.js                                                     │   │
│  │  - Validates authentication                                      │   │
│  │  - Extracts user info from request                               │   │
│  │  - Calls AIService or Chain-based service                        │   │
│  └───────────────────────┬──────────────────────────────────────────┘   │
└──────────────────────────┼───────────────────────────────────────────────┘
                           │
                           │ Two Paths:
                           │
        ┌──────────────────┴──────────────────┐
        │                                      │
        ▼                                      ▼
┌───────────────────────┐          ┌──────────────────────────────┐
│   PATH 1: Simple      │          │   PATH 2: Chain-Based        │
│   AIServiceModule     │          │   (Advanced/Complex)          │
│                       │          │                              │
│  AIServiceModule.js   │          │  AIService.js (runChat)      │
│  - Preprocess prompt  │          │  - Creates ExecutionContext │
│  - Build messages     │          │  - Creates Chain            │
│  - Call Adapter       │          │  - Runs ChainRunner         │
│  - Stream response    │          │                              │
│  - Track usage        │          │                              │
└───────────┬───────────┘          └──────────────┬───────────────┘
            │                                     │
            │                                     │
            └──────────────┬──────────────────────┘
                           │
                           ▼
        ┌──────────────────────────────────────┐
        │      EXECUTION LAYER (Chains)         │
        │  ┌────────────────────────────────┐   │
        │  │  ChainRunner                   │   │
        │  │  - Orchestrates execution      │   │
        │  │  - Calls chain.init()          │   │
        │  │  - Loops: chain.nextStep()     │   │
        │  │  - Executes steps              │   │
        │  │  - Checks termination          │   │
        │  └───────────┬────────────────────┘   │
        │              │                         │
        │              ▼                         │
        │  ┌────────────────────────────────┐   │
        │  │  Chain (e.g., BasicChatChain)  │   │
        │  │  - init(ctx): Setup            │   │
        │  │  - nextStep(): Returns step    │   │
        │  │  - shouldTerminate(): Check    │   │
        │  └───────────┬────────────────────┘   │
        │              │                         │
        │              ▼                         │
        │  ┌────────────────────────────────┐   │
        │  │  ExecutionContext              │   │
        │  │  - messages: Conversation      │   │
        │  │  - userId: For tracking        │   │
        │  │  - provider: "deepseek"        │   │
        │  │  - steps: Execution history    │   │
        │  │  - usage: Token tracking       │   │
        │  └───────────┬────────────────────┘   │
        └──────────────┼─────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │         STEP LAYER                    │
        │  ┌────────────────────────────────┐   │
        │  │  Steps (e.g., LLMStep)        │   │
        │  │  - execute(ctx): Runs logic   │   │
        │  │  - Returns result             │   │
        │  │  - Updates context            │   │
        │  └───────────┬────────────────────┘   │
        │              │                         │
        │  Available Steps:                      │
        │  - LLMStep: Non-streaming LLM call     │
        │  - StreamingLLMStep: Streaming call    │
        │  - ValidationStep: Validates output    │
        │  - ToolStep: Executes tools (future)   │
        └──────────────┼─────────────────────────┘
                       │
                       ▼
        ┌──────────────────────────────────────┐
        │      COMPUTE LAYER (LLM)              │
        │  ┌────────────────────────────────┐   │
        │  │  Adapter                       │   │
        │  │  - Normalizes provider APIs    │   │
        │  │  - generate(): Non-streaming   │   │
        │  │  - stream(): Streaming         │   │
        │  │  - Returns uniform format      │   │
        │  └───────────┬────────────────────┘   │
        │              │                         │
        │              ▼                         │
        │  ┌────────────────────────────────┐   │
        │  │  Model Registry                │   │
        │  │  - Maps provider names         │   │
        │  │  - Returns provider instance   │   │
        │  └───────────┬────────────────────┘   │
        │              │                         │
        │              ▼                         │
        │  ┌────────────────────────────────┐   │
        │  │  Providers                     │   │
        │  │  ┌──────────┐  ┌──────────┐   │   │
        │  │  │ DeepSeek │  │ OpenAI   │   │   │
        │  │  │ Provider │  │ Provider │   │   │
        │  │  └────┬─────┘  └────┬─────┘   │   │
        │  │       │              │         │   │
        │  │       └──────┬───────┘         │   │
        │  │              │                 │   │
        │  │              ▼                 │   │
        │  │    (More providers...)         │   │
        │  └──────────────┬─────────────────┘   │
        └─────────────────┼─────────────────────┘
                          │
                          ▼
        ┌──────────────────────────────────────┐
        │      EXTERNAL LLM APIs               │
        │  ┌──────────┐      ┌──────────┐     │
        │  │ DeepSeek │      │ OpenAI   │     │
        │  │ API      │      │ API      │     │
        │  └──────────┘      └──────────┘     │
        │                                     │
        │  (HTTP/HTTPS Requests)              │
        └──────────────────────────────────────┘
                          │
                          │ Response
                          ▼
        ┌──────────────────────────────────────┐
        │      USAGE TRACKING                   │
        │  ┌────────────────────────────────┐   │
        │  │  Database (ai_usage table)     │   │
        │  │  - user_id                      │   │
        │  │  - model                        │   │
        │  │  - tokens_used                  │   │
        │  │  - credits_used                 │   │
        │  └────────────────────────────────┘   │
        └──────────────────────────────────────┘
                          │
                          │ Response flows back
                          ▼
        ┌──────────────────────────────────────┐
        │      CLIENT RECEIVES RESPONSE        │
        │  - Streaming: Token by token         │
        │  - Non-streaming: Complete response  │
        └──────────────────────────────────────┘
```

### 📖 Understanding the Flow: A Simple Analogy

Think of the AI layer like ordering food at a restaurant:

1. **Client** = You (the customer)
2. **Route** = Waiter (takes your order, validates it)
3. **AIService/Chain** = Chef (decides how to prepare your meal)
4. **Steps** = Cooking steps (chop, cook, plate)
5. **Adapter** = Kitchen manager (ensures consistent quality)
6. **Provider** = Different ingredient suppliers (OpenAI, DeepSeek)
7. **External APIs** = The actual suppliers' warehouses
8. **Usage Tracking** = Receipt (tracks what was used)

### 🔄 Step-by-Step Flow Explanation

#### **Scenario: User sends "Hello, how are you?"**

#### **Step 1: Request Arrives** 
```
Client → POST /ai/chat
Body: { prompt: "Hello, how are you?" }
Headers: { Authorization: "Bearer token..." }
```

**What happens:**
- Express receives the HTTP request
- Route handler (`AIRoutes.js`) validates authentication
- Extracts user ID from the token
- Determines which path to use (Simple or Chain-based)

---

#### **Step 2A: Simple Path (AIServiceModule)**

```
AIRoutes.js → AIServiceModule.streamResponse()
```

**Inside AIServiceModule:**
```javascript
1. Preprocess prompt: "Hello, how are you?" → cleaned
2. Build messages: [{ role: "user", content: "Hello, how are you?" }]
3. Create Adapter with provider "deepseek"
4. Call adapter.stream() with messages
5. Stream tokens back to client as they arrive
6. Track usage in database
```

**Visual Flow:**
```
AIServiceModule
    ↓
Adapter (creates DeepSeekProvider)
    ↓
DeepSeekProvider.stream()
    ↓
HTTP Request to OpenRouter API
    ↓
Stream tokens back → Client
    ↓
Save usage to database
```

---

#### **Step 2B: Chain-Based Path (Advanced)**

```
AIRoutes.js → AIService.runChat()
```

**Step 2.1: Create Execution Context**
```javascript
const ctx = new ExecutionContext({
  userId: req.user.id,           // "user123"
  messages: req.body.messages,    // [{ role: "user", content: "Hello..." }]
  provider: "deepseek",          // Which LLM to use
  providerOpts: {                // Model-specific settings
    model: "deepseek/deepseek-r1-0528:free"
  }
});
```

**What's in the context?**
- `messages`: The conversation so far
- `userId`: For tracking who used it
- `provider`: Which LLM provider to use
- `steps`: Will be filled with execution history
- `usage`: Will track tokens used

---

**Step 2.2: Create Chain**
```javascript
const chain = new BasicChatChain({
  stream: true,  // Enable streaming
  res: res       // Express response object
});
```

**What the chain does:**
- Defines the "recipe" for how to process the request
- `BasicChatChain` = Simple one-step chain (just call LLM once)

---

**Step 2.3: Run Chain**
```javascript
const runner = new ChainRunner();
await runner.run(chain, ctx);
```

**Inside ChainRunner.run():**

```javascript
// 1. Initialize chain
chain.init(ctx);
// Adds system message if not present:
// "You are a helpful assistant. Answer clearly and concisely."

// 2. Get first step
const step = chain.nextStep(ctx);
// Returns: new StreamingLLMStep({ res: res })

// 3. Execute the step
const result = await step.execute(ctx);
```

---

**Step 2.4: Execute Step (StreamingLLMStep)**

**Inside StreamingLLMStep.execute():**

```javascript
// 1. Create adapter
const adapter = new Adapter(ctx.provider, ctx.providerOpts);
// Adapter looks up "deepseek" in model_registry
// Returns: new DeepSeekProvider({ model: "..." })

// 2. Call adapter.stream()
await adapter.stream(
  { messages: ctx.messages },
  (token) => {
    // For each token received:
    fullText += token;
    res.write(token);  // Send to client immediately
  }
);

// 3. Update context
ctx.addMessage("assistant", fullText);
ctx.recordLLMUsage({
  model: result.model,
  usage: result.usage
});

// 4. Return result
return {
  type: "final",
  output: fullText
};
```

---

**Step 2.5: Provider Makes API Call**

**Inside DeepSeekProvider.stream():**

```javascript
// 1. Prepare HTTP request
fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer API_KEY",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    model: "deepseek/deepseek-r1-0528:free",
    messages: [
      { role: "system", content: "You are a helpful assistant..." },
      { role: "user", content: "Hello, how are you?" }
    ],
    stream: true
  })
});

// 2. Read stream chunk by chunk
while (chunk = await reader.read()) {
  // Parse JSON from stream
  const token = parsed.choices[0].delta.content;
  
  // Call callback with token
  onToken(token);  // This goes back to StreamingLLMStep
}

// 3. Return usage info
return {
  model: "deepseek/deepseek-r1-0528:free",
  usage: { prompt_tokens: 15, completion_tokens: 8, total_tokens: 23 }
};
```

---

**Step 2.6: Response Flows Back**

```
DeepSeekProvider
    ↓ (returns usage)
StreamingLLMStep
    ↓ (updates ctx, returns result)
ChainRunner
    ↓ (checks shouldTerminate())
Chain
    ↓ (returns true - single step chain)
ChainRunner
    ↓ (returns final result)
AIService
    ↓
AIRoutes
    ↓ (response already streamed)
Client receives tokens in real-time
```

---

**Step 2.7: Usage Tracking**

After the chain completes:
```javascript
// Usage is automatically tracked in ctx.usage
// And saved to database:
await insertModel("ai_usage", {
  user_id: ctx.userId,
  model: ctx.usage.model,
  tokens_used: ctx.usage.tokens,
  credits_used: calculatedCredits
});
```

---

### 🎯 Key Concepts Explained Simply

#### **1. Why Layers?**

**Problem:** Different LLM providers have different APIs, response formats, and capabilities.

**Solution:** Layers create abstraction:
- **Adapter**: Makes all providers look the same
- **Chain**: Defines logic without caring about which provider
- **Step**: Reusable units of work

**Benefit:** Switch providers without changing your code!

---

#### **2. Execution Context (ctx)**

**Think of it as:** A shopping cart that gets passed around.

**Contains:**
- **messages**: The conversation history (like items in cart)
- **userId**: Who's shopping (for tracking)
- **steps**: What we've done so far (like a receipt)
- **usage**: How much we've spent (tokens/cost)

**Why it exists:** Every step needs to know the current state. Context carries that state.

---

#### **3. Chains**

**Think of it as:** A recipe for cooking.

**A chain defines:**
- **init()**: Prep work (preheat oven, get ingredients)
- **nextStep()**: What to do next (chop vegetables, then cook)
- **shouldTerminate()**: Are we done? (food is ready)

**Example:**
```javascript
// Simple chain: Just one step
BasicChatChain:
  init() → Add system message
  nextStep() → Call LLM
  shouldTerminate() → true (done!)

// Complex chain: Multiple steps
ReActChain:
  init() → Add system message
  nextStep() → Call LLM (think)
  nextStep() → Execute tool (act)
  nextStep() → Call LLM again (observe)
  shouldTerminate() → When final answer found
```

---

#### **4. Steps**

**Think of it as:** Individual cooking actions.

**A step:**
- Takes context (knows current state)
- Does one thing (chop, cook, validate)
- Updates context (adds result)
- Returns what happened

**Types:**
- **LLMStep**: Calls the AI model
- **StreamingLLMStep**: Calls AI and streams response
- **ValidationStep**: Checks if output is valid
- **ToolStep**: Runs a tool (search, database, etc.)

---

#### **5. Adapter Pattern**

**Problem:** 
- OpenAI returns: `{ choices: [{ message: { content: "..." } }] }`
- DeepSeek returns: `{ choices: [{ message: { content: "..." } }] }`
- Anthropic returns: `{ content: [{ text: "..." }] }`

**Solution:** Adapter normalizes everything to:
```javascript
{
  text: "...",
  usage: { total_tokens: 100 },
  model: "model-name"
}
```

**Benefit:** Your code doesn't need to know which provider is being used!

---

#### **6. Model Registry**

**Think of it as:** A phone book for LLM providers.

```javascript
model_registry = {
  "openai": () => new OpenAIProvider(),
  "deepseek": () => new DeepSeekProvider(),
  "anthropic": () => new AnthropicProvider()
}
```

**Usage:**
```javascript
// Instead of:
if (provider === "openai") {
  return new OpenAIProvider();
} else if (provider === "deepseek") {
  return new DeepSeekProvider();
}
// ... (messy!)

// We do:
const provider = model_registry[providerName](opts);
// Clean and extensible!
```

---

### 🔍 Data Flow Example

Let's trace a complete request:

```
1. User types: "What is 2+2?"

2. Frontend sends:
   POST /ai/chat
   { prompt: "What is 2+2?" }

3. Route validates and calls:
   AIServiceModule.streamResponse({ userId, prompt, options }, res)

4. AIServiceModule:
   - Cleans prompt: "What is 2+2?"
   - Builds messages: [{ role: "user", content: "What is 2+2?" }]
   - Creates adapter: new Adapter("deepseek", { model: "..." })

5. Adapter:
   - Looks up "deepseek" in model_registry
   - Returns: new DeepSeekProvider({ model: "..." })

6. DeepSeekProvider.stream():
   - Makes HTTP request to OpenRouter API
   - Streams response: "2 + 2 equals 4"
   - Each token sent to callback

7. AIServiceModule:
   - Receives tokens, forwards to client via res.write()
   - After completion, saves usage:
     { user_id: "123", model: "deepseek/...", tokens_used: 25 }

8. Client receives:
   "2 + 2 equals 4" (streamed token by token)

9. Database updated:
   ai_usage table has new row with usage info
```

---

### 🧩 Component Responsibilities

| Component | Responsibility | Analogy |
|-----------|---------------|---------|
| **Route** | Validates request, extracts user info | Restaurant host |
| **AIServiceModule** | Orchestrates simple AI calls | Simple order taker |
| **Chain** | Defines execution flow | Recipe |
| **ChainRunner** | Executes chain steps | Chef following recipe |
| **ExecutionContext** | Holds runtime state | Shopping cart |
| **Step** | Performs one action | Cooking action |
| **Adapter** | Normalizes provider APIs | Universal translator |
| **Provider** | Talks to specific LLM API | Supplier |
| **Model Registry** | Maps names to providers | Phone book |

---