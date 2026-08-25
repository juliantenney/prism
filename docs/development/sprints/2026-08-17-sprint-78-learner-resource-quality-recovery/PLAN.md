# Sprint 78 — Plan

**Status:** **CLOSED** (closed 2026-08-25) — [S78-T-056](S78-T-056-sprint-78-closure.md) · [S78-D05](decisions.md#s78-d05--close-sprint-78)  
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
  → S78-T-013 (WS2 integration verification) ✅ CLOSED (2026-08-25) — [T-056](S78-T-056-sprint-78-closure.md)
  → S78-T-025 (disciplinary-precision authoring design) ✅ COMPLETE — [S78-D03](decisions.md#s78-d03--disciplinary-warrant-authoring-salience-s78-dp)
  → S78-T-026 (disciplinary-precision salience implementation) ✅ COMPLETE
  → S78-T-027 (GPT maths-authoring reliability diagnostic) ✅ COMPLETE — T-028 salience recommended
  → S78-T-028 (LD-MATH-RENDER prose-inside-math salience implementation) ✅ COMPLETE
  → S78-T-029 (restore LD-MATH-RENDER on live GAM V2 Copy prompt) ✅ COMPLETE
  → S78-T-030 (missing page-synthesis closure / study-tips diagnostic) ✅ COMPLETE
  → S78-T-031 (page-closure ownership design) ✅ COMPLETE — [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport)
  → S78-T-032 (GAM learner-closure packaging) ✅ COMPLETE — designated `### Page learner-resource closure` → DP `study_tips` transport
  → S78-T-003 (check / revision architecture diagnostic) ✅ COMPLETE
  → S78-T-021 (check / revision architecture solution design) ✅ COMPLETE
  → S78-T-022 (DLA diagnostic-review commissioning + capture) ✅ COMPLETE
  → S78-T-023 (GAM guided-review salience) — NOT OPENED
  → S78-T-024 (WS3 integration / fresh benchmark) — SATISFIED / WAIVED ([T-056](S78-T-056-sprint-78-closure.md))
  → S78-T-019 / T-036 / T-037 (learner timing) — T-037 COMPLETE (LS timeline projection)
  → S78-T-052 / T-054 / T-055 / T-056 — closure readiness → snag fix → closure admin ✅
  → Final Gate: fresh Lagrangian EP→package→QA (≥90 uncapped; 0 Critical; 0 Major) ✅ MET (94/100)
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
| **Proposed next** | **S78-T-013** integration verification — later **CLOSED** ([T-056](S78-T-056-sprint-78-closure.md)) |

---

### S78-T-013 — WS2 integration verification

| Field | Content |
| ----- | ------- |
| **Status** | **CLOSED** (2026-08-25) — [S78-T-013](S78-T-013-workstream-2-integration-verification.md) · evidence matrix [T-056](S78-T-056-sprint-78-closure.md). Historical path: C6 attempt 2 QA **88/100**, suitability PASS, WS2 positive; attempt 1 E2. Not closed by regen-until-pass. |
| **Scope** | Fresh Lagrangian EP→DLA→GAM→**Verify generated materials** (temporary instrumentation)→QA; semantic WS2 gate; WS1/P02 regression |
| **Do not conflate** | WS2 independence vs operational suitability (C4: both can diverge) |
| **Closure** | Administrative close under T-056; E2 carry-forward; HR first-pass PASS/PASS regen 0 as signal only |
| **QA on path** | T-008 **87**; C6 **88**; Lagrangian **94** (Final Gate); HR **92** (corroboration) |

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
| **Next** | **S78-T-024** — dispositioned SATISFIED/WAIVED at sprint close ([T-056](S78-T-056-sprint-78-closure.md)); **T-023** NOT OPENED |

### S78-T-023 — GAM guided-review salience (conditional)

| Field | Content |
| ----- | ------- |
| **Status** | **NOT OPENED** — conditional trigger never met; confirmed at [T-056](S78-T-056-sprint-78-closure.md) |
| **Depends on** | S78-T-022 + failing exhibit |

### S78-T-024 — WS3 integration verification / fresh benchmark

| Field | Content |
| ----- | ------- |
| **Status** | **SATISFIED / WAIVED** (2026-08-25) — [S78-T-056](S78-T-056-sprint-78-closure.md); Check Strong evidence on C6 / Lagrangian 94 / HR Essentials |
| **Does not reopen** | T-013 · Sprint 78 |

---

### S78-T-025 — General disciplinary-precision authoring solution design

| Field | Content |
| ----- | ------- |
| **Status** | **Design complete** (2026-08-25) — [S78-T-025-disciplinary-precision-authoring-solution-design.md](S78-T-025-disciplinary-precision-authoring-solution-design.md) |
| **Decision** | [S78-D03](decisions.md#s78-d03--disciplinary-warrant-authoring-salience-s78-dp) — S78-DP salience at DLA + GAM + Design Page/visual; no verifier/schema/domain solvers |
| **Depends on** | [C6 disciplinary diagnostic](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md) |
| **Proposed next** | **S78-T-026** bounded salience implementation ✅ |

---

### S78-T-027 — GPT maths-authoring reliability diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-027-gpt-maths-authoring-reliability-diagnostic.md](S78-T-027-gpt-maths-authoring-reliability-diagnostic.md) |
| **Trigger** | Post-T-026 GAM capture fail: A5-M1 `PROSE_INSIDE_MATH` — `\text{total programme expenditure}` inside `\[...\]` |
| **Finding** | Validator correct; LD-MATH-RENDER salience gap on `\text{...}` instructional labels |
| **Proposed next** | **S78-T-028** one-line shared contract salience + regression tests |

---

### S78-T-028 — LD-MATH-RENDER prose-inside-math salience implementation

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-028-ld-math-render-prose-inside-math-salience-implementation.md](S78-T-028-ld-math-render-prose-inside-math-salience-implementation.md) |
| **Scope** | Add one shared LD-MATH-RENDER salience line (`\text{...}` instructional prose outside delimiters), sync `app.js` fallback, and add fail/pass/tolerated + injection tests |
| **Constraints upheld** | Validator heuristic unchanged; no schema changes; no domain-specific bans; no T-026 broadening |
| **Next** | **S78-T-029** live V2 Copy injection ✅; then operator fresh Lagrangian regen; T-013 remains OPEN |

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-029-restore-ld-math-render-on-live-gam-v2-copy-prompt.md](S78-T-029-restore-ld-math-render-on-live-gam-v2-copy-prompt.md) |
| **Scope** | Post-assembly `applyMathSafeOutputContractToDraft` on `buildWorkflowStepInstructions` V2 Copy path; Run Copy regression test |
| **Constraints upheld** | T-028 wording unchanged; no brief duplication; no validator/schema changes |
| **Next** | Operator fresh Lagrangian regen/benchmark; T-013 remains OPEN |

---

### S78-T-030 — Missing page-synthesis closure / study-tips diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-030-missing-page-synthesis-closure-diagnostic.md](S78-T-030-missing-page-synthesis-closure-diagnostic.md) |
| **Finding** | Assembled `page_synthesis` lacks `study_tips` by design (transport-or-omit; no synthesis). Not renderer; not T-029-class live injection gap. No `final_synthesis`/`next_steps` schema. |
| **Next** | Ownership decided in **S78-T-031** / [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport) |

---

### S78-T-031 — Page-closure ownership historical/design decision

| Field | Content |
| ----- | ------- |
| **Status** | **Design/decision complete** (2026-08-25) — [S78-T-031-page-closure-ownership-design-decision.md](S78-T-031-page-closure-ownership-design-decision.md) |
| **Decision** | [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport) — **Option B**: GAM owns closure substance; Design Page transport-only into `study_tips`; reject Option A; C is interim compliance only |
| **Minimal future change** | Prompt/contract packaging only (when authorised). No schema, renderer, or new page-synthesis fields |
| **Next** | Implemented in **S78-T-032** |

---

### S78-T-032 — GAM learner-closure packaging implementation

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-032-gam-learner-closure-packaging-implementation.md](S78-T-032-gam-learner-closure-packaging-implementation.md) |
| **Decision** | [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport) |
| **Scope** | GAM commissions `### Page learner-resource closure`; Design Page transport-only into `study_tips`; live V2 Copy + partial DP salience; regressions |
| **Next** | Fresh Lagrangian regen/benchmark; T-013 remains OPEN |

