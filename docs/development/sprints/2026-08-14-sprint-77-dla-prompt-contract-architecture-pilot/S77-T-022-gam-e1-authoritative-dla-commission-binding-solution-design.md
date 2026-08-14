# S77-T-022 — GAM E1 authoritative DLA commission binding solution design

**Status:** **SOLUTION DESIGN COMPLETE** (2026-08-14) — **no implementation**  
**Mode:** SOLUTION DESIGN ONLY  
**Depends on:** [T-019](S77-T-019-gam-e-learner-facing-corruption-diagnostic.md) · [T-021](S77-T-021-gam-case-1-operational-suitability-implementation.md)  
**Preserve:** T-021 Copy-brief executability gloss · instructional-archetype routing · T-031 ownership · partial-page envelope · schema/validators unless later evidence requires otherwise

**Do not implement from this artefact.** Do not fail/pass T-021 Case 1. Do not start GAM D or E2. Do not reopen DLA / T-031 design.

---

## 0. Known facts (not rediscovered)

E1 is confirmed **architecturally** (partial GAM Copy omits stored DLA `required_materials` and directs the model to Copilot conversation) and **behaviourally** (T-021 Gate C drift).

Gate C exhibit (operator): DLA A1–A4 vs GAM A1–A5; A1-M1 `scenario_set`→`text`; A2-M1 `problem_set`→`text`; A3-M1 `equation_set`→`text`; extra checklists. Stale conversation source **not** claimed.

T-021 Gate A/B **PASS**. Gate C **INCONCLUSIVE / BLOCKED BY E1**. Case 1 **OPEN**.

Archetype routing is model-visible but **partial / non-authoritative** (only rows with Priority-1 plans).

---

## 1. Root architecture

### A. Authoritative stored DLA immediately before GAM Copy

`resolveDlaEnrichedPageJsonForGamCopy(wf)`:

- walks workflow DLA steps;
- reads `readWorkflowRunUpstreamCaptureTextForStepId`;
- accepts parsed page with `artifact_type` page, `schema_version` 2.0.0, `assembly_state.current_stage === "dla"`;
- else `deriveDesignLearningActivitiesCaptureJson(workflow)` (must **not** be used as the live commission if a captured DLA exists).

This stored capture is the **current DLA page object**. Partial Copy currently **does not put it in the prompt**.

### B. Empty-embed seam

`buildUpstreamDlaPageEmbedSectionForGamCopy(wf)`:

```javascript
if (isPartialPageOutputWorkflowEnabled(wf)) return "";
```

**Caller:** `buildWorkflowStepInstructions` — after GAM Copilot schema instructions, `dlaPageEmbed` is pushed only if non-empty (so partial mode injects **nothing**).

Same assembly also, in partial mode:

- “PRISM does not embed stored prior step outputs… Use Copilot conversation…”
- generic: “Upstream binding bodies are intentionally omitted…” (`shouldInjectUpstreamCaptureIntoPrompt` is false for post-EP partial steps)
- Copy brief: “Use Copilot conversation context… PRISM does not embed stored prior step outputs in this mode.”

Non-partial path already fences the **full** DLA JSON. Live Lagrangian workflows are **partial**.

### C. Can the seam carry a bounded projection?

**YES.** The function already owns “what DLA, if anything, appears in GAM Copy.” Partial currently returns `""` to avoid a **full-page replay** (GAM output is `activity_id` + `materials[]` only). A **commission projection** is not a full-page replay and does not require GAM to copy-forward DLA scalars.

### D. Fields GAM needs to fulfil faithfully

Live Copy brief already requires: one hydrated object per `required_materials.material_id`; honour **purpose** and **specification**; T-021 executability; **evidence_requirement** *if present*.

| Field | In v1 projection? | Why |
| ----- | ----------------- | --- |
| `activity_id` | **YES** | Count/order; blocks A5-when-DLA-is-A1–A4 |
| `required_materials[].material_id` | **YES** | 1:1 hydration |
| `required_materials[].material_type` | **YES** | Gate C `text` substitutions |
| `required_materials[].purpose` | **YES** | Binding job |
| `required_materials[].specification` | **YES** | Binding bounds |
| `instructional_archetype` when present | **YES** | Align with routing; not a second constitution |
| `archetype_plan` when present | **YES** | Same |
| `evidence_requirement` **when present** | **YES** | Live brief already binds it; omit = E1 for those rows |
| `learner_task` / `expected_output` | **NO (v1)** | DLA-owned; GAM partial must not emit them. Purpose/spec carry the material job. Residual: if Case 1 Gate C still fails after E1, consider a later compact `learner_task` line — not in this repair |
| `evidence_decision` | **NO** | P02 DLA; GAM must not rewrite |
| Episode plan / LOs / full page / material **bodies** | **NO** | Partial architecture; DLA does not author bodies |

---

## 2. Candidate options

