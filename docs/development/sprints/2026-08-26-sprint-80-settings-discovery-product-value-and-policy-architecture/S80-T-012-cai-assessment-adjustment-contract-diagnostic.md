# S80-T-012 — CAI Assessment Adjustment contract diagnostic

**Status:** COMPLETE — discovery only  
**Date:** 2026-08-28  
**Mode:** DISCOVERY ONLY — no implementation  
**Authority:** operator request after [S80-T-011](S80-T-011-design-assessment-topology-and-cai-relationship-diagnostic.md) ACCEPTED  
**Predecessors:** T-011 (CAI-first authority), [S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md) §10, T-005B.2 (dead `selectedOptions`), S80-S1…S7 (Adjustments registry / projection)

---

## Binding constraints (from T-011)

- Ordinary assessment-capable self-study/workshop workflows are **CAI-first**.
- Capability gate = Create/Generate Assessment Items (`step_generate_assessment_items`).
- Design Assessment is **not** a prerequisite.
- DA topology, D25, D26, D27 are **out of scope** for this diagnostic and for the next Assessment Adjustments slice unless separately authorised.
- Proposed product surface under investigation: **Quantity**, **Difficulty**, **Question Type**.

This diagnostic establishes the **exact truthful contracts** needed to implement those controls. It does **not** implement them.

---

## 1. Executive conclusion

**All three proposed controls already have declared CAI contracts, but none of them currently reach the live Run prompt as typed authority.**

Root cause (already proven in T-005B.2 / T-007): Create/Run seed path hardcodes `selectedOptions = []` (`app.js:5598`). Pack `userOptions` (`number_of_items`, `difficulty_profile`, `response_formats`) therefore never expand into `Generate exactly N…` / profile / format instruction lines. The live CAI V2 partial prompt still contains:

- full **per-type authoring rules** and the closed **per-item** `difficulty_level` vocabulary (`recall|comprehension|application|analysis`);
- the phrase “Respect configured response formats…” **without any configured values**;
- **no** “Generate exactly N”;
- **no** set-level difficulty profile line.

Quantity today reaches the model only if Goal (or other free prose) mentions a count. That is subordinate prose, not a typed contract.

**Smallest truthful v1:** **Quantity + Difficulty** (Option B), both projected via existing `workflowContext` like Topic/Duration/Audience, gated on CAI presence.

**Question Type** is deferred from the smallest set because only **two** of nine declared `response_formats` values are end-to-end first-class for the current interactive learner path (`single_answer_mcq`, `true_false`). Shipping the full nine-value enum would be untruthful; shipping a narrowed enum is a product decision that can follow immediately after Option B without architecture change.

Do **not** revive `selectedOptions`, `{{option:}}`, or `[PRISM_STEP_PARAMS]`. Do **not** invent Easy/Moderate/Challenging labels. Do **not** invent a range narrower than the declared **1–200** unless the operator explicitly accepts T-007’s honesty proposal of 1–50 as a *product* narrowing (not an existing contract).

---

## 2. Quantity authority map

| Field / seam | Role | Classification |
| ------------ | ---- | -------------- |
| `resolvedFactors.assessment_total_items` | Create brief factor; topology “assessment required” / item-count resolution; frozen in `workflowBriefResolution` | **LIVE AUTHORITY** for Create topology + best commissioned source; **DEAD** for live CAI prompt text |
| Brief elicitation `assessment_total_items` (min 1, max 200, default 10) | Create Q&A | **CREATE-ONLY** (feeds resolvedFactors) |
| CAI step param / PF `number_of_items` (min 1, max 200, default 10; template `Generate exactly {{value}} assessment items.`) | Declared CAI-facing quantity | **LIVE ALIAS/MAPPING** at Create (mapped from brief / DA `total_items`); **DEAD** at Run prompt (empty `selectedOptions`) |
| `mappedBindings.stepParamPatch.step_generate_assessment_items.number_of_items` | Create bake patch | **CREATE-ONLY** / frozen copy; not late-bound at Run |
| DA `total_items` | Design Assessment param; maps → CAI `number_of_items` when DA present | **OUT OF SCOPE** for v1 Adjustments (T-011); historical twin only |
| `assessment_item_count` / `question_count` / bare `item_count` | Searched | **DEAD / absent** as live CAI quantity authorities in current LD path |
| Goal / Additional Instruction prose mentioning a count | Model-visible free text | **LIVE** but **subordinate**; not typed Quantity |
| `normalizeAssessmentItemCount` | Coerces positive integers; **no upper clamp** | Helper only — does not enforce pack max 200 |
| `validateGenerateAssessmentItemsPartialPageCapture` | Envelope + `assessment_check` presence | **Does not enforce count** |

