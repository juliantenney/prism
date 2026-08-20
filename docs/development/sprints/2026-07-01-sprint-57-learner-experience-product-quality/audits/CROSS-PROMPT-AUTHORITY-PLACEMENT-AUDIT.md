# Cross-Prompt Authority Placement Audit

**Status:** Read-only evidence record  
**Date:** 2026-07-01  
**Scope:** DLA (`step_design_learning_activities`), GAM (`step_generate_activity_materials`), Design Page (`step_design_page`)  
**Method:** Static analysis of augmentation chain, pack templates, runtime L4/L5 modules, capture/repair paths, and post-Sprint 56/57 remediation artefacts.

**Prior audits referenced:** GAM Sprint 57 (`GAM-*-AUDIT.md`, `GAM-REMEDIATION-RESULTS.md`); Design Page Sprint 57 (`DESIGN-PAGE-*-AUDIT.md`, `DESIGN-PAGE-REMEDIATION-RESULTS.md`); DLA Sprint 56 (`SPRINT-56-DLA-SSOT-SPEC.md`, `DEPRECATION-REGISTER.md`).

---

## Executive summary

This audit verifies **where major authorities live** across the three learner-page generation stages — not prompt size or further rationalisation.

After Sprint 56 (DLA SSOT), Sprint 57 GAM remediation, and Sprint 57 Design Page remediation, **orchestration boundaries are substantially clean**. Previously identified behaviourally risky misplacements (Design Page scaffold generation, pack compose duplication, materials/table governance drift, GAM depth/facilitator-ban duplication) have been **remediated**. What remains is **low-risk historical residue**: layered co-teaching on GAM depth, soft wrapper-guidance overlap on Design Page, and pack `defaultPromptNotes` stale references.

**Classification: AMBER** — minor placement drift remains; no significant ownership confusion. Trending toward **GREEN** for orchestration separation specifically.

---

## Orchestration model (shared augmentation chain)

All three steps share `applyWorkflowStepRuntimePromptAugmentations` (`app.js` ~10993–11015). Step-specific behaviour is gated inside each `apply*` function.

```
applyWorkflowStepRuntimePromptAugmentations
  1. LD-GUIDED-LEARNING-SCAFFOLD     — DLA only (dlaLearnerPageScaffoldSsot → PRE-EMIT)
  2. Pedagogic cognition             — DLA + GAM (brief-active)
  3. EQF                             — DLA + GAM + Design Page (step slices + DLA qualify)
  4. Instructional patterns (SP)     — GAM only
  5. Self-directed step scaffolds    — step-specific sub-chain
  6. LD-TABLE-FIDELITY               — DLA (spec) + GAM (author); Design Page via compose embed
  7. LD-MATERIALS-COPY               — GAM (author); Design Page via compose embed
  8. PEL orientation/reasoning       — DLA + GAM reasoning only (NOT Design Page)
  9. LD-DESIGN-PAGE-COMPOSE          — Design Page only (+ journey/authorial/scaffold compose slice)
 10. Sprint 38 visual                — Design Page only
 11. LD-MATH-RENDER                  — all three
 12. Strict JSON                     — step-kind specific
 13. Episode plan DLA population     — DLA conditional
```

Post-emit repair (not prompt authority): `page-gam-materials-preserve.js`, `page-activity-field-preserve.js`, page composition validation suite (`app.js` ~38993+).

---

## Deliverable 2 — Authority matrix

