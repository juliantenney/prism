# Sprint 76 — Plan

**Status:** **OPEN** (opened 2026-08-13)  
**Opening decision:** [S76-D01](decisions.md#s76-d01--open-sprint-76--dla-rationalisation-and-content-quality-consistency)  
**Dashboard:** [STATUS.md](STATUS.md) · **Opening evidence:** [CONTEXT.md](CONTEXT.md) · **T-010:** [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md) · **T-024:** [S76-T-024-dla-p01-p02-p03-gate-a-b.md](S76-T-024-dla-p01-p02-p03-gate-a-b.md)

Task IDs: `S76-T-###`. Decision IDs: `S76-D##` in [decisions.md](decisions.md).

Later implementation structure after T-010 is **evidence-led**. Do not invent detailed rewrite tasks before the audit.

---

## Programme phases

```text
S76-T-001 (pack init) ✅ Done
  → S76-D01 (open Sprint 76) ✅ Accepted
  → S76-T-010 (DLA audit) ✅ Diagnostic complete
  → S76-T-020 (DLA-P02 solution design) ✅ Design complete (not implementation)
  → S76-T-021 (DLA-P01 solution design) ✅ Design complete (not implementation)
  → S76-T-022 (DLA-P03 solution design) ✅ Design complete (not implementation)
  → S76-T-023 (P01/P02/P03 implementation plan) ✅ Planning complete
  → S76-T-024 (P01/P02/P03 Gate A + Gate B) ✅ Complete
  → Gate C first RR/Lagrangian runs (operator-reported)
  → S76-T-026 (P01 residual operand-closure diagnostic) ✅ Diagnostic complete
  → S76-T-027 (P01 residual solution design) ✅ Design complete
  → S76-T-028 (P01 residual implementation) ✅ Complete — awaiting operator re-benchmark
  → S76-T-029 (Design Page graphics capture shape) ✅ Complete
  → S76-T-030 (generated-operand operational suitability diagnostic) ✅ Diagnostic complete — not fixed; not P04
  → S76-T-031 (operational suitability solution design) ✅ Design complete — implementation deferred until after P04
  → S76-T-032 (A4 constructive-alignment diagnostic) ✅ Diagnostic complete — not fixed; not P04
  → S76-T-033 (LO-operation coverage solution design) ✅ Design complete — implementation deferred until after P04
  → S76-T-034 (DLA-P04 evidence-guidance rationalisation solution design) ✅ Design complete
  → S76-T-035 (DLA-P04 evidence-guidance rationalisation implementation plan) ✅ Planning complete — no implementation authorised
  → PHASE 2 remainder: P04 implementation / P05 — Not started
  → PHASE 3: Roman Roads control runs (repeated) — Not started (Gate C)
  → PHASE 4: Lagrangian challenge runs (repeated) — Not started (Gate C)
  → PHASE 5: Decision gate — Not started
  → BEFORE CLOSE: Durable prompt-engineering discipline (S76-D03) — Not started
  → Settings (PB-FA-005) — Deferred after this programme lane
```

---

## Phase 1 — Audit

### S76-T-001 — Sprint pack initialisation

| Field | Content |
| ----- | ------- |
| **Status** | **Done** (2026-08-13) |
| **Ownership** | Sprint documentation |
| **Mode** | Documentation only |
| **Approach** | Create Sprint 76 pack; top-level overview; open decision `S76-D01`; define T-010 without executing it; record Sprint 75 CLOSED; capture investigation evidence |
| **Acceptance** | Pack files present; relative links valid; no production code / test product changes in this task; T-010 defined not started; Sprint 76 OPEN; no commit required by operator |
| **Verification** | [S76-T-001-sprint-pack-initialisation.md](S76-T-001-sprint-pack-initialisation.md) |

---

### S76-T-010 — DLA audit

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-13) — [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md) |
| **Ownership** | Generation-contract / DLA investigation |
| **Mode** | **DIAGNOSTIC ONLY** — no prompt rewrite, no generation behaviour change, no schema change, no evidence rollback execution |
| **Purpose** | Establish an evidence-based account of current DLA responsibilities, prompt growth **as a historical delta**, duplication, and contract gaps before rationalisation. Include whether current DLA may have **regressed** from the Sprint 71 known-good historical quality baseline (hypothesis only). |
| **Deliverable** | [S76-T-010-dla-audit-report.md](S76-T-010-dla-audit-report.md) |

