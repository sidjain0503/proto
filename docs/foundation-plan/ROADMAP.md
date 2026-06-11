# Implementation Roadmap

## Sequencing Logic

1. Safety & bootstrapping first
2. Configuration over code edits
3. Extension points for clean forks
4. Quality gates (tests + CI)
5. Scale & polish

## Timeline (~8–10 weeks, one senior engineer)

```
Week 1:  M1 (security) + M2 (env) + M6 (cleanup)
Week 2:  M3 (migrations) + M4 (docker compose)
Week 3:  M5 (app.config) + M10 (docs)
Week 4:  M8 (core/client overlay) + M9 (module registry)
Week 5:  M7 (contract tests + CI)
Week 6:  G1 (AI path) + G6 (linting)
Week 7:  G2 (frontend modules) + G3 (logging/health)
Week 8:  G4 (ingestion queue) + G7 (deploy preset)
Week 9:  G5 (vector store) + G8 (auth enhancements)
Week 10+: Optional tier as needed
```

## Expected Outcomes

| Milestone | Fork time | Confidence |
|-----------|-----------|------------|
| Today | 3–5 days + security hardening | Low |
| After Must-haves (Week 5) | 1–2 days to running baseline | Medium-high |
| After Good-to-haves (Week 9) | 1 day baseline + half-day deploy | High |
| After Optional | Hours via CLI | High |

## Decision Framework

| Question | If yes → |
|----------|----------|
| Does a fork inherit a security/data risk? | Must-have |
| Does it block `npm run setup && npm run doctor`? | Must-have |
| Does it reduce fork customization to config edits? | Must-have |
| Does it prevent upstream merges? | Must-have (M8) |
| Improves prod reliability but fork works without it? | Good-to-have |
| Expands addressable market (enterprise, billing)? | Optional |
