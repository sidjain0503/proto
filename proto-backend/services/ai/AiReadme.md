## Proto AI Layer 

This flowchart below captures the data flow between different components inside the Proto AI layer. Its built by keeping in mind the modular structure of the ai layer to allow support for different models for model orchestration and to add other layers for evaluation and rate limiting later. 

This document needs to be enhanced later. 

```

          ┌─────────────────────────────┐
          │          Client             │
          └──────────────┬──────────────┘
                           REST / Stream
                           (prompt, options)
                           ▼
          ┌─────────────────────────────┐
          │   AiController (Route)      │
          │  - Validates request        │
          │  - Calls AiService          │
          └──────────────┬──────────────┘
                           ▼
          ┌─────────────────────────────┐
          │       AiService             │
          │  - Orchestration logic      │
          │  - Pre/Post processing      │
          │  - Usage tracking           │
          │  - Delegates to Provider    │
          └──────────────┬──────────────┘
                           ▼
          ┌───────────────────────────────┐
          │      ProviderAdapter           │
          │ (Abstract class/interface)     │
          │  generate()                    │
          │  stream()                      │
          └───────┬────────────┬──────────┘
                  ▼            ▼
    ┌──────────────────┐    ┌──────────────────┐
    │  OpenAIProvider  │    │ OtherProviders   │
    │  - Calls OpenAI  │    │ (Anthropic etc.) │
    │  - Normalizes    │    │  Plug-in later   │
    └──────────────────┘    └──────────────────┘
                  ▼
     (HTTP / SDK calls to LLM)
                  ▼
          ┌───────────────────────────────┐
          │ BackendRequest (HTTP Client)  │
          │ - Headers                     │
          │ - Retries, timeouts           │
          │ - Logging                     │
          │ - JSON normalization          │
          │ - Error handling              │
          └───────────────────────────────┘
                  ▼
         ┌────────────────────────────┐
         │      LLM Provider API      │
         └────────────────────────────┘


```

## Explaining the different layers and why behind the decisions. 

1. [AiService](./AIService.js) : Central file for all the ai operations , all the ai requests in the entire application should go from here. 

    **What does it have ?**

    - Non-model-specific decisions happen here:

        Template your prompt

        Add system prompts

        Sanitize input

        Log request

        Handle user quotas / usage

        Select provider (OpenAI, Anthropic…)

        Call provider.generate(requestDTO)

> The service does not know how to call OpenAI.

2. [Adapter](./adapter.js)

        The main function of the adapter is to Load provider based on env/config & normalize all returned data to ensure uniform interface for all different providers. 


3.  services/ai/providers/OpenAIProvider.js

- Calls OpenAI
- Implements generate()
- Implements stream()



---

## Further Improvements: Auditing and Logging Usage Data

Currently, the model response contains tokens and other usage details. To enable better monitoring, rate limiting, and auditing, we can extend the AI layer as follows:

- Whenever a model call completes, the adapter will log relevant details (e.g., model, tokens used, and user_id if available) after each run.
- This audit log can later be analyzed for user behavior, enforcing rate limits, cost tracking, and debugging anomalous activity.

### Example improvement (pseudo/JS):

In the `Adapter` class (e.g., in `adapter.js`):

```js
async generate(request) {
  const result = await this.provider.generate(request);
  // Log/audit usage:
  // Suppose request.userId is propagated as part of the request
  this.logUsage({
    user_id: request.userId,
    model: result.model,
    tokens_used: result.usage?.total_tokens,
    timestamp: Date.now(),
  });
  return {
    text: result.text,
    usage: result.usage,
    model: result.model,
  };
}

logUsage(data) {
  // Implement your audit logic here. Can be DB insert, file log, etc.
  console.log(`[AI USAGE]`, data);
}
```

- You should propagate `user_id` through all AI requests if you want per-user tracking.
- This audit layer can later be extended to actually write to a database or any persistent store, making it easy to enforce quotas or monitor for abuse by user or API key.
- It’s best to standardize this in the Adapter so every provider is covered uniformly, no matter the upstream API format.

---


