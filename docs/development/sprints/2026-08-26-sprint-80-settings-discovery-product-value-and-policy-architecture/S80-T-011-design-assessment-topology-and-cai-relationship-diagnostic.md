# S80-T-011 — Design Assessment topology and CAI relationship diagnostic

**Status:** COMPLETE — discovery only  
**Date:** 2026-08-28  
**Mode:** DISCOVERY ONLY — no implementation  
**Authority:** operator request for conditional-topology diagnostic ahead of Assessment Adjustments  
**Predecessors:** [S80-T-005B.2](S80-T-005B.2-resolved-brief-factor-effectiveness-live-consumer-audit.md), [S80-T-007](S80-T-007-adjustments-target-architecture-and-implementation-plan.md) (Assessment slice), [S80-S7](S80-S7-audience-governed-workflow-parameter.md)

---

## Executive conclusion

**Design Assessment (DA) is deliberately rare for ordinary assessment requests, and rarer still than the code intends.**

The normal product path is:

> assessment questions requested → **Create/Generate Assessment Items (CAI/GAI) without DA**

That is established, tested, and intentional (`assessment_pack.defaultExclude: ["Design Assessment"]`; pruning at `app.js:24362–24367`).

DA is intended to appear for two stronger intents:

1. **Blueprint / assessment-design wording** (`triggerRules` include DA; `keepDesignAssessmentStep` is supposed to preserve it when items are also requested).
2. **Diagnostic-misconception assessment mode** with an item count (`assessment_interaction_mode === "diagnostic_misconception"`).

**Only path (2) currently works in live Create.** Path (1) is broken by a pre-existing declaration-order / `var`-hoisting defect: `keepDesignAssessmentStep` is evaluated **before** `assessmentBlueprintRequested` and `assessmentItemsRequested` are assigned (`app.js:23047` before `:23076` / `:23084`). Under hoisting those names are `undefined` at evaluation time, so the blueprint arm never contributes. T-007 already listed this as deferred debt ("T-005B.2 var-hoisting bug").

Consequence for Assessment Adjustments: **do not make DA a prerequisite.** Quantity / Difficulty / Question Type must be truthful on the CAI-only topology that almost all recent workflows use. DA+CAI is a minority path (today: diagnostic-misconception + items).

---

## Terminology

| Operator term | Code identity |
| ------------- | ------------- |
| Design Assessment (DA) | `step_design_assessment` / title `"Design Assessment"` |
| Create Assessment Items (CAI) | `step_generate_assessment_items` / title `"Generate Assessment Items"` (GAI in code comments) |

This diagnostic uses **CAI** for the operator term and **GAI** only when citing code identifiers.

---

## 2A. Routes by which Design Assessment enters topology

### Route map (proven)

```text
Brief / elicitation
  → resolved / explicit factors + goal-intent regexes
  → LD workflowPolicy.triggerRules (may INCLUDE "Design Assessment")
  → optional-step pruning (may REMOVE "Design Assessment")
  → final step list
```

Owner function: `applyWorkflowDesignHeuristics` (`app.js:22907+`).

### Trigger A — Policy include (blueprint / design intent wording)

**Source:** `domains/learning-design/domain-learning-design-step-patterns.md` `workflowPolicy.triggerRules`:

```json
{
  "whenGoalMentionsAnyOf": [
    "assessment blueprint", "blueprint", "coverage map",
    "difficulty profile", "item distribution",
    "assessment specification", "assessment design"
  ],
  "include": ["Design Assessment"]
}
```

**Chain:**

brief goal text  
→ `whenGoalMentionsAnyOf` match  
→ INCLUDE `Design Assessment`  
→ survives only if pruning does not remove it

**Probe:** with assessment factors wiped, goal `"Produce an assessment blueprint for Henry VIII."` → **DA present, CAI absent**. So the include rule is live.

### Trigger B — Keep-flag for diagnostic misconception + items

**Source:** `app.js:23047–23050`, used at prune `24362–24367`:

```js
var keepDesignAssessmentStep =
  assessmentBlueprintRequested ||
  (diagnosticMisconceptionAssessment &&
    (assessmentItemCountHint > 0 || assessmentItemsRequested));
```

`diagnosticMisconceptionAssessment` is true when  
`assessment_interaction_mode === "diagnostic_misconception"` (`23040–23041`), which extraction sets from cues such as `misconception discussion`, `false claims`, `diagnostic true/false|statements`, `misconception check` (`19480–19482`).

