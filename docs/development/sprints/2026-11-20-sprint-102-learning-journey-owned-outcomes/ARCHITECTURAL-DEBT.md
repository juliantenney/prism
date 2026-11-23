# Sprint 102 — Architectural risks and deferred work

**Sprint status:** **CLOSED — COMPLETE — ACCEPTED WITH DOCUMENTED QUALIFICATIONS**  
**Closure:** [SPRINT-102-CLOSURE.md](SPRINT-102-CLOSURE.md)

| ID | Note | State |
| -- | ---- | ----- |
| S102-AD-001–006, 008–009, 014, 016–017 | Design bindings implemented in 102D | **Addressed** in code; live LJ Tests 1–2 PASS |
| S102-AD-007 | Journey-level QA | **Deferred** (subsequent programme) |
| S102-AD-010–013 | Sprint 101 follow-ups | Reference only |
| S102-AD-015 | Expository without `learning_content` | Watchpoint — automated preamble present; residual quality inconsistencies may remain |
| S102-AD-018 | Thin extract-time row checks | **Done** in `commission-native-lo-bind.js` |
| S102-AD-019 | Requirements markers without new stage | **Done** in sibling prompts |
| S102-AD-020 | EP Copy LO embed when no DLO | **Done** via planning delivery embed + resolve fallback |
| S102-AD-021 | AP Purpose DLO wording | **Done** in `buildAssessmentPackPrompts` |
| S102-AD-022 | Full UI persistence/reopen of commission-native children | **Partially verified** via LJ Tests 1–2; AP/ST remain |
| S102-AD-023 | Live-model LJ → component path | **Partially verified** (LJ Tests 1–2 PASS; Test 3 design-only) |
| S102-AD-024 | Browser omitted `commission-native-lo-bind.js` so intake never bound (102E defect) | **Fixed** — script added to `index.html` |
| S102-AD-025 | Create-product handoff did not expand parent LJ (navigation regression) | **Fixed** — create/save expand parent |
| S102-AD-026 | Children created before bind-script fix keep full foundation topology | **Operational** — delete and recommission; no in-place repair |
| S102-AD-027 | Expository S8 published response-contract metadata as learner headings | **Fixed** — schema-mechanic omission |
| S102-AD-028 | Figure detailed_description layout-commission language published as accessible prose | **Fixed** — production-prose filter widened |
| S102-AD-029 | Expository lacked DP `learner_artefacts` ownership/guidance for journal text | **Fixed** — shared contract path enabled; existing pages need DP re-author |
| S102-AD-030 | Interactive artefact-bound prose prompt_set used generic task-step workspace ids (102E-23) | **Fixed** — constructed-text surface from unparsed bound prompt_set |
| S102-AD-031 | Practice journal producers not bound to commissioned elicitation ids | **Fixed** — Practice included in artefact-producer / DLA gate path |
| S102-AD-032 | Assessment Pack / Situated Task commission-native runtime integration | **Carry-forward** — remains to be verified |
| S102-AD-033 | Journal capture for Assessment Pack / Situated Task | **Carry-forward** — unverified |
| S102-AD-034 | Cross-component access to actual previous learner responses | **Carry-forward** — unproven |
| S102-AD-035 | Commissioned-child Clear run data defect | **Carry-forward** — reported; fix status **not** confirmed |
| S102-AD-036 | Minor prompt presentation / learning-outcome authority inconsistencies | **Carry-forward** |

---

## Post-close programme note

[S103-D01](decisions.md#s103-d01--learning-journey-first-architecture) (Learning Journey-first architecture) is **accepted** as direction and is **not** an authorisation to implement product, UI, or commissioning-default changes.