---

### S78-T-033 — Literal TeX learner-rendering diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-033-literal-tex-learner-rendering-diagnostic.md](S78-T-033-literal-tex-learner-rendering-diagnostic.md) |
| **Exhibit** | Post–T-026/T-029 ~91/100 Lagrangian package: `\frac{U_x}{U_y}`, `\frac{p_x}{p_y}`, FOC lines show as literal TeX while partial-derivative blocks render |
| **Root cause** | vNext `render-html-utils.js` applies Markdown underscore emphasis inside unprotected `\(...\)` / `\[...\]` spans — not GAM, transport, validator, or MathJax config |
| **Proposed next** | **S78-T-034** — vNext math-delimiter protect/restore (legacy parity) + live-path regression |

---

### S78-T-034 — vNext math-delimiter protection implementation

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-034-vnext-math-delimiter-protection-implementation.md](S78-T-034-vnext-math-delimiter-protection-implementation.md) |
| **Implements** | [S78-T-033](S78-T-033-literal-tex-learner-rendering-diagnostic.md) |
| **Scope** | Shared `math-delimiter-markdown-protection.js` + vNext `render-html-utils.js` protect/restore; 8 regressions incl. live `renderLearnerPageForTest` path |
| **Next** | Fresh Lagrangian regen/benchmark + visual maths check; T-013 remains OPEN |

