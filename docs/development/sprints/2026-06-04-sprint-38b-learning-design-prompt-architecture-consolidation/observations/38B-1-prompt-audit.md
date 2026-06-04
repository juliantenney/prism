# Slice 38B-1 — Prompt audit

**Date:** 2026-06-04  
**Status:** **COMPLETE** (priority LD steps; Design Page + six upstream steps)  
**Template:** [probe-38B-1-prompt-audit-template.md](../fixtures/probe-38B-1-prompt-audit-template.md)  
**Probe:** `node scripts/probe-38b1-ld-workflow-prompt-audit.js` (full audit); `node scripts/probe-38b1-design-page-prompt-size.js` (Design Page only)

**Measurement context:** Self-directed brief = `delivery_context: self_directed`, `learning_environments: [self_study]`. Facilitated brief = `delivery_context: in_person`, `classroom`. Probe uses `buildSeededStepPromptForWorkflowStep` + `applyWorkflowStepRuntimePromptAugmentations` without live workflow DB — **PEL orientation** and **pedagogic cognition contract** may additionally apply when full `workflowBriefResolution` + pack cognition config activate `contract.active` (not counted in probe block lists below).

---

## Comparative ranking (self-directed brief)

| Step | Seeded chars | Augmented chars | Block count | Risk | Consolidation priority |
|------|-------------:|----------------:|------------:|------|------------------------|
| **Design Page** | 9,648 | **45,791** | 15 | **CRITICAL** | **1** |
| **Design Learning Activities (DLA)** | 3,470 | **39,201** | 14 | **CRITICAL** | **2** |
| **Generate Activity Materials (GAM)** | 4,377 | **34,482** | 15 | **CRITICAL** | **2** (tie — upstream table origin) |
| **Generate Assessment Items** | 6,350 | **32,308** | 11 | **HIGH** | **3** |
| Construct Learning Sequence | 4,462 | 4,462 | 0 | LOW | 4 (pack trim only) |
| Define Learning Outcomes | 1,569 | 1,569 | 0 | LOW | 5 |
| Model Knowledge | 1,293 | 1,293 | 0 | LOW | 5 |

**Facilitated brief pattern:** DLA, GAM, Assessment, Design Page collapse to **+1,494 chars** (math block only) or **+10,498** (Design Page + Sprint 38) — self-directed scaffolding is the dominant growth driver.

---

## Shared augmentation modules

| Module / block family | Steps (self-directed probe) | Origin in `app.js` |
|----------------------|----------------------------|-------------------|
| **Self-directed rhetoric stack** (9 blocks) | DLA, GAM, Assessment, Design Page | `applySelfDirectedLearnerPageStepScaffoldsToDraft` → `applyLearnerActionRhetoric` |
| **DLA material shape + framing + timeline** | DLA only | `buildSelfDirectedLearnerPageMaterialShapePromptBlock`, `ActivityFraming`, `TimelineSequencing` |
| **GAM table / reading / voice** | GAM only | `buildSelfDirectedGamTableRowAdequacy`, `ReadingSufficiency`, `LearnerVoice` |
| **Design Page field preservation** | Design Page only | `buildSelfDirectedLearnerPageDesignPageFieldPreservationBlock` |
| **Sprint 38 visual affordances** | Design Page only | `applySprint38VisualAffordanceContractToDraft` |
| **Materials fidelity (page)** | Design Page only | `applyDesignPageActivityMaterialsFidelityContractToDraft` |
| **Math notation contract** | DLA, GAM, Assessment, Design Page | `applyMathSafeOutputContractToDraft` |
| **PEL orientation** (conditional) | DLA, Design Page | `applyPedagogicEnrichmentContractScaffoldToDraft` |
| **PEL reasoning + GAM reasoning materials** (conditional) | GAM (reasoning); not in probe list | `buildPelReasoningContractPromptBlock`, `buildSelfDirectedGamPelReasoningMaterialPromptBlock` |
| **Pedagogic cognition contract** (conditional) | DLA, GAM when `contract.active` | `applyPedagogicCognitionContractScaffoldToDraft` |

---

## Table-related guidance by step

