##  Execution Layer ( Chains )

The chain layer is made separate with the compute layer/ AiService to make sure its testability isn't dependent on the llm compute and without calling any llm service we can test the chains formation logic. 

Chain: **A chain is control flow or a written plan for how many times, in what order, and for what purpose you call the LLM.**

Chain = Recipe or say

Messages = memory & Chains = logic

A chain is more like:

- Read the user input

- Call the LLM to generate an answer

- Validate the answer

- If invalid, call the LLM again

- Return the final response

- The recipe may use the chat history — but the recipe itself is not the chat history.


How Chains works ? 

```
Controller 
  ↓
Chain (Execution Layer)
  ↓
AIService (LLM Compute)
  ↓
Adapter / Provider

```


How will the Controller/Services would look ?  

```
const chain = new SimpleChatChain({ aiService });
const result = await chain.run(
  { input: prompt },
  { userId, requestId }
);

```

The chain layer owns execution, not intelligence.

Concretely, it owns:

- Execution flow

- Step boundaries

- Message construction

- Usage aggregation

- Execution trace

- Logging hooks


# Simplifying everything : 

Let's understand this by the example of a ReAct agent , Whose sole purpose is to react and decide the direction for the llm on each all and until the final stage is reached. 

If the compute layer answers questions,
the chain layer decides how questions are asked, evaluated, corrected, and acted upon.

A ReAct agent is a looped chain:

So, We Prompt model with current context

& Model responds with:

- Thought

- Action or Final answer

- System parses output

- If Action → execute tool → append observation

- Loop until Final or stop condition


It’s structured control flow.


# Elements of a Chain

1. Execution Context

      The spine of the chain.

      This is a mutable object passed through every step.

      Contains:

      - Conversation state (messages so far)

      - Intermediate outputs

      - Tool results

      - Metadata (model used, cost, timestamps)

      - Guardrails (max steps, budget, permissions)

      Think of it as:

      a request-scoped runtime, not a brain

      No persistence beyond the execution unless another layer decides to store it.

2. Step

    The smallest unit of execution.

    A step can be:

    - An LLM call

    - A tool invocation

    - A parser

    - A validator

    - A conditional check

    Each step:

    - Takes the execution context

    - Produces a deterministic output

    - Optionally mutates context

    - Returns a status signal

    Key idea:

    Steps don’t decide the future. They report what happened.


3. Control Logic (Flow)

    This is where chains differ from “prompt pipelines.”

      Control logic answers:

      - Do we continue?

      - Do we branch?

      - Do we retry?

      - Do we fail fast?

     -  Do we stop successfully?

      Examples:

      - Loop until final_answer

      - Retry on malformed output

      - Branch if confidence < threshold

      - Abort if cost > budget

      - Escalate if tool fails twice

      This is what makes chains programmable cognition, not scripted prompts.


4. Termination Conditions

    Every chain must know when it’s done.

    Termination can be:

    - Explicit (final_answer)

    - Structural (max steps reached)

    - Safety-based (policy violation)

    - Economic (budget exceeded)

    - Logical (goal satisfied)

    If this isn’t explicit, you get:

    - Infinite loops

    - Silent failures

    - Unbounded costs

    - Chains are finite machines, not conversations.

    5. Observability Hooks

    Chains are meant to be watched.

    You should be able to answer:

    - What step are we in?

    - What did the model say?

    - Why did we branch?

    - Where did it fail?

    - How much did this execution cost?

    This is why chains must be first-class objects, not hidden abstractions.