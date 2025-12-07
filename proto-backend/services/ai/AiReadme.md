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