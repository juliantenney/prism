# Topic-generation sufficiency gap (Sprint 17 post-closeout)

**Canonical:** `docs/consolidation/sprint-17-implementation-summary.md` §12  
**Sprint 18 label:** Topic-generation sufficiency / high-impact clarification  
**Not a Sprint 17 defect.**

---

## Manual smoke test

**Brief:**  
“Analyse the evidence and produce an executive briefing on AI governance risks.”

**Worked:**

- Conflict detection when applicable
- **objective_type**, **input_strategy** (`generate_from_topic`), **audience**, **output_depth** elicited
- Workflow generated successfully

**Gap:**

- No clarification on **scope** of “AI governance risks” (geography, sector, horizon, evidence base, policy frame)
- Plan included analysis-oriented steps (evidence map, thematic analysis) without validating topic sufficiency

---

## Interpretation

> `requiredFactors` resolved ≠ topic scope sufficiently specified for `input_strategy = generate_from_topic`.

Sprint 17 addressed **unsafe inference**, **mixed intent**, and **gated heuristics** — not **planning adequacy** for topic-only generation.

Only after seeing the **designed workflow** does under-specified scope become obvious — motivates Sprint 18 **workflow generation as elicitation substrate** and **contextual refinement**.

---

## Future policy concepts (not implemented)

| Concept | Purpose |
|---------|---------|
| `highImpactClarificationRules` | Targeted question when high-impact choice + weak scope signals |
| `topicSpecificityChecks` | Pack heuristics for under-specified topic-only briefs |
| `minimumContextForTopicGeneration` | Context bar before auto-continue on generate-from-topic |
| Planning adequacy notices | Disclosures distinct from validation/conflict |

Research-only first; LD separate adoption sprint.
