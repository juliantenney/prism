# Sprint 78 — Plan

**Status:** **OPEN** (opened 2026-08-17)  
**Opening decision:** [S78-D01](decisions.md#s78-d01--open-sprint-78--learner-resource-quality-recovery)  
**Dashboard:** [STATUS.md](STATUS.md) · **Context:** [CONTEXT.md](CONTEXT.md)

Task IDs: `S78-T-###`. Decision IDs: `S78-D##` in [decisions.md](decisions.md).

Repairs follow **diagnosis → design → implementation → regeneration → independent QA**. Do not implement from the sprint open record alone.

---

## Programme phases

```text
S78-D01 (open Sprint 78) ✅ Accepted
  → S78-T-001 (learner production / workspace fulfilment diagnostic) ✅ COMPLETE
  → S78-T-004 (workspace fulfilment solution design) ✅ COMPLETE
  → S78-T-005 (DLA contract + response_fulfilment) ✅ COMPLETE
  → S78-T-007 (GAM blank-cell guard) ✅ COMPLETE
  → S78-T-008 (WS1 integration + Lagrangian Gate) ✅ COMPLETE — fresh **87/100**, 0 Critical, 0 Major
  → S78-T-009 (P02 provider-row output-shape salience) ✅ COMPLETE
  → S78-T-002 (modelling / practice independence diagnostic) ✅ COMPLETE
  → S78-T-010 (modelling / practice independence solution design) ✅ COMPLETE
  → S78-T-011 (DLA model/practice independence commissioning) ✅ COMPLETE
  → S78-T-012 (GAM operand-aware authoring) ✅ COMPLETE
  → S78-T-014 (GAM operational suitability solution design) ✅ COMPLETE
  → S78-T-015 (GAM suitability salience implementation) ✅ COMPLETE — Stage-1 insufficient (C4)
  → S78-T-016 (Stage-2 enforcement design) ✅ COMPLETE
  → S78-T-017 (GAM suitability review pass) ✅ COMPLETE
  → S78-T-017A (review-scope fingerprint) ✅ COMPLETE
  → S78-T-018 (GAM verification UX / workflow integration) ✅ COMPLETE
  → S78-T-018A (DLA scope leak + fenced review JSON) ✅ COMPLETE
  → S78-T-020 (final-step Continue to Authoring CTA placement) ✅ COMPLETE
  → S78-D02 (first-pass GAM reliability; verifier = temporary instrumentation) ✅ Accepted
  → S78-T-013 (WS2 integration verification) — OPEN (C6 attempt 2 QA 88/100; first-pass E2; not closed)
  → S78-T-025 (disciplinary-precision authoring design) — DEFINED, not started
  → S78-T-003 (check / revision architecture diagnostic) ✅ COMPLETE
  → S78-T-021 (check / revision architecture solution design) ✅ COMPLETE
  → S78-T-022 (DLA diagnostic-review commissioning + capture) ✅ COMPLETE
  → S78-T-023 (GAM guided-review salience) — CONDITIONAL; do not open by default
  → S78-T-024 (WS3 integration / fresh benchmark) — QUEUED after T-022
  → S78-T-019 (activity timing / duration diagnostic) — QUEUED
  → Final Gate: fresh Lagrangian EP→package→QA (≥90 uncapped; 0 Critical; 0 Major)
```

**Present product rule ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)):** intended GAM experience is one step (valid capture → complete → Next). T-017–T-018 review is **temporary instrumentation**, not final architecture and not rejected. A verifier FAIL is a **generation failure**. **“Regenerate until it passes” is not an acceptable reliability outcome.**

---

## Workstream 1 — Learner production / workspace fulfilment

### S78-T-001 — Learner production / workspace fulfilment diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-17) — [S78-T-001-learner-production-workspace-fulfilment-diagnostic.md](S78-T-001-learner-production-workspace-fulfilment-diagnostic.md) |
| **Primary finding** | **B** — task/table mismatch on bound A1 inventory; secondary **C/D/G** |
| **Proposed next** | **S78-T-008** ✅ complete — WS1 **CLOSED** |

---

### S78-T-004 — Learner production / workspace fulfilment solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Design complete** (2026-08-17) — implemented via T-005 / T-007 |
| **Architecture** | **S78-WS-1 Response fulfilment binding** — `response_fulfilment` on `required_materials[]` + DLA capture gate + GAM blank-cell guard |
| **Verification** | [S78-T-004-learner-production-workspace-fulfilment-solution-design.md](S78-T-004-learner-production-workspace-fulfilment-solution-design.md) |

---