**Chain:**

brief cues → `assessment_interaction_mode = diagnostic_misconception`  
(+ `assessment_total_items > 0` or items requested)  
→ `keepDesignAssessmentStep = true`  
→ DA not pruned when CAI is present

**Probe:** forced or naturally extracted diagnostic-misconception + items → **DA + CAI**.

### Trigger C — Intended but broken: blueprint keep while items are requested

**Intended chain:**

goal mentions blueprint → `assessmentBlueprintRequested = true`  
→ `keepDesignAssessmentStep = true`  
→ DA kept alongside CAI

**Actual chain:** `keepDesignAssessmentStep` is computed **before** `assessmentBlueprintRequested` is assigned. Due to `var` hoisting, the blueprint operand is `undefined`. Effective semantics collapse to:

```text
keepDesignAssessmentStep ≡ diagnosticMisconceptionAssessment && assessmentItemCountHint > 0
```

**Probe:** `"…10 formative assessment questions and an assessment blueprint"` → **CAI only, DA pruned**. Confirms the broken arm.

### What does NOT insert / keep DA

| Candidate | Evidence |
| --------- | -------- |
| Ordinary formative questions / quiz / MCQ | Trigger includes **CAI only** (`quiz|mcq|…|formative questions`); DA pruned when items requested |
| `assessment_required === true` alone | Includes CAI (`triggerRules` + protect closure); does **not** include DA; pack bias `defaultExclude: ["Design Assessment"]` |
| `assessment_strategy` | Maps to constraints only; no topology consumer for DA |
| `assessment_type` / formative vs summative | Type maps to DA `activity_type` **if DA exists**; summative wording still → CAI only |
| Quantity / difficulty / question mix elicitation | Maps to step params; does not add DA |
| Self-study vs workshop | Neither product type inserts DA by itself |
| Cognition packs | May force discussion-oriented assessment flow / activity chain; do not insert DA |
| `assessment_required === false` | Explicitly **removes** DA, CAI, and marking rubric (`24345–24354`) |

### Pruning rule that removes DA (the usual case)

```js
if (
  title === "design assessment" &&
  (assessmentItemsRequested || formativeAssessmentPackDefaultIntent) &&
  !keepDesignAssessmentStep
) {
  return false; // remove DA
}
```

`assessmentItemsRequested` is true when assessment is not declined and either:

- `assessment_required === true` or `assessment_total_items > 0`, or  
- goal matches assessment-item wording (`assessment questions?|quiz|formative assessment|…`).

**Important interaction:** the phrase `"assessment blueprint"` contains `"assessment"`, so `hasExplicitPositiveAssessmentIntent` sets `assessment_required = true` (`19363`, `19373–19374`). Resolve then applies factor default `assessment_total_items: 10` (brief config `:618–619`). That makes `assessmentItemsRequested` true for almost any natural blueprint brief — which engages the prune that the broken keep-flag fails to override.

---

## 2B. Relationship between DA and CAI

### Reachable topologies (live Create)

| Case | Reachable? | Why |
| ---- | ---------- | --- |
| **1. CAI without DA** | **YES — normal** | Assessment-item intent includes CAI; pruning removes DA unless keep-flag fires |
| **2. DA + CAI** | **YES — narrow** | Today: `diagnostic_misconception` + item count > 0. Blueprint+items was intended but broken |
| **3. DA without CAI** | **YES in mechanism, NO in natural Create** | Trigger A can insert DA alone if assessment factors are absent. Natural blueprint wording sets `assessment_required` (word `"assessment"`) + default 10 items → CAI appears and DA is pruned. Declining assessment (`assessment_required: false`) removes DA too |

### Classification of DA

**Best fit: A + D hybrid, with a live minority mode.**

| Option | Verdict |
| ------ | ------- |
| A. Optional planning stage before CAI | **Intended** (precedence `Design Assessment` → `Generate Assessment Items`; CAI prompt treats blueprint as optional advanced contract; inheritance UI says settings inherit from DA) |
| B. Required for particular assessment modes | **Partially live** — diagnostic-misconception + items keeps DA |
| C. Associated with a product/output type | **No** — not gated on self-study vs workshop / page profile |
| D. Historical machinery now rarely reachable | **Partially** — blueprint keep path is accidentally dead; ordinary packs intentionally exclude DA |
| E. Something else | Pack `assessment_pack` explicitly prefers lean CAI-only flow |