### Twin / multiple count fields (explained)

1. **Brief twin:** `assessment_total_items` — author-facing Create factor.
2. **CAI twin:** `number_of_items` — CAI step/PF parameter, intended to expand to “Generate exactly N…”.
3. **DA twin:** `total_items` — DA blueprint count; maps into CAI via Create inheritance when DA exists.

Create maps (1)→(2) (and DA (3)→(2) when DA runs). Run does **not** consume (2). So the product has three names for one idea, and the only name that is *supposed* to instruct CAI is currently inert at Run.

### Quantity contract answers

| Q | Answer |
| - | ------ |
| **A. Exact CAI-facing runtime field** | Declared: `number_of_items`. Live today: **none typed**. Projection should produce the existing template sense: `Generate exactly {{N}} assessment items.` (via `workflowContext` or a bounded CAI-owned line — see §16). |
| **B. Exact commissioned frozen source** | Prefer `workflowBriefResolution.resolvedFactors.assessment_total_items`. |
| **C. Existing supported numeric range** | Declared **1–200** (brief factor + CAI PF/userOptions + settings-only control). No second conflicting declared range. |
| **D. Default / Auto** | Declared default **10**. Adjustments Auto = absent adjustment → commissioned value (or default 10 when assessment capability exists but count is missing — legacy Create behaviour). |
| **E. Live prompt says “exactly N”?** | **No** (proven with catalog-backed `buildWorkflowStepInstructions` probe, 2026-08-28). |
| **F. Validator enforces N?** | **No** — model instruction only if projected. |
| **G. Smallest projection/repair** | Registry `number` + `resolveCommissioned` + project into existing authoritative parameters block (and/or one CAI-owned sentence using the pack template). No topology change. No validator change in v1 (accept prompt-level best effort; same as T-007 Q4). |

**Range conflict note:** T-007 recommended **1–50** as a product honesty narrowing. That is **not** an existing contract. Per this task’s rule (“do not invent a new range”), v1 should declare **1–200** unless the operator explicitly chooses to narrow. Soft code paths that clamp some Create inferences to 5 are special-case heuristics, not the Adjustments range.

---

## 3. Difficulty authority map

| Vocabulary | Exact values | Declaration | Live consumer | CAI-facing? |
| ---------- | ------------ | ----------- | ------------- | ----------- |
| **CAI set profile** | `foundational`, `balanced`, `higher_order` | Pack settings control + CAI `userOptions` (`domain-learning-design-step-patterns.md` ~1061–1075, ~3102–3110) | Intended via `{{option:}}` / selectedOptions — **dead at Run** | **CAI-facing (declared); currently inert at Run** |
| **Per-item cognitive level** | `recall`, `comprehension`, `application`, `analysis` | Live CAI pack prose + `lib/ld-gai-page-enrich-contract.js` | Live CAI prompt **always** (model must emit `difficulty_level` per item) | **CAI-facing, per-item — not a set Adjustment** |
| **Brief elicitation profile** | `foundation_heavy`, `balanced`, `higher_order_heavy` | Brief factor choices (~592–602) | Create → `resolvedFactors.difficulty_profile`; mapper to CAI profile exists | **CREATE / commissioned; maps to CAI profile** |
| **Elicitation question override prose** | “introductory, balanced, or challenging” | `buildWorkflowBriefQuestionText` (`app.js:20472–20473`) | Create Q&A wording only | **HISTORICAL / misleading UI copy** — does not match factor choices |
| **DA difficulty labels** | `introductory` / `moderate` / `advanced` (and profile aliases) | DA + `mapDesignAssessmentDifficultyToItemsDifficultyProfile` | Maps into CAI profile when DA present | **DA path; out of scope for v1 surface** |
| Easy / Moderate / Challenging as registry values | — | — | — | **Not a live CAI contract — do not invent** |