---

### S78-T-035 — Legacy renderer retirement / vNext parity diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-035-legacy-renderer-retirement-vnext-parity-diagnostic.md](S78-T-035-legacy-renderer-retirement-vnext-parity-diagnostic.md) |
| **Decision** | **B** — obsolete **page** renderer retired (S74A); shared `app.js` markdown/orchestration residue + test targeting legacy helpers = unfinished hygiene, not live second renderer |
| **Proposed follow-on** | T-036 parity audit · T-037 math-module consolidation · T-038 dead branch deletion (design only until opened) |

---

### S78-T-026 — General disciplinary-precision authoring salience implementation

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-026-disciplinary-precision-authoring-salience-implementation.md](S78-T-026-disciplinary-precision-authoring-salience-implementation.md) |
| **Depends on** | S78-T-025 · S78-D03 |
| **Scope** | DLA + GAM + Design Page/visual/image-prompt salience; prompt-contract tests; cross-disciplinary fixtures |
| **Next** | Post-T-026 GAM math integrity fail — [T-027](S78-T-027-gpt-maths-authoring-reliability-diagnostic.md); **T-028** salience recommended; T-013 remains OPEN |

---

### S78-T-036 — Learner timing metadata regression diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-036-learner-timing-metadata-regression-diagnostic.md](S78-T-036-learner-timing-metadata-regression-diagnostic.md) |
| **Supersedes** | S78-T-019 (queued placeholder) |
| **Decision** | Missing `activities[].duration_minutes` upstream; vNext header sums activities only (ignores `learning_sequence.total_duration_minutes`); export/badge rendering intact. Operator later showed LS timeline **did** hold 8/14/16/11/11. |
| **Implemented by** | [S78-T-037](S78-T-037-restore-learner-timing-metadata.md) — LS timeline projection + header fallback; **not** DLA salience |

---

### S78-T-037 — Restore learner timing metadata

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-037-restore-learner-timing-metadata.md](S78-T-037-restore-learner-timing-metadata.md) |
| **Implements** | [S78-T-036](S78-T-036-learner-timing-metadata-regression-diagnostic.md) as revised by operator LS-timeline evidence |
| **Scope** | Assemble: `timeline[].duration_minutes` → `activities[].duration_minutes` when absent; vNext header fallback to `learning_sequence.total_duration_minutes`; live-path tests |
| **Not in scope** | DLA required-output salience · grouping projection · schema change |

---