### S78-T-005 — DLA contract + response fulfilment commissioning

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-005-dla-response-fulfilment-implementation.md](S78-T-005-dla-response-fulfilment-implementation.md) |
| **Scope** | DLA §4/§Commissioning + capture validator + T-023 projection + regression tests |
| **Contract version** | `78-DLA-WS-1` |

---

### S78-T-007 — GAM blank-cell guard

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-007-gam-workspace-blank-cell-implementation.md](S78-T-007-gam-workspace-blank-cell-implementation.md) |
| **Scope** | `validateGamPartialPageCapture` + `validateGamEnrichedPage` blank-cell gate for `learner_workspace` table-family rows |
| **Depends on** | S78-T-005 complete |

---

### S78-T-008 — WS1 integration verification + Lagrangian Gate

| Field | Content |
| ----- | ------- |
| **Status** | **Complete** (2026-08-17) — [record](S78-T-008-workstream-1-integration-verification.md) |
| **Outcome** | Workstream 1 **CLOSED** — fresh Lagrangian **87/100**, 0 Critical, 0 Major (operator QA) |
| **Scope** | S78-WS-1 commissioning + GAM blank-cell guard + T-009 P02 salience on live regeneration path |

---

### S78-T-009 — P02 provider-row output-shape salience repair

| Field | Content |
| ----- | ------- |
| **Status** | **Complete** (2026-08-17) — [S78-T-009-dla-p02-provider-row-output-shape-salience-repair.md](S78-T-009-dla-p02-provider-row-output-shape-salience-repair.md) |
| **Scope** | §10 OUTPUT conditional P02 invariant + pre-output checklist; prompt consistency tests |
| **Prompt delta** | +930 chars canonical (+3.2%) |

---

## Workstream 2 — Modelling / practice independence

### S78-T-002 — Modelling / practice independence diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-17) — [S78-T-002-modelling-practice-independence-diagnostic.md](S78-T-002-modelling-practice-independence-diagnostic.md) |
| **Primary classification** | **B** — independence commissioned ambiguously; secondary **G** |
| **Earliest causal layer** | DLA commissioning (no fail-closed problem-instance independence) |
| **Proposed next** | **S78-T-010** ✅ complete |

---

### S78-T-010 — Modelling / practice independence solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Design complete** (2026-08-17) — [S78-T-010-modelling-practice-independence-solution-design.md](S78-T-010-modelling-practice-independence-solution-design.md) |
| **Architecture** | **S78-WS-2 Model–practice operand independence binding** — `practice_independence` on model rows + DLA capture closure + GAM operand-aware SP-06 |
| **Representation** | Lightweight row metadata (not specification-only) |
| **Proposed next** | **S78-T-012** ✅ complete |

---

### S78-T-011 — DLA model/practice independence commissioning

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-011-dla-model-practice-independence-commissioning.md](S78-T-011-dla-model-practice-independence-commissioning.md) |
| **Contract version** | `78-DLA-WS-2` |
| **Scope** | `practice_independence` binding + §4/§6/§10 salience + capture gate + T-023 projection |
| **Proposed next** | **S78-T-012** ✅ complete → **S78-T-013** |

---

### S78-T-012 — GAM operand-aware model/practice independence authoring

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-012-gam-operand-aware-model-practice-independence-authoring.md](S78-T-012-gam-operand-aware-model-practice-independence-authoring.md) |
| **Scope** | S78-WS-2 GAM Stage-1: post-commission WS2 block + SP-06/07 cross-references + prompt-contract tests G1–G8 |
| **Prompt delta** | WS2 block +1,055 chars per binding; SP-06/07 one-line cross-references each |
| **Proposed next** | **S78-T-013** integration verification (**OPEN**) |

---

### S78-T-013 — WS2 integration verification

| Field | Content |
| ----- | ------- |
| **Status** | **OPEN** (2026-08-17) — C6 attempt 2 QA **88/100**, suitability PASS, WS2 positive; attempt 1 E2. Not closed by regen-until-pass. [C6 disciplinary](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md) · [C6 E2](S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md) · C5 [collector repair](S78-T-013-candidate-5-t015-collector-binding-repair.md) ✅. |
| **Scope** | Fresh Lagrangian EP→DLA→GAM→**Verify generated materials** (temporary instrumentation)→QA; semantic WS2 gate; WS1/P02 regression |
| **Do not conflate** | WS2 independence vs operational suitability (C4: both can diverge) |
| **Blocker** | Operator-led fresh run; unit tests do not close T-013; **“regenerate until pass” is not closure** ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)) |
| **QA already run this sprint** | T-008 **87/100** exists (WS1 closed; WS2 capability). T-013 **closure** QA is still pending. C4 correctly had no QA. |
| **Proposed next on WS2 PASS** | **S78-T-003** Check/revision diagnostic |