### Mapper already in product (use; do not reinvent)

`mapDesignAssessmentDifficultyToItemsDifficultyProfile` (`app.js:2252–2265`):

| Input | CAI profile |
| ----- | ----------- |
| `introductory`, `foundation_heavy`, `foundational` | `foundational` |
| `moderate`, `balanced` | `balanced` |
| `advanced`, `higher_order_heavy`, `higher_order` | `higher_order` |

---

## 4. Difficulty exact vocabulary (v1)

**Exact allowed values (CAI set profile):**

| value | Existing pack label |
| ----- | ------------------- |
| `foundational` | Foundational-heavy |
| `balanced` | Balanced |
| `higher_order` | Higher-order-heavy |

Do **not** relabel to Easy/Moderate/Challenging unless those strings map 1:1 to the values above (they do not, without inventing a new alias layer).

---

## 5. Difficulty semantic model

| Model | Supported? |
| ----- | ---------- |
| **A. One overall difficulty (set profile)** | **Yes** — declared CAI `difficulty_profile` (3-value). |
| **B. Difficulty profile / distribution counts** | Partially in DA blueprint (`difficulty_profile.item_counts` with recall/comprehension/…); **not** a simple Adjustments control; out of scope. |
| **C. Per-item difficulty** | **Yes** as artefact field `difficulty_level` (4-value); always required by live prompt; **not** a user Adjustment. |
| **D. Combination** | Live truth: set profile (when projected) **plus** per-item levels. User Adjustment should own **A only**. |

**Recommendation:** simple enum Adjustment → CAI set profile. Profile steers emphasis; model still emits per-item `difficulty_level`.

| Q | Answer |
| - | ------ |
| **A. Registry type** | `enum` |
| **B. Allowed values** | `foundational` \| `balanced` \| `higher_order` |
| **C. Commissioned frozen source** | `resolvedFactors.difficulty_profile` → map through existing mapper to CAI profile |
| **D. CAI projection target** | Authoritative parameter line / sentence equivalent to pack `promptInstruction` (“Use a … difficulty profile.”) |
| **E. Prerequisite repair** | None beyond projection. Do not revive selectedOptions. Optional later: fix elicitation question override copy (**D29**). |

---

## 6. Question-type inventory

Declared CAI `response_formats` values (9):

| value | Pack label |
| ----- | ---------- |
| `single_answer_mcq` | Single-answer MCQ |
| `multiple_answer_mcq` | Multiple-answer MCQ |
| `true_false` | True/false |
| `short_answer` | Short answer |
| `essay` | Essay |
| `single_mcq_and_true_false` | Single-answer MCQ + true/false |
| `objective_mix_all` | Objective mix (MCQ + true/false) |
| `constructed_mix` | Constructed mix (short answer + essay) |
| `all_formats_mix` | All supported formats |

**Not declared in CAI pack:** `matching`, generic “free text” (closest is `short_answer`).

Create also has brief `assessment_type` (mcq / short_answer / essay / …) which maps into `response_formats` via `mapDesignAssessmentActivityTypeToResponseFormats` (`app.js:2238–2248`) and forces MCQ → `single_answer_mcq` + `composition_mode: single_format` when type is mcq (`app.js:20443–20449`).

---

## 7. End-to-end support matrix

Probe + code inspection of CAI pack → `assessment_check.items[]` → `lib/learner-renderer-vnext/assessment-interactive.js` (+ runtime).