Pack declaration (`step-patterns.md:1785–1789`):

```json
"stepBiasHints": {
  "preferLeanAssessmentFlow": true,
  "defaultInclude": ["Generate Assessment Items"],
  "defaultExclude": ["Design Assessment"]
}
```

Dependencies allow CAI without DA:

```text
Generate Assessment Items: requiresAnyOf [learning_outcomes, assessment_blueprint]
```

---

## 2C. Self-study and workshop relevance

### Ordinary probes (operator briefs)

| Product type | Assessment request | Additional DA trigger | DA? | CAI? | Reason |
| ------------ | ------------------ | --------------------- | --- | ---- | ------ |
| Self-study | 10 formative questions | none | **No** | **Yes** | Items intent → CAI; DA pruned (`keep` false) |
| Workshop | 10 formative questions | none | **No** | **Yes** | Same |
| Self-study | 10 formative questions | + “assessment blueprint” | **No** | **Yes** | Blueprint include fires, but keep-flag bug + items prune removes DA |
| Workshop | misconception / diagnostic statements + formative items | diagnostic_misconception extracted | **Yes** | **Yes** | Keep-flag path B |
| Self-study | items + forced `diagnostic_misconception` + total_items=10 | diagnostic mode | **Yes** | **Yes** | Same |
| Self-study | blueprint wording only (factors wiped) | Trigger A only | **Yes** | **No** | Artificial — not natural Create |
| Either | summative 20 questions | none | **No** | **Yes** | CAI-only |
| Either | `assessment_strategy` forced | none | **No** | **Yes** | Strategy is not a DA topology trigger |

### Minimum change that causes DA to appear

For both self-study and workshop ordinary formative briefs, the **minimum live change** that currently produces DA is:

> set / extract `assessment_interaction_mode = "diagnostic_misconception"` **and** keep a positive `assessment_total_items` (or equivalent items request).

Adding blueprint / “assessment design” / “difficulty profile” wording is **not** currently sufficient when items are also requested (hoisting bug).

**Clear statement:** DA is **not** a normal part of first-class self-study or workshop commissioning when the author asks for formative questions. It appears only under the stronger diagnostic-misconception (or, if the keep-flag were fixed, blueprint) intents.

---

## 2D. What Design Assessment actually designs

### Live DA contract (when DA is present)

**Output artefact (partial page mode):**

- Required: `assessment_blueprint` object; envelope `assembly_state.current_stage = "assessment_design"`
- Optional companions: `coverage_map`, `difficulty_profile`
- Validated by `validateDesignAssessmentPartialPageCapture` (`app.js:11543–11562`)
- Authoring brief: `buildDesignAssessmentV2CopyAuthoringBrief` (`11369–11377`) — **does not emit items**

**Declared step params / PF options (DA):**

| Field | Role |
| ----- | ---- |
| `activity_type` | Question strategy (mcq / short_answer / essay / …) |
| `total_items` | Quantity |
| `difficulty_profile` | Difficulty emphasis |
| `coverage_scope` | Coverage breadth |
| `feedback_display` | Prompt-shaping only (explicitly not a new schema field) |
| `cognitive_demand`, `assessment_cadence` | Mapped from brief factors to DA params |

### Responsibility classification

