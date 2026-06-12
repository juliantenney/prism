# Sprint 42-12 — PEL Manifestation Audit

**Date:** 2026-06-11  
**Type:** Static code and prompt-contract audit only (no workflow runs, no implementation changes)  
**Builds on:** [handover Current Position](../handover-from-sprint-41.md), [42-11A Design Page provenance](42-11A-design-page-static-provenance-audit.md), [42-10 LC parity](../sprint-42-slice-10-source-ingest-learning-content-parity.md)

---

## Purpose

Sprint 42 established that upstream artefacts preserve inquiry, judgement, and journey signals, while final learner pages still read **activity-centric**. A parallel question is whether **PEL / metacognitive intentions** are strongly manifested in learner-facing outputs, or mainly present as prompt architecture and field names.

This audit maps PEL-related dimensions, injection points, contract strength, and static weaknesses — without proposing fixes.

**Note:** There is no `lib/educational-quality-framework.js`. PEL/EQF runtime lives in `lib/educational-quality-framework-prompt.js`, `lib/educational-quality-framework-evaluator.js`, and `app.js` (Sprint 30 PEC blocks, Sprint 41 learner-page framing).

---

## Files reviewed

| File | Role |
| ---- | ---- |
| `handover-from-sprint-41.md`, `README.md` | Sprint 42 position; EQF/PEL not reopened |
| `sprint-42-slice-10-source-ingest-learning-content-parity.md` | LC availability before KM |
| `observations/42-11A-design-page-static-provenance-audit.md` | Activity/material dominance at compose |
| `lib/educational-quality-framework-prompt.js` | EQF core + per-step manifestation (incl. metacognition line) |
| `lib/educational-quality-framework-evaluator.js` | Heuristic dimension scanner (diagnostic) |
| `lib/ld-journey-assimilation.js` | Closure / study_tips synthesis guidance |
| `lib/ld-authorial-exposition.js` | Wrapper voice; anti-diary closure |
| `lib/ld-self-directed-rhetoric.js` | Progression, closure, transfer cues; `design_page` rider |
| `lib/ld-design-page-compose-contract.js` | Field preservation list (PEL-related DLA fields) |
| `app.js` | PEL orientation/reasoning blocks; mandatory DLA OUTPUT CONTRACT; augmentation order; capture validation; evaluators; repair/preserve |
| `domains/learning-design/domain-learning-design-step-patterns.md` | §5 DLA, §6 GAM, §10 CLS, §13 Design Page prompts |

---

## PEL dimensions identified

PEL is not a single schema. It is distributed across **Sprint 30 PEC** (orientation + reasoning contracts), **Sprint 28 cognition packs**, **Sprint 41 mandatory learner-page framing**, and **Sprint 40 EQF** (including a lightweight metacognition line).

| Dimension | Evidence | Source |
| ----------- | --------- | ------ |
| **Confidence** | EQF: “brief confidence … checks”; evaluator `metacognition` patterns include `confidence` | `educational-quality-framework-prompt.js` CORE_LINES; `educational-quality-framework-evaluator.js` DIMENSION_PATTERNS |
| **Uncertainty** | `uncertainty_tension_prompt` field; `productive_uncertainty_required` brief factor; rhetoric “disciplinary uncertainty”; evaluation archetype guidance | `app.js` SPRINT_28_COGNITION_FACTOR_CONTRACT, OUTPUT CONTRACT, `ld-self-directed-rhetoric.js` |
| **Progress awareness** | EQF “progress” checks; evaluator `learning_success` / `metacognition`; rhetoric progression vocabulary | EQF prompt + evaluator |
| **Decision reflection** | EQF judgement + independence; `transfer_or_application_task`; closure “what changed in your understanding?” | EQF, rhetoric, journey assimilation CLOSURE_LINES |
| **Self-monitoring** | `self_explanation_prompt` (mandatory cognition option); GAM “Before you re-read…” static retrieval | DLA OUTPUT CONTRACT, GAM PEL reasoning block |
| **Independence** | EQF “progressive independence”; faded → independent in rhetoric and GAM | EQF, rhetoric, GAM PEL block |
| **Learner control** | Self-directed orientation contract (“learner working alone”); no adaptive/branching prompts | `buildPelOrientationContractPromptBlock` |
| **Next-step awareness** | EQF feedback manifestation; evaluator `next step`; support_note as evidence guard | EQF MANIFESTATION_BY_STEP (feedback), evaluator |
| **Metacognitive reflection** | EQF “Metacognition (lightweight)”; rhetoric forbids diary tone but allows epistemic synthesis; authorial `study_tips` role | EQF, rhetoric, authorial exposition |
| **Transfer readiness** | `transfer_or_application_task`; GAM closure ≥80 words; rhetoric transfer cues | DLA, GAM PEL block, rhetoric |