| Option | Repair | Verdict |
| ------ | ------ | ------- |
| **1 (recommended)** | In the **existing** embed seam, return a **bounded commission JSON** in partial mode + demote conversation | Smallest; preserves partial output; targets Gate C drift |
| **2** | Embed **full** stored DLA in partial mode (today’s non-partial behaviour) | Reject: fights partial-page contract; size; model may replay the page |
| **3** | Wording-only (“obey conversation DLA”) | **Rejected** by Gate C |
| **4** | Capture validator vs DLA baseline IDs only | Defence in depth later; **does not** put commission in the prompt |

---

## 3. Recommended minimal repair (Option 1)

### Exact seam

1. Add `buildGamAuthoritativeDlaCommissionProjection(page)` (or equivalent) in `app.js` next to the embed helper. Input = parsed object from `resolveDlaEnrichedPageJsonForGamCopy` (captured DLA only; **do not** project a derived fallback as if it were the operator capture).
2. Change `buildUpstreamDlaPageEmbedSectionForGamCopy` so **partial mode** returns a headed fenced JSON **projection**, not `""`. Keep non-partial **full** embed unchanged (rollback/legacy enrich-in-place).
3. Retarget the three conversation/omission sentences on the **GAM Copy** path so conversation is **contextual**, not the commission source. Do **not** rewrite DA/GAI/LS omission sentences in this task unless they share a helper that would regress those steps — prefer GAM-local wording.

### Projection schema (prompt JSON, not a page schema change)

```json
{
  "kind": "gam_authoritative_dla_commission",
  "source_stage": "dla",
  "activity_count": 4,
  "activity_ids": ["A1", "A2", "A3", "A4"],
  "activities": [
    {
      "activity_id": "A1",
      "required_materials": [
        {
          "material_id": "A1-M1",
          "material_type": "scenario_set",
          "purpose": "…",
          "specification": "…",
          "instructional_archetype": "…",
          "archetype_plan": {},
          "evidence_requirement": {}
        }
      ]
    }
  ]
}
```

- Omit `instructional_archetype` / `archetype_plan` / `evidence_requirement` keys when absent (do not inject nulls that look like commissions).
- **No** `materials[].body` from DLA.
- `activity_ids` / `activity_count` are derived from the stored DLA array — the embed **cannot** invent A5.

### Authority wording (same Copy constitution, not a second one)

Keep existing: partial output shape; T-021 executability; 1:1 `material_id`; forbidden DLA scalar mutation.

**Replace** “does not embed / use conversation for continuity” on GAM Copy with the substance of:

- The embedded DLA commission is **authoritative** for which activities and material rows GAM must author.
- GAM **fulfils** commissioned **bodies** (title, body_format, body) under purpose/specification (and evidence_requirement when present).
- Preserve `activity_id` / `material_id` / `material_type`; do not add, delete, substitute, or reassign rows.
- Copilot conversation may supply subject-matter **context** (and `conversation_attachment` bytes when that provenance is commissioned) but **must not override** the embedded commission.

Do not add a new numbered GAM contract block in `ld-gam-page-enrich-contract.js` unless Copy-only injection is proven invisible (T-047 kept ordinary specification on the Copy brief). **Prefer Copy assembly + embed heading**, not a second enrich-contract constitution.

### Prompt-size estimate (no Gate C DLA JSON in git)

Four activities, ~two `required_materials` rows each, purpose+specification typically ~100–400 characters: **about 2–8 kB** pretty-printed projection + ~0.4 kB heading/authority. Full DLA page (LOs, episode_plans, learner_task, cognition) is typically **several times larger**. Bounded projection is the size-correct choice.

### Copy vs Studio

Live GAM production Copy **is** `buildWorkflowStepInstructions` (brief + schema + embed + archetype routing). Workflow→Studio prefill uses the same builder. **Copy-path implementation is sufficient** for the live defect. Do not add a separate Studio GAM assembler in T-023. Pack-text GAM (`lib/gam-output-format.js`) is out of this repair.

### Archetype routing

Keep `applyLdInstructionalArchetypeRoutingToDraft` (still from stored DLA page). Projection includes archetype fields **when present** so routing and commission agree. Routing remains **pedagogical how**; projection is **what rows exist**. Not a duplicate commission if routing stays compact rules, not a second `required_materials` list.

### Partial merge/capture

`validateGamPartialPageCapture` does **not** compare activity IDs to the DLA baseline. `normalizeGamCaptureToPage` merges materials onto the **stored DLA** baseline (extra A5 in the model JSON may not persist as a fifth DLA activity). E1 is still a **generation-authority** defect: wrong types/bodies on A1–A4 still merge. **Minimal repair is prompt projection**, not a new validator. Optional later: partial capture vs baseline `activity_id` / `material_id` set — **out of T-023** unless Gate C after bind still accepts orphans.

### Schema / validator / DLA

