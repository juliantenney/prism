# Sprint 102C — Implementation readiness

**Status:** **COMPLETE** (docs / readiness only)  
**Decision:** [S102-D05](decisions.md#s102-d05--implementation-readiness)  
**Design accepted:** [S102-D04](decisions.md#s102-d04--commission-native-authoring-design)  
**Verdict:** **Ready with qualifications**  
**102D authorised by this document:** **No**

---

## Verdict

**Ready with qualifications.**

The architecture in [COMMISSION-NATIVE-AUTHORING-DESIGN.md](COMMISSION-NATIVE-AUTHORING-DESIGN.md) (as amended by accepted A1–A7) is compatible with current code. No concrete incompatibility forces redesign. Qualifications are implementation-detail risks to verify in 102D tests — not open architectural decisions.

### Qualifications (not blockers)

| Q | Item | Mitigation in 102D |
| - | ---- | ------------------ |
| Q1 | `validateLearningOutcomesShape` only enforces a non-empty `learning_outcomes[]` — per-row `statement` / `related_concepts` / `cognitive_level` are prompt-contract expectations, not hard shape errors (`lib/workflow-artefact-json-strict.js` 198–208, 522–523) | Add **thin extract-time row checks** in the commission LO binder (fail closed → foundation). Do **not** extend the shared DLO schema. |
| Q2 | Requirements today is prose + `STEP N OUTPUT: learning_requirements`; structured journey LOs must ride markers inside that artefact (or a parse-on-capture side channel) without a new stage | Parse journey LO markers from Requirements capture text; keep `learning_requirements` outputName; optionally also stamp a sibling `learning_outcomes` capture from the same step **without** fabricating a DLO stage |
| Q3 | EP Copy text still says read LOs from `STEP N OUTPUT: learning_outcomes` (`app.js` ~14116) | Embed commissioned LOs in planning Copy when bind ok; resolution fallback from seed |
| Q4 | Expository without `learning_content` (S102-AD-015) | Rely on `source_context` + commission brief; regression test EJP/XD/XM; escalate only on concrete failure |
| Q5 | AP Purpose hard-codes “Use the Learning Outcomes produced by Define Learning Outcomes” (`lib/first-class-workflow-family.js` ~623) | Conditional wording when `commissioned_learning_outcomes` bound (accepted A6) |

### No remaining design approvals required

A1–A7 are **accepted** under S102-D04. Do not reopen unless 102D code evidence shows incompatibility — record evidence explicitly.

---

## 1. Accepted decision lock (A1–A7)

| ID | Decision |
| -- | -------- |
| **A1** | Reuse DLO `learning_outcomes` schema exactly. No mandatory outcome IDs / schema extension unless implementation proves need. (`page-shell-create.js` already synthesises `outcome_id` as `LO1…` when absent — 142–178.) |
| **A2** | Component LOs may be intermediate / subset / specialisation. No `contributes_to` field. Relationship lives in LJ design context (prose + journey markers in `journey_context_text`). |
| **A3** | Journey LOs authored at **Requirements**; retain prose; add delimited structured section; Progression consumes as authoritative; **no new LJ stages**. |
| **A4** | Component LOs authored at **Design Page** into commissioning briefs; reflect journey LOs, progression, role, prior, next — not mere copies. |
| **A5** | Markers in `specification_text` / `journey_context_text`; DLO shape; extract/validate without LLM; no new commission fields unless proven necessary. |
| **A6** | Entry: Interactive/Practice → EP; Expository → EJP; AP → Purpose. Shared conditional LJ preamble; adapt AP DLO wording; Expository handles absent `learning_content` without fabricating GLC/KM; no replacement KM; no forked product prompts. |
| **A7** | One programme: (1) LJ LO gen + commissioning (2) shared extract/bind (3) Interactive+Practice (4) Expository+AP (5) cross-product regression/persistence. |

---

## 2. Code contracts and modification points

### 2.1 Learning Journey pipeline

| Concern | Current contract | 102D change |
| ------- | ---------------- | ----------- |
| Requirements prompt | `lib/learning-journey-sibling-prompts.js` `TEMPLATES.learning_requirements` / stage key `learning_requirements`; identity via `resolveStageFromStepIdentity` 67–89 | Add delimited journey LO section (DLO JSON) after prose; keep INTENDED LEARNING rules |
| Requirements output name | `LEARNING_JOURNEY_STEPS` `outputName: "learning_requirements"` — `lib/first-class-workflow-family.js` 47–52 | Unchanged. Parse markers from captured text |
| Downstream Progression | Prompt treats Requirements as authoritative prose — same file `learning_progression` | Instruct: treat structured journey LO block as authoritative destination; do not regenerate competing set |
| Elements / Commissioning | Educational jobs / product commissions — no structured LO allocation | Optional prose hints only; **DP** owns component LO rows (A4) |
| Design Page | `lib/learning-journey-design-page.js` commissions schema ~407–417; `specification_text` / `journey_context_text` guidance ~458–460; validate requires `specification_text` ~725–726 | Guidance + optional parse validation: component LO markers in `specification_text`; journey LO markers in `journey_context_text` |
| Marker precedent | `lib/learning-journey-shared-source.js` `extractSharedAuthoritativeMaterial` 17–80 | Reuse same BEGIN/END extract pattern for LO markers |

**Authority chain (no regeneration):** Requirements generates journey LOs → Progression/Elements/Commissioning consume Requirements (+ progression artefacts) without rewriting the LO set → DP allocates **component** LOs for each commission from that authoritative set + progression context.

### 2.2 Outcome format and transport

**DLO shape (reuse):**

```json
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
```

Validation entry: `validateLearningOutcomesShape` — `lib/workflow-artefact-json-strict.js` 198–208.  
Strict capture helper: `parseLearningOutcomesCaptureStrict` 360–376 (fenced JSON) — commission markers use raw JSON inside markers (like shared source), then validate shape.

**Marker syntax (locked for 102D):**

| Level | Field | Markers |
| ----- | ----- | ------- |
| Component (authoritative for bind) | `specification_text` | `<<<COMPONENT_LEARNING_OUTCOMES_BEGIN>>>` … `<<<COMPONENT_LEARNING_OUTCOMES_END>>>` |
| Journey (context; not child bind source) | `journey_context_text` | `<<<JOURNEY_LEARNING_OUTCOMES_BEGIN>>>` … `<<<JOURNEY_LEARNING_OUTCOMES_END>>>` |

**Extraction rules (fail closed → foundation path):**

1. Exactly one COMPONENT block in `specification_text`; duplicate BEGIN/END → malformed.  
2. Inner body must be JSON object with non-empty `learning_outcomes[]`.  
3. Run `validateLearningOutcomesShape` + thin per-row checks (Q1): each row object with non-empty `statement`; prefer non-empty `related_concepts` / `cognitive_level` per DLO contract — fail closed if statement missing.  
4. Do not rewrite statements.  
5. Missing / malformed / empty → **no** commission-native topology.  
6. **Bind only COMPONENT block** for child planning. Journey block is contextual for prompts; never substitute journey LOs as the component authoritative set if the component block is missing.

### 2.3 Shared commission intake

| Responsibility | Current function | 102D |
| -------------- | ---------------- | ---- |
| Recognise LJ commission | `readWorkflowCommissionContext` — `app.js` 5583–5637 (`hasCommissionContext`) | Unchanged signal; bind additionally requires valid COMPONENT markers |
| Build child family | `intakeCommission` — `lib/first-class-commission-intake.js` 205–349 | After successful `buildFirstClassWorkflowFamily`, run LO bind |
| Family titles | `buildFirstClassWorkflowFamily` / Practice / Expository / AP — `lib/first-class-workflow-family.js` | When bind ok: omit GLC/MK/DLO (and AP `upstreamLearningDesignSteps` prefix 747–757, 832–873) |
| Seed stamp | `deliverySeed` assign 309–330 | Add `commissioned_learning_outcomes` + provenance `{ authority: "learning_journey_commission", not_dlo_generated: true }` |
| Brief / honour | `composeCommissionedOriginalBrief` 5813+; `composeCommissionedContextHonourInstruction` 5894+; `applyCommissionedOriginalBriefDelivery` 6149–6168 | Extend `isCommissionContextDeliveryStep` 6088–6108 to EP/EJP when bind ok; inject preamble |
| LO resolution | `resolveUpstreamWorkflowArtefactFromCaptures` ~16945; `deriveDesignEpisodePlanCaptureJson` 15917–15926 | Fallback to seed commissioned LOs when no DLO step capture |
| Expository bindings | `ensureExpositorySiblingInputBindingsForSteps` 27985–28074 | Conditional on producers; with foundation omitted, rely on seed/embed — do not invent GLC/MK steps |
| Order gate | `normalizeWorkflowDesignStageOrderInPlace` 8859–8886 | No-op when DLO absent — verify in tests |

**Provenance rule:** Never create empty/fake DLO/GLC/MK step captures. Never label commissioned LOs as DLO-generated.

### 2.4 Workflow and prompt compatibility

| Product | Entry | Minimum changes |
| ------- | ----- | --------------- |
| Interactive / Practice | EP | Topology omit; LO seed fallback; planning-step delivery + preamble + LO embed; Practice stays out of `CREATE_DECLARATIONS` |
| Expository | EJP | Topology omit; LO available without DLO producer; preamble; absent `learning_content` safe |
| Assessment Pack | Purpose | Omit foundation prefix when bind ok; Purpose wording conditional (~623); preamble; elicitation still maps LO ids from component set |

Shared preamble themes (short, one block): outcome authority; journey membership; prior learning; component responsibility; continuity; disciplinary reasoning without replacement KM — design §5.

Reuse product prompts; no LJ forks.

### 2.5 Failure and legacy behaviour

| Case | Required behaviour |
| ---- | ------------------ |
| Create-from-topic (all Create products) | Unchanged foundation |
| LJ commission without COMPONENT markers | Full foundation (current) |
| Malformed / duplicate / empty markers | Foundation; no EP/EJP/Purpose-first |
| Ambiguous which LO set | Bind COMPONENT only; never silently use journey block as component authority |
| Saved projects without new seed fields | Readable; behave as legacy |
| Practice | LJ-commissioned only |
| Validators / renderers | Intact |

No readiness classifier — missing/invalid markers ⇒ foundation.

---

## 3. 102D implementation plan (executable)

**Not authorised until separate authorisation.**

### 3.1 Ordered code changes

1. **LO marker extract/validate helper** (mirror `learning-journey-shared-source.js`; use `validateLearningOutcomesShape` + thin row checks).  
2. **LJ Requirements + Progression prompts** — journey LO section; authoritative consumption.  
3. **LJ Design Page guidance (+ optional commission marker validation)** — component vs journey markers.  
4. **Intake bind + seed provenance + topology omit** — `intakeCommission` + family/AP prefix.  
5. **Resolution fallback + EP derive** — `resolveUpstream…` / `deriveDesignEpisodePlanCaptureJson`.  
6. **Planning delivery + shared preamble + LO embed** — `isCommissionContextDeliveryStep` / Copy assembly.  
7. **AP Purpose conditional + Expository producer-absent path**.  
8. **Tests** — §3.5–3.7.  
9. **Persistence/reopen smoke** — seed survives save/reload.

### 3.2 Exact files / functions

| File | Functions / surfaces |
| ---- | -------------------- |
| `lib/commission-native-lo-bind.js` *(new, preferred)* or colocated in intake | `extractComponentLearningOutcomes`, `extractJourneyLearningOutcomes`, `validateCommissionedLos`, `applyCommissionNativeTopology` |
| `lib/learning-journey-sibling-prompts.js` | `learning_requirements`, `learning_progression` |
| `lib/learning-journey-design-page.js` | DP prompt guidance; commission validate |
| `lib/first-class-commission-intake.js` | `intakeCommission` |
| `lib/first-class-workflow-family.js` | Practice/Interactive/Expository builders; `buildAssessmentPackFamily` / `upstreamLearningDesignSteps`; `buildAssessmentPackPrompts` Purpose line |
| `lib/workflow-artefact-json-strict.js` | **Reuse only** (no schema extension unless proven) |
| `app.js` | `readWorkflowCommissionContext`, `resolveUpstreamWorkflowArtefactFromCaptures`, `deriveDesignEpisodePlanCaptureJson`, `isCommissionContextDeliveryStep`, `applyCommissionedOriginalBriefDelivery`, `ensureExpositorySiblingInputBindingsForSteps`, `normalizeWorkflowDesignStageOrderInPlace`, EP Copy LO instructions / embed helpers |

### 3.3 Unavoidable schema/validation adjustments

| Adjustment | Justification |
| ---------- | ------------- |
| None to shared DLO schema (A1) | Default |
| Thin **extract-time** row checks in binder | Q1 — fail closed without changing `validateLearningOutcomesShape` globally |
| Optional DP validate: component marker present for supported commissions | Improves fail-closed before intake; only if cheap |

If fenced-capture helpers reject marker JSON, use `JSON.parse` + `validateLearningOutcomesShape` — do not force Requirements to emit a second fenced DLO step output format unless capture plumbing demands it (record evidence if so).

### 3.4 Prompt changes

- Requirements: structured journey LO marker section.  
- Progression: consume journey LOs; do not regenerate.  
- DP: allocate component LOs into markers; journey LOs into journey_context markers; role/prior/next in existing prose.  
- Shared conditional LJ preamble on planning steps when bind ok.  
- AP Purpose: recognise commissioned LOs when bound.  
- EP/EJP: embed/supply commissioned LOs when no DLO step — no prompt forks.

### 3.5 Unit tests

- Marker extract: valid / missing / duplicate / empty / invalid JSON / empty array.  
- Component vs journey marker distinction (bind uses COMPONENT only).  
- `intakeCommission` topology omit vs retain foundation.  
- Provenance flags (`not_dlo_generated`).  
- Practice still absent from Create declarations.

### 3.6 Integration / regression (four products + legacy)

| Case | Expect |
| ---- | ------ |
| Interactive + valid markers | EP-first; no GLC/MK/DLO; LO from seed |
| Practice + valid markers | Same |
| Expository + valid markers | EJP-first; no foundation; LO available; no fake GLC/KM |
| AP + valid markers | Purpose-first; no foundation prefix; Purpose accepts commissioned LOs |
| Create-from-topic × Interactive/Expository/AP (+ Situated Task untouched) | Foundation unchanged |
| LJ commission without markers | Foundation unchanged |
| Invalid markers | Foundation; never planning-first |
| Order gate without DLO | EP not forced after missing DLO |
| Saved workflow reopen with seed | LOs + topology persist |
| Regeneration of planning step | Does not invent new LO set |

### 3.7 Persistence and regeneration

- Seed fields survive `workflowBriefResolution` save/load.  
- Reopen child: commission-native titles remain omitted when flag/seed present.  
- Planning-step regenerate: re-reads commissioned LOs; no DLO fabrication.

### 3.8 Acceptance criteria (102D done when)

1. New LJ can emit journey LOs at Requirements and component LOs at DP in markers.  
2. Valid commission → child starts at correct planning stage with authoritative component LOs.  
3. Invalid/legacy → foundation path.  
4. Create-from-topic unchanged.  
5. Practice LJ-only.  
6. No fake DLO/GLC/KM captures.  
7. Regression matrix §3.6 green.  
8. No new outcome schema / KM stage / prompt forks / readiness classifier.

### 3.9 Remaining genuine blockers

**None architectural.** Qualifications Q1–Q5 only.  
**Process blocker:** 102D requires **separate authorisation**.

---

## 4. Expected regression-test coverage (summary)

- Marker extract/validate unit suite  
- Intake topology + provenance unit suite  
- Four commission-native product paths  
- Four+ Create-from-topic / legacy commission paths  
- Persistence/reopen/regeneration  
- Expository absent-`learning_content` smoke  
- AP Purpose commissioned-LO wording path  

---

**Stop.** 102C complete as documentation/readiness. No application changes. 102D not authorised.