**Orientation PEL fields** (`PEL_ORIENTATION_FIELD_IDS`): `study_orientation`, `intellectual_frame`, `intellectual_coherence_bridge`.

**Reasoning PEL fields** (`PEL_REASONING_FIELD_IDS`): `reasoning_orientation`, `evidence_use_prompt`, `argument_structure_hint`, `self_explanation_prompt`, `disciplinary_lens`, `conceptual_contrast_prompt`.

**Mandatory learner-page cognition** (at least one per activity): `reasoning_orientation`, `self_explanation_prompt`, `conceptual_contrast_prompt`, `uncertainty_tension_prompt`, `argument_structure_hint`, `transfer_or_application_task` (`LEARNER_PAGE_MANDATORY_COGNITION_FIELD_IDS`).

---

## Manifestation map

| Stage | Intended PEL behaviours | Contract strength |
| ----- | ------------------------- | ----------------- |
| **learning_content** | None explicit for PEL/metacognition; teaching narrative and progression only | **Absent** — not in EQF `TARGET_CANONICAL_STEP_IDS`; no PEL augmentation |
| **DLA** | `activity_preamble` + cognition-orientation fields; orientation/reasoning PEC prompt blocks; archetype-matched prompts (`self_explanation`, `uncertainty_tension`, `transfer`); optional cognition-pack fields (`scaffold_hint_sequence`, pack-driven labels) | **Strong guidance → hard at capture** for learner-page workflows: OUTPUT CONTRACT + `evaluateLearnerPageDlaActivityFramingCoverage` can block step completion; PEL orientation/reasoning blocks injected when `shouldApplyLearnerPagePedagogicFramingScaffold` |
| **GAM** | PEL reasoning materials block (worked thinking, faded templates, prompt_set self-check, closure depth); cognition-pack “Cognition cues” sections when packs active; GAM-PRES-08 minima referenced | **Strong guidance** on self-directed learner pages; materials depth hard via GAM-PRES elsewhere; **no capture validator** equivalent to DLA framing gate |
| **CLS** | EQF manifestation: learner-development journey, progression to independence; timeline `transition_to_next`, `phase_type`, facilitator/learner actions | **Soft guidance** (EQF + domain prompt); **not** Design Page input for metacognitive fields; DP uses LS mainly for order/timing + assimilated transitions (42-6) |
| **Design Page** | **Preserve** PEL fields verbatim on activity rows; EQF “lightweight metacognition” on compose; rhetoric closure/transfer; journey assimilation study_tips; authorial anti-diary closure | **Weak at generation, medium at preservation** — **PEL orientation/reasoning blocks are NOT appended to Design Page** (`applyPedagogicEnrichmentContractScaffoldToDraft` only injects PEL into DLA and GAM); field preservation is **strong guidance**, not post-compose repair for missing fields; activity membership + GAM merge are **hard** |

### Where PEL is injected (by workflow stage)