---

### S78-T-014 — GAM operational suitability / operand validity solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Design complete** (2026-08-17) — [S78-T-014-gam-operational-suitability-solution-design.md](S78-T-014-gam-operational-suitability-solution-design.md) |
| **Scope** | Domain-general suitability invariant; salience-first Stage-1 contract design; no schema/validator changes |
| **Decision** | New invariant composes with WS1/WS2; bounded GAM salience implementation recommended |
| **Proposed next** | **S78-T-015** bounded implementation, then resume T-013 |

---

### S78-T-015 — GAM operational suitability authoring salience implementation

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-015-gam-operational-suitability-authoring-salience-implementation.md](S78-T-015-gam-operational-suitability-authoring-salience-implementation.md) |
| **Scope** | Commission-local S78-OPERATIONAL-SUITABILITY block + R1–R10 prompt-contract tests |
| **Depends on** | S78-T-014 complete |
| **Next** | Stage-1 insufficient (C4) — T-016–T-018 instrumentation retained per [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification) |

---

### S78-T-016 — Operational suitability Stage-2 enforcement design

| Field | Content |
| ----- | ------- |
| **Status** | **Design complete** (2026-08-17) — [S78-T-016-operational-suitability-stage-2-enforcement-design.md](S78-T-016-operational-suitability-stage-2-enforcement-design.md) |
| **Decision** | Separate general semantic verification pass (E) + retain T-015 (F); not more prompt; not domain solvers |
| **Product status** | Implemented in T-017–T-018 as **temporary instrumentation**, not final architecture ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)) |
| **Next** | Resume **S78-T-013** |

---

### S78-T-017 — GAM operational suitability review pass

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-017-gam-operational-suitability-review-pass-implementation.md](S78-T-017-gam-operational-suitability-review-pass-implementation.md) |
| **Scope** | Verification Copy prompt + review artefact + fail-closed GAM acceptance |
| **Depends on** | S78-T-016 complete |
| **Next** | UX integrated in **T-018**. Resume **S78-T-013**. Verifier is temporary instrumentation ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)). |

---

### S78-T-018 — Operational suitability review UX + workflow integration

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-018-operational-suitability-review-ux-workflow-integration.md](S78-T-018-operational-suitability-review-ux-workflow-integration.md) |
| **Scope** | GAM sub-flow: Verify generated materials + Check verification; fail-closed Next/complete |
| **Depends on** | S78-T-017 / T-017A |
| **Product status** | Coherent GAM sub-flow for **temporary** semantic verification ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)) — not the intended permanent GAM contract |
| **Corrective** | **T-018A** — DLA must not enter verification; review prompt requires one fenced `json` block |
| **Next** | Resume **S78-T-013** |

---

### S78-T-018A — GAM review scope regression + verification copy/paste fix

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-018A-gam-review-scope-regression-verification-copy-paste-fix.md](S78-T-018A-gam-review-scope-regression-verification-copy-paste-fix.md) |
| **Scope** | Confine verification to GAM step identity; fenced Copilot review JSON |
| **Depends on** | S78-T-018 |
| **Next** | Resume **S78-T-013** |

---

### S78-T-020 — Final workflow Continue to Authoring CTA placement

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-020-final-workflow-continue-to-authoring-cta-fix.md](S78-T-020-final-workflow-continue-to-authoring-cta-fix.md) |
| **Scope** | Run-mode UI: hide Next on the final step; place Continue to Authoring below paste/status; enable from existing capture-complete gate |
| **Does not include** | Prompt/DLA/GAM/assembly/renderer/QA contracts · T-013 · T-003 · T-019 |
| **Next** | Resume **S78-T-013** |

---

## Workstream 3 — Check / revision architecture

### S78-T-003 — Check / revision architecture diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-17) — [S78-T-003-check-revision-architecture-diagnostic.md](S78-T-003-check-revision-architecture-diagnostic.md) |
| **Exhibit** | Fresh T-013-path QA **88/100**; F&S **78**; A1–A4 Check Weak; **A5 Check Strong** |
| **Primary class** | **A** — EP/archetype closure does not require `verification` (OR-group with transition) |
| **Secondary** | **B** — DLA has no fail-closed activity-level review; G1/DLA-WB-26 prompt-only |
| **Multiple-response hypothesis** | **Correlated, not causal** |
| **One-review-per-activity** | **YES** when substantive independent production exists |
| **Next** | **S78-T-021** solution design — **complete** |

