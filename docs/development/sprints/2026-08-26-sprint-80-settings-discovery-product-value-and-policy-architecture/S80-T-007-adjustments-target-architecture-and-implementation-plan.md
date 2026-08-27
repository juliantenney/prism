# S80-T-007 — Adjustments target architecture and implementation plan

**Sprint:** 80 — Settings Discovery, Product Value and Policy Architecture
**Status:** **PLAN — awaiting operator review**
**Mode:** Design / planning only — **no production code written; no slice started**
**Authority:** [S80-T-006](S80-T-006-operator-product-architecture-decision-gate.md) is DECIDED and authoritative
**Corrects:** T-006 §17C (see §1.1 below)

---

## 1. Executive architecture conclusion

**Adjustments is substantially cheaper to build than T-006 assumed, and one of T-006's architectural recommendations was wrong.** Three structural discoveries change the design:

**(a) There is no model call at Run.** Every `api.openai.com` request in `app.js` is design-time — brief factor extraction (`20450`), intent interpretation (`20578`), refinement chat (`27577`), workflow design generation (`27840`, `27892`) and question generation (`28439`). The Run path assembles prompt text and **copies it to the clipboard** for an external Copilot (`app.js:32063–32064`, toast at `32079`), then validates the pasted capture. Consequently "runtime projection" means *prompt text assembly*, and the T-006 requirement that parameter editing must work without model capability is **already structurally satisfied** — Run never needs an API key.

**(b) Per-step Additional Instruction already has a live, generic route to the model.** `step.notes`, with the param block stripped, is injected into the assembled prompt for every step:

```33786:33793:app.js
    var visibleNotes = stripWorkflowStepParamBlock(step.notes || "");
    if (outName) {
      visibleNotes = stripContradictoryWorkflowRunnerFooterFromNotes(visibleNotes);
    }
    if (visibleNotes) {
      lines.push("");
      lines.push("How to use inputs for this step (from the workflow designer):");
      lines.push(visibleNotes);
    }
```

An "Instructions" textarea already exists in the step editor bound to this field (`app.js:32442–32447`). So mechanism 2 is mostly a **separation, labelling and precedence-framing** task, not new plumbing. The defect to fix is that free text and machine parameters share one string, which is why `stripWorkflowStepParamBlock` is scattered across the codebase.

**(c) Topic is not baked into prompt bodies.** Verified empirically: in `workflow-marxeduqselfstudy.json` the topic string appears 14 times — in `name`, `workflowOutputSpec.goal`, `constraints`, and `workflowBriefResolution` — and **zero times inside any `override_prompt_body`**. `buildSeededStepPromptForWorkflowStep` receives `workflowGoal` (`app.js:35471`) but never exposes it as a template variable (`5377–5392`). Topic is therefore genuinely late-bindable today.

### 1.1 Correction to T-006 §17C

T-006 recommended injecting at `applyWorkflowStepRuntimePromptAugmentations` (`app.js:15990`). **That is the wrong chokepoint.** Evidence:

| Problem | Evidence |
| --- | --- |
| Its option map is always empty and never read | Called as `applyWorkflowStepRuntimePromptAugmentations(raw, step, wfRec, {})` (`31443`); `map` normalised at `16002` then never referenced |
| It cannot see new step properties | Context comes from `buildWorkflowStepPromptAugmentContextFromStep` (`15919`), which projects only ~10 fixed fields |
| Four LD steps bypass it entirely | DA, GAI and LS use bespoke builders at `33810–33819`; none passes through `finalizePromptBody` |
| GAM never reaches it | `buildWorkflowStepInstructions` early-returns to the canonical assembler at `33424–33432`, before any of this |
| It short-circuits on empty drafts | `15992` |

**The correct ingress is `buildWorkflowStepInstructions` (`app.js:33394`)**, which is the single assembly point for every step, plus **`buildLiveGamV2CopyPromptViaCanonicalAssembler` (`33293`)** for the GAM early-return. **Two ingress points, not one.**

### 1.2 Resulting architecture in one line

```
Adjustments UI  →  wf.adjustments (typed params) + step.additional_instruction (free text)
                →  resolveEffectiveRunContext(wf)          [one deterministic resolver, no AI]
                →  projected as delimited prompt sections at 2 ingress points
                →  external Copilot  →  capture  →  existing validators unchanged
```

No new store, no new dependency graph, no new model call, no revival of `[PRISM_STEP_PARAMS]`.

---

## 2. Target Adjustments product model

```
ADJUSTMENTS

  Workflow parameters
    Topic                    [text]
    Duration                 [number, minutes]
    Audience                 [text]            ← see §9
    Assessment               [conditional group; only if workflow has assessment capability]
      Number of items        [number]
      Question formats       [enum]
      Difficulty emphasis    [enum]

  Step adjustments
    Normalize Content        Additional instruction (optional)
    Model Knowledge          Additional instruction (optional)
    Define Learning Outcomes Additional instruction (optional)
    Design Learning Activities  Additional instruction (optional)
    Generate Activity Materials Additional instruction (optional)
    Construct Learning Sequence Additional instruction (optional)
    Design Page              Additional instruction (optional)
    ...
    (Design Episode Plan     — no field; deterministic step)
```

Two visually and conceptually separate regions. Typed parameters are deterministic and machine-read; step instructions are discretionary and model-interpreted.

---

## 3. UI reuse plan

The existing panel is **not a modal** — it is an inline tab panel, which suits reuse well.

**Reuse as-is:**

| Asset | Location | Reuse |
| --- | --- | --- |
| Panel shell + tab | `index.html:1084–1133`, `#unifiedWorkflowSettingsPanel` | Keep; retitle to "Adjustments" |
| Mode toggle | `setWorkflowMode(mode)` (`app.js:26898`), `"settings"` mode | Keep; rename mode string later, cosmetic |
| Step cards | `renderUnifiedWorkflowSettingsContent` (`3181`), per-step `<section>` at `3240–3262` | Keep — this is exactly the "Step adjustments" layout needed |
| Control factory | `appendWorkflowPackParameterControlDom` (`3398`) — select / boolean / number / text | Keep; **add a `textarea` type** for Additional Instruction |
| Declarative control shape | `normalizePackParameterControlRow` (`2320`): `key, label, description, controlType, default, options, visible, advanced, group, min, max, placeholder` | **Reuse the shape** for the new parameter registry — it is already sufficient |
| Grouping / collapsible sections | `groupWorkflowStepParameterControlsForSettings` (`2542`), `<details>` render at `3484–3492` | Keep — gives progressive disclosure free |
| Deep-link focus | `focusUnifiedWorkflowSettingsSection` (`3079`) | Keep |