### S78-T-038 — Learner composition and presentation regression diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-038-learner-composition-presentation-regression-diagnostic.md](S78-T-038-learner-composition-presentation-regression-diagnostic.md) |
| **Exhibit** | Post–T-037 Lagrangian QA **94**; operator defects: no final transfer production; collapsed numbered tasks; guided-review `1. A.`; A3 bold workspace labels |
| **Decision** | Four independent owners — do not merge; Study tips ≠ transfer task; P1 renderer → P2 parser → P3 DLA transfer → P4 workspace fidelity |
| **Proposed follow-on** | T-039…T-042 **all complete** |

---

### S78-T-039 — Guided-review feature-list enumeration fix

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-039-guided-review-feature-list-enumeration-fix.md](S78-T-039-guided-review-feature-list-enumeration-fix.md) |
| **Implements** | [S78-T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md) Defect 3 |
| **Scope** | `renderGuidedFeatureLists` look-for `<ol>` → `<ul>`; preserve A/B keys and missing guidance |
| **Not in scope** | Schema · A/B generation · global markdown lists · T-040+ |

---

### S78-T-040 — Numbered learner-task structure recovery

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-040-numbered-learner-task-structure-recovery.md](S78-T-040-numbered-learner-task-structure-recovery.md) |
| **Implements** | [S78-T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md) Defect 2 |
| **Scope** | `parseLearnerTask` consecutive mid-line `\d+[.)]\s+` split; false-positive guards |
| **Not in scope** | DLA salience · schema · markdown lists · T-041+ |

---

### S78-T-041 — Restore culminating learner transfer production

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-041-restore-culminating-learner-transfer-production.md](S78-T-041-restore-culminating-learner-transfer-production.md) |
| **Implements** | [S78-T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md) Defect 1 |
| **Scope** | DLA + GAM salience for culminating `transfer_prompt`; live V2 Copy; Study tips remain consolidation |
| **Not in scope** | New schema · DP authorship · Study tips as transfer · T-042 |

---

### S78-T-042 — Learner workspace authoring fidelity

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-042-learner-workspace-authoring-fidelity.md](S78-T-042-learner-workspace-authoring-fidelity.md) |
| **Implements** | [S78-T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md) Defect 4 |
| **Scope** | DLA + GAM salience for `template` `**Label:**` / table-family workspaces; live V2 Copy; no parser broaden; maths editor parked |
| **Not in scope** | Editable maths · MathQuill/MathLive · bold-prose parser guess · schema |

---

### S78-T-044 — Final learner-renderer presentation snagging

| Field | Content |
| ----- | ------- |
| **Status** | **Complete** (2026-08-25) — [S78-T-044-final-learner-renderer-presentation-snagging.md](S78-T-044-final-learner-renderer-presentation-snagging.md) |
| **Scope** | Look-for bullet CSS (authorised); Orient→A1 separator (existing convention); diagnose Activity N headings + grouping badges |
| **Not in scope** | Content regen · pretty grouping labels · `Activity N:` heading restore · T-013 / sprint close |

---

### S78-T-045 — Image instructional-fidelity diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-045-image-instructional-fidelity-diagnostic.md](S78-T-045-image-instructional-fidelity-diagnostic.md) |
| **Mode** | DIAGNOSTIC ONLY |
| **Finding** | Synthesis claim inventions confirmed **B→D** (atmospheric inputs / upstream inflows / outflows to other basins); residence→direction **A**. Live human path omits Concept boundary + evidence. Hardening design-only (§11). |
| **Not in scope** | Implementation · workspace redesign · T-013 / sprint close |

---

### S78-T-046 — Resource-level image consistency diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-046-resource-level-image-consistency-diagnostic.md](S78-T-046-resource-level-image-consistency-diagnostic.md) |
| **Mode** | DIAGNOSTIC ONLY |
| **Finding** | No page-level visual-style SSOT; artistic family is model-discretionary. Cheap harden via deterministic PRISM house-style block in human prompts; no schema/reference images; parallel jobs remain independent. Prefer **separate** impl from T-045 fidelity (**B**). |
| **Not in scope** | Implementation · claim-boundary changes · Graphics workflow redesign · T-013 / sprint close |

---

