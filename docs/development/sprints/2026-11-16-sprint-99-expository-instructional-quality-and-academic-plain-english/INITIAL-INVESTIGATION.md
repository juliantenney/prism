# Sprint 99 — Initial investigation (read-only)

**Date:** 2026-11-16  
**Status:** Complete for opening (no code changes)  
**Depends on:** [S99-D01](decisions.md#s99-d01--open-sprint-99--expository-instructional-quality-and-academic-plain-english)

---

## 1. Expository generation pipeline (what actually applies)

Expository is a **first-class product** (`product: "expository"`, `promptRoute: "expository"`, `publishRoute: "expository_page"`). Delivery profile: self-directed; **`activities_required: false`**, **`materials_required: false`** — exposition sections, not Interactive activity moments.

### Authoring stages (Expository-specific + shared)

| Stage | Role | Notes |
| ----- | ---- | ----- |
| Generate Learning Content (GLC) | Explanatory richness spine | Shared step; Expository sibling body when route is Expository |
| Define Learning Outcomes (LO) | Understanding-oriented outcomes | Shared; Expository LO sibling avoids Interactive evidence obligations |
| Model Knowledge (MK) | Conceptual structure | Shared; no Expository-specific template claimed |
| **Expository Journey Plan (EJP)** | Whole-resource intellectual journey | `step_expository_journey_plan` — section order, epistemic form, extent |
| **Expository Development (XD)** | Per-section explanation + commissions | `step_expository_development` — learner-facing `exposition` + optional invitations/commissions |
| **Expository Materials (XM)** | Commissioned supporting artefacts | `step_expository_materials` — tables/figures/bodies; not Interactive GAM |
| Design Page | Thin orientation / synthesis transport | Shared Design Page step on Expository route |
| Assembly | `page-vnext-assemble` Expository path | Merges EJP → XD → XM → DP into page + `expository_journey` |
| Renderer | `pageKind: "expository"` | `expositionSections`; not Interactive Orient→Learn→Do→Check composition |

**Interactive Episode Plan / DLA / GAM do not own Expository pedagogy.** Sibling prompts are explicitly “pedagogically independent of Interactive EP/DLA/GAM” (`lib/expository-sibling-prompts.js`).

**Learning Sequence:** Interactive-style `learning_sequence.timeline[].learner_study_flow` is not the Expository control plane. Do not expect M5 Option C behaviour on Expository pages.

---

## 2. Prompts, contracts and renderer behaviours (Expository-relevant)

| Surface | Location | Relevance |
| ------- | -------- | --------- |
| Expository sibling prompts | `lib/expository-sibling-prompts.js` | GLC / LO / EJP / XD / XM / Design Page bodies; judgement elaboration; EQ register |
| Domain guidance consumption | Same module `DOMAIN_GUIDANCE_CONSUMPTION` | Per-stage why domain rules apply |
| Runtime augmentations | `app.js` `applyWorkflowStepRuntimePromptAugmentations` when `promptRoute === "expository"` | Domain guidance + **EQF** + math + JSON; **S98-D08 typography** (pre-branch) |
| Assembly | `lib/page-vnext-assemble.js` | Expository stage merge; `page_synthesis`; `expository_journey` |
| Renderer | `build-page-model.js` / `render-page.js` | `isExpositoryLearnerPage`; exposition region |
| Structured materials | `expository-structured-materials.js` | Tables/figures/fallbacks for XM |

---

## 3. What Sprint 98 already reaches Expository

| Sprint 98 item | Reaches Expository? |
| -------------- | ------------------- |
| **S98-D08** discretionary-emphasis ban (`LD-LEARNER-FACING-PROSE-TYPOGRAPHY`) | **Yes** — injected before route branching for Expository runtime augmentations |
| Interactive Academic Plain English (`LD-GAM-INSTRUCTIONAL-DEPTH` APE block) | **No** — Interactive GAM-only (confirmed by Sprint 98 APE route tests) |
| Interactive Design Page role-separation / knowledge_summary Interactive wording | **No** (Interactive DP contract path) |
| M5 Option C attempt-before scaffolds | **No** — Interactive composition only; Expository has no Learn/Do moments |
| EQF educational quality framework | **Yes** — Expository augmentation path applies EQF |
| Math-safe / strict JSON contracts | **Yes** on Expository path |

**Implication:** Expository already inherits global typography + EQF, but **not** Interactive APE / layer-purpose economy as authored for GAM materials. Whether Expository needs its own Academic Plain English manifestation is an **evidence question** for M1 generation evaluation — not assumed.

---

## 4. How Expository is designed to support understanding (guidance reading)

From Expository sibling prompts (especially GLC / XD / XM):

| Dimension | Guidance posture |
| --------- | ---------------- |
| Conceptual explanation | Continuous developing exposition; sections as one journey, not mini-essays |
| Prior knowledge / advance organisation | Audience/level govern terminology; Design Page thin orientation; Prefer section-scoped figures over page KS figures in DP visual guidance |
| Examples / non-examples / analogies | Selective repertoire — **judgement rule**: include only what earns its place; not every section |
| Relationships between ideas | EJP connections / continuity hooks; recurrence with new purpose |
| Learner explain / predict / apply / check / revise | **Optional** `invitations_to_think` when they serve understanding — explicitly **not** required evidence / Interactive workspaces |
| Feedback / verification | Not Interactive Check deferral; optional invitations; no required learner_task / expected_output |
| Disciplinary precision vs linguistic complexity | EQ register: confidence without epistemic overconfidence; avoid stock metacommentary; preserve qualifications |
| Productive vs redundant repetition | Final-section consolidation; recurrence must advance; avoid restating comparative tables at length |

**Guardrail alignment:** Explanation-before-activity is the **default Expository mode**, not a defect. Attempt-before-scaffold is Interactive-specific.

---

## 5. Authored intention vs rendered experience (hypotheses only)

| Topic | Status |
| ----- | ------ |
| EJP order vs rendered section order | **Hypothesis / verify on case** — assembly intended to preserve EJP section_ids |
| explanation_intent leaking into learner exposition | Historical XD hard rule forbids; **verify on generation** |
| Schema field names as learner-visible headings | XD/XM forbid production descriptors as headings; **verify on ZIP** |
| Discretionary bold in continuous prose | S98-D08 now in Expository augmentations; **not yet generation-validated** |
| Knowledge Summary placement | Must remain before exposition; **verify on ZIP** |
| Interactive activity chrome appearing on Expository | Should not; profile `activities_required: false` — **verify** |

No learner-facing defect is declared without case evidence.

---

## 6. Genuine problems vs appropriate Expository differences

| Appropriate for Expository | Not to be treated as Interactive defects |
| -------------------------- | ---------------------------------------- |
| Explanation-first reading/viewing chapter | Missing attempt-before-scaffold |
| Optional invitations to think | Missing mandatory Do/Check workspaces |
| Empty materials commissions | “Thin” XM when prose is sufficient |
| Epistemic plurality / uncertainty preserved | “Settled model” Interactive apply activities |

---

## 7. Evidence gaps (block educational conclusions until filled)

1. No Sprint 99 Expository assembled JSON + rendered ZIP yet.  
2. S98-D08 not generation-validated on Expository.  
3. Whether Interactive APE should be mirrored (adapted) for XM/XD is unknown without prose evaluation.  
4. Prior Expository sprints (83–87) closed; their residual debt is not re-audited here — consult if M1 surfaces familiar issues.

---

## 8. Status note (post-M1 / M2)

M1 educational evaluation of three Expository resources and M2 focused investigation are recorded in [M2-INVESTIGATION.md](M2-INVESTIGATION.md) · [S99-D02](decisions.md#s99-d02--accept-m1--provisional-educational-evaluation-of-three-expository-resources) · [S99-D03](decisions.md#s99-d03--accept-m2-investigation-findings-and-propose-m3-scope).

This M0 document remains the pipeline baseline. **No Sprint 99 code changes** until M3 is authorised.
