# Sprint 81 — Decision Log

**Sprint status:** **CLOSED / COMPLETE** (opened 2026-08-28 · closed 2026-08-28)  
**Final outcome:** **B — TARGETED ENHANCEMENT**  
**Format:** ID · Decision · Status · Rationale · Consequences

---

## S81-D01 — Open Sprint 81 — Learner Workspace Investigation & Surface Architecture

- **Decision:** Open Sprint 81 as an **investigation / planning / architecture** sprint to determine whether PRISM’s current text-oriented learner workspace should be retained, lightly enhanced, systematised into surface families, or substantially overhauled — assessed against **current** production activity generation, learner evidence, and diagnostic-feedback value.

- **Status:** **Accepted** (2026-08-28)

- **Rationale:** PRISM is WORKING ALPHA. First-class engineering gate is green; D-014 is resolved; accessibility baseline is considered sufficient for alpha. The text workspace supports alpha, but some interactions may be better served by alternative surfaces. The justified change magnitude is unknown; outcomes A–D must remain open.

- **Consequences:**
  - First substantive task is [S81-T-001](S81-T-001-forensic-current-state-activity-inventory.md).
  - No learner-workspace product implementation authorised by opening alone.
  - Sprint 80 remains **CLOSED**; D-014 remains **RESOLVED**.
  - Recommendation A/B/C/D deferred until evidence tasks complete.
  - Accessibility is a design constraint, not a remediation programme in this sprint.

---

## S81-D02 — B: TARGETED ENHANCEMENT (narrowed) — final product direction

- **Decision:** Sprint 81 selects **B — TARGETED ENHANCEMENT**. PRISM **retains** current learner surfaces and pedagogical sequence (Explore → Task → Check → revise). The product opportunity is to improve the **revision / self-review loop** through **small progressive enhancements** around existing accessible surfaces.

- **Status:** **Accepted** (operator 2026-08-28) — **final shipped direction**; sprint **CLOSED** after operator acceptance of T-007/T-008.

- **Rationale:** Evidence gate [S81-T-005](S81-T-005-sprint-81-recommendation-and-decision-gate.md) (ACCEPTED). Existing surfaces were substantially appropriate; principal weakness was revision/self-review co-access, not production surfaces. **A** was a legitimate alternative considered; **C** and **D** rejected on evidence.

- **Accepted meaning of B (binding):**
  - Retain current surfaces and pedagogical sequence.
  - Improve revision/self-review via small PE around existing surfaces.
  - Does **not** authorise: new LA surface families; specialised widget architecture; learner-workspace overhaul; automated free-text/table diagnosis; table replacement; new compose editors; matching/canvas programmes; criterion→field mapping.

- **Shipped under B:**
  - **R1** — asymmetric landmarks / Check→Task ([S81-T-007](S81-T-007-implement-r1-task-check-navigation.md)) — **COMPLETE / ACCEPTED**. Task→Check removed after manual UX.
  - **R4** — revision-pass criterion accompaniment + compact reminder ([S81-T-008](S81-T-008-implement-r4-revision-criterion-accompaniment.md)) — **COMPLETE / ACCEPTED**. Design authority: [S81-T-006](S81-T-006-revision-co-access-design-validation-r3-vs-r4.md).
  - **R3** — not selected as primary; **PARKED / NOT PURSUED**.
  - **T1, T2, C1** — evidence-backed possibilities only; **not shipped**.
  - **PARKED / NOT PURSUED:** R5, T5, C3, matching/canvas/new select families.

- **Consequences:**
  - Sprint 81 is **CLOSED**.
  - Navigation granularity for revise remains **activity-level Task**.
  - Evidence schemas, feedback model (`diagnostic_review` commission-only), and first-class gate remain protected.
  - Maths Entry / mathematical learner input was **not** opened in this sprint.

---

## S81-D03 — Close Sprint 81

- **Decision:** Close Sprint 81 as **COMPLETE** after operator manual acceptance of the final revision interaction (R1 asymmetric + R4 with compact reminder below sticky nav).

- **Status:** **Accepted** (operator 2026-08-28)

- **Rationale:** Investigation and bounded B implementation finished; operator reports the interaction feels good and is happy to move on. Closure record: [SPRINT-81-CLOSURE.md](SPRINT-81-CLOSURE.md).

- **Consequences:**
  - No further Sprint 81 implementation.
  - Carried debt remains in [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md).
  - Next work requires a separate opening decision; Maths Entry is a pointer only.
