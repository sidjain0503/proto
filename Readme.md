# Proto - AI SaaS Template for JS Devs

**Proto is a full-stack AI SaaS template that treats AI as infrastructure, not a feature.**

<img width="1710" height="771" alt="image" src="https://github.com/user-attachments/assets/e72b64d0-20fc-407f-b21e-8d8125659ec2" />


## Philosophy

**AI as Infrastructure**: Rather than coupling your app to a single LLM provider, Proto builds disciplined abstractions that let you:
- Switch models without rewriting code
- Compose complex AI workflows
- Track costs and usage systematically
- Evolve your AI capabilities over time

**The Core Principle**: Treat LLMs as **volatile compute dependencies**—they change constantly, but your application logic shouldn't.

## What's Inside

**Full-Stack Template**:
- **Backend** (`proto-backend/`): Node.js/Express with modular AI layer
- **Frontend** (`proto-client/`): Next.js with chat interface
- **AI Layer**: Provider-agnostic abstraction with chains, streaming, and persistence

**Core Features**:
- ✅ Multi-provider support (OpenAI, DeepSeek, extensible)
- ✅ Streaming responses with message persistence
- ✅ Session management and conversation history
- ✅ Usage tracking and cost monitoring
- ✅ Authentication & user management
- ✅ Chain-based execution layer (for complex workflows)

## Architecture

Proto's AI stack is built in **5 layers**, each independently evolvable:

1. **LLM Compute Layer** ✅ - Provider abstraction (done)
2. **Execution Layer** ✅ - Chains for control flow (done)
3. **Capability Layer** 🔜 - Tools & side effects
4. **Knowledge Layer** 🔜 - RAG & context retrieval
5. **Measurement Layer** 🔜 - Evals & quality tracking

## Quick Start

```bash
# Backend
cd proto-backend
npm install
npm start

# Frontend
cd proto-client
npm install
npm run dev
```

## Documentation

- **[AI Architecture](./proto-backend/docs/ai/Readme.md)** - Philosophy & layered design
- **[Usage Guide](./proto-backend/docs/ai/Usage.md)** - How to use chains, add providers, extend
- **[Architecture Details](./proto-backend/docs/ai/Architecture.md)** - Deep dive into data flow

## Why Proto?

Most AI integrations are **brittle**—they break when models change, providers update APIs, or you need to add capabilities.

Proto is **designed to evolve**: swap providers, add tools, implement RAG, measure quality—all without rewriting your application logic.

**Perfect for**: Building production AI features that need to survive model changes, cost optimization, and feature expansion.

---

*Proto explores how intelligence layers live inside real software products without breaking everything.*