| value | CAI option | Live prompt authoring rules | Artefact fields | Interactive learner check | Answer / feedback path | Classification |
| ----- | ---------- | --------------------------- | --------------- | ------------------------- | ---------------------- | -------------- |
| `single_answer_mcq` | Yes | Yes | `stem`, `options`, `correct_answer` (+ rationale) | Yes (radio) | `correct_answer` / `correct_answer_text` + `explanation_or_rationale` | **FULLY_SUPPORTED** |
| `true_false` | Yes | Yes | `proposition`, `true_false_answer`, rationale | Yes (True/False radios) | `true_false_answer` + rationale | **FULLY_SUPPORTED** |
| `multiple_answer_mcq` | Yes | Yes | `correct_answers` (plural) | **No** — renderer is single-select radio; `resolveCorrectAnswer` reads **singular** only | Plural answers unused by interactive path | **MODEL_ONLY** (artefact can exist; first-class interactive path broken) |
| `short_answer` | Yes | Yes | `prompt`, `model_answer_guidance` | Explicitly non-interactive | Static feedback looks for `correct_answer`, not `model_answer_guidance` | **MODEL_ONLY** / weak static |
| `essay` | Yes | Yes | `marking_guidance`, `indicative_points`, … | Non-interactive | Marking guidance, not diagnostic correct/incorrect | **MODEL_ONLY** / tutor-facing |
| Mix values (4) | Yes | “mix from configured formats” | Depends on emitted `item_type` | Only if emitted items are MCQ/T-F | Same as atomic | **MODEL_ONLY** as a control (composition request, not a guaranteed single product behaviour) |
| `matching` | No | No | — | — | — | **DEAD** |
| free text | No | — | — | — | — | **DEAD** (use `short_answer` only if later promoted) |

Configured `response_formats` values themselves are **not** present in the live Run prompt today (same dead selectedOptions seam). Authoring rules for types **are** present as pack prose regardless.

---

## 8. Question-type semantic model

Declared `response_formats` is a **single select** whose values mean either:

- **exactly one atomic type for the set**, or
- **an allowed set / requested mixture** (the `*_mix` values).

Pack prose: “If multiple response formats are configured, generate a mix from only the configured formats…”. Combined with `composition_mode` (`single_format` | `mixed_set`).

| Model | Fit |
| ----- | --- |
| **A. Exactly one type for all questions** | Atomic values + default `composition_mode: single_format` |
| **B. Allowed set from which CAI may choose** | Mix enum values |
| **C. Requested mixture** | Mix values / `mixed_set` |
| **D. Per-item specification** | No Adjustments control; model emits `item_type` per item |
| **E. Something else** | — |

**v1 control shape if Question Type ships:** single **`enum`**, not multi-enum, not free text. Prefer atomic **FULLY_SUPPORTED** values only:

- `single_answer_mcq`
- `true_false`

Do **not** add a multi-select registry type merely to preserve mix representation. Mixes can wait.

---

## 9. Feedback compatibility

For FULLY_SUPPORTED types only:

| Type | Correct/expected | Rationale | Diagnostic / interactive feedback | Distractors |
| ---- | ---------------- | --------- | --------------------------------- | ----------- |
| `single_answer_mcq` | `correct_answer` (+ optional text) | `explanation_or_rationale` | Interactive check + static details | Options present; distractor-specific feedback **not** a separate structured contract (rationale is item-level) |
| `true_false` | `true_false_answer` | `explanation_or_rationale` | Interactive check + static details | N/A |

**Exclude from v1 Question Type** (feedback / interaction weakened):

- `multiple_answer_mcq` — interactive path does not honour `correct_answers`.
- `short_answer` / `essay` — no interactive diagnostic check; answer field names diverge from feedback resolver.
- Mix enums — can emit unsupported item types under an Adjustments “promise”.

Default Auto (no Question Type adjustment) remains coherent: pack default is `single_answer_mcq`, and Create often forces that for `assessment_type=mcq`.

---

## 10. Question-type commissioned source

| Priority | Source | Note |
| -------- | ------ | ---- |
| Preferred | `mappedBindings.stepParamPatch.step_generate_assessment_items.response_formats` if present in frozen Create state | Closest CAI vocabulary already baked at Create |
| Fallback | Map `resolvedFactors.assessment_type` via `mapDesignAssessmentActivityTypeToResponseFormats` | Brief twin, not CAI enum |
| Default | `single_answer_mcq` | Pack default |
| Legacy | Omit projection when unknown | Model follows pack defaults / Goal prose |

Do **not** treat mutable Studio option UI or live `prompt_bindings.selectedOptions` as commissioned.

---

