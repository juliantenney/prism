# Sprint 68 — Next Chat Briefing

**Paste this into a new conversation to start Sprint 68.**

---

Sprint 67 is **closed**. Sprint 68 is **chartered**.

**Pack:** `docs/development/sprints/2026-07-21-sprint-68-learning-coherence-narrative-flow/`  
**START HERE:** `SPRINT-68-START-HERE.md`  
**HANDOVER:** `HANDOVER.md`  
**Charter:** `SPRINT-68-CHARTER.md`  
**Context:** `context/README.md`

**Goal:** Improve learner coherence **and** validate the pipeline/renderer boundary on the **stable vNext renderer**.

**Dual purpose:**

1. Coherence improvements where authoritative lesson data already exists
2. Evidence showing where richer lesson data — not a smarter renderer — is required

**Guiding principles:**

> Improve the learner experience using authoritative lesson data before extending the lesson schema.

> The renderer renders. The pipeline authors.

**Investigation rule:** Classify each issue as renderer defect · render model deficiency · lesson schema deficiency · pipeline generation deficiency.

**Already done (Sprint 67):** vNext model → HTML · default export · 1200px shell · sticky nav · typography · icons · 150 regression tests.

**This sprint owns:** activity bridging · narrative continuity · orientation/progression · flow audits · render model gap analysis · evidence-based deferred schema register.

**Do not:**

* rewrite the renderer or revisit Sprint 67 CSS;
* make the renderer invent transitions, scaffolding or narrative absent from the lesson model;
* redesign navigation, layout, or iconography;
* change export architecture;
* add speculative heuristics where lesson JSON already has authoritative fields;
* extend schema before evidence demonstrates renderer-first and render-model paths are insufficient.

**Known startup item:** Only one `intellectual_coherence_bridge` appears in heteroscedasticity output — inside Activity 5, not between activities. Investigate whether bridge data exists, is misplaced, or is suppressed.

**Primary fixture:** `tests/fixtures/page-render/heteroscedasticity-beat-assignment-page.json`

**Next task:** **S68-BL-001** — activity-to-activity bridging investigation (`investigation-log.md`).

**Sprint 67 close:** `docs/development/sprints/2026-07-17-sprint-67-learner-renderer-vnext/SPRINT-67-CLOSURE.md`