| Authority | Current locations | Canonical owner | Status |
| --------- | ----------------- | --------------- | ------ |
| **Scaffold field generation** (word floors, exemplars, PRE-EMIT) | DLA: `lib/ld-guided-learning-scaffold.js` early inject via `dlaLearnerPageScaffoldSsot`; thin OUTPUT CONTRACT index (`app.js` ~7574) | **DLA** | **Correct** |
| **Scaffold preservation on compose** | Design Page: `composeOnly` slice in `applyLdGuidedLearningScaffoldContractToDraft` (`composeOnly: isDesignPage`, ~632 chars) | **Design Page** (preserve only) | **Remediated** — was behaviourally risky misplacement |
| **Cognition / reasoning field quality** | DLA: SSOT + PEL reasoning (defers to SSOT); Pedagogic cognition (brief-active) | **DLA** | **Correct** |
| **Expected-output generation** | DLA: SSOT `expected_output` floors + OUTPUT CONTRACT field index | **DLA** | **Correct** |
| **Activity preamble / orientation** | DLA: SSOT + PEL orientation (wrapper/page-level cues); deprecated `LD-ACTIVITY-PREAMBLE` / `LD-COGNITION-ORIENTATION` **not** in emit chain | **DLA** | **Correct** |
| **Learner support / material shape spec** | DLA: material-shape + timeline blocks; GAM: self-study materials block | **DLA** (spec) / **GAM** (bodies) | **Correct** |
| **Diagnostic / Evaluate scaffold** | GAM pack GAM-PRES-10 + EV-GAM | **GAM** | **Correct** |
| **Activity / material generation** | GAM: pack GAM-PRES/GAM-WB + SP-01..07 + self-study block | **GAM** | **Correct** |
| **Instructional-pattern behaviour** | GAM: `lib/instructional-pattern-prompt.js` only | **GAM** | **Correct** |
| **Material depth / completeness floors** | GAM: pack GAM-PRES-08/09 (SSOT); SP defers via depth-reference prefix; PEL reasoning cross-refs SP | **GAM** (pack) | **Valid shared authority** — post-remediation; residual SP co-teaching |
| **Facilitator-ban (self-directed)** | GAM: `buildSelfDirectedGamLearnerVoicePromptBlock` in self-study block; rhetoric delegates; capture sanitization | **GAM** (self-study block) | **Remediated** |
| **Table fidelity** | DLA: `role: "dla"` spec; GAM: `role: "author"`; Design Page: embedded in compose `role: "design_page"` | **Shared L4 contract** (`lib/ld-table-fidelity.js`) | **Valid shared authority** |
| **Materials copy fidelity** | GAM: `role: "author"` main chain; Design Page: embedded in compose `role: "design_page"` | **Shared L4 contract** (`lib/ld-materials-copy.js`) | **Valid shared authority** |
| **Page composition / assembly** | Design Page: `lib/ld-design-page-compose-contract.js` + thinned pack pointer | **Design Page** | **Remediated** (pack no longer duplicates compose body) |
| **Hierarchy / wrapper arrangement** | Design Page: `lib/ld-journey-assimilation.js`, `lib/ld-authorial-exposition.js` | **Design Page** | **Correct** |
| **Wrapper learner rhetoric** | Design Page + GAM + Assessment: `lib/ld-self-directed-rhetoric.js` with role riders; **excluded from DLA** (`!isDla` gate) | **Shared** (role-separated) | **Valid shared authority** |
| **Educational quality framework** | All three: `lib/educational-quality-framework-prompt.js` with step manifestation slices; DLA qualified via `eqfDlaLearnerPageScaffoldQualify` | **Shared L5** | **Valid shared authority** |
| **PEL orientation** | DLA only (`applyPedagogicEnrichmentContractScaffoldToDraft`, `isDla` gate) | **DLA** | **Correct** |
| **PEL reasoning materials** | DLA reasoning + GAM `buildSelfDirectedGamPelReasoningMaterialPromptBlock`; NOT Design Page | **DLA** / **GAM** | **Correct** |
| **Visual affordances** | Design Page: Sprint 38 block + post-compose enforcement | **Design Page** | **Correct** |
| **Math / TeX rendering** | All three: `lib/ld-math-render.js` | **Shared** | **Valid shared authority** |
| **Strict JSON / output validity** | All three: step-kind `applyStrictJsonArtefactContractToDraft` | **Shared** | **Valid shared authority** |
| **Episode plan population** | DLA: `applyEpisodePlanDlaPopulationPromptBlockToDraft` | **DLA** | **Correct** |
| **Pedagogic cognition contract** | DLA + GAM: `applyPedagogicCognitionContractScaffoldToDraft` (brief-active) | **DLA** / **GAM** | **Correct** |
| **GAM capture / depth validation** | Post-emit: `lib/gam-output-format.js` (GAM-FMT defers to GAM-PRES) | **GAM** (repair) | **Correct** (post-emit, not generation misplacement) |
| **Materials / field preserve repair** | Post-compose: `page-gam-materials-preserve.js`, `page-activity-field-preserve.js` | **Design Page pipeline** | **Correct** (repair layer) |
| **Content expansion / pedagogy redesign** | Explicitly banned on Design Page compose ("read-only assembly"); EQF GAM slice reinforces | **None on Design Page** | **Correct** |
| **Pack defaultPromptNotes rhetoric on DLA** | Pack §5 notes cite `LD-SELF-DIRECTED-RHETORIC at runtime`; runtime excludes DLA | **N/A (stale pack note)** | **Low-risk misplacement** (documentation only) |

