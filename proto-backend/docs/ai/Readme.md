# Proto's:  AI Layer Architecture & Strategy

Proto’s AI layer is designed as **infrastructure**, not a feature.

The goal is to build an AI system that is:

* **Model-agnostic**
* **Composable**
* **Observable**
* **Cost-aware**
* **Evolvable over time**

Rather than coupling application logic directly to a single LLM provider or framework, Proto treats LLMs as **volatile compute dependencies** and builds a disciplined abstraction around them.

This document explains:

1. The current AI compute layer 
2. The layers that complete the system
3. Why each layer exists and what problem it solves
4. RAG implementation details (see `RAG.md`)

---

## The Big Picture: AI as a Layered System

Proto’s AI stack is intentionally split into **five layers**, each with a single responsibility.

```
┌──────────────────────────────┐
│        Application           │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│     Execution Layer           │  ← Chains
│  (control flow & reasoning)   │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│     Capability Layer          │  ← Tools
│  (actions & side effects)     │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│     Knowledge Layer           │  ← RAG
│  (retrieval & context)        │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│     LLM Compute Layer         │  ← DONE
│  (providers & routing)       │
└──────────────┬───────────────┘
               ▼
┌──────────────────────────────┐
│     Measurement Layer         │  ← Evals
│  (quality, cost, reliability)│
└──────────────────────────────┘
```

Each layer can evolve independently without breaking the others.

---

## Current State: LLM Compute Layer (Implemented)

The LLM compute layer is the foundation of the entire system.


### Responsibilities

* Abstract LLM providers behind a uniform interface
* Support multiple providers (OpenAI, DeepSeek, future models)
* Enable streaming and non-streaming responses
* Track usage (tokens, credits, model)
* Keep provider-specific logic fully isolated
* Support message persistence in chat applications
* Enable session management and conversation history

---

## Data Flow Inside the AI Layer

### Simple Path (AIServiceModule)
```
┌─────────────────────────────┐
│          Client             │
└──────────────┬──────────────┘
               REST / Stream
               ▼
┌─────────────────────────────┐
│   AiController (Route)      │
│  - Validates request        │
│  - Calls AiService          │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│       AiService             │
│  - Orchestration            │
│  - Prompt preparation       │
│  - Model selection          │
│  - Usage tracking           │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│      Provider Adapter       │
│  - Normalized interface     │
│  - generate / stream        │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│      LLM Provider API       │
└─────────────────────────────┘
```

### Chat Service Path (with Chains & Persistence)
```
┌─────────────────────────────┐
│          Client             │
└──────────────┬──────────────┘
               POST /chat/:sessionId/message
               ▼
┌─────────────────────────────┐
│   ChatController (Route)    │
│  - Validates request        │
│  - Calls ChatService        │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│      ChatService            │
│  - Loads conversation history│
│  - Stores user message       │
│  - Creates ExecutionContext  │
│  - Runs Chain                │
│  - Stores assistant message  │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│      ChainRunner            │
│  - Executes chain steps      │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│   StreamingLLMStep          │
│  - Streams tokens to client │
│  - Accumulates full response │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│      Provider Adapter       │
│  - Normalized interface     │
│  - stream()                  │
└──────────────┬──────────────┘
               ▼
┌─────────────────────────────┐
│      LLM Provider API       │
└─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│      Database               │
│  - Messages stored          │
│  - Usage tracked            │
│  - Session titles updated   │
└─────────────────────────────┘
```

---

## Core Components 

### 1. `AIService` — The Orchestrator

**AIService is the single entry point for all AI calls in Proto.**

It owns **decision-making**, not provider logic.

#### What happens here

* Prompt templating
* System instruction injection
* Input sanitization
* Model selection via registry
* Streaming vs non-streaming flow
* Usage accounting (tokens, credits, model)
* Delegation to the adapter

> AIService never knows *how* OpenAI or DeepSeek are called.

This keeps business logic stable even as models change.

---

### 2. Adapter: The Normalization Boundary

The adapter is the **hard boundary** between Proto and external LLM APIs.

#### Responsibilities

* Load provider based on config/env
* Normalize responses across providers
* Normalize usage metadata
* Enforce a consistent response contract

This guarantees:

* Provider swaps do not affect upstream logic
* Streaming behaves consistently
* Usage tracking is uniform

---

### 3. Providers (`services/ai/providers/*`)

Each provider:

* Implements `generate()`
* Implements `stream()`
* Talks to exactly one external API
* Knows nothing about chains, tools, RAG, or business logic

This isolation is intentional and critical.

---

### 4. Model Registry

Models are selected by **logical name**, not provider hardcoding.

This allows:

* Switching models without touching business logic
* Routing across providers later
* Cost-aware or task-aware routing in the future

---

### 5. Usage Tracking (Implemented)

Every AI call records:

```js
{
  user_id,
  model,
  tokens_used,
  credits_used
}
```

This data becomes the foundation for:

* Rate limiting
* Cost analysis
* Abuse detection
* Model comparison
* Evaluation baselines

Usage is not an afterthought it is **infrastructure**.



# AI Layers Explained : 

### 1. Execution Layer:  Chains

**Chains define how intelligence flows.**

They are:

* Deterministic
* Explicit
* Testable

Chains orchestrate:

* Multi-step reasoning
* Validation steps
* Tool usage
* RAG context injection

This avoids prompt spaghetti and agent chaos.

---

### 2. Capability Layer: Tools

Tools give the system **controlled side effects**.

Examples:

* Search
* Database access
* External APIs
* Internal services

Tools are:

* Explicitly registered
* Schema-defined
* Invoked intentionally (not magically)

This keeps the system safe and debuggable.

---

### 3. Knowledge Layer: RAG

RAG is treated as a **pre-LLM pipeline**, not a prompt hack.

Responsibilities:

* Retrieval
* Ranking
* Context construction
* Token budgeting

This allows:

* Model-agnostic knowledge injection
* Consistent behavior across providers
* Controlled hallucination risk

---

### 4. Measurement Layer: Evals

Evals make the system **safe to evolve**.

They enable:

* Model comparisons
* Prompt regression detection
* Cost vs quality tradeoffs
* Routing decisions backed by data

Without evals, multi-LLM systems are guesswork.

---

## Why This Architecture Matters

This design ensures that:

* LLM providers remain interchangeable
* Complexity grows horizontally, not vertically
* Failures are isolated and observable
* Cost and quality are measurable
* New capabilities don’t rewrite old code

Proto is not “wrapping an LLM.”
It is **building an intelligence platform**.

---

## Summary

Proto’s AI layer is intentionally built as:

* **Compute** (LLMs)
* **Execution** (chains)
* **Capabilities** (tools)
* **Knowledge** (RAG)
* **Measurement** (evals)

Each layer compounds the value of the one below it.

This is the difference between an AI feature and an AI system.