## 11. Quantity / Difficulty / Question Type commissioned fallbacks (summary)

Apply Goal/Audience rule: prefer frozen commissioning state; do not promote mutable post-Create UI to “commissioned”.

| Parameter | Preferred | Justified fallback | Legacy | Provenance feasible? |
| --------- | --------- | ------------------ | ------ | -------------------- |
| Quantity | `resolvedFactors.assessment_total_items` | `stepParamPatch…number_of_items` | default `10` when CAI present and count absent | Yes — frozen brief resolution |
| Difficulty | `resolvedFactors.difficulty_profile` → mapper → CAI profile | `stepParamPatch…difficulty_profile` | default `balanced` | Yes — map at resolve time |
| Question Type | `stepParamPatch…response_formats` | map `assessment_type` | default `single_answer_mcq` | Yes, with mapper |

No new authority store. Persist overrides only under `workflow.adjustments.parameters.*` (existing S1 contract).

---

## 12. Existing mutable authorities

| Control | Can alter Q/D/T? | Save persists? | Run consumes as typed authority? | Implementation disposition |
| ------- | ---------------- | -------------- | -------------------------------- | -------------------------- |
| Adjustments panel | Not yet (undeclared) | N/A | N/A | Target home for v1 |
| Historical pack Settings catalogue | Would have edited CAI options | Storage code retained | **No** (S4 removed from active UI; selectedOptions dead at Run) | Leave inert; do not re-expose |
| Studio step prompt-config / option UI for GAI | Can write option rows / bindings in Studio paths | May persist on step | **No** for Run seed (`selectedOptions = []`) | Ignore for Run authority; do not revive |
| `step.prompt_bindings.selectedOptions` | Historical bake target | Sometimes present on saved steps | **No** at Run | Do not treat as Adjustments source |
| `#workflowGoal` / Goal Adjustments | Can mention counts/types in prose | Yes (governed Goal) | Prose only — subordinate | Keep; typed params must outrank |
| Per-step Additional Instruction | Free-text steering | Yes | Subordinate | Keep; typed params must outrank |
| DA Studio params | Quantity/difficulty/type on DA path | Yes when DA present | Out of scope; does not gate CAI Adjustments | Do not make DA editable from Assessment Adjustments |

Nothing must be “fixed” now; the implementation slice must **not** reintroduce competing live authorities.

---

## 13. CAI capability resolver

Exact deterministic gate (fail closed):

```text
capability id: "generate_assessment_items"   // or "assessment_items" — pick one string and register it

ADJUSTMENTS_CAPABILITY_RESOLVERS[capability] = function (wf) {
  var steps = (wf && Array.isArray(wf.steps)) ? wf.steps : [];
  return steps.some(function (step) {
    return isWorkflowStepGenerateAssessmentItemsRow(step);
    // prefers canonical_step_id === "step_generate_assessment_items";
    // title fallback already inside isWorkflowStepGenerateAssessmentItems
  });
};
```

Registry declarations:

```js
applicability: { requiresCapability: "generate_assessment_items" }
```

`isAdjustmentsParameterApplicable` already fail-closes when the resolver is missing or returns false (`app.js:35525–35534`).

**Must:**

- show assessment parameters when saved workflow contains CAI/GAI;
- hide otherwise;
- require **no** Goal keyword scan, **no** AI, **no** topology regeneration;
- **not** require Design Assessment.

Fits existing `applicability.requiresCapability` contract; registry comment that “assessment arrives with S7” is stale (Audience was S7).

---

## 14. Precedence analysis

Required principle:

> hard schemas/contracts > typed workflow parameters > Goal > Additional Instruction > stage discretion

| Conflict | Expected outcome |
| -------- | ---------------- |
| Quantity = 10; Goal “Create 20 questions.”; CAI Additional Instruction “Only create five.” | Typed Quantity **10** authoritative; Goal/AI ignored where they conflict |
| Difficulty = `higher_order`; Additional Instruction “make it easier” | Typed profile authoritative |
| Question Type = `true_false`; Additional Instruction “use essays” | Typed type authoritative |

**Is shared `workflowContext` sufficient?**

