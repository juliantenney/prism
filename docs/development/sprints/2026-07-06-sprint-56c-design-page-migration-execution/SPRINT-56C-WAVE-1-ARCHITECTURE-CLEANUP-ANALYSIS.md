# Sprint 56C — Wave 1 Architecture Cleanup Analysis

**Sprint:** 56C — Design Page Migration Execution  
**Wave:** 1 — Architecture cleanup (inspection only)  
**Date:** 2026-07-06  
**Status:** Analysis complete — **no implementation performed**

**Authority:** [CP-4 Approval Brief](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-CP-4-ARCHITECTURE-APPROVAL-BRIEF.md) · [Implementation Plan §4A / §5 Wave 1](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-IMPLEMENTATION-PLAN.md) · [Guardrails §A](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) · [Execution Checklist §B–D](../2026-07-06-sprint-56c-design-page-migration-execution/SPRINT-56C-EXECUTION-CHECKLIST.md)

**Scope:** Remove-inventory items only (CP-4 §4A). Wave 2 boundary alignment is noted where coupled but not in scope for execution.

**Method:** Static scan of runtime prompt augmentation (`app.js`), `lib/ld-*` compose modules, domain pack templates, post-compose validators, and tests. Prism/Cursor validates prompt/contract alignment — not Copilot runtime outputs ([Generation Visibility Constraint](SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md)).

---

## Executive summary

The as-built Design Page emit path still implements the **pre-CP-4 multi-author stack**: three wrapper generative modules (authorial exposition, journey assimilation, self-directed rhetoric), **knowledge-summary and study-tip synthesis** mandates, **generative visual affordance authoring** (Sprint 38 / schema 38.4), **EQF compose guidance**, and **brevity/refinement params** on `step_design_page`.

**Finding count:** 47 classified residues across 6 categories.  
**Highest-severity cluster:** Triple wrapper stack + VA generative contract (prompt injection chain in `applyWorkflowStepRuntimePromptAugmentations`).  
**Primary coupling:** `applyLdDesignPageComposeContractToDraft` embeds authorial exposition and chains journey assimilation; `applySelfDirectedLearnerPageStepScaffoldsToDraft` injects rhetoric **before** compose; Sprint 38 VA block appends **after** compose.

---

## 1. Findings inventory

### Legend

| Field | Values |
| ----- | ------ |
| **Class** | A Responsibility · B Prompt · C Workflow · D Schema · E Documentation · F Governance |
| **Severity** | High · Medium · Low |
| **Complexity** | Low · Medium · High |

---

### W1.1 — Knowledge synthesis removal (R-39, R-71)

| ID | Location | Class | Conflicting decision | Governing artefact | Severity | Complexity |
| -- | -------- | ----- | -------------------- | ------------------ | -------- | ---------- |
| W1-F01 | `lib/ld-journey-assimilation.js` — `KNOWLEDGE_SUMMARY_LINES` (derive orienting summary from LC/KM) | A, B | D2 OQ-17 — transport-or-omit; no DP synthesis | OQ-17 | High | Medium |
| W1-F02 | `lib/ld-authorial-exposition.js` — `knowledge_summary` preview concepts role | A, B | R-39 authoring | OQ-17; Assembly-Time Test | High | Medium |
| W1-F03 | `lib/ld-self-directed-rhetoric.js` — `knowledge_summary previews at start only` | A, B | R-39 | OQ-17 | High | Medium |
| W1-F04 | `app.js` — `bootstrapLdSelfDirectedRhetoricInlineIfMissing` inline block (knowledge_summary shaping) | B | R-39 | OQ-17 | High | Low |
| W1-F05 | `lib/ld-materials-copy.js` — `ARCHIVAL_FIELD_LINES`: knowledge_summary **authorable**; “coherent learner journey may be authored only here” | A, B | R-39; conflicts with transport-or-omit | OQ-17; guardrails §A | High | Medium |
| W1-F06 | `lib/ld-design-page-compose-contract.js` — AUTHORABLE VS ARCHIVAL lists `knowledge_summary` as authorable narrative | B | R-39 editorial mandate | OQ-17 | High | Medium |
| W1-F07 | `domains/.../domain-learning-design-step-patterns.md` §13 — prompt template: substantive `knowledge_summary when LC/KM bound` without transport-only framing | B, C | R-39/R-71 | OQ-17 | Medium | Medium |
| W1-F08 | `domains/.../domain-learning-design-artefacts.md` — `knowledge_summary` in sectionOrder (slot OK) — paired with synthesis prompts | D | R-70 slot vs R-39 substance | OQ-17 | Low | Low |