| Step | Pack table guidance | Runtime table guidance | Emits table content? |
|------|-------------------|------------------------|----------------------|
| Model Knowledge | No | No | No |
| Define Learning Outcomes | No | No | No |
| **DLA** | `pipe tables` in learner_task; `template` / `analysis_table` in **required_materials specs** (not content) | Material shape: integrated template/analysis_table | **Specifications only** |
| **GAM** | **Strong:** “complete pipe table with header, divider, and rows”; avoid malformed table-like text | **Table row adequacy** block (blank rows, mapping rows) | **Yes — primary table author** |
| Generate Assessment Items | No | No | Items JSON, not activity tables |
| Construct Learning Sequence | References materials by id; no table shape | No | No |
| **Design Page** | Named fields; no comma-row ban | **No table row adequacy block** | **Merge/copy** from GAM — regression point |

**38B-4 conclusion:** Table fidelity failure likely **originates in GAM output shape** and/or **Design Page merge compression**, not exclusively Design Page pack text. DLA sets `type: template` / table specs that GAM must realise as pipes.

---

## Duplication clusters — where they originate

| Cluster | First origin | Propagates to |
|---------|--------------|---------------|
| Self-directed learner rhetoric (9 blocks) | Runtime `app.js` (Sprint 35–37) | DLA, GAM, Assessment, Design Page |
| Worked example / faded / misconception | Pack `defaultPromptNotes` (DLA, GAM) + runtime blocks | GAM content, Design Page copy rules |
| Math `\\(...\\)` delimiters | Pack templates (DLA, GAM, Assessment, Design Page) + math block | All four steps |
| Table pipe rules | **GAM pack template** (strongest) | DLA specs → GAM → Design Page (weaker / duplicated) |
| Verbatim materials / no placeholders | Design Page pack + runtime materials fidelity | Design Page only (downstream) |
| Sprint 38 affordances | Design Page pack + runtime (~7k + examples) | Design Page only |
| Session synthesis vs verbatim materials | DLA/Design Page pack notes + session orientation rhetoric | Design Page overview + materials tension |

---

## Per-step audits

### Model Knowledge (§3) — `step_model_knowledge`

| Field | Value |
|-------|--------|
| **Prompt sources** | Pack §3 `promptTemplate` (1,358), `defaultPromptNotes` (236); `promptScope: step_only`; no workflow goal |
| **Runtime augmentations** | None in `applyWorkflowStepRuntimePromptAugmentations` |
| **Seeded / augmented (both briefs)** | 1,293 / 1,293 |
| **Block count** | 0 |
| **Duplicated rules** | None across runtime |
| **Contradiction risks** | LOW — isolated transformation |
| **Known regressions** | None linked to materials/table |
| **Risk** | **LOW** |

---

### Define Learning Outcomes (§4) — `step_define_learning_outcomes`

| Field | Value |
|-------|--------|
| **Prompt sources** | Pack §4 `promptTemplate` (1,786), `defaultPromptNotes` (133); userOptions (level, count, emphasis, scope) |
| **Runtime augmentations** | None |
| **Seeded / augmented** | 1,569 / 1,569 |
| **Block count** | 0 |
| **Duplicated rules** | None |
| **Contradiction risks** | Scope “module” default vs short-session activities downstream |
| **Known regressions** | None |
| **Risk** | **LOW** |

---

### Design Learning Activities (§5) — `step_design_learning_activities`

| Field | Value |
|-------|--------|
| **Prompt sources** | Pack §5 `promptTemplate` (3,805), `defaultPromptNotes` (2,703) — heavy pedagogy in notes |
| **Runtime augmentations** | Cognition scaffold (conditional); self-directed: material shape, activity framing, timeline alignment, **9 rhetoric blocks**, math |
| **Seeded / augmented (self-directed)** | 3,470 / **39,201** (+35,731) |
| **Seeded / augmented (facilitated)** | 3,470 / 4,964 (+1,494 math only) |
| **Block count (self-directed)** | **14** |
| **Duplicated rules** | Template/table/scaffolding in pack notes + worked-example runtime + material shape block |
| **Contradiction risks** | **HIGH** — “do not generate full material content” vs downstream GAM “generate full content”; specs use `template`/`analysis_table` without pipe examples |
| **Known regressions** | Indirect — weak specs may yield GAM/Design Page table drift |
| **Risk** | **CRITICAL** |