**Mostly yes** for Quantity and Difficulty, if projected into the *authoritative parameters* section (same structural precedence as Audience over Goal — S7 pattern).

**Bounded CAI-owned projection** is recommended **only if** product insists on the pack’s exact imperative wording (“Generate exactly N assessment items.” / “Allow … items only.”) and a generic `Quantity: 10` / `Difficulty: balanced` line is judged too weak against long pack prose that already says “Respect configured response formats” without values. That is an implementation detail, not a new store:

- either strengthen the shared projector labels/sentences for these ids, or
- append a short CAI-only appendix after the shared block inside the existing CAI prompt assembly path — **without** editing the large pack template body and **without** selectedOptions revival.

Do **not** implement in this diagnostic.

---

## 15. Runtime safety

For Quantity, Difficulty, and (if shipped) Question Type, changing the adjustment:

| Safety property | Holds? |
| --------------- | ------ |
| Does not add/remove workflow steps | **Yes** — registry applicability reads topology; does not rewrite it |
| Does not rerun elicitation | **Yes** — S1/S5 pattern |
| Does not mutate `resolvedFactors` | **Yes** — commissioned resolver is read-only |
| Does not call AI | **Yes** — copy-to-clipboard / prompt assembly only |
| Does not revive `PRISM_STEP_PARAMS` | **Yes** if projection stays on Adjustments path |
| Does not require workflow regeneration | **Yes** |
| Does not alter assessment capability | **Yes** — capability is step presence |

---

## 16. Options A–E assessment

| Option | Usefulness | Truthfulness | Cost | Renderer | Feedback | Authority clarity |
| ------ | ---------- | ------------ | ---- | -------- | -------- | ----------------- |
| **A. Quantity only** | High (most noticed) | High if projected | Lowest | N/A | N/A | Clear |
| **B. Quantity + Difficulty** | High | High (3-value CAI profile is real) | Low | N/A | N/A | Clear |
| **C. All three (full 9-value QT)** | High on paper | **Low** — mixes / multi / constructed overclaim | Medium | Weak for most values | Weak for most values | Muddy |
| **C′. All three (QT narrowed to MCQ + T/F)** | High | High | Medium | Good | Good | Clear |
| **D. Quantity + Question Type (narrow)** | Medium–high | High if narrowed | Medium | Good | Good | Clear; misses profile |
| **E. Difficulty only** | Low–medium | High | Low | N/A | N/A | Clear but incomplete |

---

## 17. Smallest truthful v1 recommendation

**Ship Option B: Quantity + Difficulty.**

Rationale:

- Both have exact CAI contracts and commissioned sources.
- Both are currently inert at Run for the same root cause — one projection pattern fixes both.
- Question Type needs an explicit product choice (full nine vs narrowed two). Default Auto already tends toward `single_answer_mcq` for ordinary MCQ briefs, so deferring QT does not unblock ordinary formative self-study.
- “We can add more later” applies: C′ is the natural second increment.

**If the operator insists all three names from T-011 ship together**, authorise **C′** (narrow QT), not full C.

---

## 18. Exact registry declarations proposed (Option B)

```js
{
  id: "assessment_item_count",           // or "number_of_items" — prefer CAI name if operator wants identity with pack
  label: "Number of items",
  type: "number",
  min: 1,
  max: 200,
  owner: "workflow_run_context",
  projection: "workflowContext",
  applicability: { requiresCapability: "generate_assessment_items" },
  resolveCommissioned: resolveCommissionedAssessmentItemCount
},
{
  id: "assessment_difficulty_profile",   // or "difficulty_profile" if namespaced carefully
  label: "Difficulty",
  type: "enum",
  options: [
    { value: "foundational", label: "Foundational-heavy" },
    { value: "balanced", label: "Balanced" },
    { value: "higher_order", label: "Higher-order-heavy" }
  ],
  owner: "workflow_run_context",
  projection: "workflowContext",
  applicability: { requiresCapability: "generate_assessment_items" },
  resolveCommissioned: resolveCommissionedAssessmentDifficultyProfile
}
```

Optional C′ addition:

```js
{
  id: "assessment_response_format",
  label: "Question type",
  type: "enum",
  options: [
    { value: "single_answer_mcq", label: "Single-answer MCQ" },
    { value: "true_false", label: "True/false" }
  ],
  owner: "workflow_run_context",
  projection: "workflowContext",
  applicability: { requiresCapability: "generate_assessment_items" },
  resolveCommissioned: resolveCommissionedAssessmentResponseFormat
}
```

Ids should be unique in the Adjustments allowlist; prefer prefixed ids if bare `difficulty_profile` risks confusion with brief/DA stores.

---

## 19. Expected implementation touch points

Healthy shape:

1. Registry declarations (+ capability resolver registration).
2. `resolveCommissioned*` readers (frozen brief / mappedBindings only).
3. Existing declarative Adjustments UI (no new control kinds).
4. Shared `workflowContext` projection (possibly with CAI-specific sentence templates for Quantity/format).
5. Tests (see §20).

**Flag / avoid:**

| Risk | Verdict |
| ---- | ------- |
| Broad prompt-builder edits | Avoid — shared projector only; optional minimal CAI appendix |
| `selectedOptions` revival | **Forbidden** |
| `PRISM_STEP_PARAMS` revival | **Forbidden** |
| Topology redesign | **Out of scope** |
| DA repair (D25–D27) | **Out of scope** |
| Renderer redesign | Not required for Option B; required before promoting multi-select / short answer |
| New AI interpretation | **Forbidden** |

---

## 20. Required implementation tests

Minimum vertical proofs:

1. Commissioned Quantity/Difficulty → Auto run → projected values match commissioned (and prompt contains them).
2. Adjusted Quantity/Difficulty → CAI prompt/output contract text changes accordingly; no topology delta.
3. Clear adjustment → commissioned behaviour restored.
4. Workflow without CAI step → controls absent (fail closed).
5. Workflow with CAI → controls present.
6. Quantity + Difficulty composed → no authority conflict in projected block.
7. Goal / Additional Instruction contradict typed values → typed values remain authoritative in prompt ordering/wording.
8. Persistence: save / load / duplicate / export preserve adjustments.
9. No `resolvedFactors` mutation; zero fetch/AI on Adjustments edit.
10. Legacy workflow without brief resolution → safe fallback / no throw.
11. (If C′) Question Type narrowed enum only; mix/multi/essay values rejected by validator.

---

## 21. Defects discovered

| ID | Summary | Severity |
| -- | ------- | -------- |
| **D28** | CAI pack `userOptions` (`number_of_items`, `difficulty_profile`, `response_formats`, …) never reach live Run prompts because seed/bake sets `selectedOptions = []` (`app.js:5598`). Declared “exactly N” / profile / format instructions are inert. | **HIGH** for Assessment Adjustments (this is the gap the slice closes via projection, not via selectedOptions revival) |
| **D29** | Create elicitation question override asks difficulty as “introductory, balanced, or challenging” while factor choices are `foundation_heavy\|balanced\|higher_order_heavy` (`app.js:20472` vs pack ~598–601). | LOW–MEDIUM (Create honesty) |
| **D30** | `multiple_answer_mcq` is model-authorable but learner interactive path is single-select radio and resolves only singular `correct_answer` — not `correct_answers`. | MEDIUM (blocks truthful QT enum expansion) |
| **D31** | `normalizeAssessmentItemCount` does not enforce the declared max 200 (positive integers only). | LOW |

D25–D27 remain open from T-011; unchanged and out of scope here.

---

## 22. Product decisions required

1. Accept **Option B** (Quantity + Difficulty) as Assessment Adjustments v1, or insist on **C′** (add narrowed Question Type) in the same slice.
2. Confirm Quantity range **1–200** (existing declaration) vs operator-authorised narrowing to **1–50** (T-007 honesty proposal — not an existing contract).
3. Confirm Difficulty labels use pack vocabulary (Foundational-heavy / Balanced / Higher-order-heavy), not Easy/Moderate/Challenging.
4. Confirm parameter ids (`assessment_item_count` vs `number_of_items`, etc.).
5. Confirm whether Quantity must use the exact pack sentence “Generate exactly N…” (bounded CAI projection) or a generic authoritative parameter line is enough.

