# Sprint 78 — Decision Log

**Sprint status:** **CLOSED** (opened 2026-08-17 · closed 2026-08-25)  
**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited programme constraints: [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md).

Sprint 77 remains **COMPLETE / Closed**. Do not reopen the DLA architecture pilot.

---

## S78-D01 Open Sprint 78 — Learner Resource Quality Recovery

- **Decision:** Operator approval has **opened Sprint 78 — Learner Resource Quality Recovery** as a **diagnosis-first quality recovery** programme. The sprint repairs instructional relationships exposed by the post–Sprint 77 Lagrangian QA baseline (`MODEL → ATTEMPT → CHECK → REVISE / TRANSFER`), targeting **regeneration quality** on a favourable benchmark topic — **not** hand-editing one Lagrangian resource. The first substantive task is **S78-T-001 — learner production / workspace fulfilment diagnostic** — **defined only**; it must **not** be executed until explicitly authorised after pack review. **S78-T-002** and **S78-T-003** are **queued** after T-001. Sprint open authorises **no** production code, test product, prompt, schema, validator, renderer, or workflow changes. Exit benchmark: fresh Lagrangian ≥ **90** uncapped QA; **0 Critical**; **0 Major**. QA benchmark must **not** be weakened. Sprint 77 protected baseline preserved. E2, PB-FA-010, Phase D, Settings, and unrelated backlog remain **out of sprint** unless blocking the benchmark.

- **Status:** **Accepted** (2026-08-17)

- **Rationale:** Post-S77 pipeline reaches complete learner package, but Lagrangian QA (70/100, 2 Major, F&S 30) shows instructional-relationship defects below expected quality for a favourable topic. Three Monday diagnostic tracks from [POST-S77-lagrangian-qa-baseline-2026-08-14.md](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/POST-S77-lagrangian-qa-baseline-2026-08-14.md) become structured workstreams.

- **Consequences:** Work proceeds under [PLAN.md](PLAN.md) and [CONTEXT.md](CONTEXT.md). Stop after sprint open until T-001 is authorised. Further decisions: `S78-D##`.

---

## S78-D02 GAM first-pass reliability and temporary semantic verification

- **Decision:** The intended steady-state GAM product contract remains **one step**: Generate Activity Materials → valid capture → Step complete → Next. A user should not normally need to regenerate GAM until it happens to pass.

  T-017 / T-017A / T-018 operational-suitability review is **retained** as **temporary evidence-gathering / reliability instrumentation**. It exposes semantic GAM failures that structural validation cannot detect. It is **not rejected**. It is **not** accepted as the desired permanent production reliability mechanism.

  A verifier **FAIL counts as a GAM generation failure**. If bad GAM → verifier FAIL → regenerated GAM → PASS, that demonstrates model **capability**, not that the original generation path was reliable. The original failure remains evidence for upstream diagnosis/hardening.

  **“Regenerate until it passes” is not an acceptable Sprint 78 reliability outcome.** Repeated regenerate/fail loops would create an unacceptable user experience and transfer stochastic model reliability onto the operator. **First-pass generation quality is a Sprint 78 signal.**

  Working method for verifier evidence:

  ```text
  Fresh GAM generation
  → temporary semantic verification
  → if FAIL:
      preserve candidate
      diagnose the general failure class
      trace to the earliest architectural/prompt-contract owner
      harden the existing DLA→GAM generation pipeline where justified
      avoid domain-specific patches
  → repeat fresh generation
  ```

  Classify each FAIL before repairing: genuine general generation defect · false verifier rejection · malformed/corrupted output · operator-path issue · another evidenced mechanism. Do not assume every FAIL automatically justifies a repair.

  Desired end state (not scheduled for removal yet): GAM reliably produces suitable material on first generation; verifier findings stop revealing systemic failure classes; the extra verifier interaction can be removed from the normal operator workflow. **Removal depends on evidence.**

- **Status:** **Accepted** (2026-08-17)

- **Rationale:** T-015 Stage-1 salience improved authoring guidance but Candidate 4 showed it is not by itself sufficiently reliable. T-018 integrated the Copilot review as a coherent GAM sub-flow so Sprint 78 can gather evidence without treating the extra interaction as the product. Closing reliability by looping regeneration would hide generation defects.

- **Consequences:** Resume **S78-T-013** using Verify generated materials as instrumentation, not as a substitute for first-pass GAM quality. Do not describe the verifier as final architecture or as rejected. Do not close operational suitability from unit tests or from a later PASS after an earlier FAIL on the same commission. See [STATUS.md](STATUS.md) and [S78-T-018](S78-T-018-operational-suitability-review-ux-workflow-integration.md).

---

## S78-D03 Disciplinary warrant authoring salience (S78-DP)