#### Audit scope (minimum)

1. **Current DLA responsibilities** — what DLA is supposed to own vs EP / GAM / Page.  
2. **Current assembled prompt size** — measure and document (observed ~**72,000** characters; verify at audit time).  
3. **Historical delta (required where history permits)** — reconstruct:

   **known-good / previously rationalised DLA → subsequent changes/additions → current ~72k assembled DLA.**

   Anchors: Sprint 56 post-rationalisation DLA core ~**31,932** (2026-07-01); Sprint 71 generation era (2026-07-30/31; post-S56, pre-S72 evidence productisation; **assembled size not pinned in reviews**); Sprint 72 evidence-centred additions onward.

   For each material addition/change identified, record where possible: **what** was added; **when**; **why** / which decision or defect motivated it; **approximate prompt-size contribution**; whether it remains **authoritative**; whether it **duplicates, competes with, or supersedes** another instruction; whether it **belongs in DLA at all**.

   Do not merely classify the current prompt. Report gaps where git/docs cannot identify a change.  
4. **Duplicated / competing / superseded instructions** — including multiple versions of the same contract.  
5. **EP → DLA contract** — what Episode Plan guarantees and what DLA must populate.  
6. **DLA → GAM contract** — what material obligations GAM is commissioned to realise.  
7. **Evidence-injection machinery** — where it lives, what it adds, how it interacts with general DLA signal.  
8. **Evidence validator semantics** — whether machinery may conflate or insufficiently distinguish material vs provenance vs epistemic function; known false-positive classes (including procedural mathematical task material interpreted as evidence-dependent).  
9. **Task–material sufficiency / closure** — whether learner obligations have explicit corresponding materials (quantity, variation, specificity).  
10. **Deterministic vs generative ownership** — responsibilities that may belong in validation rather than prompt prose.  
11. **RECOVER hypothesis** — whether the delta is consistent with regression from the Sprint 71 known-good historical quality baseline (including constructed/generated-content comparison cases); **do not treat regression as established** in T-010 without evidence.

#### Deliverable expectations

- Quantified prompt map by responsibility / section.  
- Historical delta account (known-good / rationalised DLA → additions → current), with per-addition fields above where history permits.  
- Explicit list of duplication / competition / supersession findings.  
- Contract-gap hypotheses for EP → DLA and DLA → GAM (with examples from Lagrangian / Roman Roads where available).  
- Bounded problem register **DLA-P01..P05** (problems, not solutions).  
- Explicit non-findings, including: size/dual-injection did not establish quality regression; GAM not an independent architectural problem; **RECOVER** remains a hypothesis.  
- **No** implementation in T-010. Phase 2 solution design is a **separate** authorised step.

#### Explicit exclusions (T-010)

- Prompt / pack / schema / workflow edits  
- GAM changes  
- Evidence-injection rollback execution  
- Adding a workflow step  
- Settings work  
- Benchmark-score chasing without contract diagnosis  

---

## Phase 2 — Rationalise / fix DLA

**Status:** P01/P02/P03 implemented through **Gate A + Gate B**. **P01-R1 implemented**. Lagrangian re-benchmark QA **84**. **T-031, T-033, T-034 designs complete. T-035 P04 plan complete.** **P04 implementation not authorised. P05 not started.** Do not claim RECOVER.