---

## 23. Debt identified

- D28–D31 (above).
- Stale registry comment: “assessment capability arrives with S7” (`app.js:35401–35402`) — Audience took S7; Assessment is still unstarted.
- T-007 §10 still recommends shipping all three with the full 9-value format enum — **superseded as product guidance by this diagnostic’s end-to-end matrix**; architecture recommendation 10b (project as prompt text; do not revive selectedOptions) **remains authoritative**.

---

## 24. Files inspected

- `app.js` — quantity helpers, mappers, CAI detection, GAI validator, Adjustments registry/applicability, selectedOptions seed, elicitation overrides, MCQ force path
- `domains/learning-design/domain-learning-design-step-patterns.md` — brief factors; CAI settings controls; CAI PF `userOptions` / promptTemplate
- `lib/ld-gai-page-enrich-contract.js` — live CAI item contract
- `lib/learner-renderer-vnext/assessment-interactive.js` — interactive/static assessment rendering and feedback
- `docs/.../S80-T-007-adjustments-target-architecture-and-implementation-plan.md` §10
- `docs/.../S80-T-011-design-assessment-topology-and-cai-relationship-diagnostic.md`
- Sprint pointers: `STATUS.md`, `next-chat-briefing.md`, `ARCHITECTURAL-DEBT.md`

---

## 25. Probes / tests used

- Catalog-backed Node probe of `buildWorkflowStepInstructions` for Generate Assessment Items with `prompt_bindings.selectedOptions` populated and brief factors set:
  - `hasExactly: false`
  - `hasDifficultyProfile: false`
  - `hasResponseFormats: false`
  - `hasDifficultyLevel: true` (per-item contract present)
  - `hasItemTypeRules: true`
  - `hasOptionPlaceholder: false`
- No production tests modified; no new permanent test file added (temp probe deleted).

---

## 26. Files changed

Documentation / sprint pointers only:

- This record (`S80-T-012-…md`)
- `STATUS.md`, `SPRINT-80-START-HERE.md`, `next-chat-briefing.md`, `HANDOVER.md`, `ARCHITECTURAL-DEBT.md` (discoverability + debt IDs)

**No production code changes.**

---

## 27. Acceptance assessment

| Criterion | Met? |
| --------- | ---- |
| Discovery only; no Assessment Adjustments implementation | Yes |
| No DA / D25–D27 / learner-level / D2–D3 / Settings cleanup | Yes |
| Quantity / Difficulty / Question Type contracts traced | Yes |
| End-to-end QT matrix with FULLY_SUPPORTED gate | Yes |
| Capability resolver specified (CAI, fail closed) | Yes |
| Commissioned sources without new authority store | Yes |
| Smallest truthful v1 recommended | Yes — Option B |
| Sprint record + pointers | Yes |

---

## 28. Exact recommended next action

1. **Operator accepts T-012** and chooses **B** or **C′** (and Quantity range 1–200 vs 1–50).
2. **Authorise one Assessment Adjustments implementation slice** that:
   - registers `generate_assessment_items` capability resolver;
   - declares Quantity + Difficulty (and narrowed QT only if C′);
   - projects via `workflowContext` (no selectedOptions / PRISM_STEP_PARAMS / DA work);
   - ships the §20 tests.
3. Do **not** start that slice until authorised.

---

## Report index (operator checklist §14)

| # | Section |
| - | ------- |
| 1 | §1 Executive conclusion |
| 2–4 | §2 Quantity authority / range / commissioned |
| 5–8 | §§3–5 Difficulty map / vocabulary / semantic / commissioned |
| 9–13 | §§6–10 Question type inventory / matrix / semantic / feedback / commissioned |
| 14 | §12 Existing mutable authorities |
| 15 | §13 CAI capability resolver |
| 16 | §14 Precedence |
| 17 | §15 Runtime safety |
| 18–19 | §§16–17 Options + recommendation |
| 20–21 | §§18–19 Registry + touch points |
| 22 | §20 Required tests |
| 23–25 | §§21–23 Defects / decisions / debt |
| 26–28 | §§24–26 Files / probes / changed |
| 29–30 | §§27–28 Acceptance / next action |