### S78-T-021 — Check / revision architecture solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Design complete** (2026-08-17) — [S78-T-021-check-revision-architecture-solution-design.md](S78-T-021-check-revision-architecture-solution-design.md) |
| **Depends on** | S78-T-003 complete |
| **Mode** | Design only — **no implementation** |
| **Decision** | **S78-WS-3:** DLA fail-closed exactly one `diagnostic_review` checklist when substantive independent production exists; bind `covers_response_material_ids` to WS1 fulfilment ids; EP clarification only (do **not** mandate `verification`); keep GAM `guided_criteria`; G1/DLA-WB-26 **replaced** by the new invariant |
| **Next** | **S78-T-024** integration verification — queued |

### S78-T-022 — DLA diagnostic-review commissioning contract + capture

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-17) — [S78-T-022-dla-diagnostic-review-commissioning-implementation.md](S78-T-022-dla-diagnostic-review-commissioning-implementation.md) |
| **Depends on** | S78-T-021 complete |
| **Mode** | DLA implementation |
| **Delivered** | `78-DLA-WS-3`; `lib/dla-diagnostic-review.js`; capture gate; GAM projection; tests |
| **Next** | **S78-T-024** integration verification — queued; **T-023** conditional only |

### S78-T-023 — GAM guided-review salience (conditional)

| Field | Content |
| ----- | ------- |
| **Status** | **Not opened** — only if a post-T-022 exhibit shows the commissioned diagnostic checklist is not authored as `guided_criteria` |
| **Depends on** | S78-T-022 + failing exhibit |

### S78-T-024 — WS3 integration verification / fresh benchmark

| Field | Content |
| ----- | ------- |
| **Status** | **Queued** after T-022 (and T-023 only if opened) |
| **Does not close** | T-013 · T-019 |

---

### S78-T-025 — General disciplinary-precision authoring solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Defined — not started** |
| **Mode** | DESIGN ONLY when authorised |
| **Depends on** | [C6 disciplinary diagnostic](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md) |
| **Scope** | One general epistemic-precision invariant; GAM + DLA wording + visual-commissioning salience; cross-disciplinary fixtures; no verifier expansion; no domain solvers; no new schema |
| **Does not include** | Implementation · T-019 · E2 sanitiser · Lagrangian hand-tuning |

---

### S78-T-019 — Activity timing / duration diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Queued — not authorised** |
| **Mode** | **DIAGNOSTIC ONLY** when started |
| **Exhibit** | Fresh learner resources omit expected activity time/duration |
| **Diagnostic question** | Where should activity timing originate, and why is it absent from the learner-facing resource? |
| **Trace** | expected duration/orientation → upstream planning → DLA/GAM if relevant → assembly → renderer/learner presentation |
| **Do not assume** | Renderer ownership |
| **Verification** | [S78-T-019-activity-timing-duration-diagnostic.md](S78-T-019-activity-timing-duration-diagnostic.md) |

---

## Moderate / presentation findings — disposition

| Finding | Disposition |
| ------- | ----------- |
| Activity 3 solution workspace: free-text Markdown-like table scaffolding vs structured mathematical workspace | **Logged, lower priority.** Do not elevate above instructional/reliability workstreams unless a shared architectural cause is proven. |
| Stray blank lines above some response fields | Logged; lower priority. |
| Missing horizontal rule / separator between activities | Logged; lower priority. |
| Image mismatch / persistence / operator-path | Logged where relevant; lower priority. |
| Activity time/duration not displayed | **In sprint as T-019** (queued diagnostic). Not renderer-assumed. |

---

## Final Gate (sprint exit)

| Criterion | Target |
| --------- | ------ |
| Path | Fresh top-to-bottom Lagrangian: EP → DLA → GAM → design/graphics → assembly → learner package |
| QA | Independent QA, PRISM Resource Quality Benchmark v2.2 |
| Uncapped score | **≥ 90/100** |
| Critical defects | **0** |
| Major defects | **0** |

Sprint 78 is **not** complete on diagnostic or unit-test pass alone. Exit must be achieved through **general architectural reliability**, not hand-tuning the Lagrangian resource.

**“Regenerate until it passes” is not an acceptable reliability outcome** ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)).

---

## Out of sprint queue (reference)

See [CONTEXT.md](CONTEXT.md) and [SPRINT-78-CHARTER.md](SPRINT-78-CHARTER.md). E2 (known recurrence, fail-closed, T-026 protocol), PB-FA-010, Phase D, Settings, etc. remain outside unless blocking the benchmark. Do **not** reopen Sprint 77. Do **not** add E2 sanitisation in this sprint.
