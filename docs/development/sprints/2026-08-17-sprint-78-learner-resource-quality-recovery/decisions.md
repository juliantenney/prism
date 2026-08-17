# Sprint 78 — Decision Log

**Sprint status:** **OPEN** (opened 2026-08-17)  
**Format:** ID · Decision · Status · Rationale · Consequences  

Inherited programme constraints: [ARCHITECTURAL-CONSTRAINTS.md](../2026-08-06-sprint-74-architecture-consolidation-and-rationalisation/ARCHITECTURAL-CONSTRAINTS.md) · [ENGINEERING-DISCIPLINES.md](../../ENGINEERING-DISCIPLINES.md).

Sprint 77 remains **COMPLETE / Closed**. Do not reopen the DLA architecture pilot to absorb this sprint.

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