| | |
| - | - |
| Schema | **NO** |
| Validator | **NO** for the minimal repair |
| DLA contract | **NO** |
| Rollback / non-partial | Full embed **unchanged** |
| `dlaCanonicalAssembler` | Unaffected |

### Authority duplication risk

Mitigate by: one projection fence; one heading “authoritative commission”; conversation **subordinate**; do not also paste full DLA in partial mode; do not duplicate `required_materials` inside the enrich-contract block.

### Conversation after repair

**Demoted**, not deleted: still needed for `conversation_attachment` provenance and non-commission context. **Commission fulfilment must not require reconstructing `required_materials` from the thread.**

---

## 4. Architectural answers

1. **Smallest seam:** `buildUpstreamDlaPageEmbedSectionForGamCopy` (plus GAM-local omission/brief sentences).
2. **Projection vs full embed:** **projection** in partial mode.
3. **Fields:** §1.D / §3 schema.
4. **Size:** ~2–8 kB for a 4-activity Lagrangian-scale DLA.
5. **Copy-only:** implement on `buildWorkflowStepInstructions` / Copy brief+embed; Studio prefill rides along.
6. **Routing:** keep; include archetype fields when present.
7. **Merge:** no required change; prompt is the E1 fix.
8. **Schema:** **NO**.
9. **Validators:** **NO** for T-023.
10. **DLA:** **NO**.
11. **Rollback:** non-partial full embed stays; assembler flag irrelevant.
12. **Contradictory authority:** retarget the three “use conversation” GAM Copy lines; single projection.
13. **Conversation:** demote for commission; retain for attachment/context.

---

## 5. Gate A/B test plan (before implementation)

Prefer extending `tests/page-gam-enrich.test.js` (and/or a focused `tests/s77-gam-e1-commission-projection.test.js`) using `buildWorkflowStepInstructions` on a partial v2 GAM step with a **stub stored DLA capture**.

| # | Assert |
| - | ------ |
| A1 | Final Copy text contains `gam_authoritative_dla_commission` (or chosen `kind`) and a json fence of the projection |
| A2 | Fixture DLA A1–A4 → prompt `activity_ids` / `activity_count` cannot include A5 |
| A3 | `material_id`, `material_type`, `purpose`, `specification` survive (string equality on fixture) |
| A4 | Archetype + plan present in prompt **iff** present on the DLA row |
| A5 | No DLA `materials[].body` / learner-facing bodies in the projection |
| A6 | Exactly one commission projection section (no second full DLA page in partial mode) |
| A7 | Conversation wording **subordinate** (must not override); old “does not embed stored prior step outputs” **absent** on GAM Copy **or** clearly scoped as not applying to this commission |
| A8 | T-021 executability clauses still present |
| A9 | Existing GAM Copy/enrich/archetype suites remain green |

Fail closed: no captured DLA → no fake commission (do not treat `deriveDesignLearningActivitiesCaptureJson` as operator DLA). Prompt may still say conversation is not the override once a capture exists.

**Gate B:** same suites as T-021 Gate B (`page-gam-enrich`, GAM Copy delivery/context, instructional-depth, mixed-acceptance as needed).

---

## 6. Subsequent Gate C (after T-023, not now)

Fresh Lagrangian **after** implementation, **same captured DLA** as the GAM run:

- GAM activity set **follows** supplied DLA (no extra A5 if DLA is A1–A4);
- commissioned `material_id` and `material_type` preserved;
- purpose/specification substantively fulfilled (not `text` substituting `scenario_set` / `problem_set` / `equation_set`);
- no uncommissioned material rows unless an **existing** explicit contract permits them;
- **then independently** check T-021 Case 1 on any solve/identify `equation_set` (coherent, determinate).

Do **not** use that run to close E2 or GAM D. Do **not** close Case 1 solely because types match.

---

## 7. Files expected to change (implementation task)

| Path | Change |
| ---- | ------ |
| `app.js` | Projection helper; partial branch of `buildUpstreamDlaPageEmbedSectionForGamCopy`; GAM Copy conversation/omission sentences; brief line that currently forbids embedding |
| `index.html` | `app.js` cache pin |
| `tests/page-gam-enrich.test.js` and/or new focused test | Gate A assertions |

**Explicit non-changes:** DLA assembler/contract · `lib/ld-gam-page-enrich-contract.js` (unless Copy-only fails) · `lib/page-gam-enrich.js` validators · schemas · EP · T-021 sentence meaning · archetype module behaviour.

---

## 8. Implementation recommendation

**Option 1.** Next task: **S77-T-023** — implement the partial-mode authoritative DLA commission projection in `buildUpstreamDlaPageEmbedSectionForGamCopy`, demote conversation on GAM Copy, Gate A/B only (no Case 1 close; no Gate C in T-023 unless separately authorised).

---

## Verdict

**E1 REPAIR = BOUNDED DLA COMMISSION PROJECTION IN THE EXISTING PARTIAL GAM EMBED SEAM — NEXT S77-T-023 — NO CODE IN T-022**
