> The following issues are scheduled for implementation in the upcoming cycle.

## Issue 3 — Add Capability Layer (Tool System)

**Title:**
`feat(ai): introduce explicit tool capability layer`

### Why this matters

Tools give the AI **controlled side effects**:

* Searching data
* Calling internal services
* Executing deterministic logic

Without a tool layer:

* Chains become monolithic
* LLMs hallucinate actions
* Side effects are untraceable

This layer enforces **explicit contracts**.

---

### Scope

Create a tool system that:

* Defines tools declaratively
* Validates tool inputs
* Executes tools deterministically
* Feeds results back into chains

---

### Todos

* [ ] Create `services/ai/tools/` directory
* [ ] Define tool interface (name, schema, execute)
* [ ] Implement tool registry
* [ ] Add example tool (e.g. `search` or `calculator`)

---

### Subtasks

* [ ] Decide how tools are exposed to models
* [ ] Ensure tools are not auto-executed without chain approval
* [ ] Add logging for tool invocation
* [ ] Add failure handling strategy for tools

---

## Issue 4 — Make Chains Tool-Aware

**Title:**
`feat(ai): enable chains to invoke tools safely`

### Why this matters

Chains should **control when and why tools are used**.

This avoids:

* Agent chaos
* Recursive tool loops
* Unbounded execution

Tool usage must be explicit, observable, and bounded.

---

### Scope

Extend chains to:

* Detect tool calls from model output
* Validate tool input
* Execute tools
* Resume execution with tool results

---

### Todos

* [ ] Define tool-call response contract
* [ ] Add tool execution step inside chains
* [ ] Prevent infinite tool loops
* [ ] Capture tool usage metrics

---

### Subtasks

* [ ] Decide max tool call depth
* [ ] Add tool execution tracing
* [ ] Ensure streaming compatibility

---

## Issue 5 — Introduce Knowledge Layer (RAG)

**Title:**
`feat(ai): add retrieval-augmented generation (RAG) layer`

### Why this matters

LLMs alone are:

* Stateless
* Hallucination-prone
* Detached from application data

RAG provides **grounded intelligence** without retraining models.

This layer must be:

* Model-agnostic
* Token-budget aware
* Decoupled from prompts

---

### Scope

Add a RAG pipeline that:

* Retrieves relevant data
* Ranks and trims context
* Injects context into chains

---

### Todos

* [ ] Create `services/ai/rag/` directory
* [ ] Define retriever interface
* [ ] Implement context builder with token budgeting
* [ ] Add RAG-enabled chain example

---

### Subtasks

* [ ] Decide embedding strategy (provider-agnostic)
* [ ] Add metadata to retrieved chunks
* [ ] Add logging for retrieval quality

---

## Issue 6 — Make RAG Chain-Composable

**Title:**
`feat(ai): integrate RAG as a pre-execution step in chains`

### Why this matters

RAG should not live inside prompts.

By making RAG a **first-class execution step**, you get:

* Reusability across chains
* Better observability
* Easier evals later

---

### Scope

Allow chains to:

* Declare RAG dependency
* Receive prepared context
* Remain unaware of retrieval internals

---

### Todos

* [ ] Add RAG hook to BaseChain
* [ ] Ensure RAG runs before LLM calls
* [ ] Capture retrieval metadata per run

---

### Subtasks

* [ ] Support multiple retrievers
* [ ] Add fallback when no context found
* [ ] Enforce token limits strictly

---

## Issue 7 — Introduce Measurement Layer (Evals)

**Title:**
`feat(ai): add evaluation framework for chains and models`

### Why this matters

Without evals:

* Model changes are risky
* Prompt tweaks are guesswork
* Cost optimizations are blind

Evals turn AI from intuition-driven to **data-driven**.

---

### Scope

Create an evaluation framework that:

* Runs chains against datasets
* Scores outputs
* Enables comparison across models

---

### Todos

* [ ] Create `services/ai/evals/` directory
* [ ] Define eval runner interface
* [ ] Add basic metrics (relevance, faithfulness)
* [ ] Store eval results persistently

---

### Subtasks

* [ ] Add dataset format
* [ ] Support multi-model evaluation
* [ ] Add CLI or script to run evals
* [ ] Tie evals to routing decisions later

---

## Issue 8 — Cost- & Quality-Aware Model Routing (Future)

**Title:**
`feat(ai): enable eval-driven model routing`

### Why this matters

This is where multi-LLM support becomes **leverage**.

Routing decisions should be based on:

* Cost
* Latency
* Quality metrics
* Task type

---

### Scope

Use eval and usage data to:

* Choose models dynamically
* Implement fallbacks
* Optimize cost without quality loss

---

### Todos

* [ ] Extend model registry with metrics
* [ ] Add routing rules engine
* [ ] Support fallback models

---

### Subtasks

* [ ] Define routing heuristics
* [ ] Add guardrails for downgrade
* [ ] Log routing decisions

---