| Stage | Source file / mechanism | Learner-visible intent |
| ----- | ------------------------- | ---------------------- |
| DLA | `buildPelOrientationContractPromptBlock`, `buildPelReasoningContractPromptBlock`, `buildLearnerPageDlaOutputContractOverrideBlock` | Activity-row orientation and “how to think” fields |
| GAM | `buildSelfDirectedGamPelReasoningMaterialPromptBlock`, `buildPedagogicCognitionContractPromptBlock` (gam) | Materials embodying reasoning, self-check, closure |
| CLS | `applyEducationalQualityFrameworkPromptBlockToDraft` | Facilitation timeline (weakly learner-facing on page) |
| Design Page | EQF, rhetoric, journey, authorial, compose **field preservation** — **not** PEL PEC blocks | Copied fields + wrapper synthesis; no new PEL generation |

### Augmentation order at Design Page (`applyWorkflowStepRuntimePromptAugmentations`)

1. Pedagogic cognition scaffold (DLA/GAM only — skipped on DP)  
2. **EQF** (includes metacognition line)  
3. Self-directed scaffolds + **LD-SELF-DIRECTED-RHETORIC** (`design_page` rider)  
4. PEL enrichment (**DLA/GAM only** — DP passes gate but receives no PEC blocks)  
5. **LD-DESIGN-PAGE-COMPOSE-CONTRACT** + authorial + journey assimilation  

---

## Comparison with exposition

| Layer | Preservation / enforcement | Relative strength vs PEL |
| ----- | --------------------------- | ------------------------ |
| **Exposition (42-2 authorial, preamble exposition)** | DLA `activity_preamble` mandatory + capture validation; compose preservation; authorial/journey on DP prompts | **Stronger at DLA**; **medium at DP** (prompt guidance, field copy) |
| **Judgement** | DLA `expected_output`, comparison/evaluate tasks; GAM must not pre-answer; GAM-PRES-08 closure; EQF judgement lines | **Stronger** — embedded in tasks and materials contracts |
| **Activity / materials** | ACTIVITY MEMBERSHIP **hard**; GAM verbatim merge **hard** (PREC-02); table fidelity | **Strongest** — dominates compose and post-compose |
| **PEL / metacognition** | DLA: mandatory min one cognition field + evaluators; DP: **preserve if present**; EQF metacognition explicitly **“lightweight”**; no page-level PEL repair | **Weaker at DP** than activities/materials; **medium at DLA** |

**Asymmetry:** Judgement and exposition have **materials-level** enforcement (GAM-PRES, task structure). Classic metacognition dimensions (confidence, progress checks, next-step monitoring) are mostly **EQF aspirational wording** without dedicated fields, capture gates, or post-compose repair on the page.

**Precedence stack** (`app.js` materials-copy guidance): L4 materials fidelity **>** L5 pedagogical enrichment **>** L7 rhetoric. PEL fields on activity rows can be **preserved** but **visually subordinated** to large `materials.*` bodies (42-11A).

---

## Static weaknesses

| Weakness | Detail |
| -------- | ------ |
| **Design Page has no PEL generation contract** | `resolvePedagogicEnrichmentContractIds` returns PEC ids when learner-page framing applies, but `applyPedagogicEnrichmentContractScaffoldToDraft` only appends blocks when `isDla` or `isGam` — **not** `isDesignPage` |
| **Metacognition explicitly deprioritised** | EQF: “Metacognition (lightweight)”; Design Page manifestation: “do not turn it into heavy extra tasks” |
| **No page-level PEL repair** | `repairLearnerPageCompositionFromUpstream` restores DLA activities and merges framing fields; does not synthesise `study_tips`, overview metacognition, or missing cognition fields from upstream LC/KM |
| **Evaluators are diagnostic only** | `evaluatePelOrientationContractSatisfaction`, `evaluatePelReasoningContractSatisfaction`, EQF evaluator — used in tests/probes; **do not block** Design Page capture |
| **Selective uncertainty/scaffolding** | `uncertainty_tension_prompt` and `scaffold_hint_sequence` only when brief factors / cognition packs active — not universal |
| **CLS → learner metacognition gap** | LS produces facilitator-oriented timeline; assimilation to DP is prompt-level, not structural |
| **learning_content out of PEL surface** | GLC not in EQF targets; no metacognitive field schema at LC stage |
| **Field ≠ visible manifestation** | Mandatory `self_explanation_prompt` on DLA does not guarantee prominent render or reader attention vs task/tables |
| **Anti-diary rhetoric vs PEL labels** | Rhetoric/journey discourage “reflect on your learning” diary tone — correct for quality, but can **suppress** surface metacognitive language even when PEL intent exists |