### S76-T-020 — DLA-P02 solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Solution design complete** (2026-08-13) — [S76-T-020-dla-p02-solution-design.md](S76-T-020-dla-p02-solution-design.md) |
| **Scope** | **DLA-P02 only** |
| **Mode** | DESIGN ONLY — no prompt/validator/schema/production changes |
| **Verdict** | **DLA-P02 READY FOR IMPLEMENTATION PLANNING** (not authorised by this task) |

### S76-T-021 — DLA-P01 solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Solution design complete** (2026-08-13) — [S76-T-021-dla-p01-solution-design.md](S76-T-021-dla-p01-solution-design.md) |
| **Scope** | **DLA-P01 only** |
| **Mode** | DESIGN ONLY — no prompt/validator/schema/production changes |
| **Verdict** | **DLA-P01 READY FOR IMPLEMENTATION PLANNING** (not authorised by this task) |

### S76-T-022 — DLA-P03 solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Solution design complete** (2026-08-13) — [S76-T-022-dla-p03-solution-design.md](S76-T-022-dla-p03-solution-design.md) |
| **Scope** | **DLA-P03 only** |
| **Mode** | DESIGN ONLY — no prompt/validator/schema/production changes |
| **Verdict** | **DLA-P03 READY FOR IMPLEMENTATION PLANNING** (not authorised by this task) |

### S76-T-023 — P01/P02/P03 implementation plan

| Field | Content |
| ----- | ------- |
| **Status** | **Planning complete** (2026-08-13) — [S76-T-023-dla-p01-p02-p03-implementation-plan.md](S76-T-023-dla-p01-p02-p03-implementation-plan.md) |
| **Scope** | Coordinated **P01 + P02 + P03** only (not P04/P05) |
| **Mode** | PLANNING ONLY — no prompt/validator/schema/production/test changes |
| **Verdict** | **P01/P02/P03 IMPLEMENTATION PLAN READY FOR OPERATOR REVIEW** — subsequently authorised and implemented through Gate B (T-024) |

### S76-T-024 — P01/P02/P03 Gate A + Gate B implementation

| Field | Content |
| ----- | ------- |
| **Status** | **Gate A + Gate B complete** (2026-08-13) — [S76-T-024-dla-p01-p02-p03-gate-a-b.md](S76-T-024-dla-p01-p02-p03-gate-a-b.md) |
| **Scope** | Coordinated **P01 + P02 + P03** only (not P04/P05; not Gate C) |
| **Mode** | Implementation through validators + enrich + tests + minimal DLA contract/shape/GAM preservation |
| **Verdict** | **READY FOR OPERATOR REVIEW BEFORE GATE C** — Gate C subsequently run; see T-026 for residual |

### S76-T-026 — P01 residual operand-closure diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-13) — [S76-T-026-dla-p01-residual-operand-closure-diagnostic.md](S76-T-026-dla-p01-residual-operand-closure-diagnostic.md) |
| **Scope** | Gate C Lagrangian A2/A3 P01 residual only (not P04/P05; not a fix) |
| **Mode** | DIAGNOSTIC ONLY |
| **Verdict** | **P01 RESIDUAL READY FOR SOLUTION DESIGN** — subsequently designed in T-027 |

### S76-T-027 — P01 residual operand-closure solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Solution design complete** (2026-08-13) — [S76-T-027-dla-p01-residual-operand-closure-solution-design.md](S76-T-027-dla-p01-residual-operand-closure-solution-design.md) |
| **Scope** | P01-R1 operand vs model/workspace/scaffold only (not P04/P05; not implementation) |
| **Mode** | DESIGN ONLY |
| **Verdict** | **P01 RESIDUAL READY FOR IMPLEMENTATION PLANNING** — subsequently implemented in T-028 |

### S76-T-028 — P01 residual operand-closure implementation

| Field | Content |
| ----- | ------- |
| **Status** | **Implemented** (2026-08-13) — [S76-T-028-dla-p01-residual-operand-closure-implementation.md](S76-T-028-dla-p01-residual-operand-closure-implementation.md) |
| **Scope** | T-027 Option 2: commissioning-order step 2 operand/stimulus clarification only |
| **Mode** | Bounded prompt clarification — no schema, no behavioural validator, no P04/P05, no generation |
| **Verdict** | **P01 RESIDUAL IMPLEMENTED — READY FOR OPERATOR RE-BENCHMARK** |