- **Decision:** Adopt **S78-DP (disciplinary warrant)** as a cross-cutting **prompt/contract salience** invariant, distinct from operational suitability. Learner-facing content, including visuals, must not present a stronger disciplinary conclusion than stated assumptions, taught model class, and supplied evidence warrant; introductory simplifications must be appropriately visible rather than presented as unrestricted general results.

  **Minimum ownership:** DLA commissioning claim-strength · GAM material-body warrant · Design Page `page_synthesis` and visual `allowed_claims` / `disallowed_claims` / `canonical_discipline_note` salience · small image-prompt projection. **EP, assembly/renderer, and the T-017/T-018 verifier are out of the minimal set.**

  Implementation is **prompt/contract salience only**: **no** new schema, **no** verifier expansion, **no** deterministic disciplinary validation, **no** domain-specific solvers or banned-term lists. Residual detection remains independent QA (Benchmark Subject & Disciplinary Quality).

- **Status:** **Accepted** (2026-08-25) — design: [S78-T-025](S78-T-025-disciplinary-precision-authoring-solution-design.md)

- **Rationale:** Candidate 6 scored **88/100** with verifier **PASS** and Subject Quality **84**. Suitability asks whether particulars are usable; warrant asks whether claims/representations are appropriately strong. C6 FOC→optimum started in DLA; shadow-price under-scoping started in DLA; inequality notation came from Design Page → image generation. Expanding the temporary suitability verifier into shadow-QA would violate S78-D02 and freeze Lagrangian checks into instrumentation.

- **Consequences:** Next implementation when authorised: **S78-T-026**. Do **not** reopen WS1–3 for this class. Do **not** close T-013 or Sprint 78 on design alone. Do **not** treat Evidence 78 as a blocker. E2/first-pass reliability remains a separate track.

---

## S78-D04 Page-closure ownership (GAM substance · Design Page transport)

- **Decision:** Learner-resource **closure substance** is owned by **GAM** (consolidation / transfer / ### Closure–### Debrief material bodies within the commissioned activity set, bounded by DLA where needed). **Design Page** may only **transport** a designated upstream closure body into existing `page_synthesis.study_tips`; it must **not** synthesise instructional closure. Omit-when-none remains valid when no transportable body exists.

  This affirms Sprint 56C / Assembly-Time **R-41** and rejects restoring Design Page fallback authorship (T-030 Option A) without a separate architecture reopen. It also rejects inventing `final_synthesis` / `next_steps` or renderer-only fixes.

  The current gap after T-030 is **incomplete upstream packaging** (56C SQ-1/SQ-2 deferred), not a renderer defect and not a missing Design Page contract injection.

  **Minimal future intervention (when authorised):** prompt/contract only — ensure a compact transportable culminating closure/consolidation body exists upstream, and clarify Design Page transport mapping into `study_tips`. **No** schema, **no** new page-synthesis fields, **no** renderer change, **no** activity redesign of A1–A5 as a set.

- **Status:** **Accepted** (2026-08-25) — design: [S78-T-031](S78-T-031-page-closure-ownership-design-decision.md) · diagnostic: [S78-T-030](S78-T-030-missing-page-synthesis-closure-diagnostic.md)

- **Rationale:** 56C removed DP study_tips synthesis because it caused wrong-stage instructional authoring, GAM paraphrase/hallucination risk (R-42), and thin-assembly violations. Historical owner of substance was always GAM. Latest 91/100 package was contract-compliant without `study_tips`; QA’s brief final-synthesis recommendation is best met by completing the deferred transport path, not by reopening DP as an instructional author.

- **Consequences:** Do **not** implement Option A by default. **S78-T-032** implemented Option B packaging (prompt/contract). Do **not** start T-019. Do **not** close T-013 or Sprint 78 on this decision alone.

---

## S78-D05 Close Sprint 78

- **Decision:** Operator authorisation closes **Sprint 78 — Learner Resource Quality Recovery**. Closing administration is recorded in [S78-T-056](S78-T-056-sprint-78-closure.md).

  Closing state:

  - **T-013 CLOSED** against written WS2 criteria (evidence matrix in T-056); E2 is a pre-alpha carry-forward, not a T-013 blocker.
  - **Workstream 2 CLOSED.**
  - **Final Gate MET** on primary Lagrangian post–T-037 QA **94/100**, 0 Critical, 0 Major; HR Essentials **92/100** + first-pass PASS/PASS (regen 0) corroborates domain-shift/first-pass signal without replacing Lagrangian as primary benchmark.
  - **T-054 blocker RESOLVED** by T-055.
  - **T-024 SATISFIED / WAIVED**; **T-023 NOT OPENED.**
  - Pre-alpha and optional/hygiene carry-forwards recorded in T-056; they do **not** keep Sprint 78 open.

  No production code, prompt, schema, validator, renderer, or workflow change is authorised by this close. No further Sprint 78 improvement task is opened. Next sprint is **not** opened by this decision.

- **Status:** **Accepted** (2026-08-25)

- **Rationale:** T-052 recommended C READY TO CLOSE; the sole subsequent pre-closure blocker (T-054) was resolved by T-055. Written Final Gate and T-013 criteria are met without requiring another benchmark generation or statistical reliability campaign.

- **Consequences:** Authoritative pack state is **CLOSED**. Do not reopen Sprint 78 for polish. Carry-forwards proceed only via future programme selection ([NEXT-SPRINT.md](../../../sprints/NEXT-SPRINT.md) / product backlog).