---

## Risk ranking

Likely causes if PEL feels absent on final pages (static inference only):

1. **Composition / activity dominance** — PEL fields live on activity rows inside the dominant `learning_activities` section; large GAM materials control scan path (42-11A). *Category: composition dominance + activity dominance.*

2. **Design Page does not generate PEL** — only preserves upstream fields and soft EQF/rhetoric/journey closure; no PEC blocks at compose. *Category: weak preservation at page generation stage.*

3. **Token / precedence competition** — PREC-02 and L4 materials fidelity override wrapper thinning; many prompt modules stacked; metacognition explicitly lightweight. *Category: prompt dilution + model discretion.*

4. **Gap between DLA capture gate and page compose** — DLA may pass framing validation but LLM compose can still thin wrappers, duplicate rows, or bury fields; repair does not re-run PEL evaluators on page. *Category: weak preservation contracts at DP.*

5. **Impression vs absence** — PEL may be **present as fields** (`reasoning_orientation`, `self_explanation_prompt`) but read as **educational labels** rather than metacognitive movement — indistinguishable from exposition without manual read. *Category: model discretion / reader impression.*

---

## Verdict

**B. PEL implemented but weakly protected**

**Rationale:**

- **Implemented:** Rich PEL surface at **DLA** (mandatory preamble + cognition fields, orientation/reasoning PEC prompts, capture validation) and **GAM** (PEL reasoning materials block, closure minima references). EQF and rhetoric spread journey, independence, and lightweight metacognition across CLS and Design Page prompts.
- **Weakly protected at the learner page:** Design Page does **not** receive PEL PEC injection; metacognition is **explicitly lightweight** in EQF; no hard page-level metacognitive contract; post-compose path prioritises **activity membership and GAM materials** over PEL visibility; evaluators do not gate page output.

This is **consistent with** (not contradictory to) the activity-centric composition gap from 42-11A: PEL is largely **authored at DLA/GAM** and **copied through** Design Page, so it can exist upstream yet **not read as a metacognitive spine** on the final resource.

**Not chosen:**

- **A** — contradicted by missing DP PEL injection and lightweight EQF metacognition wording.  
- **C** — too harsh; DLA mandatory framing and PEL prompts are substantive, not purely aspirational.  
- **D** — static evidence is sufficient to rule out “largely absent.”

---

## Recommended next investigation

**Do not implement.** Validate manifestation on **existing Marx manual run artefacts** (handover preference over harness/fixtures):

1. Run **PEL evaluators** (`evaluatePelOrientationContractSatisfaction`, `evaluatePelReasoningContractSatisfaction`) against captured DLA JSON and composed page JSON from the same Marx manual run.
2. Run **EQF evaluator** on final `page` artefact — compare `metacognition`, `learning_success`, `independence` dimension hits vs `capability` / `judgement`.
3. **Manual read** of rendered HTML: for each activity, are `self_explanation_prompt`, `reasoning_orientation`, `intellectual_coherence_bridge` **visible and salient**, or buried below tables/checklists?
4. Compare **field presence** (DLA capture) vs **field presence** (composed page after repair/GAM merge) — detect compose-time stripping (42-7 pattern for GAM bodies; framing fields use separate merge path).
5. If fields are present but low-salience, the gap is likely **composition dominance / reader experience** (42-11B), not missing PEL architecture at DLA.

If Marx artefacts show strong DLA PEL scores but weak page evaluator scores or poor HTML salience, that would confirm **B → composition/visibility** rather than **upstream PEL absence**.