### S78-T-047 — Harden image instructional fidelity for synthesis visuals

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-047-harden-image-instructional-fidelity-synthesis.md](S78-T-047-harden-image-instructional-fidelity-synthesis.md) |
| **Mode** | Implementation |
| **Change** | Synthesis Concept/claim boundary + live human authorised evidence; strengthened activity Concept boundary; DP/VA S78-VA synthesis commissioning salience |
| **Not in scope** | T-046 house style · schema expansion · GAM visual ownership · EP→DLA→GAM regen · T-013 / sprint close |

---

### S78-T-048 — Harden resource-level image visual consistency

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-048-harden-resource-visual-consistency.md](S78-T-048-harden-resource-visual-consistency.md) |
| **Mode** | Implementation |
| **Change** | Deterministic PRISM `Resource visual language` house block in every live human image prompt (+ canonical mirror from same module); no schema; parallel jobs unchanged |
| **Not in scope** | Claim/evidence changes · reference images · pixel validation · T-013 / sprint close |

---

### S78-T-049 — First-pass generation validation reliability diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-049-first-pass-generation-validation-reliability-diagnostic.md](S78-T-049-first-pass-generation-validation-reliability-diagnostic.md) |
| **Mode** | DIAGNOSTIC ONLY |
| **Finding** | Validators correct; DLA P02 residual stochastic post–T-009; GAM lacks high-salience silent role + quantitative pre-emit checks (OPS-2 catches). Decision **C**. |
| **Not in scope** | Implementation · validator weakening · UX redesign · T-013 / sprint close |

---

### S78-T-050 — Harden DLA evidence-provider first-pass consistency

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-050-dla-evidence-provider-first-pass-hardening.md](S78-T-050-dla-evidence-provider-first-pass-hardening.md) |
| **Mode** | Implementation |
| **Change** | Ultra-short FINAL SILENT PRE-EMIT CHECK (P02) at end of live DLA §10; reinforces existing invariant; validator unchanged |
| **Not in scope** | GAM hardening · schema/validator changes · auto-retry · T-013 / sprint close |

---

### S78-T-051 — Harden GAM first-pass semantic and quantitative consistency

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-051-gam-first-pass-consistency-hardening.md](S78-T-051-gam-first-pass-consistency-hardening.md) |
| **Mode** | Implementation |
| **Change** | Compact FINAL SILENT PRE-EMIT CONSISTENCY CHECK (role/status + conditional quantitative/derived) on live GAM V2 Copy; canonical contract constant; validators unchanged |
| **Not in scope** | DLA T-050 edits · schema/validator changes · auto-retry · claiming stochastic improvement · T-013 / sprint close |

---

### S78-T-052 — Sprint 78 closure-readiness diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-052-sprint-78-closure-readiness-diagnostic.md](S78-T-052-sprint-78-closure-readiness-diagnostic.md) — **C** executed via T-056 |
| **Mode** | DIAGNOSTIC ONLY |
| **Finding** | Recommend **C READY TO CLOSE**; T-054 snag cleared by T-055; closed by T-056 |
| **Not in scope** | Production changes · regeneration · closing T-013 / Sprint 78 in this task |

---

### S78-T-054 — Transfer response Markdown / closure leakage diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Diagnostic complete** (2026-08-25) — [S78-T-054-transfer-response-markdown-closure-leakage-diagnostic.md](S78-T-054-transfer-response-markdown-closure-leakage-diagnostic.md) |
| **Mode** | DIAGNOSTIC ONLY |
| **Finding** | PRIMARY A+D: GAM hosted closure in `transfer_prompt`; vNext used inline Markdown for transfer prompts. Cleared by T-055. |
| **Not in scope** | Implementation · workspace redesign · T-013 / sprint close |

---

### S78-T-055 — Fix transfer/closure separation and transfer Markdown rendering

| Field | Content |
| ----- | ------- |
| **Status** | **Implementation complete** (2026-08-25) — [S78-T-055-transfer-closure-markdown-fix.md](S78-T-055-transfer-closure-markdown-fix.md) |
| **Mode** | IMPLEMENTATION |
| **Finding** | Blocker **RESOLVED**. GAM: never host page closure in `transfer_prompt`; vNext: block Markdown for transfer workspace prompts; T-032/T-041 preserved. |
| **Not in scope** | Pedagogy redesign · HR migration · T-013 / sprint close |