**Replace:**

| Current | Problem | Replacement |
| --- | --- | --- |
| Value source = pack `stepParameterControls` / `workflowParameterControls` | Pack-declared legacy catalogue; produces the 41-control surface | New small parameter registry (§4) |
| `syncUnifiedWorkflowSettingsToStepNotes` (`3140`) writing into edit-mode DOM textareas | **Fragile** — bails silently if step `<li>` elements are not rendered (`3152`, `3166–3168`); couples persistence to DOM presence | Write directly to `wf.adjustments` / `step.additional_instruction` on the model |
| Step discovery via `collectIncludedWorkflowStepRows` (`2927`), which **silently skips steps with no canonical id** (`2944`) | Would hide instruction fields for legitimate steps | Enumerate `workflow.steps` directly; use canonical id only for labelling |
| Count badge `countUnifiedWorkflowVisibleParameterControls` (`3001`), shown at `3045–3054` | Counts *available controls*, i.e. advertises knob count — the exact anti-pattern T-006 rejects | **Remove the numeric badge.** Show a dot/marker only when the user has actually set something |
| Per-step summary cue `WORKFLOW_SETTINGS_SUMMARY_PARAM_IDS` (`3503–3513`), rendered `3724–3764` | Displays legacy inert values as if effective (T-006 §11) | Retire with the legacy controls |

**Save interaction:** keep the current model — controls sync on `change`/`input`, real persistence via the workflow header **Save** (`handleSaveWorkflow`, `32785`). Copy at `index.html:1129–1130` already explains this. No new Apply button (§16).

---

## 4. Typed workflow-parameter contract

A new declarative registry — **not** a rename of `resolvedFactors` or `[PRISM_STEP_PARAMS]`.

```js
// Illustrative shape only — not code to implement.
{
  id: "topic",                       // stable key
  label: "Topic",                    // user-facing
  help: "What this resource covers.",// optional
  type: "text",                      // text | number | enum
  options: null,                     // required when type === "enum"
  min: null, max: null,              // number bounds
  applicability: { always: true },    // or { requiresCapability: "assessment" }
  owner: "runtime_context",          // the single interpretation point
  projection: "workflowContext",     // named projection strategy
  validate: fn                       // optional beyond type/bounds
}
```

Deliberately mirrors the existing control shape (`app.js:2357–2372`) so the rendering infrastructure works unchanged.

**Field-by-field against the T-007 requirement list:** parameter id → `id`; type → `type`; valid values → `options` / `min` / `max`; label → `label`; help → `help`; current explicit value → stored separately in `wf.adjustments` (declaration stays static); ownership → `owner`; applicability → `applicability`; validation → type + bounds + optional `validate`; extensibility → §14.

**Two projection strategies only, both defined once:**

| Strategy | Meaning | Used by |
| --- | --- | --- |
| `workflowContext` | Rendered into the workflow-context block that leads the run | Topic, Audience |
| `stepScoped` | Rendered into the prompt of the specific owning step(s) | Duration (LS/DLA), assessment params (DA/GAI) |

A new parameter picks an existing strategy. Only if a genuinely new *kind* of projection is needed does anything structural change — that is the extensibility test.

---

## 5. Persistence model

**Smallest representation that is honest:**

```js
workflow.adjustments = {
  version: 1,
  parameters: { topic: "Elizabeth I", duration_minutes: 45 }   // explicit values only
};

step.additional_instruction = "Prioritise foundational concepts…";  // new field, per step
```

Design rules:

1. **Only explicitly set values are stored.** Absence means Auto — PRISM's contextual judgement. This resolves the T-005 Auto/unset question with representation A (absence), which needs no sentinel value and no default-version pinning.
2. **`step.additional_instruction` is a new dedicated field**, not appended to `step.notes`. This is the key hygiene fix: it ends the shared-string problem that requires `stripWorkflowStepParamBlock` at `5307`, `25430`, `33344`, `33786`, `34367`.
3. **`resolvedFactors` is untouched.** It remains the frozen Create-time commissioning record. Adjustments *overlay* it at resolution time; they never rewrite it. This preserves the T-005B.1 provenance distinction between "author chose X" and "PRISM resolved X".
4. **Nothing is written to `[PRISM_STEP_PARAMS]`.**
5. **Export / duplicate:** both are plain-JSON structural copies, so a new top-level workflow key and a new step key travel automatically. `gatherWorkflowDetailFormData` (`32571`) and the step gather at `32664–32710` need the two new fields added to their property lists — that is the only wiring.

---

## 6. Runtime authority model

Single deterministic resolver, no AI:

```
resolveEffectiveRunContext(wf) →
  {
    topic:    adjustments.parameters.topic    ?? resolvedFactors/goal-derived,
    duration: adjustments.parameters.duration ?? resolvedFactors.duration_minutes,
    audience: …,
    assessment: { … },
    provenance: { topic: "adjustment" | "commissioned" | "absent", … }
  }
```

**Precedence, highest first** (implements T-006 §7):

1. Canonical hard requirements, output contracts, schemas
2. Validators (unchanged — Adjustments never touches capture validation)
3. Authoritative upstream artefacts (existing capture embedding, `33762–33768`)
4. **Explicit typed workflow parameters**
5. **Per-step Additional Instruction**
6. Stage discretionary defaults / frozen `resolvedFactors`

Every consumer reads the resolver output. No stage re-derives a parameter. `provenance` exists so the UI can say "commissioned as X" versus "you set X" without guessing.

---

## 7. Topic vertical-proof design

**Goal:** same workflow, Topic = Henry VIII → Run; Topic = Elizabeth I → Run. No workflow regeneration, no elicitation call.

