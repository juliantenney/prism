# S77-T-023 — GAM E1 authoritative DLA commission binding implementation

**Status:** **IMPLEMENTED — Gate A PASS · Gate B PASS · Gate C PASS** (2026-08-14)  
**Mode:** Implementation through Gate A and Gate B; Gate C recorded in [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md)  
**Gate C:** **PASS** — **E1 CLOSED** (operator, 2026-08-14)  
**Depends on:** [T-022](S77-T-022-gam-e1-authoritative-dla-commission-binding-solution-design.md) Option 1  
**Preserve:** T-021 Copy-brief executability gloss · LD-INSTRUCTIONAL-ARCHETYPE-ROUTING · T-031 ownership · partial-page envelope

---

## 1. Files changed

| File | Change |
| ---- | ------ |
| `app.js` | Partial `buildUpstreamDlaPageEmbedSectionForGamCopy` injects bounded commission; helpers `projectGamAuthoritativeDlaCommissionFromPage` / `buildAuthoritativeDlaMaterialCommissionSectionFromPage`; GAM Copy conversation wording demoted; skip generic omitted-bodies line on GAM; export helpers on `__PRISM_TEST_API` |
| `index.html` | Cache pin `app.js?v=20260814-s77-t023-gam-e1` |
| `tests/page-gam-enrich.test.js` | Partial-mode omission tests retargeted; A1–A4 commission Gate A assertions |
| This artefact | Record |

**Not changed:** DLA contract/assembler, EP, schemas, validators, GAM E2, GAM D, Graphics, T-021 Case-1 rule text.

---

## 2. Exact projection schema (v1)

Pretty-printed JSON inside a fenced `json` block:

```json
{
  "kind": "gam_authoritative_dla_commission",
  "activities": [
    {
      "activity_id": "<from DLA when present>",
      "instructional_archetype": "<only if present on the activity>",
      "archetype_plan": "<only if present on the activity>",
      "evidence_requirement": "<only if present on the activity>",
      "required_materials": [
        {
          "material_id": "<when present>",
          "material_type": "<when present>",
          "purpose": "<when present>",
          "specification": "<when present>",
          "evidence_requirement": "<only if present on the row>"
        }
      ]
    }
  ]
}
```

Rules:

- Include only activities that have a non-empty `required_materials` array.
- Copy source values faithfully; do not invent or normalise missing fields.
- Optional keys appear only when already present (non-null) on the source object.
- Never project `learner_task`, `expected_output`, `evidence_decision`, `episode_plan`, material `body`, or page-shell fields.

---

## 3. Exact authority wording

Heading: `### AUTHORITATIVE DLA MATERIAL COMMISSION`

Body (single paragraph):

> This embedded JSON is the authoritative DLA material commission for Generate Activity Materials. Author only the listed activities and required_materials rows. Preserve activity_id, material_id, and material_type. Fulfil each row's purpose and specification. Honour instructional_archetype and archetype_plan when present. Honour evidence_requirement when present. Do not add, delete, substitute, rename, or reassign commissioned material rows. Copilot conversation may provide contextual continuity but must not override this embedded commission.

---

## 4. Injection seam

`buildUpstreamDlaPageEmbedSectionForGamCopy(wf)`

- **Partial mode (live Lagrangian path):** resolve stored DLA via existing `resolveDlaEnrichedPageJsonForGamCopy` (capture with `assembly_state.current_stage === "dla"`; else existing derive fallback — still not conversation). Project; do **not** return `""`.
- **Non-partial:** full DLA page embed **unchanged**.

Caller unchanged: `buildWorkflowStepInstructions` after GAM Copilot schema instructions (`dlaPageEmbed`).

GAM-local wording:

- Schema line: full DLA page is not embedded; commission is binding; conversation must not override.
- Copy brief: conversation is contextual only; must not override the commission.
- Generic “Upstream binding bodies are intentionally omitted…” is **skipped for GAM only** so it does not contradict the commission section.

Archetype routing still applied after assembly (`applyLdInstructionalArchetypeRoutingToDraft`). Projection = commission data; routing = derived authoring instruction.

---

## 5. Copy / Studio path coverage

| Path | Coverage |
| ---- | -------- |
| **Workflow Copy** | **YES** — `textToCopy = buildWorkflowStepInstructions(...)` then GAM routing apply |
| **Prompt Studio GAM** | **YES** — same `buildWorkflowStepInstructions` assembler + same routing apply (existing Studio vs Copy delivery tests remain green) |
| Non-GAM partial steps (DLA, LS, Design Page, DA, GAI) | Unchanged omitted-bodies behaviour |
| Non-partial GAM | Unchanged full DLA embed |

---

## 6–7. Size (observational)