### S76-T-029 — Design Page graphics capture contract repair

| Field | Content |
| ----- | ------- |
| **Status** | **Implemented** (2026-08-13) — [S76-T-029-design-page-graphics-capture-contract-repair.md](S76-T-029-design-page-graphics-capture-contract-repair.md) |
| **Scope** | Design Page capture generate-row SHAPE gate only (not prompt, not Graphics planner, not P04/P05) |
| **Mode** | Bounded capture enforcement — reuse Sprint 38 envelope + Sprint 70 generate shape; skip assembled-page activity existence |
| **Verdict** | **GRAPHICS CAPTURE/HANDOFF DEFECT IMPLEMENTED — READY TO RECAPTURE DESIGN PAGE** |

### S76-T-030 — Generated-operand operational suitability diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-13) — [S76-T-030-generated-operand-operational-suitability-diagnostic.md](S76-T-030-generated-operand-operational-suitability-diagnostic.md) |
| **Scope** | Lagrangian A3 Problem B generated-operand validity only (not P01 reopen; not P04/P05; not a fix; A4/A5 classify-only) |
| **Mode** | DIAGNOSTIC ONLY |
| **Verdict** | **GENERATED OPERAND VALIDITY READY FOR SOLUTION DESIGN** — do not implement before P04; do not absorb into P04 |

### S76-T-031 — Generated-operand operational suitability solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Solution design complete** (2026-08-13) — [S76-T-031-generated-operand-operational-suitability-solution-design.md](S76-T-031-generated-operand-operational-suitability-solution-design.md) |
| **Scope** | Shared DLA-P03 / GAM fulfilment principle only (not P01/P02; not P04/P05; not implementation; A4/A5 not in scope) |
| **Mode** | DESIGN ONLY |
| **Verdict** | **GENERATED OPERAND VALIDITY DESIGN COMPLETE — IMPLEMENTATION DEFERRED UNTIL AFTER P04** |

### S76-T-032 — Lagrangian A4 constructive-alignment diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-13) — [S76-T-032-dla-a4-constructive-alignment-diagnostic.md](S76-T-032-dla-a4-constructive-alignment-diagnostic.md) |
| **Scope** | A4 LO↔task supporting-check collapse only (not P01/P02/P03; not T-031 implementation; not P04/P05) |
| **Mode** | DIAGNOSTIC ONLY |
| **Verdict** | **A4 CONSTRUCTIVE ALIGNMENT READY FOR SOLUTION DESIGN** — design before P04; implement after; do not absorb into P04 |

### S76-T-033 — DLA LO-operation coverage solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Solution design complete** (2026-08-13) — [S76-T-033-dla-lo-operation-coverage-solution-design.md](S76-T-033-dla-lo-operation-coverage-solution-design.md) |
| **Scope** | DLA learner-production covers mapped LO load-bearing operations (not P01/P02/P03; not T-031; not P04/P05; not implementation) |
| **Mode** | DESIGN ONLY |
| **Verdict** | **LO-OPERATION COVERAGE DESIGN COMPLETE — IMPLEMENTATION DEFERRED UNTIL AFTER P04** |

### S76-T-034 — DLA-P04 evidence-guidance rationalisation solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Solution design complete** (2026-08-13) — [S76-T-034-dla-p04-evidence-guidance-rationalisation-solution-design.md](S76-T-034-dla-p04-evidence-guidance-rationalisation-solution-design.md) |
| **Scope** | DLA evidence/self-audit rationalisation only (not P01/P02/P03 redesign; not P05; not T-031/T-033 implementation; not Sprint 72 rollback) |
| **Mode** | DESIGN ONLY |
| **Verdict** | **DLA-P04 READY FOR IMPLEMENTATION PLANNING** — no implementation authorised from this task |