---

## Deliverable 3 — Highest-signal misplacements (remaining)

Only **active** drift is listed. Remediated items appear in §Remediated findings.

### F-01 — GAM depth co-teaching (pack + SP + PEL cross-refs)

| Field | Detail |
| ----- | ------ |
| **Authority** | Material depth / completeness floors |
| **Source files** | `domains/learning-design/domain-learning-design-step-patterns.md` §6 (GAM-PRES-08/09); `lib/instructional-pattern-prompt.js`; `app.js` `buildSelfDirectedGamPelReasoningMaterialPromptBlock` |
| **Current location** | GAM emit path — pack template + SP depth-reference prefix + trimmed PEL reasoning |
| **Expected owner** | Pack GAM-PRES-08/09 (depth SSOT); SP owns pattern shape only |
| **Historical cause** | SP blocks authored before pack depth consolidation; PEL added cross-material reasoning layer |
| **Learner-facing impact** | **None observed** — SP explicitly defers to GAM-PRES; capture gate uses pack floors. Residual risk is prompt-token competition, not conflicting minima. |
| **Severity** | **Low** |

### F-02 — Design Page wrapper guidance overlap

| Field | Detail |
| ----- | ------ |
| **Authority** | Wrapper transitions, closure, inquiry arc |
| **Source files** | `lib/ld-journey-assimilation.js`; `lib/ld-self-directed-rhetoric.js` (design_page rider); `lib/educational-quality-framework-prompt.js` (design_page manifestation) |
| **Current location** | Design Page emit — journey assimilation + rhetoric + EQF journey slice |
| **Expected owner** | Journey assimilation (wrapper arc); rhetoric (learner voice on wrapper); EQF (quality dimensions) |
| **Historical cause** | Sprint 41–42 layered wrapper contracts without deduplication pass |
| **Learner-facing impact** | **Low** — soft guidance overlap on transitions/closure; journey CORE explicitly defers to materials PREC-02. No competing field ownership. |
| **Severity** | **Low** |

### F-03 — DLA pack notes cite rhetoric not injected at runtime

| Field | Detail |
| ----- | ------ |
| **Authority** | Learner voice / rhetoric |
| **Source files** | `domains/learning-design/domain-learning-design-step-patterns.md` §5 `defaultPromptNotes`; `app.js` ~11104 (`applyLearnerActionRhetoric && !isDla`) |
| **Current location** | Pack notes only — runtime gate excludes DLA (Sprint 56) |
| **Expected owner** | GAM / Design Page / Assessment — not DLA |
| **Historical cause** | Pack notes not updated when S56 removed DLA rhetoric rider |
| **Learner-facing impact** | **None** — notes are not appended to emit prompt; runtime behaviour is correct |
| **Severity** | **None** (documentation residue) |

### F-04 — GAM table/materials dual call site (implementation, not ownership)

| Field | Detail |
| ----- | ------ |
| **Authority** | Table / materials L4 injection |
| **Source files** | `app.js` ~11007–11008 (main chain) and ~11097–11099 (GAM sub-chain) |
| **Current location** | Both paths call `applyLdTableFidelityContractToDraft` / `applyLdMaterialsCopyContractToDraft` with marker dedupe |
| **Expected owner** | GAM author role (single logical injection) |
| **Historical cause** | Sub-chain added for self-directed scaffold bundling before main-chain L4 modules |
| **Learner-facing impact** | **None** — second call no-ops when marker present |
| **Severity** | **None** |

