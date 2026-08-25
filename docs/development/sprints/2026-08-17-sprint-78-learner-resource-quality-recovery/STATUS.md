# Sprint 78 — Status

**Last updated:** 2026-08-25  
**Sprint status:** **OPEN**  
**Opening decision:** [S78-D01](decisions.md#s78-d01--open-sprint-78--learner-resource-quality-recovery)  
**Reliability decision:** [S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)  
**Disciplinary warrant decision:** [S78-D03](decisions.md#s78-d03--disciplinary-warrant-authoring-salience-s78-dp)  
**Page-closure ownership:** [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport)

---

## Snapshot

| Field | Value |
| ----- | ----- |
| **Theme** | Learner Resource Quality Recovery |
| **Goal** | Repair instructional relationships **MODEL → ATTEMPT → CHECK → REVISE / TRANSFER** exposed by Lagrangian QA baseline |
| **Primary benchmark** | Lagrangian Multipliers (favourable regression topic) |
| **Baseline QA** | Uncapped **70/100**; release **69/100**; **2 Major**; F&S **30** — [POST-S77 baseline](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/POST-S77-lagrangian-qa-baseline-2026-08-14.md) |
| **Fresh benchmark (T-008)** | Uncapped **87/100**; **0 Critical**; **0 Major** — operator QA 2026-08-17 (WS1 closed; WS2 capability evidence; not T-013 closure) |
| **Fresh benchmark (T-013 path QA)** | Uncapped **88/100**; **0 Critical**; **0 Major**; F&S **78**; A1–A4 Check Weak; **A5 Check Strong** — exhibit for **T-003**; **not** T-013 closure |
| **Candidate 6 QA (GAM attempt 2)** | Uncapped **88/100**; **0 Critical**; **0 Major**; F&S **92**; Subject **84**; Evidence **78**; all four activities Check **Strong** — [disciplinary diagnostic](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md); **not** T-013 closure |
| **Fresh benchmark (post–T-037)** | Uncapped **94/100** (operator independent QA) — content strong; composition defects in [T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md); **not** T-013 / sprint exit |
| **Exit target** | Fresh from-top Lagrangian ≥ **90** uncapped; **0 Critical**; **0 Major** — via **general architectural reliability**, not Lagrangian hand-tuning |
| **Immediate priority** | **S78-T-048 complete** — PRISM house visual language injected into live human (+ canonical) image prompts. Re-copy prompts / regenerate images for visual-family benefit. T-013 remains OPEN. |
| **Predecessor** | Sprint 77 **CLOSED** — do not reopen |

---

## GAM reliability (present)

**Intended steady-state contract:** Generate Activity Materials → valid GAM capture → Step complete → Next. Operators should not normally regenerate until GAM happens to pass.

**Temporary semantic verification (T-017 / T-017A / T-018):** retained for evidence gathering. Not rejected. Not the desired permanent production mechanism. A verifier FAIL **is a GAM generation failure**. **“Regenerate until it passes” is not an acceptable Sprint 78 reliability outcome.** First-pass generation quality is a sprint signal.

Desired end state: first-pass suitable GAM; verifier no longer revealing systemic classes; extra interaction removable **when evidence supports it**. Removal is **not scheduled**.

---

## Task board

| ID | Title | Status |
| -- | ----- | ------ |
| **S78-T-001** | Learner production / workspace fulfilment diagnostic | **Diagnostic complete** (2026-08-17) |
| **S78-T-004** | Learner production / workspace fulfilment solution design | **Design complete** (2026-08-17) |
| **S78-T-005** | DLA contract + `response_fulfilment` commissioning | **Implementation complete** — [record](S78-T-005-dla-response-fulfilment-implementation.md) |
| **S78-T-007** | GAM blank-cell guard for bound workspace rows | **Implementation complete** — [record](S78-T-007-gam-workspace-blank-cell-implementation.md) |
| **S78-T-008** | Full WS1 regression + Lagrangian Gate | **Complete** — [record](S78-T-008-workstream-1-integration-verification.md); fresh **87/100** |
| **S78-T-009** | P02 provider-row output-shape salience (prompt-contract) | **Complete** — [record](S78-T-009-dla-p02-provider-row-output-shape-salience-repair.md) |
| **S78-T-002** | Modelling / practice independence diagnostic | **Diagnostic complete** — [record](S78-T-002-modelling-practice-independence-diagnostic.md) |
| **S78-T-010** | Modelling / practice independence solution design | **Design complete** — [record](S78-T-010-modelling-practice-independence-solution-design.md) |
| **S78-T-011** | DLA model/practice independence commissioning | **Implementation complete** — [record](S78-T-011-dla-model-practice-independence-commissioning.md) |
| **S78-T-012** | GAM operand-aware model/practice independence authoring | **Implementation complete** — [record](S78-T-012-gam-operand-aware-model-practice-independence-authoring.md) |
| **S78-T-013** | WS2 integration verification + fresh generation | **OPEN** — C6 attempt 2 QA **88/100**, suitability PASS, WS2 positive; attempt 1 E2. Not closed by regen-until-pass — [record](S78-T-013-workstream-2-integration-verification.md) · [C6 disciplinary](S78-T-013-candidate-6-disciplinary-precision-diagnostic.md) · [C6 E2](S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md) |
| **S78-T-014** | GAM operational suitability / operand validity solution design | **Design complete** — [record](S78-T-014-gam-operational-suitability-solution-design.md) |
| **S78-T-015** | GAM operational suitability authoring salience implementation | **Implementation complete** — Stage-1 **insufficient** (C4) — [record](S78-T-015-gam-operational-suitability-authoring-salience-implementation.md) |
| **S78-T-016** | Operational suitability Stage-2 enforcement design | **Design complete** — [record](S78-T-016-operational-suitability-stage-2-enforcement-design.md) |
| **S78-T-017** | GAM operational suitability review pass | **Implementation complete** — temporary instrumentation — [record](S78-T-017-gam-operational-suitability-review-pass-implementation.md) · [T-017A](S78-T-017A-operational-suitability-review-binding-hardening.md) |
| **S78-T-018** | Operational suitability review UX + workflow integration | **Implementation complete** — [record](S78-T-018-operational-suitability-review-ux-workflow-integration.md) |
| **S78-T-018A** | GAM review scope regression + verification copy/paste fix | **Implementation complete** — DLA no longer gated; fenced review JSON — [record](S78-T-018A-gam-review-scope-regression-verification-copy-paste-fix.md) |
| **S78-T-020** | Final workflow Continue to Authoring CTA placement | **Implementation complete** — UI refinement — [record](S78-T-020-final-workflow-continue-to-authoring-cta-fix.md) |
| **S78-T-003** | Check / revision architecture diagnostic | **Diagnostic complete** — [record](S78-T-003-check-revision-architecture-diagnostic.md) |
| **S78-T-021** | Check / revision architecture solution design | **Design complete** — [record](S78-T-021-check-revision-architecture-solution-design.md) |
| **S78-T-022** | DLA diagnostic-review commissioning + capture | **Implementation complete** — [record](S78-T-022-dla-diagnostic-review-commissioning-implementation.md) |
| **S78-T-023** | GAM guided-review salience (conditional) | **Not opened** — only if T-022 exhibit proves insufficient |
| **S78-T-024** | WS3 integration verification / fresh benchmark | **Queued** after T-013 path |
| **S78-T-019** | Activity timing / duration diagnostic | **Superseded** by T-036 — [record](S78-T-019-activity-timing-duration-diagnostic.md) |
| **S78-T-036** | Learner timing metadata regression diagnostic | **Diagnostic complete** — [record](S78-T-036-learner-timing-metadata-regression-diagnostic.md) |
| **S78-T-037** | Restore learner timing metadata | **Implementation complete** — [record](S78-T-037-restore-learner-timing-metadata.md) |
| **S78-T-038** | Learner composition / presentation regression diagnostic | **Diagnostic complete** — [record](S78-T-038-learner-composition-presentation-regression-diagnostic.md) |
| **S78-T-039** | Guided-review feature-list enumeration fix | **Implementation complete** — [record](S78-T-039-guided-review-feature-list-enumeration-fix.md) |
| **S78-T-040** | Numbered learner-task structure recovery | **Implementation complete** — [record](S78-T-040-numbered-learner-task-structure-recovery.md) |
| **S78-T-041** | Restore culminating learner transfer production | **Implementation complete** — [record](S78-T-041-restore-culminating-learner-transfer-production.md) |
| **S78-T-042** | Learner workspace authoring fidelity | **Implementation complete** — [record](S78-T-042-learner-workspace-authoring-fidelity.md) |
| **S78-T-043** | GAM verification controls layout / spacing fix | **Implementation complete** — [record](S78-T-043-gam-verification-controls-layout-spacing-fix.md) |
| **S78-T-044** | Final learner-renderer presentation snagging | **Complete** — [record](S78-T-044-final-learner-renderer-presentation-snagging.md) |
| **S78-T-045** | Image instructional-fidelity diagnostic | **Diagnostic complete** — [record](S78-T-045-image-instructional-fidelity-diagnostic.md) |
| **S78-T-046** | Resource-level image consistency diagnostic | **Diagnostic complete** — [record](S78-T-046-resource-level-image-consistency-diagnostic.md) |
| **S78-T-047** | Harden image instructional fidelity (synthesis) | **Implementation complete** — [record](S78-T-047-harden-image-instructional-fidelity-synthesis.md) |
| **S78-T-048** | Harden resource-level image visual consistency | **Implementation complete** — [record](S78-T-048-harden-resource-visual-consistency.md) |
| **S78-T-025** | General disciplinary-precision authoring solution design | **Design complete** — [record](S78-T-025-disciplinary-precision-authoring-solution-design.md) · [S78-D03](decisions.md#s78-d03--disciplinary-warrant-authoring-salience-s78-dp) |
| **S78-T-026** | General disciplinary-precision authoring salience implementation | **Implementation complete** — [record](S78-T-026-disciplinary-precision-authoring-salience-implementation.md) |
| **S78-T-027** | GPT maths-authoring reliability diagnostic | **Diagnostic complete** — [record](S78-T-027-gpt-maths-authoring-reliability-diagnostic.md); T-028 salience recommended |
| **S78-T-028** | LD-MATH-RENDER prose-inside-math salience implementation | **Implementation complete** — [record](S78-T-028-ld-math-render-prose-inside-math-salience-implementation.md) |
| **S78-T-029** | Restore LD-MATH-RENDER on live GAM V2 Copy prompt | **Implementation complete** — [record](S78-T-029-restore-ld-math-render-on-live-gam-v2-copy-prompt.md) |
| **S78-T-030** | Missing page-synthesis closure / study-tips diagnostic | **Diagnostic complete** — [record](S78-T-030-missing-page-synthesis-closure-diagnostic.md) |
| **S78-T-031** | Page-closure ownership historical/design decision | **Design/decision complete** — [record](S78-T-031-page-closure-ownership-design-decision.md) · [S78-D04](decisions.md#s78-d04--page-closure-ownership-gam-substance--design-page-transport) |
| **S78-T-032** | GAM learner-closure packaging implementation | **Implementation complete** — [record](S78-T-032-gam-learner-closure-packaging-implementation.md) |
| **S78-T-033** | Literal TeX learner-rendering diagnostic | **Diagnostic complete** — [record](S78-T-033-literal-tex-learner-rendering-diagnostic.md) |
| **S78-T-034** | vNext math-delimiter protection implementation | **Implementation complete** — [record](S78-T-034-vnext-math-delimiter-protection-implementation.md) |
| **S78-T-035** | Legacy renderer retirement / vNext parity diagnostic | **Diagnostic complete** — [record](S78-T-035-legacy-renderer-retirement-vnext-parity-diagnostic.md) |
| **Final Gate** | Fresh Lagrangian + independent QA | **Not started** (C6 **88/100** interim; not sprint exit) |

---

## Workstream disposition

| WS | Track | Exhibit | Status |
| -- | ----- | ------- | ------ |
| 1 | Do / workspace fulfilment | Activity 1 comparison table | **CLOSED** — T-001→T-009; DLA `response_fulfilment` + GAM blank-cell preservation; fresh **87/100**; original pre-filled/non-editable workspace repaired. Do not reopen. |
| 2 | Modelling → practice independence | Activity 3 identical problem (historical) | Architecture **strong positive evidence** (T-011/T-012; fresh distinct model/attempt operands; QA praised separation). T-013 **OPEN** because the integration path also exposed **separate** operational-suitability failures and malformed-output recurrences. **Do not conflate WS2 with operational suitability.** Candidate 4: **WS2 PASS + suitability FAIL**. |
| — | Operational suitability (cross-cutting) | Load-bearing generated particulars | T-014/T-015 commission-relative invariant (general, not Lagrangian-specific). Stage-1 salience **insufficient** (C4). T-016–T-018 verifier = **temporary instrumentation** ([S78-D02](decisions.md#s78-d02--gam-first-pass-reliability-and-temporary-semantic-verification)). |
| 3 | Check / revision architecture | A1–A4 Weak Check; A5 Strong; F&S 78 | T-021 **design complete**; T-022 **implementation complete** (S78-WS-3 DLA capture). Next: **T-024** integration/benchmark when authorised; **T-023** conditional only. |
| — | Activity timing / duration | Learner resources omit expected time | **T-037 complete** — LS timeline projected onto activities; header falls back to LS total. DLA contract unchanged. |
| — | Disciplinary / epistemic precision | FOC→optimum under-qualification; unscoped shadow price; inequality in synthesis graphic | T-025 design + **T-026 salience complete** ([S78-D03](decisions.md#s78-d03--disciplinary-warrant-authoring-salience-s78-dp)). Next: fresh benchmark. Do not expand the verifier. |
| — | Moderate / presentation | A3 math workspace; blank lines; missing HR; image path | **Logged, lower priority** — do not elevate above instructional/reliability workstreams unless a shared architectural cause is proven. |

---

## Priority order (practical)

1. **Fresh Lagrangian benchmark** after T-032 closure packaging (+ prior T-026–T-029 maths/warrant work). Do not expand the verifier.
2. Keep **E2 upstream-response architecture diagnostic** queued (C6 attempt 1). No sanitiser.
3. **T-013 remains OPEN** (first-pass reliability; regen-until-pass is not closure).
4. **T-022 complete.** Authorise **T-024** when ready. Do not open T-023 by default.
5. Do **not** execute T-019 in this sequence unless separately authorised.
6. Assess Subject Quality / FOC warrant / shadow-price scope / visual model-class on the fresh package.
7. Assess whether the semantic verifier is still finding systemic failure classes.
8. Remove/defer the verifier **only** when evidence supports first-pass GAM reliability.
9. Close Sprint 78 **only** when exit conditions are satisfied.

---

## Known recurrences (do not absorb as Sprint 77 reopen)

| Item | Status |
| ---- | ------ |
| **E2** malformed GAM JSON | Known recurrence (T-013 Candidate 2; **Candidate 6** 2026-08-17); Copilot-visible splice **upstream of Prism capture**; fail-closed; [S77-T-026](../2026-08-14-sprint-77-dla-prompt-contract-architecture-pilot/S77-T-026-gam-e2-intermittent-corruption-diagnostic.md); [C6 diagnostic](S78-T-013-candidate-6-malformed-gam-e2-diagnostic.md); no sanitiser |
| **Truncation** | Distinct malformed-output observation (T-013 Candidate 3); not WS2/suitability evidence |

---

## Protected baseline

Sprint 77 DLA canonical architecture extended via **`78-DLA-WS-1`** / **`78-DLA-WS-2`**. E1 closed, Case 1 closed — unchanged.

---

## Next authorised action

**Next authorised action:** Authorise presentation fixes per [T-038](S78-T-038-learner-composition-presentation-regression-diagnostic.md) (P1 guided-review enumeration → P2 numbered tasks → P3 culminating transfer → P4 workspace fidelity). Fresh Lagrangian regen when commissioning changes land. E2 architecture diagnostic remains queued. Do **not** close T-013 or Sprint 78.