| Claimed responsibility | DA output / param | Downstream consumer | Classification |
| ---------------------- | ----------------- | ------------------- | -------------- |
| Assessment purpose / strategy | PF task prose; `activity_type` | CAI inheritance → `response_formats`; CAI prompt “question strategy” | **LIVE_AND_CONSUMED** (params) when DA present |
| LO alignment | Blueprint design instructions | CAI prompt *if* blueprint present in conversation; not embedded in V2 partial copy | **LIVE_BUT_NOT_CONSUMED** as structured upstream embed in partial mode; **DECLARED** in legacy PF template |
| Coverage map | `coverage_map` / `coverage_scope` | Page assembler patches `coverage_map`; CAI inherits `coverage_mode` from DA param | **LIVE_AND_CONSUMED** (page merge + param inheritance); blueprint body not re-injected into CAI prompt |
| Quantity / item allocation | `total_items` / blueprint.total_items | CAI `number_of_items` via `resolveAssessmentItemsInheritedOptions`; brief also maps `assessment_total_items` → both DA and CAI | **LIVE_AND_CONSUMED** (params); dual-mapped from brief |
| Difficulty | `difficulty_profile` (+ item_counts in PF JSON) | Transformed to CAI `difficulty_profile`; page merge of `difficulty_profile` | **LIVE_AND_CONSUMED** (params / page); cognitive item_counts not validated downstream |
| Question / item type | `activity_type` → `response_formats` | CAI inheritance | **LIVE_AND_CONSUMED** |
| Sequencing of items | not owned | — | **DEAD** / not DA’s job |
| Assessment blueprint object | `assessment_blueprint` | Page `assessment_design` partial merge (`lib/page-vnext-assemble.js:434–440`); Validate / Rubric stages when present; CAI PF says “if present use as advanced contract” but V2 copy brief forbids upstream embed | **LIVE_AND_CONSUMED** (page assembly); **LIVE_BUT_NOT_CONSUMED** as CAI prompt embed in partial mode |
| Feedback strategy | `feedback_display` | Prompt-shaping on DA only | **DECLARED_ONLY** / weak |
| Evidence requirements | design_rationale / marking intent in PF | No hard consumer found on CAI partial path | **UNCLEAR** / mostly **DECLARED_ONLY** |

### Exactly what CAI consumes from DA today

1. **Step-param inheritance** (`resolveAssessmentItemsInheritedOptions`, `app.js:5055–5142`):  
   `activity_type` → `response_formats`, `total_items` → `number_of_items`, `difficulty_profile` → mapped profile, `coverage_scope` → `coverage_mode`.  
   Precedence: explicit CAI values win (`assessmentPolicy.overridePrecedence: "explicit_downstream_wins"`).

2. **UI notice** on CAI config: “Core assessment settings are inherited from Design Assessment by default” (`5213`) — only meaningful when DA exists upstream.

3. **Page assembly** merges DA partial fields onto the page artefact.

4. **Not consumed in V2 partial CAI prompts:** the `assessment_blueprint` JSON itself is not injected (`page-prompt-no-upstream-injection` asserts this; CAI brief says conversation context only).

When DA is **absent**, CAI still runs from learning_outcomes (+ knowledge_model), using brief-mapped CAI params (`number_of_items`, `difficulty_profile`, `response_formats` via `assessment_type` / defaults). Quantity and difficulty are **already dual-mapped to CAI** in the brief mapping rules (`:1660–1674`).

---

## 2E. Why DA is rare in recent workflows

| Hypothesis | Verdict |
| ---------- | ------- |
| Normal formative-question requests require CAI but not DA | **TRUE** — primary explanation; intentional lean pack |
| DA requires a stronger/different assessment-design intent | **TRUE** — blueprint wording or diagnostic-misconception |
| DA belongs to an assessment-specific workflow mode | **Partially** — `page_profile: assessment` exists for assessment-primary briefs, but DA topology is not gated on it |
| Self-study/workshop commissioning does not normally trigger it | **TRUE** |
| Defaults / elicitation make its trigger uncommon | **TRUE** — and worse: mentioning “assessment” in blueprint phrasing auto-requires items (default 10), which engages DA pruning |
| DA is currently unreachable | **FALSE** — reachable via diagnostic-misconception + items |
| Blueprint keep path unreachable when items also requested | **TRUE** — accidental (hoisting bug), not deliberate |

**Distinction:**

- **Deliberately rare:** ordinary question requests → CAI-only (`defaultExclude`, pruning).
- **Accidentally rarer / broken:** blueprint+items keep path dead due to declaration order; natural “assessment blueprint” briefs co-trigger item defaults that prune the DA the trigger just added.

That matches the operator report of not having seen DA for a long time: typical self-study/workshop briefs ask for formative questions, never diagnostic-misconception mode, and never survive the blueprint keep path.

---

## 2F. Implications for runtime Assessment parameters

**Do not make DA a prerequisite.** The same user-facing Adjustment must work on CAI-only and DA+CAI topologies.

### Quantity