**No findings rated Medium or High** after remediation passes. Pre-remediation High items (Design Page scaffold generation on compose, materials/table not injected, pack compose duplication) are **closed**.

---

## Deliverable 4 — Confirmed non-issues

Major authorities inspected and found **correctly placed**:

| Authority | Evidence |
| --------- | -------- |
| **DLA scaffold SSOT + PRE-EMIT** | `enrichDlaLearnerPageAugmentContext` sets `dlaLearnerPageScaffoldSsot`; first augmentation step; `tests/sprint-56-dla-ssot-rationalisation.test.js` |
| **DLA rhetoric exclusion** | `applySelfDirectedLearnerPageStepScaffoldsToDraft` gates rhetoric with `!isDla`; S56 deprecation register |
| **Deprecated preamble/cognition emitters removed from DLA chain** | `applyLdActivityPreambleExpositionContractToDraft` / `applyLdCognitionOrientationContractToDraft` exist for evaluators only — not called from augmentation chain |
| **DLA thin OUTPUT CONTRACT** | Field index points to SSOT; no duplicate word-range grid (`DEPRECATION-REGISTER.md`) |
| **EQF ↔ DLA scaffold qualification** | `eqfDlaLearnerPageScaffoldQualify` rewrites conflicting "reduce scaffolding" lines (`lib/educational-quality-framework-prompt.js` ~147–189) |
| **GAM-only instructional patterns** | `applyInstructionalPatternPromptBlockToDraft` gated to GAM |
| **GAM facilitator-ban single prompt owner** | Self-study learner-voice block authoritative; rhetoric delegates (`GAM-REMEDIATION-RESULTS.md`) |
| **GAM depth hierarchy documented** | `lib/gam-output-format.js` — GAM-PRES word floors authoritative over GAM-FMT char heuristics |
| **PEL not on Design Page** | `applyPedagogicEnrichmentContractScaffoldToDraft` — orientation/reasoning gated `isDla` / `isGam` only |
| **Design Page read-only compose** | Compose contract + pack template: "do not redesign pedagogy" |
| **Design Page materials/table injection** | `buildLdDesignPageComposePromptBlock` embeds L4 with `role: "design_page"`; C-01 resolved (`DESIGN-PAGE-REMEDIATION-RESULTS.md`) |
| **Design Page compose-only scaffold** | `composeOnly: isDesignPage` — preservation slice only, not generation (`lib/ld-guided-learning-scaffold.js`) |
| **Design Page pack → compose SSOT** | Pack thinned to pointers; compose contract owns membership/schema |
| **Table fidelity Design Page deferral** | `applyLdTableFidelityContractToDraft` returns draft for Design Page; L4 embedded in compose (~10228) |
| **Materials copy GAM-only main chain** | `applyLdMaterialsCopyContractToDraft` returns early when `!isGam` |
| **Post-compose GAM/materials repair** | Correctly downstream of generation — not a prompt-stage authority leak |
| **Sprint 38 visual Design Page only** | `applySprint38VisualAffordanceContractToDraft` gated |
| **Episode plan population DLA only** | `applyEpisodePlanDlaPopulationPromptBlockToDraft` |
| **DLA / GAM / Design Page stage separation** | DLA specifies obligations; GAM realises bodies; Design Page assembles — enforced in pack roles and augmentation gates |

---

## Remediated findings (closed — not active misplacement)

| Authority | Was | Remediation | Status |
| --------- | --- | ----------- | ------ |
| Scaffold generation on Design Page | Full DLA FIELD_LINES + EXEMPLAR + PRE-EMIT on compose | `composeOnly` preservation slice | **Closed** |
| Pack compose duplication | ~11k inline compose rules in pack §13 | Thinned to runtime pointers | **Closed** |
| Materials/table on Design Page | Referenced but main-chain no-op | Embedded in compose block | **Closed** |
| GAM depth SP vs GAM-PRES | Competing depth teaching | SP defers; GAM-PRES SSOT | **Closed** (residual F-01) |
| GAM facilitator-ban | Pack + rhetoric + self-study | Self-study block authoritative | **Closed** |
| DLA scaffold duplication | Multiple blocks + OUTPUT CONTRACT ranges | SSOT + PRE-EMIT (S56) | **Closed** |
| DLA rhetoric on generation path | Rhetoric rider on DLA | Removed S56 | **Closed** |