---

### W1.2 — Study tips synthesis (R-41, R-42)

| ID | Location | Class | Conflicting decision | Governing artefact | Severity | Complexity |
| -- | -------- | ----- | -------------------- | ------------------ | -------- | ---------- |
| W1-F09 | `lib/ld-journey-assimilation.js` — `CLOSURE_LINES` / study_tips epistemic synthesis from GAM signals | A, B | R-41 synthesis | Assembly-Time Test §6 | High | Medium |
| W1-F10 | `lib/ld-journey-assimilation.js` — reference closure in study_tips without embed-only guard for synthesis | B | R-42 Mode G risk | Assembly-Time Test §6 | Medium | Medium |
| W1-F11 | `lib/ld-authorial-exposition.js` — study_tips synthesise meaning | A, B | R-41 | Assembly-Time Test | High | Medium |
| W1-F12 | `lib/ld-self-directed-rhetoric.js` — closure / epistemic synthesis bullets | A, B | R-41 | Assembly-Time Test | High | Medium |
| W1-F13 | `app.js` inline rhetoric bootstrap — study_tips synthesis lines | B | R-41 | Assembly-Time Test | High | Low |
| W1-F14 | `lib/ld-guided-learning-scaffold.js` — `TRANSITION_LINES` assimilate into overview/**study_tips** | B | R-41; wrapper synthesis | D6; Assembly-Time Test | Medium | Medium |
| W1-F15 | `domains/.../domain-learning-design-prompt-rules.md` §6d–6g — study_tips synthesis patterns on **Design Page** | E | R-41 | Assembly-Time Test | Medium | Low |

---

### W1.3 — Triple wrapper stack (R-35, R-43, R-49, R-51; D6)

| ID | Location | Class | Conflicting decision | Governing artefact | Severity | Complexity |
| -- | -------- | ----- | -------------------- | ------------------ | -------- | ---------- |
| W1-F16 | `lib/ld-authorial-exposition.js` — entire module scoped to Design Page wrapper authoring (R-43) | A, B | D6 wrapper collapse | CP-4 §6; guardrails §A | High | High |
| W1-F17 | `lib/ld-journey-assimilation.js` — upstream signal assimilation into wrapper (R-35) | A, B | D6; R-35 | CP-4 §6 | High | High |
| W1-F18 | `lib/ld-self-directed-rhetoric.js` — `WRAPPER_RHETORIC_LINES`, `ROLE_RIDERS.design_page` | A, B | R-49, R-51 | D6; Assembly-Time Test §4 | High | High |
| W1-F19 | `app.js` — `applyLdDesignPageComposeContractToDraft` injects authorial + journey + guided scaffold on learner pages | C | Triple stack | Implementation plan W1.2 | High | High |
| W1-F20 | `app.js` — `applySelfDirectedLearnerPageStepScaffoldsToDraft` → `applyLdSelfDirectedRhetoricContractToDraft` for Design Page | C | Third rhetoric layer | D6 | High | Medium |
| W1-F21 | `app.js` — `applyWorkflowStepRuntimePromptAugmentations` ordering: rhetoric (step scaffolds) → compose (authorial+journey) → VA | C | Coupled triple stack | W1.2 work package | High | High |
| W1-F22 | `lib/ld-design-page-compose-contract.js` — references and optionally embeds LD-AUTHORIAL-EXPOSITION; mandates obey JOURNEY-ASSIMILATION + SELF-DIRECTED-RHETORIC | B, C | D6 | CP-4 §6 | High | High |
| W1-F23 | `index.html` — script tags load `ld-authorial-exposition.js`, `ld-journey-assimilation.js`, `ld-self-directed-rhetoric.js` | C | Stack modules active | — | Medium | Low |
| W1-F24 | `domains/.../domain-learning-design-step-patterns.md` §13 — defaultPromptNotes mandate LD-JOURNEY-ASSIMILATION + LD-SELF-DIRECTED-RHETORIC on learner profile | B, E | D6 | CP-4 §6 | High | Medium |

---

### W1.4 — Pedagogical wrapper authoring (R-36, R-37 instructional split)

| ID | Location | Class | Conflicting decision | Governing artefact | Severity | Complexity |
| -- | -------- | ----- | -------------------- | ------------------ | -------- | ---------- |
| W1-F25 | Wrapper modules — inquiry arc / intellectual journey / stakes authoring in overview (R-36/R-37 instructional) | A, B | Pedagogical R-36/R-37 remove | Consolidation review | High | High |
| W1-F26 | `lib/educational-quality-framework-prompt.js` — `step_design_page` EQF lines (compose journey, reflective closure) | A, B | R-53 EQF on DP emit | 56A demotion; guardrails §A | High | Medium |
| W1-F27 | `app.js` — `applyEducationalQualityFrameworkPromptBlockToDraft` in augment chain for all Design Page prompts | C | R-53 | Implementation plan W1.6 | High | Medium |
| W1-F28 | `domains/.../domain-learning-design-prompt-rules.md` §6f–6j — session orientation / progression / epistemic synthesis rhetoric on Design Page | E | R-36–R-37, R-43 | Consolidation | Medium | Low |

*Note:* Structural inquiry framing retained in Wave 2 must be distinguished during execution; Wave 1 removes **instructional authoring** mandates.

---

### W1.5 — Generative VA (R-56–R-59; OQ-13–16)

| ID | Location | Class | Conflicting decision | Governing artefact | Severity | Complexity |
| -- | -------- | ----- | -------------------- | ------------------ | -------- | ---------- |
| W1-F29 | `app.js` — `buildSprint38VisualAffordanceDesignPagePromptBlock` (full generative VA spec, mandatory 38.4) | A, B | R-55–R-59; OQ-13 | OQ-13–16 | High | High |
| W1-F30 | `app.js` — `applySprint38VisualAffordanceContractToDraft` on Design Page | C | R-56–R-59 | OQ-13 | High | Medium |
| W1-F31 | `app.js` — `applySprint38VisualAffordancesToComposedPage` post-compose validation/normalization | C, D | Mandatory VA path | OQ-15/16 | High | High |
| W1-F32 | `lib/sprint38-visual-affordances.js` — SCHEMA_VERSION 38.4, `source_basis` validation | D | R-59; mandatory schema | OQ-15/16 | High | High |
| W1-F33 | `lib/ld-design-page-compose-contract.js` — Sprint 38 visual/pedagogical contracts; `visual_affordances[]` additive metadata | B | R-56 generative on DP | OQ-13 | High | Medium |
| W1-F34 | `lib/ld-materials-copy.js` — `visual_affordance descriptions` authorable; `source_basis` cite paths | B, D | R-59; VA authoring | OQ-14/15 | High | Medium |
| W1-F35 | `domains/.../domain-learning-design-step-patterns.md` §13 — output keys + template mandate `visual_affordance_schema_version "38.4"`, `activities_visual_review[]`, `visual_affordances[]` | C, D | R-55 mandatory 38.4 | OQ-16 | High | High |
| W1-F36 | `lib/ld-table-fidelity.js` — L6 visual affordance metadata in precedence stack | B | VA as compose layer | OQ-13 | Medium | Low |

---

### W1.6 — Brevity / optimisation params (R-78–R-80)

| ID | Location | Class | Conflicting decision | Governing artefact | Severity | Complexity |
| -- | -------- | ----- | -------------------- | ------------------ | -------- | ---------- |
| W1-F37 | `domains/.../domain-learning-design-step-patterns.md` — `tone_style`, `depth_level`, `output_density` on `step_design_page` | C | R-78–R-80 | D7; CP-4 | High | Medium |
| W1-F38 | `domains/.../domain-learning-design-step-patterns.md` — workflowBriefConfig mappingRules → `stepParams.step_design_page.*` | C | R-78–R-80 | Responsibility matrix | High | Medium |
| W1-F39 | `app.js` — `resolveDesignPageRefinementProfile` / refinement elicitation for design_page | C | R-78–R-80 | D7 | Medium | Medium |
| W1-F40 | Multiple `lib/*` — “brevity” as **materials preservation override** (retain; not R-78–R-80) | B | — | R-22 | — | — |

*W1-F40 is not a removal candidate* — preservation precedence is approved; listed to avoid accidental deletion.

---

### W1.7 — Tests and governance encoding rejected behaviour

| ID | Location | Class | Conflicting decision | Governing artefact | Severity | Complexity |
| -- | -------- | ----- | -------------------- | ------------------ | -------- | ---------- |
| W1-F41 | `tests/workflow-learner-page-journey-assimilation.test.js` — asserts journey assimilation **on** Design Page | F | D6 | W1.2 | High | Medium |
| W1-F42 | `tests/workflow-learner-page-journey-assimilation.test.js` — asserts authorial exposition retained | F | R-43 | W1.2 | High | Medium |
| W1-F43 | `tests/ld-self-directed-rhetoric.test.js` — design_page rider includes journey assimilation | F | Triple stack | W1.2 | Medium | Low |
| W1-F44 | `tests/ld-design-page-compose-contract.test.js` — requires references to AUTHORIAL, JOURNEY, RHETORIC siblings | F | Post-W1 contract shape | W1.2 | Medium | Medium |
| W1-F45 | `tests/sprint-38-visual-affordances.test.js` — mandatory 38.4 normalization | F | OQ-16 | W1.4 | High | Medium |
| W1-F46 | `tests/design-page-materials-fidelity.test.js` — VA coexistence fixture | F | OQ-13 | W1.4 | Medium | Low |
| W1-F47 | `docs/development/prompt-contracts/DEPRECATION-REGISTER.md` — notes DP rhetoric “unchanged”; contradicts CP-4 | E, F | Sprint 56C mandate | Implementation plan | Low | Low |

---

## 2. Residue classification summary

| Class | Count | Primary loci |
| ----- | ----- | ------------ |
| **A — Responsibility residue** | 12 | Wrapper modules; VA contract; EQF step_design_page |
| **B — Prompt residue** | 22 | `lib/ld-*`; `app.js` inline/bootstrap blocks; domain §13 template |
| **C — Workflow residue** | 11 | `applyWorkflowStepRuntimePromptAugmentations` chain; brief refinement mapping |
| **D — Schema residue** | 6 | Sprint 38 page root keys; domain defaultOutputStructure |
| **E — Documentation residue** | 4 | `domain-learning-design-prompt-rules.md`; sprint-38 docs (reference) |
| **F — Governance residue** | 6 | Tests asserting pre-target behaviour |

---

## 3. Compliance assessment (by work package)

| Work package | Inventory | Findings | Compliance status |
| ------------ | --------- | -------- | ----------------- |
| **W1.1** Knowledge synthesis | R-39, R-71 | F01–F08 | **Non-compliant** — synthesis mandates active |
| **W1.2** Wrapper demotion | R-35, R-43, R-49, R-51; triple stack | F16–F24, F25 (partial) | **Non-compliant** — three modules + injection |
| **W1.3** Study tips | R-41, R-42 | F09–F15 | **Non-compliant** |
| **W1.4** VA generative | R-55–R-59 | F29–F36 | **Non-compliant** |
| **W1.5** Brevity | R-78–R-80 | F37–F39 | **Non-compliant** on domain/refinement |
| **W1.6** EQF on DP | R-53 | F26–F27 | **Non-compliant** |

---

## 4. Removal candidate inventory

### Immediate removal candidates

*Safe to remove or gate off Design Page path without Wave 2 positive contract work.*

| Candidate | Findings | Action (execution phase) |
| --------- | -------- | ------------------------ |
| **RC-01** Stop EQF injection on Design Page | F26–F27 | Remove `step_design_page` from EQF targets or gate in `applyEducationalQualityFrameworkPromptBlockToDraft` |
| **RC-02** Stop Sprint 38 VA prompt block on Design Page | F29–F30 | Remove/gate `applySprint38VisualAffordanceContractToDraft` for `step_design_page` |
| **RC-03** Stop self-directed rhetoric on Design Page | F18, F20 | Gate `applyLdSelfDirectedRhetoricContractToDraft` when `isWorkflowStepDesignPage` |
| **RC-04** Stop journey assimilation on Design Page | F17, F19 | Remove `applyLdJourneyAssimilationContractToDraft` from compose path |
| **RC-05** Stop authorial exposition on Design Page | F16, F19 | Remove authorial embed from `applyLdDesignPageComposeContractToDraft` |
| **RC-06** Remove knowledge_summary / study_tips synthesis lines from remaining DP contracts | F01–F15 | Edit or retire wrapper prose in any module still referenced |
| **RC-07** Remove brevity params from Design Page brief mapping | F37–F38 | Domain pack: detach tone/depth/density from `step_design_page` |
| **RC-08** Remove guided-scaffold wrapper transition lines on DP compose | F14 | `ld-guided-learning-scaffold.js` — drop TRANSITION_LINES from compose-only block |

### Requires dependency review

| Candidate | Findings | Dependency |
| --------- | -------- | ------------ |
| **RC-09** Post-compose VA normalization | F31–F32 | GAM/DLA paths; renderer tests; inflation fixtures |
| **RC-10** Compose contract sibling references | F22, F33 | Wave 2 thin bridge wording; materials-copy authorable list |
| **RC-11** Domain §13 prompt template + output structure | F07, F24, F35 | Runner instructions; Copilot template parity; export validators |
| **RC-12** `lib/ld-materials-copy.js` authorable narrative list | F05, F34 | Distinguish archival vs transport-or-omit for R-70 slot |
| **RC-13** Refinement profile for design_page | F39 | Workflow brief UX; may affect non-LD workflows |
| **RC-14** Precedence stack L6 VA metadata | F36 | Table-fidelity module shared with GAM |

### Requires stakeholder confirmation

| Candidate | Findings | Question |
| --------- | -------- | -------- |
| **RC-15** Retire vs repurpose wrapper modules | F16–F18 | Modules may serve GAM/DLA — confirm Design Page-only gating sufficient |
| **RC-16** Sprint 38 historical docs / fixtures | E corpus | Archive labelling only — not runtime |
| **RC-17** `knowledge_summary` section slot in domain artefacts | F08 | R-70 retained — confirm transport-or-omit wording in template only |
| **RC-18** SQ-VA-4 optional explicit VA metadata | F31 | If any consumer needs portable VA — architecture decision, not Wave 1 default |

---

## 5. Migration sequencing (recommended)

### Phase 1 — Stop prompt injection (coupled removals)

Execute in one PR where possible to avoid partial triple stack:

```
1. RC-03  rhetoric off DP
2. RC-04  journey assimilation off DP
3. RC-05  authorial exposition off DP
4. RC-02  VA prompt block off DP
5. RC-01  EQF off DP
```

**Prerequisite:** None for prompt gating.  
**Coupling:** F19–F21 — single augment-chain change in `app.js` plus compose contract options.

### Phase 2 — Contract text cleanup

```
6. RC-06  synthesis language in ld-materials-copy, ld-design-page-compose-contract, ld-guided-learning-scaffold
7. RC-08  wrapper transition lines on compose
8. RC-07  brevity params domain mapping
```

**Prerequisite:** Phase 1 complete (avoid re-authoring in contracts still injected).

### Phase 3 — Schema and post-compose

```
9. RC-09  post-compose VA normalization policy (default path: no mandatory 38.4)
10. RC-11 domain template + defaultOutputStructure
11. RC-10 compose contract sibling list
```

**Prerequisite:** OQ-14 default (renderer inference) — no mandatory `visual_affordances[]` on emit.  
**Validation impact:** Update F41–F46 tests; Wave 3 fixture definitions.

### Phase 4 — Governance alignment

```
12. Update tests (F41–F46) to assert absence of rejected mandates
13. Update DEPRECATION-REGISTER (F47)
14. Wave 1 compliance review per checklist §B
```

### Safe removals (isolated)

| Item | Risk |
| ---- | ---- |
| RC-01 EQF off DP | Low — EQF remains on DLA/GAM |
| RC-07 brevity params | Low — does not affect Layer 1 |
| RC-08 scaffold transition lines | Low — DLA pre-emit gates unchanged |

### Coupled removals (must move together)

| Set | Reason |
| --- | ------ |
| RC-03 + RC-04 + RC-05 | Triple stack collapse (D6) |
| RC-02 + RC-09 + RC-11 | VA generative path end-to-end |
| RC-06 + RC-10 + RC-12 | Authorable-vs-archival narrative consistency (OQ-17) |

### Validation impacts (Prism/Cursor scope)

| Area | Impact |
| ---- | ------ |
| Prompt contract tests | Rewrite expected markers (journey/authorial/rhetoric/VA) |
| Structural page JSON tests | VA keys optional; no mandatory empty arrays |
| Wave 3 OQ-25 fixtures | Re-baseline structural review checklists |
| Runtime generation | **Out of scope** — Copilot capture workflows |

---

## 6. Wave 1 risk review

| Risk ID | Risk | Likelihood | Impact | Mitigation |
| ------- | ---- | ---------- | ------ | ---------- |
| **RK-W1-01** | **Wrapper re-expansion** — partial removal leaves one module still authoring | Medium | High | Phase 1 single-chain gate; checklist §B |
| **RK-W1-02** | **Synthesis reintroduction** via materials-copy “authorable narrative” | Medium | High | RC-12 explicit transport-or-omit; OQ-17 |
| **RK-W1-03** | **VA ownership leakage** — post-compose validator re-mandates 38.4 | Medium | High | RC-09 coordinated with RC-02 |
| **RK-W1-04** | **Hidden ownership** — inline `bootstrapLdSelfDirectedRhetoricInlineIfMissing` bypasses lib | Low | High | Remove or sync inline with lib gate |
| **RK-W1-05** | **Documentation drift** — domain template contradicts runtime | Medium | Medium | RC-11 same PR as augment chain |
| **RK-W1-06** | **Test false negatives** — tests require rejected contracts | High | Medium | Phase 4 test updates before Wave 1 sign-off |
| **RK-W1-07** | **Brevity param removal** breaks brief elicitation UX | Low | Low | Stakeholder confirm RC-13 |
| **RK-W1-08** | **Accidental removal** of materials preservation brevity override (F40) | Medium | High | Explicit exclusion in execution brief |

---

## 7. Wave 1 exit criteria

Wave 1 is **complete** when all of the following are true (structural/prompt review — per [Generation Visibility Constraint](SPRINT-56C-GENERATION-VISIBILITY-CONSTRAINT.md)):

### A. Prompt augmentation (Design Page path)

| # | Criterion | Evidence |
| - | --------- | -------- |
| 1 | No `LD-AUTHORIAL-EXPOSITION` block appended to Design Page prompts | Prompt snapshot / contract test |
| 2 | No `LD-JOURNEY-ASSIMILATION` block appended to Design Page prompts | Prompt snapshot / contract test |
| 3 | No `LD-SELF-DIRECTED-RHETORIC` **design_page** rider appended | Prompt snapshot / contract test |
| 4 | No `Sprint 38 visual affordance authoring contract` appended to Design Page prompts | Prompt snapshot / contract test |
| 5 | No `EDUCATIONAL-QUALITY-FRAMEWORK` block on Design Page (`step_design_page`) | Prompt snapshot / contract test |
| 6 | No synthesis mandates for `knowledge_summary` or `study_tips` on DP emit path | Contract text audit |
| 7 | No brevity-shaping params (`tone_style`, `depth_level`, `output_density`) mapped to `step_design_page` | Domain pack diff |

### B. Compose contract alignment

| # | Criterion | Evidence |
| - | --------- | -------- |
| 8 | `LD-DESIGN-PAGE-COMPOSE-CONTRACT` does not require obeying removed sibling modules | Compose contract test |
| 9 | Authorable-vs-archival list does not mandate DP knowledge synthesis | OQ-17 compliance |
| 10 | No mandatory generative VA fields in compose obligations | OQ-13–16 |

### C. Schema / post-compose (default path)

| # | Criterion | Evidence |
| - | --------- | -------- |
| 11 | Domain template does not mandate `visual_affordance_schema_version "38.4"` on every page | Domain §13 diff |
| 12 | Post-compose normalization does not require empty `visual_affordances[]` emission | Validator review |
| 13 | `source_basis` not required on default DP path | OQ-15 |

### D. Governance

| # | Criterion | Evidence |
| - | --------- | -------- |
| 14 | Tests updated — no assertion that rejected modules **must** be present on DP | Test suite |
| 15 | [Execution checklist §B](SPRINT-56C-EXECUTION-CHECKLIST.md) Wave 1 removals pass | Signed review |
| 16 | Inventory reconciliation: §4A Remove items absent as **generative mandates** | W1 compliance log |

**Explicitly not Wave 1 exit:** Thin assembly-coherence bridge (R-40, R-44, R-45, R-47) — Wave 2. Transport-or-omit upstream packaging (SQ-1/SQ-2) — Wave 2.

---

## 8. Prompt augmentation chain (as-built reference)

Current Design Page augment order in `applyWorkflowStepRuntimePromptAugmentations`:

```
guided learning scaffold (DLA+DP)
→ pedagogic cognition
→ EQF                    ← W1.6 remove
→ instructional pattern (GAM only)
→ self-directed scaffolds + rhetoric  ← W1.3 remove (DP)
→ table fidelity (GAM)
→ materials copy (GAM)
→ pedagogic enrichment (DLA only for PEC)
→ design page compose (+ authorial + journey)  ← W1.2 remove
→ Sprint 38 VA           ← W1.4 remove
→ math render
→ strict JSON
```

---

## 9. References

| Document | Role |
| -------- | ---- |
| [SPRINT-56B-IMPLEMENTATION-PLAN.md](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-IMPLEMENTATION-PLAN.md) | Wave 1 work packages |
| [SPRINT-56B-ARCHITECTURE-GUARDRAILS.md](../2026-07-06-sprint-56b-design-page-migration-planning/SPRINT-56B-ARCHITECTURE-GUARDRAILS.md) | §A must-not list |
| [DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-ASSEMBLY-TIME-OWNERSHIP-TEST.md) | R-41, §4 categories |
| [DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-OQ-17-KNOWLEDGE-SUMMARY-POLICY-REVIEW.md) | Transport-or-omit |
| [OQ-13–16 VA reviews](../2026-07-06-sprint-56b-design-page-migration-planning/DESIGN-PAGE-OQ-13-VISUAL-AFFORDANCES-OWNERSHIP-REVIEW.md) | VA off DP |
| [SPRINT-56C-EXECUTION-CHECKLIST.md](SPRINT-56C-EXECUTION-CHECKLIST.md) | Wave gate checks |

---

## Document control

| Field | Value |
| ----- | ----- |
| File | `SPRINT-56C-WAVE-1-ARCHITECTURE-CLEANUP-ANALYSIS.md` |
| Type | Inspection / migration planning |
| Implementation | **None** — execution follows separate Wave 1 work packages |