**Current emission surface — exactly one place:**

```33117:33141:app.js
  function buildWorkflowRuntimeContextText(wf, step) {
    ...
    if (goalText) lines.push("Goal: " + goalText);
    if (outputSpec.audience) lines.push("Audience: " + outputSpec.audience);
    ...
      if (constraintsText) lines.push("Constraints: " + constraintsText);
```

Called from one site, **first step only**:

```32021:32029:app.js
      // In Run mode, prepend compact global workflow context to the FIRST step only.
      if (inRunMode && zeroBasedIndex === 0) {
```

**Design:**

1. `resolveEffectiveRunContext` supplies the effective topic.
2. Override at **resolution**, not emission. The persisted goal is additionally read by roughly fifteen *gating* sites (`app.js:8219`, `15930`, `8292`, `8308`, `8338`, `10306`, `13988`, `14052`, `14113`, `14234`, `14264`, `14968`, `15075`, `15116`, `15584`, `15840`, `15872`, `15968`, `16042`, `17083`) which lowercase it and regex-test it to choose contract blocks. If only the emitted text were overridden, delivery-mode and page-profile detection would still run against the old topic. Overriding where `normalizeWorkflowOutputSpec` is resolved makes emitting and gating readers agree.
3. **Decide the first-step-only scope.** Today later steps inherit topic through Copilot conversation context. Two options — **operator decision required (Q1)**:
   - **7a (recommended, minimal):** keep first-step-only. Matches current behaviour; lowest risk; relies on conversation continuity that already works.
   - **7b:** emit the effective topic on every step. More robust for out-of-order or resumed runs, but changes prompt content for every step and risks redundancy.
4. **Three stored copies must be reconciled.** The Marx export shows `explicit.topic = "Was Marx Right?"` (clean) but `resolvedFactors.topic` and `workshop_subject` hold the whole raw design-intent blob, and `constraints` embeds a `topic:` clause. The resolver must define one precedence and the `constraints` `topic:` clause must be rewritten or suppressed when an adjustment is present, or the model receives two topics.

**Why Topic is the right first slice:** not baked into any prompt body (verified), no enum vocabulary problem, no topology gate, no dependent factors, one emission site, and no prerequisite defect.

**Prior art worth noting, not adopting:** a `{{Variable}}` fill already runs at copy time (`fillTemplateVariables`, `35218–35239`, wired at `32044`) using `window.prompt()`. It proves late binding at copy time works, but it is transient, untyped and unpersisted, so it is not the parameter mechanism.

---

## 8. Duration design and the D1 prerequisite

**D1 is smaller than feared.** The hardcoded text:

```493:495:lib/ld-dla-page-enrich-contract.js
      "- DLA-WB-01: resource_intent self_study_workbook, session_duration_target_minutes (~60), consolidation_requirement, workbook_contract_applied: true …",
      …
      "- DLA-WB-03: Sum of activity duration_minutes 50–70 unless an explicit brief exception is recorded.",
```

plus `"~60-minute learner workbook"` at `473`. `buildDlaWorkbookOverlayBlock()` takes **no arguments** (`471`) and its single production caller passes none (`app.js:10338`).

**Minimal repair:** add one optional options argument, derive target and a ±10 band, interpolate into the three lines; pass `{ durationMinutes: resolved.duration_minutes }` at `app.js:10338`. `resolved` is **already in scope** at that point (computed `10300–10303`). Defaulting to 60 reproduces today's strings byte-for-byte, so the four test call sites (`tests/ld-dla-canonical-assembler.test.js:260`, `tests/s78-t-041-culminating-transfer-production.test.js:214`, `tests/dla-phase-d-retirement.test.js:182,225`, `tests/s78-dla-diagnostic-review.test.js:107`) keep passing unchanged. **Two edited call sites, one new optional parameter, no new plumbing.** Note `50–70` uses an en dash.

**Duration ownership is currently violated.** Learning Sequence is the only stage that genuinely produces an allocation (`total_duration_minutes` plus per-block `start_minute`/`duration_minutes`, `lib/workflow-artefact-json-strict.js:26,146–148,506`). But at least three other readers interpret duration independently: the DLA overlay (hardcoded), DLA per-activity emission (`app.js:8783`), and brief inference thresholds (`app.js:18917–18925`, `19373–19381`). The renderer reconciles only after the fact, by preference not contract — and says so:

```4:8:lib/learner-renderer-vnext/project-timeline-durations.js
 * Transport Learning Sequence timeline durations onto activity rows.
 * Does not compute a new allocation: copies timeline entry minutes onto
 * matching activities[].duration_minutes when the activity value is absent.
```

**Design:** Duration is a single author constraint. LS owns allocation. DLA receives the *constraint* as a target band (via the D1 repair) rather than inventing its own. Downstream consumes artefacts. The resolver is the one place the number is interpreted.

**Additional live defect found (record, do not fix here):** the LS duration step param never reaches the model. The pack declares `"Build the sequence to fit exactly {{value}} minutes total duration."` (`domain-learning-design-step-patterns.md:1517–1528`), but Run strips the param block (`33786`) and passes an empty option map (`31443`). Today `60` reaches LS only incidentally, via the `Constraints:` line on **step 1**. Call this **D3**. It does not block Duration under this design, because the parameter will be projected as prompt text rather than through step params.

**Ordering:** Topic before Duration. There is no dependency forcing D1 first, and Topic proves the architecture without touching canonical DLA.

**Other hardcoded time literals to record, not fix:** `domain-learning-design-step-patterns.md:2402` (a `<= 30 minutes` threshold shaping outcome count), `:3200`, `:1522`, `:981` (defaults 60, with inconsistent ranges 15–240 vs 10–480), `app.js:18921`, `19373`, `19381` (`>= 45` inference thresholds).

---

## 9. Audience / learner level recommendation

**Recommendation: Option A — free-text Audience only in v1. Defer the learner-level enum (Q2).**

Reasoning from evidence:

- Three conflicting vocabularies exist: brief `learner_level` = `beginner/intermediate/advanced/undergraduate/postgraduate`; LO step param `learnerLevel` = `school/undergraduate/postgraduate/professional/general_adult`; overlapping in only **2 of 5** values (T-005B.1 conflicts 1 and 13).
- Learning Design declares **no** `audience` factor (`extraFields: []`), so `resolved.audience` is permanently undefined for LD and the page shell falls back to the `"Learners"` constant (`app.js:11638`).
- There is already a live emission slot: `if (outputSpec.audience) lines.push("Audience: " + outputSpec.audience)` (`33125`) — currently often empty for LD.
- **Free text cannot deterministically imply a typed level without AI**, and T-006 forbids an interpretation call in Adjustments.

So free-text Audience is immediately truthful, fills an existing empty slot, removes the `"Learners"` placeholder, and commits to no vocabulary. Choosing a canonical enum is a genuine product decision requiring evidence about what consuming stages should do differently at each level — that is its own task, not a T-007 side effect. Shipping an enum now would bless one of three conflicting vocabularies arbitrarily.

---

## 10. Assessment v1 recommendation

The investigation **materially corrected** two prior beliefs. Corrections first:

| Prior belief | Finding |
| --- | --- |
| "GAI's prompt is voided" | **Refuted.** The *stored body* is voided (`31425–31439`), but `resolveStepPromptText` is never reached — `33804–33817` diverts first, and `gaiV2PartialStep` is **unconditional**. GAI then receives an authoring brief + contract library + the **full live pack template** (`33276–33285`). GAI is the best-instructed assessment step, not the worst |
| "The item count is filtered by `isAssessmentLeakLine`" | **Wrong mechanism.** That filter (`33112–33115`) only runs for GLC/MK/LO steps. The count dies because `var selectedOptions = [];` (`app.js:5373`) is never populated, `{{option:…}}` resolves only in the studio path (`6104`), and the resulting empty `- Label:` line is deleted (`5252`) |

**Verdicts:**

| Dimension | Verdict | Evidence |
| --- | --- | --- |
| **Question format** | **Supported — needs projection only** | 5 types with per-type authoring rules and per-type required fields in the live prompt (`step-patterns.md:3024`); 9 enum values (`:3041–3056`); combo expander (`app.js:5689–5700`) and per-format line pruner (`5726–5756`) already written |
| **Difficulty** | **Supported per item** | `difficulty_level` is a **required** field in the model-visible contract (`lib/ld-gai-page-enrich-contract.js:38`), with a closed 4-value set `recall/comprehension/application/analysis` (`step-patterns.md:3024`, `:2761`) |
| **Quantity** | **Needs projection** | Instruction and range already declared (`step-patterns.md:3032–3038`, 1–200); dead only via `selectedOptions` |
| **Matching question type** | **Not supported — exclude** | No `matching` type at any layer |

**v1 assessment surface (conditional on assessment capability):**

