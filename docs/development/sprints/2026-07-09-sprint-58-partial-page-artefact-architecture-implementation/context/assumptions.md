# Assumptions — Sprint 58

1. v2 schema (`2.0.0`) remains frozen for Sprint 58.
2. Episode Plan continues to produce a **full** page shell (deterministic derive acceptable).
3. Users manually paste Copilot output into `runStepOutput` per step.
4. Copilot conversation retains prior STEP N OUTPUT messages within a session.
5. `workflowRunCapturedOutputs` keyed by workflow step `id` is the assembly input source.
6. Renderer (`normalizePageForRender`) does not need schema changes for assembled pages.
7. Legacy compose workflows still exist in the wild — must not break.
8. Instructional budget heuristics from 57A inform prompt text but are not sprint deliverables.
9. Human review remains the quality gate for instructional content.
10. PRISM does not post-validate LLM instructional quality automatically.

## Invalidated assumptions (from 57A)

- ~~LLMs can preserve full page JSON across post-EP stages when prompted~~
- ~~Prompt hardening alone achieves durable enrich-in-place~~
