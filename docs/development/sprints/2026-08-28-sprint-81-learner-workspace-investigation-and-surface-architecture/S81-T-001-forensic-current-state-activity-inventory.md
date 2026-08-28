# S81-T-001 — Forensic current-state activity inventory

**Sprint:** 81 — Learner Workspace Investigation & Surface Architecture  
**Status:** **COMPLETE — ACCEPTED** (operator 2026-08-28)  
**Executed:** 2026-08-28  
**Mode:** Investigation / evidence only — **no** learner-workspace product implementation  
**Opening decision:** [S81-D01](decisions.md#s81-d01--open-sprint-81--learner-workspace-investigation--surface-architecture)  
**Follow-on:** [S81-T-002](S81-T-002-learner-action-evidence-feedback-model.md) — COMPLETE (awaiting operator review of T-002)

---

## 1. Purpose

Establish **exactly what PRISM can currently generate** as learning activities — from the real production system — before designing a learner-action taxonomy or new interaction-surface model.

This is a **source-backed forensic inventory**, not a pedagogical wishlist.

---

## 2. Authoritative opening state (kickoff)

| Item | State |
| ---- | ----- |
| Sprint 80 | **CLOSED** — WORKING ALPHA ([T-008](../2026-08-26-sprint-80-settings-discovery-product-value-and-policy-architecture/S80-T-008-working-alpha-boundary-audit-and-sprint-80-closeout.md)) |
| Sprint 81 | **ACTIVE** — investigation / planning / architecture |
| D-014 | **RESOLVED** — gate `npm run test:first-class` |
| First-class journeys | Create → Save → Adjust → Run/Copy → capture → assemble → learner render (self-study / workshop; CAI default assessment path) |
| Accessibility | Alpha baseline established; **not** remediation scope here |
| Outcomes A–D | **Open** |

---

## 3. Executive verdict (forensic)

PRISM does **not** have a single first-class “activity type” enum that maps 1:1 to learner UI. Live production composes activities from several **independent layers**:

1. **Episode / activity planning** — frozen page archetypes `understand | apply | analyse | evaluate` + beat `FunctionEnum` + (optional) material-level instructional archetypes.  
2. **DLA commissioning** — `required_materials[]` rows with `material_type`, optional `response_fulfilment`, optional `diagnostic_review` / `practice_independence`.  
3. **GAM authoring** — material bodies (including `guided_criteria` checklist JSON).  
4. **vNext composition / render** — Orient/Learn/Do/Check moments + three implemented learner workspace capabilities (`text_entry`, `table_entry`, `ordering`) plus checklist / assessment interactive paths.

**Multiplicity is structural, not accidental:** many technical material types share one surface; one technical type can yield several learner forms; assessment select-like UX is separate from recognised-but-unsupported `single_select` / `multi_select` response-part surfaces.

**Diagnostic feedback (hard constraint):** the DLA field `diagnostic_review` is **proven commission/structural closure only** — **not** consumed by learner-renderer-vnext. Learner-facing “feedback” today is mostly **local self-check** (guided-review checkboxes, ordering exact-match, MCQ/TF radios). There is **no** first-class CAI → `feedback_pack` → vNext path. Guided-review generation explicitly **forbids claiming Prism assessed free-text** (`lib/guided-review-generation-contract.js`).

**Runtime mapping note:** vNext does **not** branch on DLA `response_kind`; it keys off material type / blank cells / task-step heuristics / ordering blocks. `response_kind` is a commissioning vocabulary, not a render enum.

---

## 4. Canonical production path (traced first)

```text
Create / Adjust (self-study | workshop)
  → Design Learning Activities (DLA partial page)
       • episode_plan archetype + beats (FunctionEnum)
       • required_materials[] + response_fulfilment (+ diagnostic_review when WS-3 trigger)
  → Generate Activity Materials (GAM)
       • bodies; guided_criteria for diagnostic checklists
       • diagnostic_review projected via gam-canonical-assembler
  → Assemble page (vNext assemble; assessment_items when CAI)
  → learner-renderer-vnext
       • moments Orient / Learn / Do / Check
       • workspaces text_entry | table_entry | ordering
       • checklist interactive / guided_review
       • assessment interactive (CAI items)
```

**Path class:** **First-class** for self-study and workshop per S80-T-008. Self-study vs workshop differ mainly by **DLA overlay / voice / facilitator fields**, not by a second material-type registry (see §9).

**Not on default first-class CAI path:** Design Feedback / `feedback_pack` (domain step exists; Create prunes unless explicit feedback intent; vNext does not consume it).

---

## 5. Inventory — technical / schema layer

*Provisional labels in italics are descriptive only — not a proposed taxonomy.*

### 5.1 Page / episode archetypes (frozen V1)

| Technical ID | Path class | Evidence |
| ------------ | ---------- | -------- |
| `understand`, `apply`, `analyse`, `evaluate` | **First-class** | `lib/episode-plan-population-contract.js` `FROZEN_V1_ARCHETYPES`; `lib/episode-plan-v1-validation.js`; certification corpus expects these |

These are **activity-sequence archetypes**, not learner surface kinds.

### 5.2 Beat functions (`FunctionEnum`)

Canonical membership (`lib/episode-plan-v1-vocabulary.js`):

`orientation`, `framing`, `activation`, `explanation`, `example`, `non_example`, `misconception_confrontation`, `criteria_exposition`, `criteria_construction`, `perspective_construction`, `worked_thinking`, `worked_judgement`, `guided_inquiry`, `guided_reasoning`, `guided_practice`, `independent_performance`, `evaluative_judgement`, `verification`, `revision`, `reflection`, `transfer`, `prediction`, `observation`, `transition`

vNext maps many of these into composition moments Orient / Learn / Do / Check (`lib/learner-renderer-vnext/compose-moment-classification.js`). **Moment ≠ technical type ≠ surface.**

Grammar also defines learner **roles** (`reflect | explain | model | practise | check | transfer`) — pedagogical roles on beats, **not** surface kinds (`lib/episode-plan-v1-archetype-grammar.js`).

**Path class — retired:** whole-sequence archetype journey registry emptied in Phase 5B (`lib/learner-renderer-vnext/archetype-rules.js` `ARCHETYPE_RULES: {}`). Do not treat as live activity ontology.

**Path class — legacy label set:** `beat-material-registry.js` `EPISODE_FUNCTION_BEATS` includes tokens outside FunctionEnum (e.g. `worked_example`, `application`, `check_understanding`) — presentation/heuristic legacy, not FunctionEnum membership.

### 5.3 Material-level instructional archetypes (DLA stamp / rules)

Allowed set (`lib/ld-instructional-archetype.js`):

| Technical ID | Role (descriptive) | Path class |
| ------------ | ------------------ | ---------- |
| `mechanism_explanation` | Causal explanation material planning | **Supported** on DLA path |
| `process_walkthrough` | Worked process/investigation prose | **Supported** |
| `mental_model_building` | System model + contrast | **Supported** |
| `evaluation_judgement` | Criteria-weighed judgement | **Supported** |

These constrain **how materials are authored**, not which workspace widget appears.

### 5.4 DLA `response_kind` / fulfilment (production binding)

| `response_kind` | Allowed material types (commission) | Fulfilment kinds | Path class | Evidence |
| --------------- | ----------------------------------- | ---------------- | ---------- | -------- |
| `table_compare` | `comparison_table` | `learner_workspace` / related | **First-class** | `lib/dla-production-fulfilment.js` |
| `table_complete` | analysis/decision/classification/planning/data/impact/comparison tables, `template` | same | **First-class** | same |
| `table_decide` | `decision_table`, `analysis_table` | same | **First-class** | same |
| `table_classify` | `classification_table` | same | **First-class** | same |
| `table_plan` | `planning_table` | same | **First-class** | same |
| `text_compose` | `prompt_set`, `template`, `task_card` | `learner_text_production` / workspace | **First-class** | same |

**Not in DLA `RESPONSE_KINDS`:** ordering / ranking / sequencing as a fulfilment kind — despite DLA contract prose mentioning “existing ordering workspace” (`lib/ld-dla-page-enrich-contract.js`) and vNext supporting ordering. See §10 unknowns / debt.

Teaching-only material types (no response fulfilment expected): e.g. `text`, `checklist`, `modelling_note`, `worked_example`, `sample_output`, `reference_table`, `consolidation_summary` (`TEACHING_ONLY_MATERIAL_TYPES` in fulfilment module). Also lists `explanatory_note` — **not** in `MATERIAL_RENDERER_TYPES` (commission/render vocabulary mismatch; see §10 / debt).

GAM blank-cell enforcement for table workspaces keys off fulfilment `kind === "learner_workspace"` (`lib/gam-workspace-fulfilment.js`) — still commissioning, not learner feedback.

### 5.5 vNext renderable material types

From `lib/learner-renderer-vnext/parse-material.js` `MATERIAL_RENDERER_TYPES`:

`text`, `worked_example`, `sample_output`, `checklist`, `analysis_table`, `scenario`, `decision_table`, `modelling_note`, `prompt_set`, `comparison_table`, `classification_table`, `planning_table`, `reference_table`, `data_table`, `impact_table`, `template`, `task_card`, `transfer_prompt`, `consolidation_summary`

Plus aliases (e.g. `rubric` → `checklist`, `exposition` → `text`). Non-renderable / structural types (`expected_output`, `guidance`, `what_to_do`, …) are excluded from material render.

Legacy generic `table` / `worksheet` flagged in same module — **historical / legacy** naming, not primary commission vocabulary.

### 5.6 Learner surface kinds (response-part registry)

| Surface kind | Implementation status | Path class | Evidence |
| ------------ | --------------------- | ---------- | -------- |
| `text_entry` | Implemented | **First-class** | `response-part-types.js`, `learner-surface-registry.js`, draft adapters |
| `table_entry` | Implemented via table workspace materials (not response-part composition) | **First-class** | `completion-table-workspace.js`, registry diagnostic if mis-composed |
| `ordering` | Implemented | **Supported** (renderer + certification); **commission frequency on live DLA unclear** | `normalize-ordering.js`, cert corpus fixture |
| `matching` | Recognised, unsupported | **Recognised-but-unsupported** | registry `UNSUPPORTED_LEARNER_SURFACE` |
| `single_select` | Recognised, unsupported as response-part | **Recognised-but-unsupported** (select-like UX exists via assessment path) | registry; `assessment-interactive.js` |
| `multi_select` | Recognised, unsupported | **Recognised-but-unsupported** | registry |

### 5.7 Assessment item types (CAI / GAI)

| Item type (pack / contract) | Interactive auto-check in vNext? | Path class | Evidence |
| --------------------------- | -------------------------------- | ---------- | -------- |
| `single_answer_mcq` | Yes when options + correct answer | **First-class** (CAI default) | `ld-gai-page-enrich-contract.js`; `assessment-interactive.js` |
| `true_false` | Yes (synthesises True/False) | **First-class** | same |
| `short_answer` / `open_response` | No interactive scoring | **Supported** as static / non-interactive | `canRenderInteractive` returns false |
| `essay` | Pack `response_formats` atomic option | **Pack-supported**; interactive path **not** evidenced (treat as constructed-response static unless proven) | `domain-learning-design-step-patterns.md` |
| `multiple_answer_mcq` | Pack allows; interactive multi-select **not** evidenced as first-class | **Debt / honesty gap** (S80) | domain step patterns; S80-T-008 / T-012 notes |

Domain also lists mix presets (`single_mcq_and_true_false`, `objective_mix_all`, …). GAI partial-page contract exemplifies `single_answer_mcq`; which mixes run on live default CAI is **not fully traced** in T-001 (unknown).

Assessment draft kind: `assessment_selection` (`learner-draft-adapters.js`) — **separate** from `single_select` surface kind.

### 5.8 Ordering / sequencing metadata

| Technical signal | Notes | Path class |
| ---------------- | ----- | ---------- |
| `activity_interaction_type`: sequencing / ranking | Normalised into ordering workspace | **Supported** when present on assembled page |
| `ordering.{canonical_order, learner_display_order, …}` | Authoritative schema variants | Fixture + historical production audit cited in cert fixture provenance |

Domain pack: DLA *may* emit `activity_interaction_type` / `ordering` (`domain-learning-design-step-patterns.md`). **Live DLA enrichment modules searched did not show ordering emission logic** comparable to `response_fulfilment` — treat routine first-class emission as **unknown** (§10).

### 5.9 Commission bindings (not surfaces)

| Binding | Shape | Consumer | Feedback class |
| ------- | ----- | -------- | -------------- |
| `response_fulfilment` | binds production material identity | DLA validate + GAM project | **No direct learner feedback** |
| `diagnostic_review.covers_response_material_ids` | on checklist row; must close fulfilment ids | DLA WS-3 + GAM `copyOwnFieldIfPresent` | **Proven structural only** — **zero** vNext references |
| `practice_independence` | on worked_example / modelling_note | DLA guided-only exemption / binding | **Apparent** relation to whether diagnostic_review is required; not a feedback UI |

---

## 6. Inventory — learner-facing forms × response evidence × surface

Dimensions kept separate. Rows may share surfaces (multiplicity preserved).

### 6.1 Exposition / study materials (*read / study*)

| Technical types (examples) | Learner-facing form | Response / evidence | Current surface | Feedback relationship | Path class |
| -------------------------- | ------------------- | ------------------- | --------------- | --------------------- | ---------- |
| `text`, `scenario`, `modelling_note`, `worked_example`, `sample_output`, `consolidation_summary`, `reference_table` (static) | Prose / worked model / sample / summary | None required for completion | Static markdown material in Learn (or absorbed moments) | **None** (unless later checklist covers production elsewhere) | **First-class** |

### 6.2 Table completion / comparison (*fill table*)

| Technical types | Learner-facing form | Evidence | Surface | Feedback | Path class |
| --------------- | ------------------- | -------- | ------- | -------- | ---------- |
| Unconditional: `analysis_table`, `decision_table`, `comparison_table` | Editable completion table in Do | Cell map (`table_entry` draft) | `table_entry` workspace | **No** programmatic check of cells; diagnostic checklist may be **self-attestation** covering fulfilment ids | **First-class** |
| Conditional: `classification_table`, `planning_table`, `data_table`, `impact_table` | Same **only if** blank learner cells present; else static | Same when workspace | Same | Same | **First-class** |
| `reference_table` | Reference / criteria table | None | Static (even if blanks) | **None** | **First-class** |

**Multiplicity:** six+ table material types → one `table_entry` capability when composition rules fire (`completion-table-workspace.js`).

### 6.3 Written production (*compose text*)

| Technical types / sources | Learner-facing form | Evidence | Surface | Feedback | Path class |
| ------------------------- | ------------------- | -------- | ------- | -------- | ---------- |
| `prompt_set` items | Prompted text areas | `{ text }` per part | `text_entry` | **No** auto-mark; may be covered by guided-review checklist (self-confirm) | **First-class** |
| `template` sections (`**Label:**`) | Labelled multi-field text | `{ text }` per section | `text_entry` | Same | **First-class** |
| `task_card` | Task card (often with production obligation) | Depends on fulfilment / composed parts | Often text / study mix | Same | **First-class** |
| `transfer_prompt` / transfer / reflection prompts | Transfer or reflection prompt + text entry | `{ text }` | `text_entry` | Same | **First-class** |
| Task steps classified as `text_compose` | Instruction + text workspace when unbound | `{ text }` | `text_entry` | Same | **First-class** |

### 6.4 Checklist / self-check / guided review (*check own work*)

| Technical type | Learner-facing form | Evidence | Surface | Feedback | Path class |
| -------------- | ------------------- | -------- | ------- | -------- | ---------- |
| `checklist` + flat criteria | Interactive checkbox self-check | `checklist_entry` draft (booleans) | Interactive checklist fieldset | **Local self-attestation only** | **First-class** |
| `checklist` + `guided_criteria` / mode → `guided_review` | Criterion panels (statement, why, look-for / if-missing, confirm) | Same draft kind; progressive UI | Guided-review body + `guided-review-runtime.js` | **Local self-attestation**; does **not** read text/table/ordering drafts | **First-class** (diagnostic checklist body) |
| `checklist` without parseable criteria | Static list | None | Static ul | **None** | **Supported** |

**Critical:** `diagnostic_review` object is **not** what the learner sees. Learner sees GAM-authored checklist body. Binding is commission authority only (`lib/dla-diagnostic-review.js` header: structural closure).

### 6.5 Ordering / sequencing (*reorder*)

| Technical signals | Learner-facing form | Evidence | Surface | Feedback | Path class |
| ----------------- | ------------------- | -------- | ------- | -------- | ---------- |
| `activity_interaction_type` + `ordering` schema | Reorderable list in Do | Ordered item ids | `ordering` | **Proven local** exact-order check (`ordering-runtime.js`) — **not** DLA `diagnostic_review` | **Supported** renderer; **unknown** as routine DLA→GAM emission |

Certification fixture `tests/fixtures/page-render/prism-authoritative-ordering-page.json` cites historical production audit — evidence of **capability**, not proof of current Create→DLA frequency.

### 6.6 Formative assessment items (*answer items*)

| Technical types | Learner-facing form | Evidence | Surface | Feedback | Path class |
| --------------- | ------------------- | -------- | ------- | -------- | ---------- |
| `single_answer_mcq`, `true_false` (evaluable) | Stem + radios | `assessment_selection` | Assessment interactive HTML | **Proven local** correct/incorrect + optional rationale | **First-class** CAI |
| `short_answer` / `open_response` | Stem (+ static options if any) | Limited / non-interactive | Static / non-scored path | **None** auto | **Supported** |
| `multiple_answer_mcq` | Authored in pack | Unknown at interactive layer | Not evidenced as multi-select workspace | **Unknown** / debt | Pack **supported**; runtime honesty **gap** |

### 6.7 Moments (composition frame — not activity types)

| Moment | Typical content (descriptive) | Path class |
| ------ | ----------------------------- | ---------- |
| Orient | Framing / entry / bridge | **First-class** composition |
| Learn | Explanation / worked materials | **First-class** |
| Do | Production workspaces + ordering | **First-class** |
| Check | Checklists, consolidation, transfer-ish materials | **First-class** |

Same technical material can appear in different moments depending on beat function / split rules — another multiplicity axis.

---

## 7. Diagnostic-feedback relationship matrix

Classification key (per operator emphasis):

| Tag | Meaning |
| --- | ------- |
| **Proven** | Code/contract consumer exists on traced path |
| **Apparent / indirect** | Linked by commission or pedagogy, no runtime consumer found |
| **None** | No feedback contract on path |
| **Unknown** | Insufficient evidence |

| Concern | Relationship | Notes | Evidence |
| ------- | ------------ | ----- | -------- |
| DLA `diagnostic_review` → vNext | **None** (as runtime feedback) / **Proven** as commission gate | Zero matches under `learner-renderer-vnext` | `dla-diagnostic-review.js`; grep empty in vNext |
| `diagnostic_review` → GAM | **Proven** projection | Field copied onto material row | `gam-canonical-assembler.js` |
| Guided-review checklist UI | **Proven** local self-check | Does not inspect production workspaces | `render-material.js`, `guided-review-runtime.js` |
| Ordinary interactive checklist | **Proven** local self-check | Checkbox only | `render-material.js` |
| Ordering check | **Proven** local exact-order | Independent of DLA DR | `ordering-runtime.js` |
| Assessment interactive | **Proven** local option match | Independent of DLA DR | `assessment-interactive.js`, `assessment-runtime.js` |
| Table/text drafts → automated diagnostic | **None** found | Drafts persist only | `learner-draft-adapters.js` |
| `covers_response_material_ids` → criterion text | **Apparent / indirect** | Commission requires coverage; GAM authors criteria; no runtime join | S78 design docs + assembler; no renderer join |
| Guided-review `repair` / `expected` → draft comparison | **None** | Authored guidance only; contract forbids claiming free-text assessment | `guided-review-generation-contract.js`; `render-material.js` |
| `practice_independence` → learner feedback | **None** | DLA structure / guided-only short-circuit for DR requirement; unused by vNext | `dla-practice-independence.js` |
| `response_kind` → which feedback engine | **None** | Fulfilment/GAM gates only; feedback engines key off surface kinds | fulfilment + ordering/assessment runtimes |
| Design Feedback / `feedback_pack` | **None** on first-class CAI path | Step optional/historical; not assembled into vNext | domain patterns; Create prune; no vNext consumer |
| Knowledge-model misconception feedback | **Unknown** for live learner page | Pack templates exist for feedback_pack era | domain step patterns — not traced into vNext |
| Free-text / table auto-marking or draft submission | **None** on live path | Drafts local-only (“not submitted”) | `compose-workspace.js` guidance; draft persistence |

---

## 8. Collisions / multiplicity (do not collapse)

1. **Many table `material_type`s → one `table_entry` surface** (with conditional blank-cell gate for some types).  
2. **Many text sources → one `text_entry` surface** (`prompt_set`, `template`, transfer/reflection, unbound task steps).  
3. **One `checklist` material_type → ≥3 learner forms** (static list / interactive ticks / guided-review panels).  
4. **Select-like UX dual path:** assessment radios (`assessment_selection`) vs unimplemented `single_select` / `multi_select` response-part surfaces.  
5. **`diagnostic_review` vs guided-review body:** same pedagogical intent, **different artefacts** (binding object vs authored JSON/prose).  
6. **Ordering:** implemented surface + historical fixtures; **not** a DLA `response_kind`; commission path frequency **unknown**.  
7. **Episode archetype / beat function / instructional archetype / material type / response_kind / surface** are five different axes — a later “one type = one widget” model would be false against this inventory.  
8. **Two vocabularies:** DLA `response_kind` (`table_*` / `text_compose`) vs runtime `data-workspace-kind` (`text_entry` / `table_entry` / …) — joined only by material-type heuristics, not a shared enum.  
9. **Self-check draft ≠ scored feedback:** guided-review checkbox state persists under the same draft system as production workspaces — easy to misread as a feedback pipe.

---

## 9. Self-study vs workshop

| Layer | Difference found? | Evidence |
| ----- | ----------------- | -------- |
| Material-type registry | **No** separate registries | Shared `parse-material.js` / fulfilment maps |
| Response_kind set | **No** difference found | Shared `dla-production-fulfilment.js` |
| DLA commissioning overlays | **Yes** — self-study workbook overlay, facilitator_moves omit vs optional | `ld-dla-page-enrich-contract.js`; `app.js` output contract overrides |
| Authorial voice | **Yes** | `ld-authorial-exposition.js` |
| Learner surfaces | **No** separate surface stack found | Shared vNext |

**Verdict:** Same technical activity machinery; journey differences are overlays / voice / choreography, not a second activity ontology.

---

## 10. Gaps / unknowns (honest)

1. **How often does live Create→DLA→GAM emit ordering/sequencing** on first-class self-study/workshop today? Renderer + fixtures prove capability; DLA `RESPONSE_KINDS` omit ordering — **unknown production frequency**.  
2. **Whether GAM always realises `diagnostic_review` rows as `guided_criteria` JSON** vs flat checklist — contract prefers guided_criteria; fallback paths exist — **residual ambiguity**.  
3. **Any server-side or tutor-facing consumer of `covers_response_material_ids` beyond validation** — not found in vNext; collector unused historically (S78-T-013) — treat further consumers as **unknown** unless proven.  
4. **`multiple_answer_mcq` end-to-end behaviour** on CAI+vNext — pack-supported; interactive multi-select not proven.  
5. **Whether `task_card` systematically becomes text_entry vs static** across all archetypes — fulfilment allows `text_compose` on task_card; composition rules vary — **partially known**.  
6. **Custom/non-first-class workflows** — out of alpha boundary; not inventoried.  
7. **Historical parallel renderers / pre-vNext** — not used as production authority; may still exist in repo as **legacy**.  
8. **`explanatory_note`** appears in DLA teaching-only set but **not** in `MATERIAL_RENDERER_TYPES` — live emission / render behaviour **unknown**.  
9. **`video`** appears in beat-material registry (WATCH), not DLA presentation vocabulary — live emission **unknown**.  
10. **`open_response`** handled in renderer as non-interactive; relationship to pack `short_answer` / `essay` **unclear**.  
11. **Default live CAI `response_formats` mix** vs pack enum — not fully traced through `app.js` in this task.

---

## 11. Evidence-supported questions for next investigation task(s)

These are inventory-derived, not design proposals:

1. Which **provisional learner-action clusters** (compose text, complete table, self-check, reorder, answer MCQ/TF, study-only, …) are forced by the production matrix above, and which technical types collapse into the same action?  
2. For each cluster, what **evidence is actually persisted** vs merely displayed, and what would diagnostic feedback need that today is missing?  
3. Given `diagnostic_review` is commission-only, what is the **real feedback dependency graph** (guided-review prose, local checkers, absent `feedback_pack`, drafts)?  
4. Is **ordering** a first-class generative outcome today or a **supported-but-rare / historical** capability that must not drive surface-family design alone?  
5. Where would specialised surfaces add value **without** breaking the proven self-check / local-check feedback model — or is outcome A (retain current surfaces) evidence-supported?

---

## 12. Recommended next task (not executed)

**Recommend open next:**

### S81-T-002 — Learner-action types derived from forensic inventory

- **Mode:** investigation only (no product implementation; no surface-family architecture yet).  
- **Input:** this T-001 record.  
- **Job:** derive a **small evidence-tagged set of learner-action / evidence clusters** from §5–§8 (preserving multiplicity), explicitly separating technical IDs from learner actions.  
- **Include as a mandatory annex (or immediate T-003):** diagnostic-feedback dependency map answering §11 Q2–Q3 with the proven/apparent/none/unknown tags reused here.

Rationale: PLAN sequence places action derivation immediately after inventory; feedback is a hard constraint and already shows a commission/runtime split that must shape any later surface recommendation. Do **not** design surface families in T-002.

---

## 13. Architectural debt discovered (recorded, not solved)

See [ARCHITECTURAL-DEBT.md](ARCHITECTURAL-DEBT.md). Summary:

| ID | Finding |
| -- | ------- |
| S81-D-001 | `diagnostic_review` commission binding unused by learner-renderer-vnext (runtime feedback ≠ field) |
| S81-D-002 | `matching` / `single_select` / `multi_select` recognised but unsupported as response-part surfaces; select-like UX only via assessment path |
| S81-D-003 | Ordering workspace supported in vNext; absent from DLA `RESPONSE_KINDS` — commissioning/surface mismatch |
| S81-D-004 | `feedback_pack` / Design Feedback not on first-class CAI→assemble→vNext path |
| S81-D-005 | `multiple_answer_mcq` pack honesty vs interactive runtime (carried from S80) |
| S81-D-006 | `explanatory_note` in DLA teaching-only set but absent from `MATERIAL_RENDERER_TYPES` |
| S81-D-007 | Dual vocabulary: DLA `response_kind` vs runtime workspace kinds (heuristic join only) |

---

## 14. Acceptance criteria check

| Criterion | Met? |
| --------- | ---- |
| Inventory traceable to production sources | **Yes** |
| First-class self-study / workshop / CAI covered or marked unknown | **Yes** |
| Technical vs form vs evidence vs surface vs feedback separated | **Yes** |
| First-class vs legacy evidence-backed where claimed | **Yes** (ordering frequency left unknown) |
| No product code changes | **Yes** |
| Clear handoff to next investigation task | **Yes** — §12 |

---

## 15. Primary evidence index

| Area | Paths |
| ---- | ----- |
| Fulfilment / DR | `lib/dla-production-fulfilment.js`, `lib/dla-diagnostic-review.js`, `lib/dla-practice-independence.js` |
| Episode vocab | `lib/episode-plan-v1-vocabulary.js`, `lib/episode-plan-population-contract.js` |
| Instructional archetypes | `lib/ld-instructional-archetype.js` |
| DLA/GAM contracts | `lib/ld-dla-page-enrich-contract.js`, `lib/ld-gai-page-enrich-contract.js`, `lib/gam-canonical-assembler.js` |
| Materials / surfaces | `lib/learner-renderer-vnext/parse-material.js`, `response-part-types.js`, `learner-surface-registry.js`, `completion-table-workspace.js`, `table-material-types.js` |
| Composition | `compose-moment-classification.js`, `compose-response-parts.js`, `compose-activity-moments.js` |
| Feedback UIs | `render-material.js`, `guided-review-runtime.js`, `ordering-runtime.js`, `assessment-interactive.js`, `guided-review-generation-contract.js` |
| Drafts | `learner-draft-adapters.js`, `learner-draft-constants.js` |
| GAM blank-cell gate | `lib/gam-workspace-fulfilment.js` |
| Retired journey registry | `lib/learner-renderer-vnext/archetype-rules.js` (Phase 5B) |
| Alpha boundary | `S80-T-008-…md` |
| Ordering capability fixture | `tests/fixtures/page-render/prism-authoritative-ordering-page.json` |

**Late corroboration (same session):** findings from [Explore activity type production](60de4bff-370b-46c3-a887-98f78125db3d) and [Explore feedback and workspaces](724a054e-d45b-4291-9a95-12edae45a837) folded into §3, §5.2, §5.4, §5.7, §7–§8, §10, and debt — no change to T-001 recommendation or STOP gate.

---

## 16. Out of scope (confirmed not done)

- Surface-family design; A/B/C/D selection; production implementation; accessibility remediation; RC3–RC8 suite cleanup; inventing a final pedagogical action vocabulary.