---

## Final assessment

### 1. Are any major authorities currently misplaced?

**No major authorities are misplaced** in the sense of wrong generation stage ownership. Residual items (F-01, F-02) are **layered co-teaching** within correctly owned stages, not cross-stage leaks. F-03 is pack documentation only.

### 2. Which findings have observable learner-facing consequences?

**None among active findings.** Remediated items (Design Page scaffold generation, materials/table drift) had plausible learner-facing risk (thinned scaffolds, paraphrased materials) and were addressed. Remaining drift is prompt-size / guidance-redundancy, mitigated by explicit deferral statements and capture/repair layers.

### 3. Which findings are merely historical residue?

- GAM SP + PEL cross-references alongside pack depth (F-01)
- Design Page journey + rhetoric + EQF wrapper overlap (F-02)
- DLA pack `defaultPromptNotes` rhetoric reference (F-03)
- GAM dual L4 call sites with dedupe (F-04)

### 4. Does any finding justify further remediation?

**Optional, not required for orchestration confidence:**

| Tranche | Est. benefit | Priority |
| ------- | ------------ | -------- |
| Journey ↔ rhetoric wrapper dedupe on Design Page | ~0.8–1.2k chars | Optional |
| DLA pack `defaultPromptNotes` sync (remove rhetoric mention) | Documentation hygiene | Low |
| GAM SP further thinning (beyond S57 deferral prefix) | Marginal | Low |

No finding warrants a **RED-level** remediation programme. Behaviour is stable; boundaries are documented.

### 5. Has DLA / GAM / Design Page architecture achieved clean responsibility separation?

**Yes, substantively.** The responsibility model holds:

| Stage | Generates | Does not generate |
| ----- | --------- | ----------------- |
| **DLA** | Scaffold fields, cognition cues, expected outputs, material obligations | Page layout, material bodies, GAM activity content |
| **GAM** | Activity materials, assessment artefacts, instructional-pattern bodies | Page composition, scaffold word floors, Design Page orchestration |
| **Design Page** | Page assembly, wrapper prose, field/material preservation | Activity generation, scaffold generation, content expansion |

Shared L4/L5 contracts (table, materials, EQF, math, JSON) use **role-based injection** with clear canonical modules — not ambiguous duplication.

---

## Classification

### **AMBER** — minor placement drift remains; orchestration boundaries clean

| Criterion | Assessment |
| --------- | ---------- |
| vs **RED** | No significant ownership confusion; no behaviourally risky cross-stage authorities |
| vs **GREEN** | Residual co-teaching (GAM depth layers, Design Page wrapper modules) and pack note staleness |
| Trend | **Improving** — three targeted remediation passes closed all High-severity placement issues |

**Peer prompt sizes (post-remediation, RNA/HCV self-directed probe):**

| Step | Augmented chars |
| ---- | --------------: |
| DLA (post-S56) | 31,932 |
| Design Page (post-S57) | 32,685 |
| GAM (post-S57) | 41,558 |

---

## Traceability

| Artefact | Path |
| -------- | ---- |
| Augmentation chain | `app.js` ~10993–11107 |
| DLA SSOT enrich | `app.js` ~10980–10990 |
| Design Page compose embed | `app.js` ~10004–10110 |
| Scaffold composeOnly | `lib/ld-guided-learning-scaffold.js`; `app.js` ~9702–9706 |
| GAM probes | `scripts/probe-gam-s57-audit-metrics.js` |
| Design Page probes | `scripts/probe-design-page-s57-audit-metrics.js` |
| DLA S56 guards | `tests/sprint-56-dla-ssot-rationalisation.test.js` |
| Deprecation register | `docs/development/prompt-contracts/DEPRECATION-REGISTER.md` |