### S76-T-035 — DLA-P04 evidence-guidance rationalisation implementation plan

| Field | Content |
| ----- | ------- |
| **Status** | **Planning complete** (2026-08-13) — [S76-T-035-dla-p04-evidence-guidance-rationalisation-implementation-plan.md](S76-T-035-dla-p04-evidence-guidance-rationalisation-implementation-plan.md) |
| **Scope** | P04 Option 2 mechanical change-set only (contract + pack notes + prompt tests + version pin; not P05; not T-031/T-033; not validators) |
| **Mode** | IMPLEMENTATION PLANNING ONLY |
| **Verdict** | **DLA-P04 IMPLEMENTATION PLAN READY FOR OPERATOR REVIEW** — no implementation authorised from this task |

Based on audit evidence, later authorised implementation may:

- remove duplication;  
- remove superseded machinery;  
- resolve competing instructions;  
- simplify unclear semantics;  
- fix genuine EP → DLA and DLA → GAM contract defects;  
- rationalise or temporarily disable evidence machinery **if justified**.

**Default:** no new workflow step.

---

## Phase 3 — Roman Roads control runs

**Status:** Not started

Generate Roman Roads **afresh multiple times**. Benchmark each run. Assess:

- mean / typical quality;  
- run-to-run variance;  
- regression against historically strong behaviour;  
- intermediate EP / DLA / GAM contract quality.

Do not rely on a single lucky score.

---

## Phase 4 — Lagrangian challenge runs

**Status:** Not started

Generate Lagrangian Multipliers **afresh multiple times**. Benchmark each run. Assess:

- quality;  
- variance;  
- task–material completeness;  
- disciplinary richness;  
- executable learner activities.

---

## Phase 5 — Decision gate

**Status:** Not started

Only after rationalisation and re-benchmarking determine what content-richness problems genuinely remain. Then evaluate:

- existing DLA evidence injection;  
- task–material sufficiency mechanisms;  
- provenance / authenticity handling;  
- evidence semantics;  
- stronger deterministic closure validation;  
- any remaining content-richness intervention.

**Do not pre-commit** Sprint 76 to a particular new mechanism before this evidence exists.

---

## Closure gate — durable prompt-engineering discipline

**Status:** Required before Sprint 76 closure · **Not started** (exact discipline is an **output** of the sprint, informed by T-010)

Sprint 76 **cannot close** after a one-off DLA rationalisation alone. Before closure, document a durable prompt-engineering discipline that prevents recurrence of **APPEND NOW → RATIONALISE LATER**.

Principles the eventual solution should address (not a pre-committed implementation list):

- identify existing authoritative responsibility before adding instructions;  
- modify / replace rather than automatically append;  
- rationalise superseded / overlapping wording in the same change;  
- place requirements in prompt prose vs schema vs validation vs application logic vs another stage, as appropriate;  
- assess net prompt-size impact; make material growth intentional and explainable;  
- protect behavioural contracts with tests rather than defensive prose accretion;  
- observability sufficient to detect unexpected prompt growth.

**Do not** mandate at open: arbitrary character limits, a particular automated guardrail, a specific metric, or a particular implementation.

See [SPRINT-76-CHARTER.md](SPRINT-76-CHARTER.md) · [S76-D03](decisions.md#s76-d03--durable-prompt-engineering-discipline-as-sprint-76-exit-condition).

---

## Deferred outside opening scope

| Item | Notes |
| ---- | ----- |
| Settings / PB-FA-005 | After this DLA / quality lane |
| Evidence-injection rollback experiment | Option only — not executed at open |
| New workflow step | Default **no** |
| Transition blocking fixes commit | Working-tree fixes exist; operator reviews separately |

---

## Last updated

2026-08-13 — T-035 P04 **implementation plan complete**. No implementation authorised. P04/P05/T-031/T-033 live changes not started. Do not claim RECOVER.