| Topology | Contract |
| -------- | -------- |
| **CAI-only** | Project to CAI (`number_of_items` / prompt “Generate exactly N…”) as the sole consumer. Already the Create mapping target alongside DA. |
| **DA+CAI** | DA owns planning `total_items`; CAI should receive it via existing inheritance. Runtime Adjustment should still **project to CAI** (and optionally update DA params if present) so CAI-only and DA+CAI behave the same for the author. Prefer **one projection to CAI**; treat DA inheritance as Create-time planning, not a second user control. |

Truthfulness note (T-007 Q4): item count is prompt-level; validators do not enforce count.

### Difficulty

| Topology | Contract |
| -------- | -------- |
| **CAI-only** | Project to CAI `difficulty_profile` (vocabulary must match CAI’s closed set / mapped set). |
| **DA+CAI** | DA uses a related but not identical vocabulary; inheritance applies `da_difficulty_to_gen_difficulty_profile`. Runtime Adjustment should target the **CAI-facing vocabulary** directly so CAI-only runs are coherent. Do not require the author to understand DA’s intermediate enum. |

Product decision (already flagged T-007 Q3): consolidate difficulty vocabularies; until then, Adjustments should speak CAI’s language.

### Question Type

| Topology | Contract |
| -------- | -------- |
| **CAI-only** | Project to CAI `response_formats` (live GAI control). |
| **DA+CAI** | DA `activity_type` maps into `response_formats`. Same rule: **one user-facing control → CAI `response_formats`**, with inheritance remaining Create-time glue when DA exists. |

### Coherence flag

All three parameters **can** have coherent CAI-first semantics across both topologies because:

- brief mapping already writes quantity/difficulty to CAI even when DA is absent;
- CAI can generate without a blueprint;
- DA inheritance is additive, not required.

**No need for two user-facing versions.**  
**Do need:** capability gating on “workflow contains CAI/GAI step”, not on “workflow contains DA”.

If a future product wants Adjustments to rewrite the **blueprint artefact** itself, that is a separate DA-owned concern and should not block the CAI-first Assessment slice.

---

## Defects recorded

| ID | Summary | Severity |
| -- | ------- | -------- |
| **D25** | `keepDesignAssessmentStep` evaluated before `assessmentBlueprintRequested` / `assessmentItemsRequested` are assigned — blueprint keep arm is dead (T-007 “var-hoisting bug”) | **HIGH** for DA honesty; does not block CAI-first Assessment Adjustments |
| **D26** | Natural “assessment blueprint / assessment design” wording sets `assessment_required` via bare `"assessment"` token, then default `assessment_total_items: 10`, which engages DA pruning — blueprint-only DA is unreachable in natural Create | **MEDIUM** |
| **D27** | In V2 partial mode, CAI does not embed upstream `assessment_blueprint`; DA→CAI contract is param inheritance + page merge only, while PF prose still describes blueprint-guided generation | **MEDIUM** (documentation / authority gap) |

D14 learner-level and D18 Create-inference debt remain unrelated and open.

---

## Files / probes used

- `app.js` — `applyWorkflowDesignHeuristics`, keep/prune, inheritance, extraction
- `domains/learning-design/domain-learning-design-step-patterns.md` — policy, brief config, DA/CAI contracts
- `lib/page-vnext-assemble.js` — `assessment_design` merge
- `tests/workflow-ld-assessment-semantics-topology.test.js` — existing DA-absent regressions
- Live topology probes via `__PRISM_TEST_API.applyWorkflowDesignHeuristics` (2026-08-28)

---

## Acceptance assessment (diagnostic)

Discovery complete. No code changed. Evidence is sufficient to decide Assessment Adjustments topology assumptions:

1. **CAI-without-DA is the normal assessment-capable workflow.**  
2. **DA+CAI is a live minority path (diagnostic misconception + items).**  
3. **Blueprint-gated DA+CAI is currently broken (D25/D26).**  
4. Quantity / Difficulty / Question Type should be **CAI-first**, capability-gated on CAI presence, not DA.

---

## Exact recommended next action

Operator decision:

1. Accept this diagnostic as evidence for the Assessment Adjustments slice.  
2. Authorise Assessment parameters as **CAI-first** (Quantity, Difficulty, Question Type), gated on GAI/CAI step presence.  
3. Optionally schedule a **narrow D25 fix** (move `keepDesignAssessmentStep` below the `assessmentBlueprintRequested` / `assessmentItemsRequested` assignments) as a separate topology honesty repair — **not** required to ship Assessment Adjustments.

Do **not** start learner level, D2, or D3 in that slice.