**DLA block list (self-directed):** Material shape, Activity framing, Timeline sequencing, Learner-action rhetoric, Worked-example/faded, Embedded feedback, Concept/procedure, Metacognitive closure, Session orientation, Conceptual tension, Intellectual progression, Epistemic synthesis, Transfer/durable, Math.

---

### Generate Activity Materials (§6) — `step_generate_activity_materials`

| Field | Value |
|-------|--------|
| **Prompt sources** | Pack §6 `promptTemplate` (4,473), `defaultPromptNotes` (1,675); `preferredOutputFormat: text`; structured section template |
| **Runtime augmentations** | Cognition (conditional); self-directed: **table row adequacy**, reading sufficiency, material voice, timeline, **9 rhetoric blocks**, math; PEL reasoning materials when enrichment active |
| **Seeded / augmented (self-directed)** | 4,377 / **34,482** (+30,105) |
| **Seeded / augmented (facilitated)** | 4,377 / 5,871 |
| **Block count (self-directed)** | **15** |
| **Duplicated rules** | Pipe table rule in pack + table row adequacy runtime; worked-example in pack notes + runtime |
| **Contradiction risks** | **MEDIUM** — “Facilitator use:” section in output template vs self-directed voice block |
| **Known regressions** | **Upstream candidate for table shape** — if GAM emits CSV/prose, Design Page inherits; fixture shows correct pipes when model complies |
| **Risk** | **CRITICAL** |

**GAM-only blocks:** Table row adequacy, Reading sufficiency, Material voice (not on Design Page).

**Strongest pack table line:** “If a table is needed, produce a complete pipe table with header, divider, and rows”.

---

### Generate Assessment Items (§9) — `step_generate_assessment_items`

| Field | Value |
|-------|--------|
| **Prompt sources** | Pack §9 `promptTemplate` (6,454), `defaultPromptNotes` (1,073); large MCQ/stimulus contract |
| **Runtime augmentations** | `isWorkflowStepAssessmentProducer` → rhetoric stack (9) + math when self-directed |
| **Seeded / augmented (self-directed)** | 6,350 / **32,308** (+25,958) |
| **Seeded / augmented (facilitated)** | 6,350 / 7,844 |
| **Block count (self-directed)** | **11** |
| **Duplicated rules** | Closure/judgement overlap with DLA pack + rhetoric blocks |
| **Contradiction risks** | MEDIUM — long template + rhetoric; not table-related |
| **Known regressions** | None table-specific |
| **Risk** | **HIGH** |

---

### Construct Learning Sequence (§10) — `step_construct_learning_sequence`

| Field | Value |
|-------|--------|
| **Prompt sources** | Pack §10 `promptTemplate` (4,619), `defaultPromptNotes` (168) |
| **Runtime augmentations** | None |
| **Seeded / augmented** | 4,462 / 4,462 |
| **Block count** | 0 |
| **Duplicated rules** | Material reference rules overlap Design Page membership themes |
| **Contradiction risks** | Facilitator choreography in template vs self-directed notes — **MEDIUM** for learner-page workflows |
| **Known regressions** | None table-specific; sequence omission ≠ Design Page membership (different rules) |
| **Risk** | **LOW** (size) / **MEDIUM** (facilitator vs self-directed wording) |

---

## Design Page (§13) — summary

See sections above (unchanged substance). **45,791** chars augmented, **15** blocks, **CRITICAL**. Open regressions: placeholder (partial), **table fidelity (open)**.

---

## Consolidation plan pointer (38B-3)

Collapse to **8-layer contract**; estimated self-directed augmentation reduction **~75k+ chars** across DLA+GAM+Design Page+Assessment if rhetoric stack unified once. Design Page target ≤22k augmented (charter).

---

## Outputs

- [x] All priority steps inventoried with metrics  
- [x] Comparative ranking table  
- [x] Shared modules + table guidance + duplication origin  
- [x] Handoff to [38B-5](38B-5-workflow-wide-review.md) waves  
- [ ] Duplication → taxonomy layer mapping (38B-2)