1. **Number of items** — number, 1–50 (narrower than the pack's 200; keep it honest)
2. **Question formats** — enum, the existing 9 values
3. **Difficulty emphasis** — enum, 3 values, **mapped explicitly** to the contractual 4-value per-item vocabulary

**Critical design decision.** All three dimensions share one root cause, the dead `selectedOptions` seam. There are two ways to activate them:

- **10a — revive `selectedOptions` / `{{option:}}`.** Rejected. It is a **Create-time bake** path, so it produces baked values, not late binding; and it revives precisely the legacy plumbing T-006 demoted.
- **10b — project assessment parameters as delimited prompt text at the same runtime chokepoint as Topic and Duration. Recommended.** One mechanism for all parameters, genuinely late-bound, no legacy revival.

**Vocabulary collision to resolve (Q3):** difficulty has three competing vocabularies — per-item `recall/comprehension/application/analysis` (contractual), profile `foundational/balanced/higher_order` (`step-patterns.md:1061–1075`), and elicitation `introductory/balanced/challenging` (`app.js:20188–20189`). v1 must expose one and define the mapping.

**Truthfulness caveat for quantity:** "exactly N" remains a prompt-level request. The GAI validator checks only envelope fields and the presence of `assessment_check` (`app.js:11328–11351`) — no item-count, type or difficulty validation exists. Either accept prompt-level best effort or add a count check; **recommend accepting it in v1 and documenting it**, because count is the parameter users will most notice being disobeyed. Flagged as **Q4**.

**Conditionality:** assessment controls appear only when the workflow's topology contains assessment capability, detected from the existing step set (a step matching `isWorkflowStepGenerateAssessmentItems` / `isWorkflowStepDesignAssessment`). Adjustments never adds or removes those steps — topology remains a Create concern (T-006 §6.5).

---

## 11. Per-step Additional Instruction contract

**One generic mechanism. No per-stage implementation paths.**

**Storage:** `step.additional_instruction` (new field, §5).

**Ingress — two points, because of the GAM early return:**

| # | Function | Covers |
| --- | --- | --- |
| **I1** | `buildWorkflowStepInstructions` (`app.js:33394`) | Every step *except* GAM v2 — including DA, GAI and LS, because the injection sits in the surrounding `lines` scaffold (`33790`) which runs before the bespoke-builder ternary at `33810` |
| **I2** | `buildLiveGamV2CopyPromptViaCanonicalAssembler` (`app.js:33293`) | GAM v2 only, reached via the early return at `33424–33432` |

Both should call **one shared helper** so the block text and precedence framing are defined once.

**Injected form** — delimited, explicitly subordinate, placed after canonical requirements:

```
Author additional instruction for this step (optional steering, subordinate to all
requirements above). Apply it only where this step has discretion. If it conflicts
with the output contract, schema, upstream artefacts, or the workflow parameters
above, follow those and ignore the conflicting part of this instruction.

<author text>
```

**Contract, per T-006 §7 — the instruction:** is optional; is scoped to exactly one step; is persisted with the workflow; is model-visible when that step runs; requires **no** separate AI call; may influence discretionary decisions; **may not** override required schemas or validators, contradict explicit typed parameters, rewrite fixed topology or capability, or displace authoritative upstream artefacts.

**Relabelling:** the existing "Instructions" textarea (`32442`, placeholder "Guidance for running this step") and the prompt label "How to use inputs for this step (from the workflow designer)" (`33792`) both need to change so designer-notes and author-steering are not conflated.

---

## 12. Model-driven step detection

**There is no `step.type` discriminator.** No `type`, `kind`, `stage`, `engine` or `deterministic` property exists on a step (constructed shape at `app.js:35400–35417`; backfill at `22097` adds none). The pack's `### Type` lines are documentation — never parsed.

**Recommended derivation — use what the architecture already knows:**

1. Exclude `isWorkflowStepDesignEpisodePlanRow(step)` under v2 — deterministic derive.
2. Include if `getStepPromptSourceType(step) !== "none"`, **or** the step matches one of the bespoke v2 builders (`33810–33819`) or the GAM canonical path (`33424`).
3. Equivalent existing predicate: `isWorkflowStepRunnablePromptConfiguration` (`31488`).

No manual allowlist. The one explicit exclusion is Episode Plan, which is principled rather than arbitrary:

```33450:33452:app.js
        lines.push(
          "Deterministic step (Sprint 56F): PRISM derives the vNext page shell (schema_version 2.0.0) from upstream learning_outcomes. Do NOT invent episode plans with an LLM. …"
        );
```

**Expected LD step set:**

| Step | Model-driven | Field? |
| --- | --- | --- |
| Normalize Content | Yes | Yes |
| Generate Learning Content | Yes | Yes |
| **Model Knowledge** | **Yes** | **Yes** |
| Define Learning Outcomes | Yes | Yes |
| Design Learning Activities (DLA) | Yes | Yes |
| Generate Activity Materials (GAM) | Yes (canonical assembler) | Yes — needs ingress **I2** |
| Design Assessment (DA) | Yes (bespoke brief) | Yes |
| Design Feedback | Yes | Yes |
| Generate Assessment Items (GAI) | Yes (bespoke prompt) | Yes |
| Construct Learning Sequence (LS) | Yes (bespoke brief) | Yes |
| **Design Episode Plan (EP)** | **No — deterministic derive** | **No** |
| Design Page (DP) | Yes | Yes |
| Generate Slide Deck / VLE Structure / Learning Object Set | Yes | Yes |
| Validate Learning Design | Yes | Yes |
| Revise Assessment Based on QA | Yes | Yes |
| Design Marking Rubric | Yes | Yes |

**Model Knowledge specifically:** model-driven, carries a full `promptTemplate` (`step-patterns.md:2338`), recognised as `knowledge_model` (`app.js:13326–13332`), strict-JSON validated (`13392`), and consumed by Learning Outcomes via the **generic** upstream-capture embedding (`33762–33768`) under the pack's declared dependency `"Define Learning Outcomes": { "requires": ["knowledge_model"] }` (`step-patterns.md:78`) — not a bespoke path. It falls through to the ordinary augmented prompt route at `33820`, so it needs no special handling. It is a strong candidate for the guidance examples, since it shapes the conceptual foundation everything downstream inherits.

**Note:** PEL is not a workflow step — it is a prompt augmentation applied inside the chain (`applyPedagogicEnrichmentContractScaffoldToDraft`, `16015`). It gets no field.

---

## 13. Stage-specific guidance model

Same generic mechanism; per-step **help text only**, sourced from a small static map keyed by canonical step id, rendered into the existing `description` slot the control shape already supports (`app.js:2357–2372`).

| Step | Guidance (draft, not final copy) |
| --- | --- |
| Model Knowledge | Concepts to foreground, distinctions to draw, knowledge emphasis |
| Define Learning Outcomes | Learning ambition and outcome emphasis |
| Design Learning Activities | Activity character and emphasis |
| Design Episode Plan | *(no field)* |
| Construct Learning Sequence | Pacing emphasis within the available time |
| Design Page | Synthesis and visual priorities |
| Design Assessment / GAI | Assessment character within supported capability |

Each entry ends with a consistent qualifier such as "PRISM's output contract and your workflow parameters take precedence" so guidance never implies override power. If a step has no entry, show the generic label — never a fabricated hint.

---

## 14. Runtime chokepoint design

```
                      resolveEffectiveRunContext(wf)          ← single resolver, deterministic
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        ▼                          ▼                          ▼
  P1 workflowContext         P2 stepScoped            P3 additionalInstruction
  buildWorkflowRuntime-      shared projection         shared helper
  ContextText (33117)        helper                    (delimited block)
        │                          │                          │
        └──────────┬───────────────┴──────────────┬───────────┘
                   ▼                              ▼
      I1 buildWorkflowStepInstructions   I2 buildLiveGamV2CopyPrompt-
         (33394) — all steps                ViaCanonicalAssembler (33293)
                   │                              │
                   └──────────────┬───────────────┘
                                  ▼
                   fillTemplateVariables (32044) → clipboard (32063)
                                  ▼
                        external Copilot → capture → existing validators
```

**Two ingress points. Three projections. One resolver.**

Explicitly **not** used: `applyWorkflowStepRuntimePromptAugmentations` (`15990`) — see §1.1; `[PRISM_STEP_PARAMS]` and `selectedOptions` / `{{option:}}` — dead and Create-time respectively; `buildPromptFactoryWorkflowContextText` (`34329`) — Studio-only and behind an unreachable guard.

---

## 15. Canonical DLA / GAM safety analysis

**Non-negotiable: no new normative authority inside canonical DLA or GAM.**

| Concern | Design response |
| --- | --- |
| Historical Settings ingress | Stays closed. `NEUTRAL_POLICY_INGRESS` in `lib/gam-canonical-assembler.js` is untouched |
| Additional Instruction reaching GAM | Permitted, but only via **I2** as a delimited subordinate block appended **after** the canonical contract — never merged into or ahead of canonical sections |
| Additional Instruction reaching DLA | Same, via **I1**. The canonical contract assembly in `lib/ld-dla-page-enrich-contract.js` is not restructured |
| Duration reaching DLA | Only as a **target band** through the D1 repair, replacing a hardcoded literal with a derived one. This *reduces* independent interpretation |
| Pedagogy | Unchanged. No retune of DLA/GAM/PEL reasoning in T-007 |
| Defect D2 (cognition bypass, `15996–16001`) | Recorded, scheduled separately. **Not** fixed as part of Adjustments — fixing it would change DLA prompt content, which must not be entangled with a parameter feature |

Ordering rule inside both ingress points: canonical contract → upstream artefacts → workflow parameters → author instruction. The instruction is always last and always framed as subordinate.

---

## 16. Save / Apply / staleness lifecycle

**Simplest honest model. No reactive dependency graph.**

- **Save** = persist `wf.adjustments` and `step.additional_instruction`. Purely persistence; no regeneration, matching current behaviour (`handleSaveWorkflow`, `32785`).
- **No separate Apply button.** Because Run is copy-per-step, the next Copy of any step naturally picks up current values. An Apply button would imply a batch operation that does not exist.
- **Effect timing:** immediate for any step copied after the change. Already-captured outputs are unaffected — they are stored artefacts.
- **Staleness:** advisory only. Existing captures were produced under previous values; a lightweight marker ("parameters changed since this step was captured") is sufficient and honest. **Do not** build invalidation or auto-rerun. Deferred to a later slice — a v1 without it is still truthful provided the UI does not claim artefacts updated.
- **Studio:** no rebake semantics needed. Adjustments never writes prompt bodies, which is precisely why this stays simple.
- **Duplicate / export:** structural JSON copy carries both new fields automatically once added to the gather functions (§5.5).

---

## 17. Legacy boundary table

**Rule: repair legacy behaviour now only where it directly blocks a selected v1 contract.**

| Legacy item | Blocks v1? | Action now | Action later |
| --- | --- | --- | --- |
| Historical 41-control Settings catalogue | **No** | Leave in place; new registry renders alongside | Hide/remove (slice S8) |
| `[PRISM_STEP_PARAMS]` | **No** | No new writes; not read by Adjustments | Quarantine/remove — separate debt |
| Dead step-param prompt projection | **No** | Not used | Remove with catalogue |
| `selectedOptions = []` (`app.js:5373`) | **No** — §10b routes around it | Leave | Decide fate with the catalogue |
| **Hardcoded DLA duration (D1)** | **YES — blocks Duration** | **Repair in slice S5** (2 call sites, 1 optional param) | — |
| DLA cognition bypass (D2) | **No** | Record only | Separate authorised task |
| **LS step-param never reaches model (D3, new)** | **No** — §10b/§8 route around it | Record | Retire with step params |
| Undeclared topology factors | **No** | Untouched; topology is a Create concern | Debt register |
| Conflicting audience/level enums | **No** — deferred by §9 | Avoid by shipping free text | Canonical vocabulary task |
| Three difficulty vocabularies | **Partially — Q3** | Choose one for the v1 mapping | Full consolidation |
| Stale Settings summary cue (`3503–3513`, `3724–3764`) | **No**, but actively misleading | Suppress for retired controls in S8 | — |
| Count badge (`3001`, `3045–3054`) | **No** | Remove in S4 (§3) | — |
| `syncUnifiedWorkflowSettingsToStepNotes` DOM coupling | **YES for the new panel** | New panel writes to the model directly (§3) | Remove function with catalogue |
| `collectIncludedWorkflowStepRows` skipping non-canonical steps (`2944`) | **YES for step fields** | Enumerate `workflow.steps` directly | — |
| Var-hoisting bug in topology block (T-005B.2) | **No** | Record | Debt register |

---

## 18. Proposed implementation slices

Reordered from the operator's outline on the evidence: **Additional Instruction moves earlier** (its route already exists and is nearly free), and **Duration moves after Topic** (it needs the D1 repair; Topic needs nothing).

| Slice | Behaviour introduced | Production files | Tests | Prerequisites | Rollback boundary |
| --- | --- | --- | --- | --- | --- |
| **S1** Parameter registry + persistence contract | Declarative registry; `wf.adjustments` read/write; resolver skeleton with no consumers | `app.js` (new registry + resolver; `gatherWorkflowDetailFormData` `32571`) | Unit: declaration validation, resolver precedence, absence = Auto | — | Pure addition; unused until S2 |
| **S2** Topic vertical proof | Topic parameter overrides effective goal at resolution; emitted via `buildWorkflowRuntimeContextText`; `topic:` clause in `constraints` reconciled | `app.js` (`33117`, `normalizeWorkflowOutputSpec` resolution) | **Behavioural:** two Runs of one workflow, different Topic, assert emitted prompt text differs; assert no `fetch` occurs | S1; **Q1** | Feature-flaggable; absent parameter = today's behaviour |
| **S3** Additional Instruction | `step.additional_instruction`; shared delimited-block helper; injected at I1 and I2; step gather updated | `app.js` (`33394`, `33293`, `32664–32710`, `32442`) | Instruction on MK appears only in MK prompt; EP exposes none; precedence framing present; empty = byte-identical prompt | — (independent of S1) | Absent field = today's behaviour |
| **S4** Adjustments UI repurpose | Panel retitled; two regions; registry-driven controls; `textarea` control type; count badge removed; model-direct writes | `index.html` (`1084–1133`), `app.js` (`3181`, `3398`, `2927`) | Render tests; only model-driven steps get fields; no DOM-coupling regression | S1, S3 | UI-only; data contracts already proven |
| **S5** D1 repair + Duration | `buildDlaWorkbookOverlayBlock(opts)`; duration threaded at one call site; Duration parameter | `lib/ld-dla-page-enrich-contract.js` (`471–495`), `app.js` (`10338`) | Default reproduces current strings **byte-for-byte** (4 existing tests unchanged); 30 min → overlay says 30 and band 25–35 | S1 | Optional param defaulting to 60 |
| **S6** Audience (free text) | Audience parameter fills the existing empty `Audience:` slot; `"Learners"` fallback replaced when set | `app.js` (`33125`, `11638`) | Set audience appears; unset = today's behaviour | S1, S4 | Trivial |
| **S7** Assessment minimal set | Conditional group; three parameters projected as prompt text (§10b); capability detection | `app.js` (`33394` projection, capability predicate) | Non-assessment workflow exposes none; each parameter changes GAI prompt text; validators unchanged | S1, S4; **Q3**, **Q4** | Conditional group hidden by default |
| **S8** Retire superseded controls | Legacy catalogue controls and misleading summary cue hidden | `app.js` (`3503–3513`, `3724–3764`, pack control sourcing) | No inert control renders as an Adjustment | S4 | Hide before delete |
| **S9** Architecture acceptance tests | The §21 suite, including the second-parameter extension proof | `tests/` | — | S2, S3, S7 | Test-only |
| **S10** Closure + documentation | Record actual architecture; update debt register with D2, D3 and deferrals | docs | — | All | Docs-only |

**Extensibility checkpoint:** after S6, adding a further simple parameter must require only a registry declaration plus a test. If it does not, stop and revise before S7.

---

## 19. Slice risk matrix

| Slice | Risk | Principal concern |
| --- | --- | --- |
| S1 Registry / persistence | **LOW** | Additive; no consumers. Watch: new fields must reach the gather functions or values silently vanish on save |
| S2 Topic | **MEDIUM** | Overriding at resolution touches a value read by ~15 gating sites; a mistake could flip delivery-mode or page-profile detection. Mitigate with a snapshot test over gating outcomes for an unchanged workflow |
| S3 Additional Instruction | **LOW–MEDIUM** | Route already live. Risk is prompt precedence — an over-assertive instruction. Mitigate with the subordinate framing and leak tests. Two ingress points must not drift; enforce one shared helper |
| S4 UI repurpose | **MEDIUM** | Replacing `syncUnifiedWorkflowSettingsToStepNotes` removes a silent-failure DOM coupling — a net improvement, but the write path changes for every control |
| S5 D1 + Duration | **MEDIUM–HIGH** | Touches canonical DLA contract text. Highest integrity risk in the plan. Strictly bounded by the byte-identical default and the 4 existing tests |
| S6 Audience | **LOW** | Fills an empty slot; no vocabulary commitment |
| S7 Assessment | **MEDIUM** | Three unresolved vocabulary/enforcement questions; prompt-level only, no validator enforcement. Must not overclaim in UI copy |
| S8 Retire controls | **LOW–MEDIUM** | Hiding is safe; deleting risks unknown readers. Hide first, delete later |
| S9 Tests | **LOW** | Test-only |
| S10 Closure | **LOW** | Docs-only |

**Cross-cutting risks:**

| Risk | Mitigation |
| --- | --- |
| Old Settings plumbing leaking back | §10b explicitly refuses to revive `selectedOptions`; no `[PRISM_STEP_PARAMS]` writes; acceptance test 9 |
| Accidental dependence on elicitation AI | Acceptance test 2 asserts no `fetch` during parameter edit or Run |
| Studio vs Run divergence | Adjustments never writes prompt bodies, so Studio is structurally unaffected |
| Stale artefacts misrepresented | §16 advisory marker; UI must not claim artefacts updated |
| Canonical DLA/GAM integrity | §15 ordering rule; S5 byte-identical default; D2 excluded |
| Topology drift | Parameters cannot add or remove steps; acceptance test 7 |

---

## 20. Alpha-oriented minimum

**Minimum coherent step change: S1 + S2 + S3 + S4.**

That delivers a genuinely reusable workflow (change Topic, Run again, no regeneration), a generic steering mechanism on every model-driven step, an honest UI, and an architecture proven to extend. It touches no canonical contract text and carries no HIGH-risk slice.

**Add S5 (Duration) if canonical DLA work is acceptable in the same sprint** — it is the most valuable second parameter and the one that best proves the registry generalises beyond free text.

**Safely deferred:** Audience enum (§9), assessment parameters (S7), legacy control removal (S8, hiding is enough), staleness markers (§16), D2, D3, the `<= 30 minutes` and `>= 45` literals, and the T-005B.2 var-hoisting bug.

---

## 21. Architecture acceptance tests

Implementing the T-007 §19 list, with the specific assertions that make each meaningful:

| # | Test | Assertion |
| --- | --- | --- |
| 1 | Topic changes live Run context | Same workflow, two Topic values → assembled step-1 prompt text differs and contains the new topic; no prompt body mutated |
| 2 | No AI needed for a parameter change | No `fetch` during edit, save or Copy; passes with `state.apiKey` empty |
| 3 | MK instruction is scoped | Instruction on MK appears in MK's prompt |
| 4 | EP instruction is scoped | Instruction on EP (or DP) appears only there |
| 5 | No cross-step leak | Instruction on one step appears in no other step's prompt; unset steps byte-identical to baseline |
| 6 | Precedence retained | Canonical/schema text present and ordered before the instruction block; subordinate framing present; validators unchanged by a contradictory instruction |
| 7 | Assessment conditionality | Workflow without assessment steps exposes no assessment parameters |
| 8 | **Extension proof** | Adding a second simple typed parameter requires only a registry declaration — assert no new projection code path and no prompt-file edits |
| 9 | No inert controls presented | No retired Settings control renders as an effective Adjustment |
| 10 | Green when unset | Full existing suite passes with no Adjustments set; assembled prompts byte-identical to pre-change baseline |

Test 10 is the safety net for the whole plan; test 8 is the anti-spaghetti guarantee.

---

## 22. Explicit deferrals

| Deferred | Why |
| --- | --- |
| Learner-level enum | Three conflicting vocabularies; needs its own product decision (§9) |
| Difficulty vocabulary consolidation | Choose one mapping for v1; full consolidation later (**Q3**) |
| Assessment item-count validation | Prompt-level in v1; enforcement is a decision (**Q4**) |
| `matching` question type | Not supported at any layer; genuine new work |
| Short-answer / essay renderer polish | Functional but generic today |
| Defect D2 (cognition bypass) | Would change DLA prompts; must not entangle with a parameter feature |
| Defect D3 (LS step param dead) | Routed around by design |
| `[PRISM_STEP_PARAMS]` removal | No new authority is enough for v1 |
| Legacy control deletion | Hiding suffices |
| Staleness markers / invalidation | Advisory only; no dependency graph |
| Duration literals in LO template and inference thresholds | Recorded as debt |
| Per-run parameter history / provenance UI | Resolver exposes provenance; no UI in v1 |

**Operator questions requiring answers before the affected slice:**

- **Q1 (S2):** Topic emitted on first step only (7a, recommended) or every step (7b)?
- **Q2 (S6):** Accept free-text-only Audience for v1?
- **Q3 (S7):** Which difficulty vocabulary is canonical?
- **Q4 (S7):** Accept prompt-level item count without validator enforcement?

---

## 23. Files / code / tests inspected

**`app.js`** — Settings UI shell (`1084`-linked handlers, `2288–2293`, `2295–2411`, `2413–2573`, `2927–3054`, `3079`, `3121–3171`, `3181–3262`, `3265–3333`, `3353–3468`, `3503–3513`, `3666–3764`, `26898–26973`, `54111–54115`); prompt seeding (`5234–5257`, `5259–5428`, `5596–5650`, `5689–5756`, `5872–5892`, `6104`); cognition/brief resolution (`8205–8261`, `8219`, `8292–8338`); DLA canonical slot (`10298–10360`, `10334–10339`); partial-page gating (`10279–10284`, `10442–10446`); page shell (`11638`, `11999`, `12083`, `13117`, `10489–10501`); GAI contract + validation (`11127–11149`, `11328–11353`); step kinds (`13326–13392`); augmentation chain (`15919–15957`, `15990–16027`, `16031–16042`); brief inference (`18900–19012`, `18917–18938`, `19373–19381`, `20159–20191`); model calls (`20450`, `20578`, `27577`, `27780–27900`, `28439`); design base/brief (`21262`, `21308–21309`); catalogue backfill (`22097–22124`); topology (`22763–22799`, `24019–24084`); prompt resolution (`31309–31314`, `31386–31396`, `31410–31492`); Run copy path (`31842–32079`, `32021–32064`); step DOM/gather (`32437–32465`, `32571`, `32638`, `32664–32710`, `32785–32878`); prompt assembly (`33083–33141`, `33112–33115`, `33232–33286`, `33293`, `33394–33432`, `33762–33830`); Studio context (`34329–34386`); workflow normalisation and generation (`34548–34558`, `35199–35239`, `35327–35532`, `35400–35471`); template API (`54338–54339`).

**`index.html`** — `830–859`, `1005`, `1084–1133`.

**`lib/`** — `ld-dla-page-enrich-contract.js` (`370–373`, `471–495`, `511`); `ld-gai-page-enrich-contract.js` (`38`, `68`); `gam-canonical-assembler.js`; `workflow-artefact-json-strict.js` (`26`, `146–148`, `506`); `page-vnext-assemble.js` (`76–139`, `447–448`); `learner-renderer-vnext/build-page-model.js` (`185–191`); `learner-renderer-vnext/project-timeline-durations.js` (`4–14`); `learner-renderer-vnext/normalize-ordering.js`; `learner-renderer-vnext-browser.js` (`4780–4870`).

**`domains/learning-design/domain-learning-design-step-patterns.md`** — `78`, `87–88`, `146–153`, `219–240`, `282–328`, `435–441`, `726–727`, `977–987`, `1039–1075`, `1517–1574`, `2174–3600` (step patterns), `2402`, `2723`, `2761`, `3024–3056`, `3102–3107`, `3191–3203`.

**Tests / fixtures** — `tests/ld-dla-canonical-assembler.test.js:260`; `tests/s78-t-041-culminating-transfer-production.test.js:214`; `tests/dla-phase-d-retirement.test.js:182,225`; `tests/s78-dla-diagnostic-review.test.js:107`; `tests/fixtures/educational-psychology-post-s68/workflow.json:3029`; `docs/development/sprints/2026-06-20-sprint-50-pedagogic-manifestation/marx_export/workflow-marxeduqselfstudy.json`.

---

## 24. Files changed

**This record only.** No production code, pack, prompt, schema or test changes.

- `S80-T-007-adjustments-target-architecture-and-implementation-plan.md` (new)

---

## 25. Sprint records updated

- `STATUS.md`, `SPRINT-80-START-HERE.md`, `PLAN.md`, `HANDOVER.md`, `next-chat-briefing.md`, `README.md`
- `decisions.md` — **S80-D07** (architecture plan; corrects D06's chokepoint recommendation)
- T-007 marked **PLAN — awaiting operator review**; no slice started

---

## 26. Acceptance assessment

All 27 required outputs delivered. Design is evidence-backed at function-and-line level throughout.

**Three material corrections to prior sprint conclusions**, each verified directly rather than accepted from a subagent:

1. **T-006 §17C named the wrong chokepoint.** `applyWorkflowStepRuntimePromptAugmentations` receives an always-empty option map, cannot see new step fields, is bypassed by DA/GAI/LS, and is never reached by GAM. Corrected to `buildWorkflowStepInstructions` + the GAM assembler.
2. **"GAI's prompt is voided" was wrong.** Only the *stored* body is voided; GAI receives the full live pack template plus contract and exemplar. This materially improves the assessment outlook — question format and per-item difficulty are already model-visible.
3. **The item-count death mechanism was misattributed** to `isAssessmentLeakLine`. The real cause is the unpopulated `selectedOptions` at `app.js:5373` — the same Create-time bake defect T-006 §1 cited, rediscovered independently, which confirms rather than contradicts the T-006 rationale.

**Two new defects recorded:** **D3** (LS duration step param never reaches the model) and confirmation that the D1 repair is genuinely two call sites.

**Not done, by instruction:** no production code, no slice started, no legacy cleanup, no Workspace Surfaces work.

**Four operator questions (Q1–Q4)** block specific slices, not the plan as a whole. S1–S4 — the Alpha minimum — need only **Q1**.

---

## 27. Exact recommended next action

**Operator review of this plan, answering Q1–Q4** (Q1 alone unblocks the Alpha minimum).

On acceptance, authorise **slice S1 (parameter registry + persistence contract)** and **slice S3 (Additional Instruction)** — they are independent of each other, both LOW-risk, both purely additive, and together they de-risk everything after.

Recommended first authorisation if only one slice is wanted: **S3**, because its runtime route already exists and demonstrably works, so it delivers visible product value with the least architectural exposure.

**STOP — plan returned for operator review. No implementation. No slice started.**