---

### S78-T-056 — Sprint 78 closure administration

| Field | Content |
| ----- | ------- |
| **Status** | **COMPLETE** (2026-08-25) — [S78-T-056-sprint-78-closure.md](S78-T-056-sprint-78-closure.md) |
| **Mode** | ADMINISTRATION |
| **Outcome** | Sprint 78 **CLOSED** · T-013 **CLOSED** · WS2 **CLOSED** · Final Gate **MET** · T-054 blocker **RESOLVED** · T-024 satisfied/waived · T-023 NOT OPENED |
| **Not in scope** | Production changes · further quality-improvement tasks |

---

### S78-T-019 — Activity timing / duration diagnostic

| Field | Content |
| ----- | ------- |
| **Status** | **Superseded** by S78-T-036 (2026-08-25) |
| **Mode** | **DIAGNOSTIC ONLY** when started |
| **Exhibit** | Fresh learner resources omit expected activity time/duration |
| **Diagnostic question** | Where should activity timing originate, and why is it absent from the learner-facing resource? |
| **Trace** | expected duration/orientation → upstream planning → DLA/GAM if relevant → assembly → renderer/learner presentation |
| **Do not assume** | Renderer ownership |
| **Verification** | [S78-T-019-activity-timing-duration-diagnostic.md](S78-T-019-activity-timing-duration-diagnostic.md) · executed under [T-036](S78-T-036-learner-timing-metadata-regression-diagnostic.md) |

---

## Moderate / presentation findings — disposition

| Finding | Disposition |
| ------- | ----------- |
| Activity 3 solution workspace: free-text Markdown-like table scaffolding vs structured mathematical workspace | **T-042 complete** — `template`/`**Label:**` (or blank tables); maths editor still parked |
| Stray blank lines above some response fields | Logged; lower priority. |
| Missing horizontal rule / separator between activities | **T-044** — Orient→A1 boundary restored to match A1→An; activity siblings already had separators |
| Image mismatch / persistence / operator-path | Logged where relevant; lower priority. |
| Activity time/duration not displayed | **T-037 complete** — LS timeline → activity projection + header LS-total fallback |
| Missing final transfer production; collapsed numbered tasks; `1. A.` diagnostics | **T-038 diagnostic complete** — T-039…T-042 all implemented; editable maths remains parked |
| Post-94 look-for bullets; Orient→A1 gap; Activity N heading; grouping badges | **T-044 complete** — look-for CSS + Orient→A1; retain title-only headings; grouping badges when populated |
---

## Final Gate (sprint exit)

| Criterion | Target | Result |
| --------- | ------ | ------ |
| Path | Fresh top-to-bottom Lagrangian: EP → DLA → GAM → design/graphics → assembly → learner package | Post–T-037 Lagrangian package |
| QA | Independent QA, PRISM Resource Quality Benchmark v2.2 | Operator independent QA |
| Uncapped score | **≥ 90/100** | **94/100** |
| Critical defects | **0** | **0** |
| Major defects | **0** | **0** |

**Verdict (2026-08-25):** **MET** — [S78-T-056](S78-T-056-sprint-78-closure.md). Corroboration: HR Essentials **92/100** + first-pass PASS/PASS (regen 0). Lagrangian remains the primary Final Gate benchmark.

Sprint 78 is **CLOSED**. Exit was achieved through **general architectural reliability**, not hand-tuning the Lagrangian resource.

**“Regenerate until it passes” is not an acceptable reliability outcome** ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)).

---

## Out of sprint queue (reference)

See [CONTEXT.md](CONTEXT.md) and [SPRINT-78-CHARTER.md](SPRINT-78-CHARTER.md). E2 (known recurrence, fail-closed, T-026 protocol), PB-FA-010, Phase D, Settings, etc. remain outside unless blocking the benchmark. Do **not** reopen Sprint 77. Do **not** add E2 sanitisation in this sprint.