Representative fixture: four-activity Lagrangian-shaped DLA (A1–A4, 10 `required_materials` rows; mixed optional archetype / evidence fields). Not a live captured Lagrangian page (Gate C not run).

| Metric | Value |
| ------ | ----- |
| Projection JSON chars | **2902** |
| Headed section chars (authority + fence + JSON) | **3501** |
| Activities projected | **4** |
| Material rows projected | **10** |
| Approx. final GAM prompt delta vs prior partial omission | **~+3484** (section + conversation/brief reword; minus GAM omitted-bodies sentence) |

No unrelated GAM guidance was thinned.

---

## 8. Gate A result — **PASS**

| # | Check | Result |
| - | ----- | ------ |
| 1 | Commission section in final model-visible partial GAM prompt | **YES** |
| 2 | Sourced from stored/current DLA capture via resolver, not conversation | **YES** |
| 3 | All commissioned activity/material rows represented | **YES** (A1–A4; empty-RM A5 omitted) |
| 4 | `material_id` preserved | **YES** |
| 5 | `material_type` preserved | **YES** |
| 6 | `purpose` preserved | **YES** |
| 7 | `specification` preserved | **YES** |
| 8 | Archetype fields only when present | **YES** |
| 9 | `evidence_requirement` only when present | **YES** |
| 10 | No material body embedded | **YES** |
| 11 | No `learner_task` / `expected_output` / `evidence_decision` / `episode_plan` | **YES** |
| 12 | Conversation cannot override commission | **YES** |
| 13 | T-021 wording intact | **YES** |
| 14 | Archetype routing intact | **YES** |
| 15 | No DLA/schema/validator changes | **YES** |

---

## 9. Gate B result — **PASS** (targeted)

Core suite **90 pass / 0 fail**:

- `tests/page-gam-enrich.test.js` (T-021 operational-suitability + new commission tests)
- `tests/ld-instructional-archetype-gam-copy-delivery.test.js`
- `tests/ld-instructional-archetype-gam-copy-context.test.js`
- `tests/ld-gam-instructional-depth.test.js`
- `tests/ld-instructional-archetype-assembled-gam-prompt.test.js`
- `tests/ld-instructional-archetype-delivery-observability.test.js`
- `tests/ld-instructional-archetype-mixed-acceptance.test.js`
- `tests/workflow-gam-capture-validation-gate.test.js`

Also run: `tests/page-partial-capture-validate.test.js`, `tests/page-gam-materials-projection.test.js`, `tests/sprint-72-evidence-centred-activity-slice.test.js` (evidence-provider GAM boundary) — no T-023 regressions.

**Pre-existing (not T-023):** `tests/page-prompt-no-upstream-injection.test.js` still asserts `/DLA partial-page contract/` on live DLA Copy, which now uses canonical `## 1. DLA ROLE AND AUTHORITY`. That assertion failed before GAM checks; **not weakened**. GAM checks in that file still forbid `### Upstream DLA page` and `learner_task` in a full-page embed.

---

## 10. Tests / pass counts

| Suite cluster | Result |
| ------------- | ------ |
| Gate B core (files listed in §9) | **90 pass, 0 fail** |
| New/updated GAM commission assertions | **pass** |

Existing tests were retargeted to the new partial GAM contract (commission instead of empty embed), not weakened.

---

## 11–19. Explicit report

| # | Item | Result |
| - | ---- | ------ |
| 11 | T-021 preserved | **YES** |
| 12 | Archetype routing preserved | **YES** |
| 13 | `evidence_requirement` preservation | **YES** (copy when present; never synthesised) |
| 14 | Body embedding | **NO** |
| 15 | DLA change | **NO** |
| 16 | Schema change | **NO** |
| 17 | Validator change | **NO** |
| 18 | E2 changed | **NO** |
| 19 | GAM D changed | **NO** |

---

## 20. Blocker before Gate C

**Cleared.** Operator reloaded and ran a fresh post–T-023 DLA→GAM chain. Record: [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md).

---

## 21. Gate C (operator, 2026-08-14) — **PASS · E1 CLOSED**

Authoritative inspection (not re-analysed): fresh DLA **A1–A5**, three commissioned rows each; fresh GAM exact same activity set and material IDs/types; no missing or extra rows; purpose/specification substantively fulfilled; archetype-sensitive material substantively routed.

Same run closed **T-021 Case 1** (see T-024 §B and [T-021](S77-T-021-gam-case-1-operational-suitability-implementation.md)).

Does **not** close GAM D or E2.

---

## 22. Exact next action

**S77-T-025** — GAM D pedagogical-function fulfilment **diagnostic** (defined; not started). E2 remains OPEN / intermittent.

---

## Verdict

**T-023 GATE A/B/C PASS — E1 CLOSED.** Bound evidence in [T-024](S77-T-024-gam-e1-and-case-1-bound-gate-c.md).
