# Sprint 102B — Commission-native authoring design

**Status:** **Accepted** ([S102-D04](decisions.md#s102-d04--commission-native-authoring-design))  
**Readiness:** [S102-D05](decisions.md#s102-d05--implementation-readiness) — **Ready with qualifications** — [IMPLEMENTATION-READINESS.md](IMPLEMENTATION-READINESS.md)  
**Mode:** Design accepted; **102D implementation not authorised** by design acceptance alone  
**Builds on:** [102A](INITIAL-INVESTIGATION.md), [boundary check / S102-D03](COMPONENT-BOUNDARY-COMPATIBILITY.md)  
**Principle:** The Learning Journey owns curriculum coherence; components realise their commissioned contribution.

This is a **mechanical** design: reuse existing LJ stages, DLO `learning_outcomes` shape, commission text fields, intake, product planning stages, and product prompts. No new LJ stages, no new outcome schema, no replacement KM, no forked product pipelines, no readiness classifier.

### Accepted decision lock (A1–A7)

| ID | Lock |
| -- | ---- |
| A1 | Exact DLO schema; no mandatory outcome IDs / schema extension |
| A2 | No `contributes_to`; relationships in LJ design context |
| A3 | Journey LOs at Requirements (prose + delimited structured section) |
| A4 | Component LOs at Design Page (not mere copies of journey LOs) |
| A5 | Markers in existing commission text fields; extract without LLM |
| A6 | EP / EJP / Purpose entry; shared preamble; AP wording adapt; Expository without fabricating GLC/KM |
| A7 | Shared mechanisms once; progressive validation Interactive+Practice then Expository+AP |

---

## 1. Learning Journey outcome generation

### 1.1 Journey-level outcomes — which existing stage

**Stage: Requirements** (`learning_requirements` / JourneyRequirements)  
`lib/learning-journey-sibling-prompts.js` — `learning_requirements` (already owns **INTENDED LEARNING**).

**Why not later stages**

| Stage | Role today | Why not primary LO author |
| ----- | ---------- | ------------------------- |
| Progression | Designs developmental path from Requirements | Consumer of destination, not author |
| Elements | Educational jobs | Too late; jobs realise outcomes |
| Commissioning | Product realisation | Allocates experiences, not journey destination |
| Design Page | Structured commissions + page | Allocates **component** LOs (see §1.3) |

**Do not add a LJ stage.** Extend Requirements output only.

### 1.2 Requirements output change (prompt + contract)

Keep the existing prose **LEARNING REQUIREMENTS** document.

**Add** a mandatory machine block after the prose (same marker pattern as Step 4 shared material):

```text
<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>
{
  "learning_outcomes": [
    {
      "statement": "...",
      "related_concepts": ["..."],
      "cognitive_level": "...",
      "notes": "..."
    }
  ],
  "learner_level": "...",
  "scope": "...",
  "alignment_notes": "..."
}
<<<JOURNEY_LEARNING_OUTCOMES_END>>>
```

**Shape:** Exact established DLO representation — `lib/workflow-artefact-json-strict.js` `validateLearningOutcomesShape` / contract 198–208, 515–524 (`statement`, `related_concepts`, `cognitive_level`, optional `notes`; optional top-level `learner_level`, `scope`, `alignment_notes`). **Do not** require mandatory outcome `id` fields (A1). Shell code may synthesise display ids later (`lib/page-shell-create.js` ~142–178).

**Authority:** User brief does **not** supply LOs; Requirements **generates** them. If the brief already supplies authoritative outcomes, preserve them (existing INTENDED LEARNING rule).

**Capture:** Persist structured journey LOs by parsing markers from the Requirements capture text (outputName remains `learning_requirements`). Optionally stamp a sibling `learning_outcomes` capture from the same step without adding a stage or fabricating DLO. Prose LEARNING REQUIREMENTS document remains.

### 1.3 Informing Progression

**Prompt change only** on `learning_progression`: treat the Requirements prose **and** the journey `learning_outcomes` block as authoritative destination. Progression designs developmental phases toward those outcomes; it must not silently replace or invent a competing destination set.

No new Progression output schema.

### 1.4 Component-specific outcomes — Design Page

**Allocation stage: Design Page** (`lib/learning-journey-design-page.js`).

DP already emits `commissions[]` with `specification_text`, `journey_context_text`, `dependencies` (schema ~407–417; guidance ~458–460).

**DP responsibilities (additive guidance, no new commission keys):**

1. Read journey-level `learning_outcomes` from Requirements capture / Step 4 continuity.  
2. For each supported commission, allocate a **component** LO set that:
   - Uses the **same DLO shape**;
   - Reflects journey outcomes, instructional progression, this component’s teaching/practice/assessment responsibility, what preceding components establish, and what subsequent components require (A4);
   - May be intermediate capabilities, subsets or specialisations — **not** mere copies of journey outcomes (A2);
   - Does **not** add a `contributes_to` schema field — preserve relationships in LJ design context / journey marker prose.
3. Embed component LOs + journey LO context into existing text fields (§2).

Step 4 Commissioning remains educational-job / product selection in prose; DP is where structured component LOs are frozen into the commission envelope (consistent with DP already being the structured handoff).

**Optional thin Step 4 hint (not a new stage):** Commissioning may note which journey outcomes each experience serves in prose; DP remains authoritative for DLO-shaped rows.

---

## 2. Component commissioning (transport)

### 2.1 What each brief must contain

| Content | Field | Form |
| ------- | ----- | ---- |
| Authoritative **component** LOs | `specification_text` | Marker block (§2.2) + existing educational job prose |
| Relevant **journey-level** LOs | `journey_context_text` | Marker block (may be subset / id+statement summary) |
| Instructional role | `specification_text` | Existing educational job prose |
| Prior learning / dependencies | `journey_context_text` + `dependencies` | Existing continuity contract |
| Prepare-for-next | `journey_context_text` | Existing bring-forward / role-in-journey prose |

**No new commission JSON fields** unless marker extraction fails in implementation (S102-AD-003). Prefer markers over new keys.

### 2.2 Marker representation (deterministic)

Inside `specification_text`:

```text
<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>
{ "learning_outcomes": [ /* DLO-shaped component rows */ ] }
<<<COMPONENT_LEARNING_OUTCOMES_END>>>
```

Inside `journey_context_text`:

```text
<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>
{ "learning_outcomes": [ /* relevant journey rows */ ] }
<<<JOURNEY_LEARNING_OUTCOMES_END>>>
```

Markers mirror `<<<SHARED_AUTHORITATIVE_MATERIAL_*>>>` already used in LJ commissioning (`learning-journey-sibling-prompts.js` Step 4).

**Extraction rules (fail closed)**

1. Require exactly one `COMPONENT_LEARNING_OUTCOMES` block in `specification_text`.  
2. Parse inner JSON; run `validateLearningOutcomesShape` (`workflow-artefact-json-strict.js`).  
3. Reject empty arrays, missing `statement`, or unparseable JSON.  
4. Journey block optional for bind success but required by DP guidance; if present, validate same shape.  
5. **Do not** LLM-rewrite, fill gaps, or invent statements.  
6. Strip markers from human-facing brief display if needed; retain full text in seed for audit.

### 2.3 Intake envelope

Unchanged fields — `lib/first-class-commission-intake.js` 141–147, 309–330:

- `commission_specification` ← `specification_text`  
- `journey_context` ← `journey_context_text`  
- `commission_dependencies`, `source_context`, etc.

Bind runs **after** successful `intakeCommission` / family build (§3).

---

## 3. Shared intake and outcome binding

### 3.1 Shared mechanism (one function family)

Proposed module surface (name illustrative):  
`lib/commission-native-lo-bind.js` (or functions colocated in `first-class-commission-intake.js` if smaller).

**Algorithm**

1. **Recognise** LJ commission: `hasCommissionContext` / envelope from intake (`app.js` `readWorkflowCommissionContext` 5583–5637).  
2. **Extract** component LO block from `commission_specification`.  
3. **Validate** with `validateLearningOutcomesShape` — no LLM.  
4. **Materialise** into workflow seed, **not** a fake DLO step:

```text
resolvedFactors.commissioned_learning_outcomes = <validated object>
resolvedFactors.commissioned_learning_outcomes_provenance = {
  authority: "learning_journey_commission",
  source_field: "commission_specification",
  not_dlo_generated: true
}
```

5. **Topology:** If bind **ok**, omit foundation titles GLC / MK / DLO (and Normalize when present solely as foundation prefix). Retain product planning → middle → DP.  
6. **If bind fails** (missing/invalid markers): **do not** invent LOs; keep **full** existing foundation (GLC → MK → DLO → …). Legacy commissions without markers keep today’s behaviour.

### 3.2 How EP / EJP / Purpose see LOs (no fabricated DLO)

Extend resolution used by planning stages:

- `resolveUpstreamWorkflowArtefactFromCaptures("learning_outcomes", …)` (`app.js` ~16945) **or** a thin wrapper called from:
  - `deriveDesignEpisodePlanCaptureJson` (15917–15926)
  - Expository Copy / bindings
  - AP publish + Purpose embed

**Fallback order:** (1) real step capture named `learning_outcomes` if a DLO step exists; (2) else `commissioned_learning_outcomes` when provenance says LJ-commissioned; (3) else miss → existing empty/fail behaviour.

**Provenance:** UI/logs may show “LJ-commissioned outcomes”; never stamp `enriched_by` / capture metadata as if DLO ran. **Do not** create empty GLC/MK/DLO step captures.

### 3.3 Supply journey context to planning stage

Reuse existing:

- `composeCommissionedOriginalBrief` (5813–5888)  
- `composeCommissionedContextHonourInstruction` (5894–5934)  
- `applyCommissionedOriginalBriefDelivery` (6149–6168)

**Change:** Treat product **planning** steps as commission-context delivery targets when bind succeeded (§5), not only GLC/MK/DLO/Purpose/XD/DLA as today (`isCommissionContextDeliveryStep` 6088–6108).

---

## 4. Product-specific planning entry

Shared pattern: **bind LOs → omit foundation → enter product planning stage**.

| Product | Entry stage | Topology when bind ok | Code today |
| ------- | ----------- | --------------------- | ---------- |
| Interactive | Design Episode Plan | EP → DLA → GAM → LS → DP | `INTERACTIVE_TITLES` 25–34 |
| Practice | Design Episode Plan | Same | Practice builder 1020–1052 |
| Expository | Expository Journey Plan | EJP → XD → XM → DP | `EXPOSITORY_TITLES` 36–44 |
| Assessment Pack | Interpret Evidence Purpose | Purpose → Elicitation → Formative → DP | `ASSESSMENT_PACK_STEPS` 84–105; drop `upstreamLearningDesignSteps` prefix when bind ok (747–757, 832–873) |

### 4.1 Ordering gates

`normalizeWorkflowDesignStageOrderInPlace` (`app.js` 8859–8886): EP-after-DLO only runs when **both** titles exist. Omitting DLO makes the gate a no-op. **No change required** beyond topology omit — verify with tests.

### 4.2 Upstream bindings

| Product | Adjustment |
| ------- | ---------- |
| Interactive / Practice | EP derive already needs LOs — satisfied via commissioned seed (§3.2). `ensureEpisodePlanInputBindingsForSteps` (28076+) binds DLA/DP → EP; leave as-is. |
| Expository | `ensureExpositorySiblingInputBindingsForSteps` (28050–28072) only binds when producers exist. With GLC/MK/DLO omitted, EJP will **not** auto-bind LO/KM/GLC. **Required:** ensure planning Copy embeds commissioned LOs; extend ensure* **or** resolution fallback so EJP/XD still receive LO artefact without inventing GLC/MK steps. XM’s preference for `learning_content`: when absent, rely on `source_context` + commission brief (S102-AD-015 watchpoint) — **do not** add KM/GLC substitutes. |
| Assessment Pack | Purpose prompt currently says use DLO LOs (`first-class-workflow-family.js` ~623). **Required binding adjustment:** when commissioned LOs present, Purpose/Copy treat them as authoritative; do not require a DLO step. Elicitation `mapped_learning_outcome_ids` continue to use component LO ids. |

### 4.3 Validation / persistence / regeneration

- Persist `commissioned_learning_outcomes` + provenance on the child workflow brief resolution (same durability as `commission_specification`).  
- Regeneration of planning stage: re-read seed; do not re-run LO invention.  
- Regeneration of foundation: only if user restores foundation path / bind invalid.  
- Child workflow save: ensure omitted titles stay omitted after reload (identity flag e.g. `commission_native_lo_bound: true` on seed).

### 4.4 Expository hard bindings and `learning_content`

- Hard bindings are **conditional on producer steps existing** (28017–28041). Omitting producers avoids false KM/GLC requirements.  
- Prompts still *prefer* learning_content when present (`expository-sibling-prompts.js` ~157, 268). Commission-native path: prefer `SOURCE / CONTEXT MATERIAL` from `source_context` already injected by `composeCommissionedOriginalBrief` (5838–5852).  
- If a later concrete failure shows EJP/XD/XM cannot proceed without GLC, escalate as implementation finding — **do not** pre-build a KM stage (S102-D02 / S102-AD-009).

---

## 5. Conditional prompt preamble (no forked product prompts)

### 5.1 Injection point

Reuse `applyCommissionedOriginalBriefDelivery` / honour-instruction assembly.

When `commissioned_learning_outcomes` present and step is the product **planning** step (EP / EJP / Purpose), prepend a short block (in addition to existing AUTHORITATIVE COMMISSION CONTEXT where appropriate):

```text
COMMISSION-NATIVE OUTCOME AUTHORITY

Outcome authority. The commissioned component learning_outcomes supplied with this workflow are authoritative. Do not replace them or independently regenerate a competing outcome set.

Journey membership. This component belongs to a larger Learning Journey sequence. It need not be independently comprehensive of the whole journey.

Prior learning. Build on knowledge and capabilities explicitly established by earlier components (see LEARNING JOURNEY CONTEXT). Do not unnecessarily reteach that material.

Component responsibility. Fulfil the specified instructional role and the allocated component learning_outcomes only.

Continuity. Where the commission identifies later dependencies, prepare learners for those subsequent components without assuming this resource must complete the whole journey.

Disciplinary reasoning. Apply subject knowledge directly as required by the commission and outcomes. Do not invent a parallel knowledge-modelling stage or substitute knowledge_model artefact.
```

Also embed the validated component `learning_outcomes` JSON in the Copy payload for the planning step (mirror EP’s existing “read learning_outcomes from …” expectation — `buildEpisodePlanV2CopilotSchemaInstructions` 14116 — by supplying the artefact explicitly when no DLO step exists).

### 5.2 Extend delivery-step recognition

`isCommissionContextDeliveryStep` (6088–6108): when bind ok, return true for:

- Design Episode Plan (Interactive / Practice)  
- Expository Journey Plan  
- Interpret Evidence Purpose (already true for AP)

Keep foundation targets for **legacy** commissions that still run GLC/MK/DLO.

### 5.3 Genuinely required prompt/binding adjustments (not a fork)

| Item | Why |
| ---- | --- |
| AP Purpose line ~623 (“Use the Learning Outcomes produced by Define Learning Outcomes”) | Must be conditional or superseded when commissioned LOs bound |
| EP instruction “Read learning_outcomes from STEP N OUTPUT” (14116) | Supply embedded commissioned LO artefact when no DLO step |
| Expository EJP/XD “when learning_content available” | No change to prefer-when-present; ensure absence is allowed under commission-native |
| LJ Requirements / Progression / DP prompts | Additive contracts for markers + allocation (§1–2) |

**Do not** create LJ-specific EP/EJP/Purpose prompt files.

---

## 6. Preserve existing behaviour

| Path | Behaviour |
| ---- | --------- |
| Create-from-topic Interactive / Expository / AP / Situated Task | Unchanged full foundation + product middle |
| LJ commission **without** valid component LO markers | Unchanged: full GLC→MK→DLO (or AP prefix) |
| Invalid / empty LO markers | Fail closed → foundation path; no invented LOs |
| Practice | Remains LJ-commissioned only (`CREATE_DECLARATIONS` omits practice) |
| Product validators / renderers / instructional contracts | Unchanged |
| Persistence / regeneration | Unchanged except new seed fields when bind ok |

**No** Ready / Needs enrichment / Requires full workflow classifier — missing LOs simply retain foundation (S102-D02 / S102-AD-008).

---

## 7. Implementation design checklist

### 7.1 Exact LJ stages / prompt / output changes

| Stage | File | Change |
| ----- | ---- | ------ |
| Requirements | `lib/learning-journey-sibling-prompts.js` | Emit journey LO marker block (DLO shape) |
| Requirements capture | `app.js` / LJ capture path | Parse + validate + store `learning_outcomes` |
| Progression | `lib/learning-journey-sibling-prompts.js` | Authoritative consumption of journey LOs |
| Design Page | `lib/learning-journey-design-page.js` | Allocate component LOs into commission text markers; validate markers on DP parse if feasible |
| Commissioning (optional) | same sibling prompts | Prose hint only |

### 7.2 DLO shape to reuse

`validateLearningOutcomesShape` / strict contract — `lib/workflow-artefact-json-strict.js` 198–208, 515–524.

### 7.3 Commissioning-text + extraction

Markers in §2.2; extract in intake bind; prefer `specification_text` / `journey_context_text` only.

### 7.4 Shared intake bind + provenance

§3; seed fields `commissioned_learning_outcomes` + provenance; resolution fallback; no fake DLO.

### 7.5 Planning entry + topology

§4; filter titles in `intakeCommission` / family post-process (`lib/first-class-commission-intake.js`, `lib/first-class-workflow-family.js` Practice/Interactive/Expository/AP builders).

### 7.6 Conditional preamble

§5; `app.js` `isCommissionContextDeliveryStep`, `applyCommissionedOriginalBriefDelivery`, planning-step LO embed.

### 7.7 Ordering / validation / persistence / regeneration

§4.1–4.3; order gate no-op when DLO absent; durable seed flag; Expository ensure* + AP Purpose conditional.

### 7.8 Failure / fallback

Bind fail → existing foundation path. Never invent LOs. Never fabricate DLO/GLC/MK captures.

### 7.9 Focused regression tests

| Case | Expect |
| ---- | ------ |
| Interactive LJ commission + valid markers | No GLC/MK/DLO; EP first; LO from seed; EP derive ok |
| Practice LJ commission + valid markers | Same as Interactive |
| Expository LJ commission + valid markers | No foundation; EJP first; LO available; no KM required |
| AP LJ commission + valid markers | No foundation prefix; Purpose first; LOs authoritative |
| Each product Create-from-topic | Foundation unchanged |
| LJ commission without markers | Foundation unchanged |
| Invalid LO JSON / empty array | Foundation fallback; no invent |
| Order gate | EP not forced after missing DLO |
| Provenance | Seed shows lj_commission; no DLO capture row |
| Expository ensureBindings | No crash without GLC/MK producers; LO still available to EJP |

### 7.10 Smallest ordered implementation sequence

1. **Marker contract + extract/validate helper** — shared parse using `validateLearningOutcomesShape`.  
2. **LJ Requirements + Progression prompt/capture** — journey LOs.  
3. **LJ Design Page guidance + optional DP validation** — component LO markers.  
4. **Intake bind + seed provenance + topology omit** — `first-class-commission-intake.js` / family builders.  
5. **Resolution fallback** for `learning_outcomes` — `app.js` derive/resolve paths.  
6. **Planning-step commission delivery + preamble + LO embed** — `isCommissionContextDeliveryStep` / Copy.  
7. **Product binding tweaks** — Expository ensure*/Copy; AP Purpose conditional (~623).  
8. **Regression tests** — §7.9.  
9. **Manual smoke** — one LJ → Practice/Interactive/Expository/AP commission (authorisation separate).

**Primary files/functions**

- `lib/learning-journey-sibling-prompts.js` — Requirements, Progression (+ optional Commissioning)  
- `lib/learning-journey-design-page.js` — DP schema guidance / validate commissions  
- `lib/first-class-commission-intake.js` — `intakeCommission` post-bind  
- `lib/first-class-workflow-family.js` — title lists / `buildAssessmentPackFamily` prefix / Practice builder  
- `lib/workflow-artefact-json-strict.js` — reuse validate (A1 if ids)  
- `app.js` — `readWorkflowCommissionContext`, `resolveUpstreamWorkflowArtefactFromCaptures`, `deriveDesignEpisodePlanCaptureJson`, `isCommissionContextDeliveryStep`, `applyCommissionedOriginalBriefDelivery`, `ensureExpositorySiblingInputBindingsForSteps`, `normalizeWorkflowDesignStageOrderInPlace`, EP Copy embed helpers  

---

## 8. Decision lock status

A1–A7 **accepted** under S102-D04 (see header table). Implementation readiness: [IMPLEMENTATION-READINESS.md](IMPLEMENTATION-READINESS.md) / S102-D05.

Executable 102D sequence, files, tests, and acceptance criteria live in the readiness doc. Do not reopen A1–A7 unless 102D finds concrete incompatibility.

---

## 9. Estimated implementation scope

| Band | Work |
| ---- | ---- |
| **Small** | Marker extract/validate helper; intake seed + topology omit; resolution fallback; planning preamble/delivery |
| **Medium** | LJ Requirements/Progression/DP prompt+capture contracts; Expository/AP binding conditionals; regression tests |
| **Out of scope here** | New stages/schemas/KM; journey-level QA; regenerating Lagrange/C4 packages; Situated Task special-case (accepts commission but not in four-product matrix — leave foundation unless later authorised) |

One Sprint 102 implementation programme (A7) after **separate 102D authorisation** — not a pipeline rewrite.

---

## 10. Explicit non-goals

- New LJ pipeline stages  
- New outcome schema / replacement KM prompts  
- Separate LJ forks of EP/EJP/Purpose prompts  
- Mandatory Ready classifier  
- Application implementation without 102D authorisation  

**Design accepted.** Implementation awaits separate authorisation.
