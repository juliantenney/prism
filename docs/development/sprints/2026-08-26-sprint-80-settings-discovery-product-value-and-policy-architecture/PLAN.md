# Sprint 80 — Plan

**Status:** OPEN  
**Opening decision:** [S80-D01](decisions.md#s80-d01--open-sprint-80--settings-discovery-product-value-and-policy-architecture)  
**Dashboard:** [STATUS.md](STATUS.md)

Task IDs: `S80-T-###`. Decision IDs: `S80-D##`.

---

## Method (binding)

```text
history + current-state topology
  → per-setting catalogue / provenance / supersession audit
  → product-value & framing analysis (A/B/C/D remain open)
  → policy authority / stage-ownership options
  → persistence / lifecycle / compatibility options
  → OPERATOR DECISION GATE (T-006)
  → target architecture + implementation plan (only after decision)
  → discovery sprint closure
```

**Critical principle:** Do not activate an existing Setting merely because it exists. Later architecture (canonical DLA, canonical GAM, PEL, stage contracts) may have **superseded** controls that looked useful when first exposed.

**Target shape to evaluate (not prescribe prematurely):**

```text
UI
  → typed policy
  → stage-owned interpretation
  → canonical prompt / operation projection
  → artefact
```

Avoid: prompt-string injection from UI; global bag of booleans; competing authority with DLA/GAM/PEL/Design Page.

---

## Programme sequence

```text
S80-T-001 … T-004  ✅ COMPLETE — ACCEPTED
  -> S80-T-005 Persistence, lifecycle and compatibility options  ✅ COMPLETE (awaiting acceptance)
  -> S80-T-005A Elicitation-to-workflow-to-Run parameterisation diagnostic  ✅ COMPLETE (awaiting acceptance)
  -> S80-T-005B Minimal runtime parameter contract diagnostic  ✅ COMPLETE (awaiting acceptance)
  -> S80-T-005B.1 Complete brief-factor inventory + resolution   ✅ COMPLETE (awaiting acceptance)
  -> S80-T-005B.2 Brief-factor effectiveness / live-consumer audit ✅ COMPLETE — ACCEPTED
  -> S80-T-006 Operator decision gate                            ✅ DECIDED — Option C (Adjustments)
  -> S80-T-007 Target architecture + implementation plan         ✅ PLAN — awaiting operator review
  -> S80-T-008 Final review + discovery sprint closure           ⬅ after slice authorisation
  -> S80-T-006 Operator product/architecture decision gate  ← NEXT (HUMAN STOP)
  -> S80-T-007 Target architecture + implementation plan (after decision)
  -> S80-T-008 Final review + discovery sprint closure
```

---

## Task definitions

### S80-T-001 — Sprint opening + Settings history / current-state diagnostic

- Status: **COMPLETE — ACCEPTED**
- Record: [S80-T-001](S80-T-001-sprint-opening-settings-history-and-current-state-diagnostic.md)

### S80-T-002 — Existing Settings catalogue + provenance + supersession audit

- Status: **COMPLETE — ACCEPTED**
- Record: [S80-T-002](S80-T-002-existing-settings-catalogue-provenance-supersession-audit.md)
- Delivered: full 41-control ledger; dual classifications; decision-owner map; supersession findings

### S80-T-003 — Settings product value, catalogue philosophy and UX framing

- Status: **COMPLETE — ACCEPTED**
- Record: [S80-T-003](S80-T-003-settings-product-value-catalogue-philosophy-and-ux-framing.md)
- Delivered: product principles; framing analysis; Auto philosophy; disposition of all 41; consolidated concepts; A–D options without winner; T-004 handoff set

### S80-T-004 — Policy authority / stage ownership architecture options

- Status: **COMPLETE — ACCEPTED**
- Record: [S80-T-004](S80-T-004-policy-authority-and-stage-ownership-architecture-options.md)
- Delivered: ownership ledger; policy vs consequence; DLA/GAM ingress; Auto semantics; re-apply/staleness; Options 1–3 with Hybrid preferred candidate; weak C6/C8/C12 disposition; PB-FA-005 implications; T-005 semantic persistence handoff

### S80-T-005 — Persistence, lifecycle and compatibility options

- Status: **COMPLETE** (awaiting operator acceptance unless separately accepted)
- Record: [S80-T-005](S80-T-005-policy-persistence-lifecycle-provenance-and-compatibility-options.md)
- Mode: options + recommendation only
- Delivered: six-way state distinction; persistence Options A/B/C; T-006 decision matrix
- **No** persisted schema change in this sprint

### S80-T-005A — Elicitation-to-workflow-to-Run parameterisation diagnostic

- Status: **COMPLETE** (awaiting operator acceptance)
- Record: [S80-T-005A](S80-T-005A-elicitation-to-workflow-to-run-parameterisation-diagnostic.md)
- Mode: discovery evidence only — **no** parameterisation architecture choice
- Delivered: Create/elicitation inventory; pipeline trace; rich goal + Self-study/Workshop traces; bake vs runtime; transcript reuse proof; thought experiments; Settings ≠ parameterisation
- Acceptance: pending — then **S80-T-006** (human gate)

### S80-T-005B — Minimal runtime parameter contract diagnostic

- Status: **COMPLETE** (awaiting operator acceptance)
- Record: [S80-T-005B](S80-T-005B-minimal-runtime-parameter-contract-diagnostic.md)
- Mode: discovery evidence only — **no** runtime parameter implementation
- Scope: Topic, Duration, Audience (+ source-description disposition). Assessment parameters explicitly excluded
- Delivered: per-parameter traces; feasibility A/B/C/D per parameter (Topic B, Duration B, Audience B conditional); source description = commissioning-only; effective-run-context concept at two existing chokepoints; provisional v1 surface with honest contracts; extensibility + assessment-future check; Settings relationship
- Acceptance: pending — then **S80-T-006** (human gate)

### S80-T-005B.1 — Complete brief-factor inventory and resolution diagnostic

- Status: **COMPLETE** (awaiting operator acceptance)
- Record: [S80-T-005B.1](S80-T-005B.1-complete-brief-factor-inventory-and-resolution-diagnostic.md)
- Mode: discovery evidence only — **no** change to Settings, parameters, elicitation or prompts
- Scope: the whole resolved brief model, deliberately **not** optimised around Topic / Duration / Audience
- Delivered: complete 42-key factor table across 4 layers (28 pack-declared, 5 conditionally code-merged, 8 undeclared passthrough, 1 alias); full enum catalogue; resolution pipeline with exact functions; elicitation contract shapes; open-text → factor mapping; provenance model with 4 loss cases; 13-entry dependency ledger; topology-changing factors with A/B/C/D; runtime-status classification; factor families; parameterisation-relevance classification; 15 vocabulary conflicts; both-way Settings gap analysis
- Acceptance: pending — then **S80-T-005C** (optional assessment-family diagnostic) or **S80-T-006**

### S80-T-005B.2 — Resolved brief-factor effectiveness / live-consumer audit

- Status: **COMPLETE** (awaiting operator acceptance)
- Record: [S80-T-005B.2](S80-T-005B.2-resolved-brief-factor-effectiveness-live-consumer-audit.md)
- Mode: diagnostic only — **no** change to prompts, Settings, parameters, packs or schemas
- Scope: all 44 resolved brief keys, traced to a terminal outcome
- Delivered: 44-row effectiveness matrix; effectiveness counts (7 LIVE / 15 CREATE / 2 STUDIO / 1 INDIRECT / 2 SUPERSEDED / 7 INERT / 10 DEAD); proven-effective product shortlist; six-route analysis; step-param dead-end audit; canonical DLA/GAM supersession verdicts; cognition and assessment family findings; behavioural test evidence and gaps; four corrections to T-005B.1; two probable defects recorded
- Acceptance: **ACCEPTED** (2026-08-27)

### S80-T-006 — Operator product/architecture decision gate

- Status: **DECIDED** (2026-08-27)
- Record: [S80-T-006](S80-T-006-operator-product-architecture-decision-gate.md) · Decision log: **S80-D06**
- Mode: **HUMAN DECISION** — taken by the operator; Cursor recorded and structured it
- Outcome: **Option C — Settings superseded by Adjustments**, comprising (1) a small allowlisted set of **typed workflow parameters** and (2) an optional **per-step natural-language author instruction**
- Key rules: composition not replacement; no new AI interpretation call; structured parameters editable without model capability; instructions may not override schemas/validators/typed parameters/upstream artefacts/topology/canonical requirements; parameters may not change topology; extensibility must be `declare → type → owning interpretation point → runtime projection`
- v1 candidates: Topic, Duration (blocked on defect D1), Audience/level (needs canonical vocabulary), assessment parameters (conditional)
- `[PRISM_STEP_PARAMS]` demoted to legacy transport with no authority; no migration complexity designed
- Prerequisite defects recorded, not fixed: **D1** hardcoded DLA timing text, **D2** canonical DLA cognition bypass

### S80-T-007 — Target architecture + implementation plan

- Status: **PLAN delivered** — awaiting operator review (2026-08-27)
- Record: [S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md) · Decision log: **S80-D07**
- Mode: **design and planning only**; implementation requires explicit slice authorisation
- Architecture: declarative parameter registry → one deterministic `resolveEffectiveRunContext` resolver → three named projections → **two** prompt-assembly ingress points; plus `step.additional_instruction` as a new dedicated field
- **Corrects T-006 §17C:** the projection chokepoint is `buildWorkflowStepInstructions` (`app.js:33394`) + `buildLiveGamV2CopyPromptViaCanonicalAssembler` (`33293`), **not** `applyWorkflowStepRuntimePromptAugmentations` (`15990`), which is called with an empty option map, cannot see new step fields, is bypassed by DA/GAI/LS and is never reached by GAM
- Key findings: **no model call at Run** (copy-to-clipboard; no-API-key requirement already satisfied); per-step author text **already reaches the model** via `step.notes` (`33786–33793`); **Topic is not baked** into any prompt body
- Persistence: `wf.adjustments.parameters` + `step.additional_instruction`; absence means Auto; `resolvedFactors` untouched; nothing written to `[PRISM_STEP_PARAMS]`
- Slices **S1–S10**; Alpha minimum is **S1+S2+S3+S4** (no canonical contract text touched)
- Operator questions **Q1–Q4** gate specific slices; **Q1** alone gates the Alpha minimum
- New defect recorded: **D3** (LS duration step param never reaches the model)
- PB-FA-005: former meaning superseded; no definition carried forward

### S80-T-008 — Final review + discovery sprint closure

- Status: PENDING
- Confirm decisions recorded; plan coherent; open questions separated; next implementation sprint defined if required; no accidental runtime activation

---

## Closure posture

Sprint 80 closes when:

- current Settings reality is documented;
- existing catalogue is reviewed;
- superseded controls are identified;
- product direction is explicitly decided (T-006);
- stage ownership direction is defined;
- persistence/lifecycle direction is defined;
- target architecture is documented;
- implementation plan exists if needed;
- no accidental runtime activation occurred.

---

## Explicit non-goals

See [SPRINT-80-CHARTER.md](SPRINT-80-CHARTER.md) scope guard and [SPRINT-80-START-HERE.md](SPRINT-80-START-HERE.md).
