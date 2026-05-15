# Sprint 17 — implementation summary (snapshot)

**Canonical:** `docs/consolidation/sprint-17-implementation-summary.md`  
**Status:** Closed (implementation) — **85 passed**, 0 failed.

---

## Outcomes

- Research sparse-brief golden fixtures **S1–S6**; pack-driven **validationRules**, **conflictPolicies**, **disclosurePolicy**, **planningGateDisclosures**.
- Heuristic **proceed gates** on GRC and Design Page until `objective_type` + `input_strategy` resolved.
- Grouped **Planning notices** (missing, blocked, conflicting, rejected inference, gated steps).
- **explicitExtract** proposal deferred (shared LD-heavy parser remains).

**Rule:** Runtime interprets policy; domain packs declare policy.

---

## Sprint 18 motivation (from closeout)

Deterministic essentials make planning **safe** but not always **adequate**. Post-closeout smoke test: brief on “AI governance risks” elicited all required factors including `generate_from_topic` but never clarified topic scope before an analysis-heavy chain was generated.

**Future candidate label:** Topic-generation sufficiency / high-impact clarification.

**Possible pack concepts:** `highImpactClarificationRules`, `topicSpecificityChecks`, `minimumContextForTopicGeneration`, planning adequacy notices.

---

## Follow-on priority (abridged)

1. Topic-generation sufficiency / high-impact clarification  
2. explicitExtract 4a/4b (Research)  
3. Inference / audience promotion  
4. Factory MVP threshold vs auto-continue  
5. LD extract profile (separate sprint)
