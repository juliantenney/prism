# Sprint 102 — Initial investigation (102A)

**Status:** **COMPLETE** (read-only)  
**Sprint:** 102 — Learning Journey–Owned Outcomes and Commission-Native Component Authoring  
**Opening:** [S102-D01](decisions.md#s102-d01--open-sprint-102)  
**Amendments:** [S102-D02](decisions.md#s102-d02--amend-sprint-102-assumptions)  
**Mode:** Read-only code/docs inspection — **no** application, prompt, schema, validator or workflow edits  
**Builds on:** Sprint 101G commission-native feasibility (not repeated as experiment)

---

## Purpose

Determine the **mechanical** path for journey-owned outcomes → commission transport → EP representation, and the smallest change set that lets commissioned components start at Episode Plan without inventing competing outcomes — while preserving standalone foundation workflows where they exist.

This is **not** a re-proof of pedagogical feasibility.

---

## Design principle

The Learning Journey owns curriculum coherence; components realise their commissioned contribution.

### Authority / transport / representation (S102-D02)

| Layer | Meaning |
| ----- | ------- |
| **Authority** | Learning Journey defines and allocates outcomes |
| **Transport** | Existing commissioning text carries those outcomes |
| **Representation** | EP may require the same outcomes in a structured format |

Converting authoritative commissioned outcomes into EP’s required representation must **not** silently generate or rewrite outcomes.

### Pedagogical feasibility already established (do not re-litigate)

- The **C4 Step 4 experiment** successfully generated a mathematically sound component using **supplied structured learning outcomes without GLC or MK**.  
- We **do not assume** that EP needs a replacement knowledge model.  
- We will **not** introduce compensating knowledge-modelling prompts unless a concrete dependency or observed failure justifies them.  
- Treat that success as feasibility evidence, **not** proof that every component can omit foundation stages.

### Architecture posture (S102-D02)

Sprint 101G *Ready / Needs enrichment / Requires full workflow* is a **candidate** mechanism only — **not** a required classification system. Prefer the **smallest working implementation**.

---

## Concise existing data flow

```text
LJ JourneyRequirements
  → intended learning (prose) + body of knowledge (prose)
LJ JourneyProgression / JourneyElements
  → developmental phases + educational jobs (prose)
LJ JourneyCommission (Step 4)
  → educational jobs, continuity, product selection (prose)
LJ Design Page
  → commissions[] { specification_text, journey_context_text, dependencies, product_id, … }
       NO structured learning_outcomes[] on the journey page
        ↓
commissionToIntakeEnvelope → intakeCommission
  → deliverySeed { commission_specification, journey_context, …, optional source_context }
  → child family titles = INTERACTIVE_TITLES (Practice/Interactive)
       still includes GLC → MK → DLO → EP → …
        ↓
ORIGINAL_BRIEF / commission context honoured on GLC/MK/DLO
  → child DLO emits STEP OUTPUT: learning_outcomes (structured)
        ↓
EP deriveDesignEpisodePlanCaptureJson
  → resolveUpstreamWorkflowArtefactFromCaptures("learning_outcomes")  [HARD]
  → createPageShellFromEpisodePlan(…, { learning_outcomes })
        ↓
DLA → GAM → LS → DP consume progressive page (LOs + episode_plans hard; KM/GLC optional)
```

---

## Findings (evidence)

### 1. Journey outcomes: generated as prose, not structured LO artefacts

- LJ `learning_requirements` prompts establish **INTENDED LEARNING** in prose (preserve supplied outcomes or derive them) — `lib/learning-journey-sibling-prompts.js` (`learning_requirements`).  
- Progression / elements / commissions continue in prose educational jobs — same file (`learning_progression`, `learning_elements`, `learning_commissions`).  
- Design Page commission schema has **no** `learning_outcomes[]` field. Fields are identity + `specification_text` + `journey_context_text` + `dependencies` — `lib/learning-journey-design-page.js` ~409–418, 453–462.  
- Journey DP `assembly_state.enriched_by` lists journey stages only (`learning_requirements` … `design_page`) — same file ~429–437.

**Implication (authority gap):** Journey “owns” intended learning narratively, but does **not** emit a durable structured outcome set that components can consume as EP representation.

### 2. Allocation to components is educational-job prose, not outcome IDs

- Step 4 commissions map elements → product commissions with **Educational job**, continuity, bring-forward — not `outcome_id` rows.  
- Design Page guidance: `specification_text` = educational job/constraints; `journey_context_text` = scenario / preceding activities / bring-forward — `learning-journey-design-page.js` ~458–460.  
- Prefer Practice for activity-oriented jobs — ~456.

**Implication:** Responsibilities are allocated; **structured outcome allocation is not**.

### 3. Commission → child intake stamps prose only

- Intake builds `deliverySeed` with `commission_specification`, `journey_context`, `commission_dependencies`, optional `source_context` — `lib/first-class-commission-intake.js` ~309–330.  
- **CONFIRM (Sprint 101):** intake does **not** inject finished KM/LO artefacts; child still runs GLC → MK → DLO — [PRACTICE-INSTRUCTIONAL-CONTRACT.md](../2026-11-19-sprint-101-practice-as-a-learning-journey-component/PRACTICE-INSTRUCTIONAL-CONTRACT.md) §2.2.  
- Commission honour context targets foundation steps (GLC/MK/DLO; Normalize for Interactive) — `app.js` `isCommissionContextDeliveryStep` ~6088–6108. **Not** EP.

### 4. EP hard-requires structured `learning_outcomes`

- EP prompt: “Read learning_outcomes from STEP N OUTPUT” — `app.js` `buildEpisodePlanV2CopilotSchemaInstructions` ~14116.  
- Derive path: `deriveDesignEpisodePlanCaptureJson` resolves upstream `learning_outcomes`; **empty → no shell** — `app.js` ~15917–15926.  
- Shell embeds LO array + `source_artefacts` provenance — `lib/page-shell-create.js` `createPageShellFromEpisodePlan` ~380–412, 502–507.  
- Strict DLO shape: non-empty `learning_outcomes[]` with `statement`, `related_concepts`, `cognitive_level` — `lib/workflow-artefact-json-strict.js` ~201–207, 522–523.  
- Fallback: episode_plans can be derived from LOs if EP capture missing (non-canonical) — underscoring LOs as the critical handoff — `app.js` ~15908–15911.

**Representation requirement:** structured LO artefact. Prose in `specification_text` is **transport**, not EP representation.

### 5. GLC / MK soft for EP→DP; DLO hard via topology + LO capture

| Stage | GLC / `learning_content` | MK / `knowledge_model` | DLO / `learning_outcomes` |
| ----- | ------------------------ | ---------------------- | ------------------------- |
| EP | Soft (conversation only) | Soft | **Hard** (capture / shell) |
| DLA | Optional enrichment | Optional | **Hard** via page LOs + episode_plans — `ld-dla-page-enrich-contract.js` ~284 |
| GAM / LS / DP | Soft at best | Soft | Preserve page LOs; upstream is progressive `page` |

Expository sibling bindings hard-bind to LO/KM/learning_content; Interactive/Practice EP chain does **not** (Sprint 101G). No evidence EP requires a KM substitute after C4 Step 4 success.

### 6. Ordering / validation / persistence blockers to EP-first

1. **Child topology always includes foundation:** Practice/Interactive build `INTERACTIVE_TITLES` = GLC → MK → DLO → EP → … — `lib/first-class-workflow-family.js` ~25–34, Practice ~1020–1052.  
2. **Order gate:** `normalizeWorkflowDesignStageOrderInPlace` forces EP **after** DLO when both present — `app.js` ~8879–8885.  
3. **EP derive** looks for DLO capture name `learning_outcomes`, not commission fields.  
4. **Commission context** is delivered to GLC/MK/DLO, not rebound onto EP.  
5. **Provenance:** assembly expects foundation STEP outputs; fabricating empty GLC/MK/DLO would poison provenance (101G).

### 7. Preserving standalone / legacy behaviour (smallest mechanism)

- Practice is **LJ-commissioned only**; **not** in Create menu — `CREATE_DECLARATIONS` omits practice (`first-class-workflow-family.js` ~196–235); comment ~1021 “LJ-commissioned only in v1”.  
- Standalone Create declarations remain Interactive (self-study/workshop), Expository, Assessment Pack, Learning Journey, Situated Task — same block.  
- Fail-closed: unknown products do not become Interactive — `unknown_product` ~1055–1057.

**Smallest isolation rule:** commission-native EP entry only when `hasCommissionContext` (or equivalent LJ-intake flag) **and** authoritative structured outcomes are bound; Create-from-topic Interactive/Expository/AP/Situated Task keep full foundation unchanged. Practice has no standalone Create path to preserve.

---

## Mechanical blockers (specific)

1. No journey-level structured `learning_outcomes[]` artefact / field on Design Page commissions.  
2. Intake does not bind structured LOs into the child workflow.  
3. Child title list always includes GLC/MK/DLO for Practice/Interactive.  
4. Design-graph order gate assumes DLO before EP.  
5. EP derive hard-requires upstream `learning_outcomes` capture.  
6. Commission honour context targets foundation steps, not EP.  
7. Prose outcomes in `specification_text` ≠ strict LO representation (conversion must be explicit, non-rewriting).

---

## Minimal proposed change set (investigation recommendation only — **not authorised to implement**)

Prefer the **smallest working** path; do **not** mandate the full 101G three-way classifier.

1. **Authority (LJ):** Ensure journey design/commissioning can state the outcomes allocated to each component **authoritatively** (prose in `specification_text` may suffice for transport if a deterministic parse/bind step exists; otherwise the smallest additive structured field on the commission or intake envelope — only if prose proves insufficient).  
2. **Transport:** Continue using existing commission intake (`specification_text` / `journey_context_text` / `source_context`).  
3. **Representation bind (mechanical core):** At child intake or EP-entry, **materialise** authorised outcomes into a `learning_outcomes` artefact capture **without LLM rewrite** (validate shape; fail closed if incomplete).  
4. **Topology:** For that commissioned child only, omit GLC/MK/DLO model steps (or no-op them) and start at EP; keep `INTERACTIVE_MIDDLE` + DP.  
5. **Order gate:** Allow EP-first when foundation titles are absent / when commission-native flag is set.  
6. **Prompts:** Alternate EP binding: authoritative commission LOs (not only “STEP N OUTPUT: learning_outcomes” from DLO). Rebind commission honour context onto EP when foundation is skipped.  
7. **No KM substitute** unless a concrete failure appears.  
8. **Isolation:** Gate on LJ commission context; never alter Create-from-topic Interactive/Expository/AP/Situated Task foundation titles.

Optional later: a thin readiness check that refuses EP-first when structured outcomes cannot be bound — without adopting a full Ready/Needs enrichment/Requires full workflow product taxonomy.

---

## Genuine unresolved decisions

1. **Transport vs new field:** Can allocated outcomes be carried entirely in `specification_text` with a strict parseable subsection, or is the smallest additive structured commission/intake field required for reliable non-rewriting bind?  
2. **Who materialises representation:** Intake (before workflow graph) vs first EP step (deterministic seed) vs Design Page emission of structured rows — which is smallest and fail-closed?  
3. **Scope of EP-first products:** Practice-only first, or all LJ-commissioned Interactive/Practice (and later others) behind the same flag?  
4. **Partial foundation:** When subject apparatus is thin but outcomes are complete, is shared `source_context` + journey_context enough, or must some components still run GLC/MK (without treating that as a mandatory classifier framework)?  
5. **Provenance label:** How to record that LOs are journey-commission-authoritative rather than child-DLO-authored without inventing fake DLO captures.

---

## Inventory: commission vs EP needs

| Need | Present today | Gap |
| ---- | ------------- | --- |
| Educational job / constraints | `specification_text` | May embed outcomes in prose only |
| Continuity / bring-forward | `journey_context_text` | Soft for EP |
| Shared corpus | `source_context` | Soft; not KM |
| Structured `learning_outcomes[]` | Child DLO only | **Hard gap for EP-first** |
| KM / GLC artefacts | Child stages | **Not required** for EP given C4 evidence |

---

## Explicitly out of scope for 102A

- Implementation, prompts, validators, schemas, workflows  
- Journey-level QA  
- Sprint 101 follow-up implementation  
- Commit / push  
- 102B design drafting beyond this recommendation
